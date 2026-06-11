import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Image } from 'react-native';
import { showAlert } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import { SoftnessChip } from '@/components/ui/SoftnessChip';
import { Back, Cloud, ShoppingBasket, Sparkle } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useLastScan, setLastScan } from '@/src/state/lastScan';
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

function expiryText(daysLeft: number | null): string {
  if (daysLeft == null) return 'Unknown shelf life';
  if (daysLeft <= 0) return 'Use today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

function capitalize(s: string): string {
  return s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/**
 * Scan result — pushed after a capture (camera or gallery). Was a tab
 * ("scan/analysis") that duplicated the home scan orb; now it's a
 * transient result screen so the tab bar can host Recipes instead.
 */
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const last = useLastScan();
  const { addItem, signedIn } = useFridge();

  // E1 refinement: the AI estimates shelf life assuming the item is fresh /
  // just-bought (it can't know when you bought it). Let the user say how many
  // days ago they got it; we subtract that from the total shelf life for a
  // realistic "days left". This is why an egg can read "2 days" raw but the
  // user knows they bought it last week.
  const [daysAgo, setDaysAgo] = useState(0);
  const totalShelf = last?.totalDays ?? last?.daysLeft ?? null;
  const rawDaysLeft = last?.daysLeft ?? null;
  const effectiveDaysLeft =
    daysAgo > 0 && totalShelf != null
      ? Math.max(0, totalShelf - daysAgo)
      : rawDaysLeft;

  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const onAddToFridge = async () => {
    if (!last) return;
    if (!signedIn) {
      showAlert('Sign in required', 'Sign in to save items to your fridge.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/auth') },
      ]);
      return;
    }
    const totalDays = last.totalDays ?? last.daysLeft ?? 7;
    // Persist the REFINED days-left (after the user's "bought N days ago").
    const daysLeft = effectiveDaysLeft ?? last.daysLeft ?? totalDays;
    const result = await addItem({
      name: capitalize(last.product),
      location: 'fridge',
      tone: last.tone,
      days_left: daysLeft,
      total_days: totalDays,
      expiry_text: expiryText(daysLeft),
      warn: last.tone === 'soon' || last.tone === 'past',
      thumbnail_path: last.imagePath,
      source_scan_id: last.scanId,
    });
    if (result?.error) {
      showAlert('Could not save', result.error);
      return;
    }
    setLastScan(null);
    router.replace('/(tabs)/fridge');
  };

  const onScanAnother = () => router.replace('/capture');

  // No staged scan — only reachable if navigated here directly. Send the
  // user to a fresh capture rather than showing a dead screen.
  if (!last) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <IconButton accessibilityLabel="back" onPress={dismiss}>
            <Back size={20} color={colors.ink} />
          </IconButton>
          <Text style={[typeScale.label, styles.headerLabel]}>ANALYSIS</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyWrap}>
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.emptyIcon}>
            <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
          </SoftSurface>
          <Text style={[typeScale.displayMedium, styles.emptyTitle]}>No scan yet</Text>
          <Text style={[typeScale.body, styles.emptySub]}>
            Scan an item to see its freshness verdict here.
          </Text>
          <View style={styles.emptyCta}>
            <PrimaryPillCTA label="Scan now" onPress={() => router.replace('/capture')} />
          </View>
        </View>
      </View>
    );
  }

  const titleColor = VERDICT_COLOR[last.verdict] ?? colors.primary;
  const verdictTitle = VERDICT_TITLE[last.verdict] ?? capitalize(last.verdict);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="back" onPress={dismiss}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.label, styles.headerLabel]}>ANALYSIS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.huge }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Image — rounded-square cushion with circular halo inside */}
        <View style={styles.imageBlock}>
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.imageOuter}>
            <View style={styles.imageDisc}>
              {last.imageUri ? (
                <Image source={{ uri: last.imageUri }} style={styles.image} />
              ) : (
                <View style={styles.imageFallback}>
                  <Sparkle size={48} color={colors.inkSecondary} strokeWidth={1.6} />
                </View>
              )}
            </View>
          </SoftSurface>
        </View>

        {/* Verdict card — RECESSED */}
        <SoftInset radius="xxl" strength="thick" style={styles.verdictWrap} contentStyle={styles.verdictInner}>
          <Text style={[typeScale.label, styles.verdictLabel]} numberOfLines={2}>{capitalize(last.product || 'item').toUpperCase()}</Text>
          <Text style={[typeScale.displayMedium, styles.verdictTitle, { color: titleColor }]}>{verdictTitle}</Text>
          <View style={styles.softnessRow}>
            <SoftnessChip
              label={`${Math.round(last.confidence)}% confidence`}
              iconColor={titleColor}
            />
          </View>
          {/* Why — the AI's reasoning for this verdict (E1) */}
          {last.reasoning ? (
            <Text style={[typeScale.bodySmall, styles.reasoning]}>{capitalize(last.reasoning)}</Text>
          ) : null}
        </SoftInset>

        {/* Safety disclaimer — permanent, on every verdict. Visual AI cannot
            detect pathogens; this is the documented legal/safety prerequisite. */}
        <Text style={[typeScale.bodySmall, styles.safetyNote]}>
          Visual estimate only — does not detect bacteria. When in doubt, throw it out.
        </Text>

        {/* Refine — the verdict assumes a just-bought item; let the user say
            how long they've had it so days-left is realistic (E1). */}
        {totalShelf != null ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.refineCard}>
            <Text style={[typeScale.label, styles.refineLabel]}>HOW LONG HAVE YOU HAD IT?</Text>
            <View style={styles.refineRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="fewer days"
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setDaysAgo((d) => Math.max(0, d - 1));
                }}
                style={({ pressed }) => [styles.stepBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={styles.stepGlyph}>−</Text>
              </Pressable>
              <View style={styles.refineMid}>
                <Text style={[typeScale.titleMedium, styles.refineValue]}>
                  {daysAgo === 0 ? 'Just got it' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`}
                </Text>
                {daysAgo > 0 && totalShelf != null ? (
                  <Text style={[typeScale.bodySmall, styles.refineHint]}>
                    {`Adjusted to ${Math.max(0, totalShelf - daysAgo)} day${Math.max(0, totalShelf - daysAgo) === 1 ? '' : 's'} left`}
                  </Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="more days"
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setDaysAgo((d) => Math.min(totalShelf ?? 30, d + 1));
                }}
                style={({ pressed }) => [styles.stepBtn, { opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={styles.stepGlyph}>+</Text>
              </Pressable>
            </View>
          </SoftSurface>
        ) : null}

        {/* Storage note — CUSHION raised */}
        {last.storageNote ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.noteCard}>
            <View style={styles.noteRow}>
              <SoftInset radius="lg" strength="medium" style={styles.noteIcon} contentStyle={styles.noteIconInner}>
                <Cloud size={22} color={colors.amber} />
              </SoftInset>
              <Text style={[typeScale.body, styles.noteText]}>{capitalize(last.storageNote)}</Text>
            </View>
          </SoftSurface>
        ) : null}

        {/* Days info — reflects the refined estimate */}
        {effectiveDaysLeft != null ? (
          <SoftInset radius="xxl" strength="medium" style={styles.daysWrap} contentStyle={styles.daysInner}>
            <Text style={[typeScale.numberLarge, { color: titleColor }]}>{Math.max(0, effectiveDaysLeft)}</Text>
            <Text style={[typeScale.label, styles.daysLabel]}>{expiryText(effectiveDaysLeft).toUpperCase()}</Text>
          </SoftInset>
        ) : null}

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <PrimaryPillCTA
            label="Add to Fridge"
            onPress={onAddToFridge}
            iconLeft={<ShoppingBasket size={22} color={colors.amber} strokeWidth={2.2} />}
          />
          <GhostText label="Scan Another" onPress={onScanAnother} />
        </View>
      </ScrollView>
    </View>
  );
}

const IMAGE_OUTER = 240;
const IMAGE_DISC = 192;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
  },
  headerSpacer: { width: 48, height: 48 },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
  },
  imageBlock: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  imageOuter: {
    width: IMAGE_OUTER,
    height: IMAGE_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageDisc: {
    width: IMAGE_DISC,
    height: IMAGE_DISC,
    borderRadius: IMAGE_DISC / 2,
    overflow: 'hidden',
    backgroundColor: '#c5d8a4',
  },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceTint,
  },
  verdictWrap: { width: '100%' },
  verdictInner: {
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verdictLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  verdictTitle: {
    textAlign: 'center',
  },
  softnessRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  safetyNote: {
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  reasoning: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 14,
    paddingHorizontal: spacing.sm,
  },
  refineCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  refineLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  refineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refineMid: {
    flex: 1,
    alignItems: 'center',
  },
  refineValue: {
    color: colors.ink,
  },
  refineHint: {
    color: colors.primary,
    marginTop: 2,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.inkMuted,
  },
  stepGlyph: {
    fontSize: 24,
    lineHeight: 26,
    color: colors.ink,
  },
  noteCard: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  noteIcon: { width: 48, height: 48 },
  noteIconInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    flex: 1,
    color: colors.ink,
    opacity: 0.9,
    lineHeight: 22,
  },
  daysWrap: { width: '100%' },
  daysInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  daysLabel: {
    color: colors.inkSecondary,
    letterSpacing: 1.5,
  },
  ctaBlock: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptySub: {
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  emptyCta: {
    width: '100%',
    maxWidth: 460,
    marginTop: spacing.xl,
  },
});
