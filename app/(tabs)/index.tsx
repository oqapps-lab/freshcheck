import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { CategoryGlyph, categoryFor } from '@/components/ui/CategoryGlyph';
import { Scan } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  toneColor,
} from '@/constants/tokens';
import { useFridge } from '@/src/hooks/useFridge';
import { useScans } from '@/src/hooks/useScans';

/**
 * Home / Scan — v4 "Paper & Pith" Stitch dashboard.
 * Ref: docs/06-design/DESIGN-V4.md §Screen patterns / Home, stitch-v2/home-1.
 *
 *   ANALYSIS                       ← eyebrow
 *   ┌────── (220 circle) ──────┐
 *   │      [scan glyph]         │
 *   └──────────────────────────┘
 *   Ready to Scan               ← displayL hero
 *   Point at food. Result …     ← body
 *   ┌────── 2-up grid ─────────┐
 *   │ 3              │ avocado │
 *   │ ITEMS EXPIRING │ LAST    │
 *   │ SOON           │ SAFE    │
 *   └────────────────┴─────────┘
 *
 * The FloatingTabBar is owned by the (tabs) layout — not rendered here.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary } = useFridge();
  const { scans } = useScans();

  const lastScan = scans[0];

  const expiringCount = summary.expiring;
  const expiringLabel =
    expiringCount === 0 ? 'Nothing Expiring' : 'Items Expiring Soon';

  const lastScanTone = lastScan ? toneColor[lastScan.tone] : null;
  const lastScanVerdictLabel = lastScan
    ? lastScan.verdict?.toUpperCase?.() ?? 'SAFE'
    : 'ALL CLEAR';
  const lastScanEyebrow = lastScan ? 'Last Scan' : 'Ready';
  const lastScanVerdictColor = lastScanTone?.accent ?? colors.verdictSafe;

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.push('/scan/camera');
  };

  const handleExpiringPress = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/(tabs)/fridge');
  };

  const handleLastScanPress = () => {
    Haptics.selectionAsync().catch(() => {});
    if (lastScan) {
      router.push('/scan/result');
    } else {
      router.push('/scan/camera');
    }
  };

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + layout.floatingBottomClearance + spacing.lg,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1 · ANALYSIS eyebrow */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate)}
          style={styles.eyebrowWrap}
        >
          <Text
            style={[typeScale.labelSmall, styles.eyebrowText]}
            accessibilityRole="text"
          >
            ANALYSIS
          </Text>
        </Animated.View>

        {/* 2 · Big neumorphic scan circle */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(80)}
          style={styles.orbWrap}
        >
          <Pressable
            onPress={handleScanPress}
            accessibilityRole="button"
            accessibilityLabel="Open scanner"
            accessibilityHint="Opens the camera to scan a food item"
          >
            <NeumorphicCard
              variant="raised"
              radius="full"
              padding={0}
              style={styles.orbCard}
            >
              <View style={styles.orbInner}>
                <Scan size={88} color={colors.primary} strokeWidth={1.6} />
              </View>
            </NeumorphicCard>
          </Pressable>
        </Animated.View>

        {/* 3 · Hero title */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(160)}
          style={styles.heroWrap}
        >
          <Text style={[typeScale.displayL, styles.heroTitle]}>
            Ready to Scan
          </Text>
        </Animated.View>

        {/* 4 · Body subcopy */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(240)}
          style={styles.bodyWrap}
        >
          <Text style={[typeScale.body, styles.bodyText]}>
            Point at food. Result in 3 seconds.
          </Text>
        </Animated.View>

        {/* 5 · Two-up stat grid */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(320)}
          style={styles.statsRow}
        >
          {/* LEFT — expiring count */}
          <Pressable
            onPress={handleExpiringPress}
            accessibilityRole="button"
            accessibilityLabel={`${expiringCount} ${expiringLabel.toLowerCase()}`}
            accessibilityHint="Open fridge inventory"
            style={styles.statCellPressable}
          >
            <NeumorphicCard
              variant="raised"
              radius="lg"
              padding={spacing.lg}
              style={styles.statCard}
            >
              <Text
                style={[typeScale.displayL, styles.statNumber]}
                accessibilityElementsHidden
              >
                {expiringCount}
              </Text>
              <Text style={[typeScale.labelSmall, styles.statEyebrow]}>
                {expiringLabel.toUpperCase()}
              </Text>
            </NeumorphicCard>
          </Pressable>

          {/* RIGHT — last scan verdict */}
          <Pressable
            onPress={handleLastScanPress}
            accessibilityRole="button"
            accessibilityLabel={
              lastScan
                ? `Last scan ${lastScan.product}, verdict ${lastScanVerdictLabel.toLowerCase()}`
                : 'No scans yet, all clear'
            }
            accessibilityHint={
              lastScan ? 'Open last scan result' : 'Open scanner'
            }
            style={styles.statCellPressable}
          >
            <NeumorphicCard
              variant="raised"
              radius="lg"
              padding={spacing.lg}
              style={styles.statCard}
            >
              <View style={styles.thumb}>
                <CategoryGlyph
                  category={
                    lastScan ? categoryFor(lastScan.product) : 'produce'
                  }
                  size={30}
                  color={colors.primary}
                  strokeWidth={1.6}
                />
              </View>
              <Text
                style={[typeScale.labelSmall, styles.statEyebrow]}
                numberOfLines={1}
              >
                {lastScanEyebrow.toUpperCase()}:
              </Text>
              <Text
                style={[
                  typeScale.titleM,
                  styles.verdictLabel,
                  { color: lastScanVerdictColor },
                ]}
                numberOfLines={1}
              >
                {lastScanVerdictLabel}
              </Text>
            </NeumorphicCard>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const ORB_SIZE = 220;
const ORB_INNER_RING = 168;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    alignItems: 'stretch',
  },
  eyebrowWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  eyebrowText: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  orbWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  orbCard: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    alignSelf: 'center',
  },
  orbInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  bodyWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  bodyText: {
    color: colors.outline,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCellPressable: {
    flex: 1,
  },
  statCard: {
    minHeight: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  statEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  verdictLabel: {
    marginTop: 4,
    textAlign: 'center',
  },
});
