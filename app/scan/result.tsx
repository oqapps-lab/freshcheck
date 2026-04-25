import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Share as RNShare,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Share, Droplet, Plus } from '@/components/ui/Glyphs';
import { CategoryGlyph, categoryFor } from '@/components/ui/CategoryGlyph';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  radii,
  shadows,
} from '@/constants/tokens';
import { scanDetail } from '@/mock/scans';
import { useCurrentScan, scanStore } from '@/src/lib/scanStore';
import { useFridge } from '@/src/hooks/useFridge';
import type { Tone } from '@/constants/tokens';

type ResultData = {
  id: string;
  product: string;
  verdictLabel: string;
  confidence: number;
  daysLeft: number | null;
  totalDays: number | null;
  storageNote: string | null;
  imagePath: string | null;
  tone: Tone;
};

/**
 * v4 Cloud glyph — the small storage-card icon (per Stitch result-1).
 * Drawn inline because Glyphs.tsx doesn't export Cloud yet.
 */
const Cloud: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = colors.primary,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 18h10a4 4 0 0 0 0.4-7.98A6 6 0 0 0 5.5 11.2 3.5 3.5 0 0 0 7 18Z"
      stroke={color}
      strokeWidth={1.75}
      strokeLinejoin="round"
    />
  </Svg>
);

/** "safe" → "Safe", "perfectly ripe" → "Perfectly Ripe". */
const titleCase = (s: string): string =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

/**
 * Scan Result v4 — Stitch "Paper & Pith".
 *
 * Layout:
 *   1. Top bar      → back / ANALYSIS / share, all neumorphic 40-circle.
 *   2. Image card   → 240×240 NeumorphicCard with photo or category glyph.
 *   3. Verdict card → eyebrow VERDICT, big Title-Cased headline, amber chip.
 *   4. Storage card → cloud tile + short keep-cool blurb.
 *   5. CTA stack    → amber "Add to Fridge" + ghost "SCAN ANOTHER".
 *   6. Disclaimer   → small caption at the bottom.
 *
 * Ref: docs/06-design/stitch-v2/result-1_*.png + DESIGN-V4.md §Scan Result.
 */
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const live = useCurrentScan();
  const { addItem } = useFridge();

  // Normalize live result and mock into the same shape.
  const r: ResultData = live
    ? {
        id: live.id,
        product: live.product,
        verdictLabel: titleCase(live.tone === 'past' ? 'Toss It' : live.tone),
        confidence: live.confidence,
        daysLeft: live.daysLeft,
        totalDays: live.totalDays,
        storageNote: live.storageNote,
        imagePath: live.imagePath,
        tone: live.tone,
      }
    : {
        id: scanDetail.id,
        product: scanDetail.product,
        verdictLabel: titleCase(scanDetail.verdictLabel),
        confidence: scanDetail.confidence,
        daysLeft: scanDetail.daysLeft,
        totalDays: scanDetail.totalDays,
        storageNote: scanDetail.storage,
        imagePath: null,
        tone: scanDetail.tone,
      };

  const productLc = r.product.toLowerCase();

  const storageBlurb =
    r.daysLeft != null && r.daysLeft > 0
      ? `Rest in a cool shade. Best enjoyed in ${r.daysLeft} day${r.daysLeft === 1 ? '' : 's'}.`
      : (r.storageNote ?? 'Rest in a cool shade.');

  const shareResult = async () => {
    Haptics.selectionAsync().catch(() => {});
    try {
      await RNShare.share({
        message: `FreshCheck says my ${productLc} is ${r.verdictLabel} (${Math.round(r.confidence)}% sure).`,
      });
    } catch {
      // user cancelled — no-op
    }
  };

  const saveToFridge = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (live && r.daysLeft != null && r.totalDays != null) {
      await addItem({
        name: r.product,
        tone: r.tone === 'neutral' ? 'fresh' : r.tone,
        days_left: r.daysLeft,
        total_days: r.totalDays,
        expiry_text:
          r.daysLeft <= 1 ? 'expires tomorrow' : `expires in ${r.daysLeft} days`,
        warn: r.tone === 'past' || r.tone === 'soon',
        source_scan_id:
          r.id.startsWith('ephemeral') || r.id === 'mock-scan' ? null : r.id,
      });
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
    scanStore.clear();
    router.replace('/(tabs)/fridge');
  };

  const scanAnother = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    scanStore.clear();
    router.replace('/scan/camera');
  };

  return (
    <AtmosphericBackground>
      {/* Top bar */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <NeumorphicCard
          variant="raised"
          radius="full"
          padding={0}
          style={styles.iconBtnCard}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtnHit}
            accessibilityRole="button"
            accessibilityLabel="back"
          >
            <Back size={18} color={colors.ink} />
          </Pressable>
        </NeumorphicCard>

        <Text
          style={[styles.eyebrow, typeScale.labelSmall]}
          accessibilityRole="header"
        >
          ANALYSIS
        </Text>

        <NeumorphicCard
          variant="raised"
          radius="full"
          padding={0}
          style={styles.iconBtnCard}
        >
          <Pressable
            onPress={shareResult}
            style={styles.iconBtnHit}
            accessibilityRole="button"
            accessibilityLabel="share result"
          >
            <Share size={18} color={colors.ink} />
          </Pressable>
        </NeumorphicCard>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 76,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Image / glyph card */}
        <Animated.View
          entering={FadeIn.duration(motion.slow)}
          style={styles.imageWrap}
        >
          <NeumorphicCard
            variant="raised"
            radius="md"
            padding={0}
            style={styles.imageCard}
          >
            <View style={styles.imageFace}>
              {r.imagePath ? (
                <Image
                  source={{ uri: r.imagePath }}
                  style={styles.imagePhoto}
                  resizeMode="cover"
                  accessibilityLabel={`${productLc} photo`}
                />
              ) : (
                <CategoryGlyph
                  category={categoryFor(r.product)}
                  size={80}
                  color={colors.primary}
                />
              )}
            </View>
          </NeumorphicCard>
        </Animated.View>

        {/* Verdict card */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(120)}
          style={styles.verdictWrap}
        >
          <NeumorphicCard
            variant="raised"
            radius="md"
            padding={24}
            style={styles.verdictCard}
          >
            <Text style={[typeScale.labelSmall, styles.verdictEyebrow]}>
              VERDICT
            </Text>
            <Text
              style={[typeScale.displayL, styles.verdictHero]}
              accessibilityRole="header"
              accessibilityLabel={`Verdict ${r.verdictLabel}`}
            >
              {r.verdictLabel}
            </Text>
            <View style={styles.confidenceChip}>
              <Droplet size={14} color={colors.onAccent} />
              <Text style={[typeScale.label, styles.confidenceLabel]}>
                {Math.round(r.confidence)}% Sure
              </Text>
            </View>
          </NeumorphicCard>
        </Animated.View>

        {/* Storage card */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(240)}
          style={styles.storageWrap}
        >
          <NeumorphicCard
            variant="raised"
            radius="md"
            padding={20}
            style={styles.storageCard}
          >
            <View style={styles.storageRow}>
              <View style={styles.storageIconTile}>
                <Cloud size={20} color={colors.primary} />
              </View>
              <Text style={[typeScale.body, styles.storageText]}>
                {storageBlurb}
              </Text>
            </View>
          </NeumorphicCard>
        </Animated.View>

        {/* CTA stack */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(360)}
          style={styles.ctaStack}
        >
          <PillCTA
            variant="primary"
            label="Add to Fridge"
            onPress={saveToFridge}
            icon={<Plus size={18} color={colors.onAccent} />}
            fullWidth
            accessibilityLabel="add to fridge"
          />
          <PillCTA
            variant="ghost"
            label="SCAN ANOTHER"
            onPress={scanAnother}
            fullWidth
            accessibilityLabel="scan another item"
            style={styles.ghostCta}
          />
        </Animated.View>

        {/* Disclaimer */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(480)}
          style={styles.disclaimerWrap}
        >
          <Text style={[typeScale.caption, styles.disclaimer]}>
            visual check only — won't catch bacteria
          </Text>
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    zIndex: 10,
  },
  iconBtnCard: {
    width: 44,
    height: 44,
  },
  iconBtnHit: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
  },
  imageWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  imageCard: {
    width: 240,
    height: 240,
  },
  imageFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  imagePhoto: {
    width: '100%',
    height: '100%',
  },
  verdictWrap: {
    marginBottom: spacing.lg,
  },
  verdictCard: {
    alignItems: 'center',
  },
  verdictEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  verdictHero: {
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  confidenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    gap: 6,
    ...shadows.none,
  },
  confidenceLabel: {
    color: colors.onAccent,
    textTransform: 'none',
    letterSpacing: 0.2,
  },
  storageWrap: {
    marginBottom: spacing.xl,
  },
  storageCard: {
    // padding handled by NeumorphicCard prop
  },
  storageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  storageIconTile: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvasMist,
  },
  storageText: {
    flex: 1,
    color: colors.onSurfaceVariant,
  },
  ctaStack: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ghostCta: {
    marginTop: spacing.xxs,
  },
  disclaimerWrap: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  disclaimer: {
    color: colors.outline,
    textAlign: 'center',
  },
});
