import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native';
import { showAlert, showPrompt } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import i18n from '@/src/i18n';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Back, Check, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import {
  useScanQueue,
  clearQueue,
  markAddedToFridge,
  retryQueued,
  processQueue,
  updateResult,
  type QueueItem,
} from '@/src/state/scanQueue';
import { useFridge } from '@/src/hooks/useFridge';
import { useAuth } from '@/src/hooks/useAuth';
import { track } from '@/src/lib/analytics';
import { usePremium } from '@/src/hooks/usePremium';
import { getSupabase } from '@/src/lib/supabase';

// Maps verdict id → i18n key; resolved with t() at the render site (this object
// is module-level, so it can't call a hook here).
const VERDICT_TITLE_KEY: Record<string, string> = {
  fresh: 'scanBatch.verdict.fresh',
  safe: 'scanBatch.verdict.safe',
  soon: 'scanBatch.verdict.soon',
  past: 'scanBatch.verdict.past',
};
const VERDICT_COLOR: Record<string, string> = {
  fresh: colors.primary,
  safe: colors.primary,
  soon: colors.amber,
  past: colors.red,
};
const VERDICTS = ['fresh', 'safe', 'soon', 'past'] as const;

function capitalize(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function expiryText(daysLeft: number | null): string {
  // Module-level (called from render AND from addToFridge before persisting),
  // so resolve via i18n.t rather than a hook. i18n is initialized in _layout.
  if (daysLeft == null) return i18n.t('scanBatch.expiry.unknown');
  if (daysLeft <= 0) return i18n.t('scanBatch.expiry.today');
  return i18n.t('scanBatch.expiry.daysLeft', { count: daysLeft });
}

/**
 * Batch scan results — live view of the scanQueue. Each photo shows a
 * spinner while pending/scanning, then its verdict. Add items to the fridge
 * one-by-one or all at once. "Done" clears the queue.
 */
export default function ScanBatchScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queue = useScanQueue();
  const { addItem, signedIn } = useFridge();
  const { user } = useAuth();
  const { premium } = usePremium();
  const supabase = getSupabase();

  // Measured footer height so the last card clears the floating action bar
  // (it was being half-hidden behind it).
  const [footerH, setFooterH] = useState(140);
  const onFooterLayout = (e: LayoutChangeEvent) => setFooterH(e.nativeEvent.layout.height);

  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const rescan = (id: string) => {
    if (!supabase || !user) return;
    Haptics.selectionAsync().catch(() => {});
    retryQueued(id);
    void processQueue(supabase, user.id, premium);
  };

  // Whole-table detection isn't perfect — let the user fix a mis-read name or
  // bump the verdict on the results list before adding to the fridge.
  const renameItem = (item: QueueItem) => {
    if (!item.result) return;
    Haptics.selectionAsync().catch(() => {});
    showPrompt(
      t('scanBatch.editPrompt.title'),
      t('scanBatch.editPrompt.message'),
      [
        { text: t('scanBatch.editPrompt.cancel'), style: 'cancel' },
        {
          text: t('scanBatch.editPrompt.save'),
          onPress: (v) => {
            const name = v?.trim();
            if (name) updateResult(item.id, { product: name.toLowerCase() });
          },
        },
      ],
      { defaultValue: capitalize(item.result.product || ''), placeholder: t('scanBatch.editPrompt.placeholder') },
    );
  };

  const cycleVerdict = (item: QueueItem) => {
    if (!item.result) return;
    Haptics.selectionAsync().catch(() => {});
    const idx = VERDICTS.indexOf(item.result.verdict as (typeof VERDICTS)[number]);
    const next = VERDICTS[(idx + 1) % VERDICTS.length];
    updateResult(item.id, { verdict: next, tone: next });
  };

  const done = queue.filter((q) => q.status === 'done');
  const pending = queue.filter((q) => q.status === 'pending' || q.status === 'scanning');
  const addable = done.filter((q) => q.result && !q.addedToFridge);

  const addToFridge = useCallback(
    async (item: QueueItem) => {
      if (!item.result) return;
      if (!signedIn) {
        showAlert(t('scanBatch.signInAlert.title'), t('scanBatch.signInAlert.message'), [
          { text: t('scanBatch.signInAlert.cancel'), style: 'cancel' },
          { text: t('scanBatch.signInAlert.signIn'), onPress: () => router.push('/auth') },
        ]);
        return;
      }
      const r = item.result;
      const totalDays = r.totalDays ?? r.daysLeft ?? 7;
      const daysLeft = r.daysLeft ?? totalDays;
      const res = await addItem({
        name: capitalize(r.product),
        location: 'fridge',
        tone: r.tone,
        days_left: daysLeft,
        total_days: totalDays,
        expiry_text: expiryText(r.daysLeft),
        warn: r.tone === 'soon' || r.tone === 'past',
        thumbnail_path: r.imagePath,
        source_scan_id: r.scanId,
      });
      if (res?.error) {
        showAlert(t('scanBatch.saveError.title'), res.error);
        return;
      }
      markAddedToFridge(item.id);
      track('fridge_item_added', { source: 'batch' });
    },
    [addItem, signedIn, router, t],
  );

  const addAll = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    for (const item of addable) {
      // eslint-disable-next-line no-await-in-loop
      await addToFridge(item);
    }
    router.replace('/(tabs)/fridge');
  }, [addable, addToFridge, router]);

  const finish = () => {
    clearQueue();
    router.replace('/(tabs)/fridge');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel={t('scanBatch.a11y.back')} onPress={dismiss}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>{t('scanBatch.header')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: footerH + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[typeScale.displayMedium, { color: colors.ink }]}>
            {pending.length > 0 ? t('scanBatch.hero.scanning') : t('scanBatch.hero.results')}
          </Text>
          <Text style={[typeScale.label, styles.eyebrow2]}>
            {t('scanBatch.counter', { done: done.length, left: pending.length })}
          </Text>
        </View>

        {queue.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.emptyTitle]}>{t('scanBatch.empty.title')}</Text>
            <Text style={[typeScale.bodySmall, styles.emptySub]}>
              {t('scanBatch.empty.subtitle')}
            </Text>
            <View style={styles.emptyCta}>
              <PrimaryPillCTA label={t('scanBatch.empty.cta')} onPress={() => router.replace('/capture' as never)} />
            </View>
          </View>
        ) : (
          <View style={styles.list}>
            {queue.map((item) => {
              const r = item.result;
              const titleColor = r ? VERDICT_COLOR[r.verdict] ?? colors.primary : colors.inkSecondary;
              return (
                <SoftSurface key={item.id} variant="cushion" radius="xxl" innerStyle={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.thumbWrap}>
                      {item.uri ? (
                        <Image source={{ uri: item.uri }} style={styles.thumb} />
                      ) : (
                        <View style={styles.thumbFallback} />
                      )}
                      {(item.status === 'pending' || item.status === 'scanning') && (
                        <View style={styles.thumbOverlay}>
                          <ActivityIndicator color={colors.surfaceWhite} />
                        </View>
                      )}
                    </View>

                    <View style={styles.cardBody}>
                      {item.status === 'done' && r ? (
                        <>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('scanBatch.a11y.editName', { name: r.product })}
                            onPress={() => renameItem(item)}
                            hitSlop={6}
                          >
                            <Text style={[typeScale.titleMedium, { color: colors.ink }]} numberOfLines={1}>
                              {capitalize(r.product || t('scanBatch.card.itemFallback'))}
                            </Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t('scanBatch.a11y.changeVerdict')}
                            onPress={() => cycleVerdict(item)}
                            hitSlop={6}
                          >
                            <Text style={[typeScale.labelSmall, { color: titleColor, marginTop: 2 }]}>
                              {(VERDICT_TITLE_KEY[r.verdict] ? t(VERDICT_TITLE_KEY[r.verdict]) : r.verdict).toUpperCase()}
                            </Text>
                          </Pressable>
                          <Text style={[typeScale.bodySmall, styles.sub]}>
                            {expiryText(r.daysLeft)}
                          </Text>
                          <Text style={[typeScale.labelSmall, styles.editHint]}>{t('scanBatch.card.editHint')}</Text>
                        </>
                      ) : item.status === 'error' ? (
                        <>
                          <Text style={[typeScale.titleMedium, { color: colors.red }]}>{t('scanBatch.card.scanFailed')}</Text>
                          <Text style={[typeScale.bodySmall, styles.sub]} numberOfLines={2}>
                            {item.error ?? t('scanBatch.card.scanFailedHint')}
                          </Text>
                        </>
                      ) : (
                        <Text style={[typeScale.bodySmall, styles.sub]}>
                          {item.status === 'scanning' ? t('scanBatch.card.reading') : t('scanBatch.card.waiting')}
                        </Text>
                      )}
                    </View>

                    {item.status === 'done' && r ? (
                      item.addedToFridge ? (
                        <View style={styles.addedBadge}>
                          <Check size={16} color={colors.primary} strokeWidth={3} />
                        </View>
                      ) : (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={t('scanBatch.a11y.addToFridge', { name: r.product })}
                          onPress={() => {
                            Haptics.selectionAsync().catch(() => {});
                            void addToFridge(item);
                          }}
                          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.85 : 1 }]}
                        >
                          <Text style={[typeScale.labelSmall, styles.addBtnText]}>{t('scanBatch.cta.add')}</Text>
                        </Pressable>
                      )
                    ) : item.status === 'error' ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('scanBatch.a11y.rescan')}
                        onPress={() => rescan(item.id)}
                        style={({ pressed }) => [styles.rescanBtn, { opacity: pressed ? 0.85 : 1 }]}
                      >
                        <Text style={[typeScale.labelSmall, styles.rescanBtnText]}>{t('scanBatch.cta.rescan')}</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </SoftSurface>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating actions */}
      {queue.length > 0 && (
        <View
          style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}
          onLayout={onFooterLayout}
        >
          {addable.length > 0 && (
            <PrimaryPillCTA label={t('scanBatch.cta.addAll', { count: addable.length })} onPress={addAll} />
          )}
          {/* Done is a clear button (was a grey ghost-link that read as
              disabled). When there's nothing to add, it's the primary action. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('scanBatch.a11y.done')}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              finish();
            }}
            style={({ pressed }) => [styles.doneBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <SoftSurface variant="pill" radius="full" innerStyle={styles.doneInner}>
              <Text style={[typeScale.titleSmall, styles.doneText]}>{t('scanBatch.cta.done')}</Text>
            </SoftSurface>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerSpacer: { width: 48, height: 48 },
  eyebrow: { color: colors.inkSecondary },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.lg },
  hero: { paddingHorizontal: 8, marginBottom: spacing.xl },
  eyebrow2: { color: colors.inkSecondary, marginTop: 6, textTransform: 'uppercase' },
  list: { gap: spacing.lg, paddingHorizontal: 8 },
  card: { padding: spacing.lg },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceTint,
  },
  thumb: { width: '100%', height: '100%' },
  thumbFallback: { width: '100%', height: '100%', backgroundColor: colors.surfaceTint },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, gap: 2 },
  sub: { color: colors.inkSecondary, marginTop: 2 },
  editHint: { color: colors.inkMuted, marginTop: 6, letterSpacing: 1 },
  addBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  addBtnText: { color: colors.surfaceWhite, letterSpacing: 1.4 },
  rescanBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.amber,
  },
  rescanBtnText: { color: colors.amberDeep, letterSpacing: 1.4 },
  doneBtn: { alignSelf: 'stretch' },
  doneInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  doneText: { color: colors.ink },
  addedBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.canvas,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.massive,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: { color: colors.ink, textAlign: 'center' },
  emptySub: { color: colors.inkSecondary, textAlign: 'center', lineHeight: 20 },
  emptyCta: { width: '100%', maxWidth: 460, marginTop: spacing.lg },
});
