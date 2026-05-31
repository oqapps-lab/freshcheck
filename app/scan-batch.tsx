import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { Back, Check, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import {
  useScanQueue,
  clearQueue,
  markAddedToFridge,
  type QueueItem,
} from '@/src/state/scanQueue';
import { useFridge } from '@/src/hooks/useFridge';

const VERDICT_TITLE: Record<string, string> = {
  fresh: 'Fresh & ripe',
  safe: 'Safe to eat',
  soon: 'Use it soon',
  past: 'Past its prime',
};
const VERDICT_COLOR: Record<string, string> = {
  fresh: colors.primary,
  safe: colors.primary,
  soon: colors.amber,
  past: colors.red,
};

function capitalize(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
function expiryText(daysLeft: number | null): string {
  if (daysLeft == null) return 'Unknown shelf life';
  if (daysLeft <= 0) return 'Use today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

/**
 * Batch scan results — live view of the scanQueue. Each photo shows a
 * spinner while pending/scanning, then its verdict. Add items to the fridge
 * one-by-one or all at once. "Done" clears the queue.
 */
export default function ScanBatchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queue = useScanQueue();
  const { addItem, signedIn } = useFridge();

  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const done = queue.filter((q) => q.status === 'done');
  const pending = queue.filter((q) => q.status === 'pending' || q.status === 'scanning');
  const addable = done.filter((q) => q.result && !q.addedToFridge);

  const addToFridge = useCallback(
    async (item: QueueItem) => {
      if (!item.result) return;
      if (!signedIn) {
        Alert.alert('Sign in required', 'Sign in to save items to your fridge.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign in', onPress: () => router.push('/auth') },
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
        Alert.alert('Could not save', res.error);
        return;
      }
      markAddedToFridge(item.id);
    },
    [addItem, signedIn, router],
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
        <IconButton accessibilityLabel="back" onPress={dismiss}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>BATCH SCAN</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.massive * 2 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[typeScale.displayMedium, { color: colors.ink }]}>
            {pending.length > 0 ? 'Scanning your batch…' : 'Batch results'}
          </Text>
          <Text style={[typeScale.label, styles.eyebrow2]}>
            {`${done.length} DONE · ${pending.length} LEFT`}
          </Text>
        </View>

        {queue.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.emptyTitle]}>Nothing queued</Text>
            <Text style={[typeScale.bodySmall, styles.emptySub]}>
              Switch the scanner to Batch and snap a few items.
            </Text>
            <View style={styles.emptyCta}>
              <PrimaryPillCTA label="Back to scan" onPress={() => router.replace('/capture' as never)} />
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
                          <Text style={[typeScale.titleMedium, { color: colors.ink }]} numberOfLines={1}>
                            {capitalize(r.product || 'Item')}
                          </Text>
                          <Text style={[typeScale.labelSmall, { color: titleColor, marginTop: 2 }]}>
                            {(VERDICT_TITLE[r.verdict] ?? r.verdict).toUpperCase()}
                          </Text>
                          <Text style={[typeScale.bodySmall, styles.sub]}>
                            {expiryText(r.daysLeft)}
                          </Text>
                        </>
                      ) : item.status === 'error' ? (
                        <>
                          <Text style={[typeScale.titleMedium, { color: colors.red }]}>Scan failed</Text>
                          <Text style={[typeScale.bodySmall, styles.sub]} numberOfLines={2}>
                            {item.error ?? 'Try this one again from the scanner.'}
                          </Text>
                        </>
                      ) : (
                        <Text style={[typeScale.bodySmall, styles.sub]}>
                          {item.status === 'scanning' ? 'Reading ripeness…' : 'Waiting…'}
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
                          accessibilityLabel={`add ${r.product} to fridge`}
                          onPress={() => {
                            Haptics.selectionAsync().catch(() => {});
                            void addToFridge(item);
                          }}
                          style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.85 : 1 }]}
                        >
                          <Text style={[typeScale.labelSmall, styles.addBtnText]}>ADD</Text>
                        </Pressable>
                      )
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
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          {addable.length > 0 && (
            <PrimaryPillCTA label={`Add ${addable.length} to fridge`} onPress={addAll} />
          )}
          <GhostText label="Done" onPress={finish} />
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
  addBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  addBtnText: { color: colors.surfaceWhite, letterSpacing: 1.4 },
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
