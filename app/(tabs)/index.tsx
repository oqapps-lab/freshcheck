import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TokenDot } from '@/components/ui/TokenDot';
import { ProductRow } from '@/components/ui/ProductRow';
import { DecorDots } from '@/components/ui/DecorDots';
import { PulseGlow } from '@/components/ui/PulseGlow';
import { Sprig, Scan, Fridge as FridgeGlyph, Droplet } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  radii,
  layout,
  gradients,
  motion,
} from '@/constants/tokens';
import { user, dayOfWeek } from '@/mock/user';
import { fridgeSummary } from '@/mock/fridge';
import { recentScans, homeStats } from '@/mock/scans';

/**
 * Home Dashboard — /(tabs)/index  (v2 — rich gradients + animation + editorial asymmetry)
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.1
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Gentle float animation for the Fridge glyph inside the hero
  const glyphY = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    glyphY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [glyphY, reduceMotion]);

  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: glyphY.value }] }));

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brand}>
          <Sprig size={22} color={colors.sageInk} />
          <Text style={[typeScale.label, styles.wordmark]}>FreshCheck</Text>
        </View>
        <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel="Notifications">
          <Sprig size={22} color={colors.sageInk} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 72,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 180,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(motion.moderate).delay(40)} style={styles.greeting}>
          <Text style={[typeScale.displayM, { color: colors.sageInk }]}>Hi {user.name}</Text>
          <Eyebrow>{`Your kitchen · ${dayOfWeek}`}</Eyebrow>
        </Animated.View>

        {/* Hero card — RICH v2: gradient bg + pulse glow + floating glyph + decor dots */}
        <Animated.View entering={FadeInDown.duration(motion.moderate).delay(120)}>
          <GlassCard variant="leafHighlight" showTopLight showInnerGlow style={styles.heroCard} padding={0}>
            <View style={styles.heroPhoto}>
              <LinearGradient
                colors={gradients.heroAmbient}
                start={{ x: 0.0, y: 0 }}
                end={{ x: 1.0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <DecorDots palette={['white', 'white', 'sageMist', 'peachSoft']} />
              <PulseGlow size={200} tone="cream" style={styles.heroGlow} />
              <Animated.View style={[styles.heroGlyphWrap, floatStyle]}>
                <View style={styles.heroGlyphBg}>
                  <FridgeGlyph size={68} color={colors.white} strokeWidth={1.6} />
                </View>
                <View style={styles.heroDroplet}>
                  <Droplet size={18} color={colors.white} />
                </View>
              </Animated.View>
              <Text style={styles.heroCaption}>Inside your fridge</Text>
            </View>
            <View style={styles.heroMeta}>
              <Text style={[typeScale.titleM, { color: colors.ink }]}>
                {fridgeSummary.total} items
              </Text>
              <View style={styles.dotSpacer} />
              <TokenDot tone="past" size={8} />
              <Text style={[typeScale.bodySmall, { color: colors.coralInk, marginLeft: 6 }]}>
                {fridgeSummary.expiring} expiring today
              </Text>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Stats row — each card has its own subtle color tint */}
        <Animated.View
          entering={FadeInDown.duration(motion.moderate).delay(220)}
          style={styles.statsRow}
        >
          <GlassCard variant="tinted" tintGradient={gradients.statSaved} style={styles.statCard} padding={16}>
            <Eyebrow>Saved</Eyebrow>
            <HeroNumber value={`$${homeStats.saved}`} size="s"  />
          </GlassCard>
          <GlassCard variant="tinted" tintGradient={gradients.statScans} style={styles.statCard} padding={16}>
            <Eyebrow>Scans</Eyebrow>
            <HeroNumber value={homeStats.scans} size="s"  />
          </GlassCard>
          <GlassCard variant="tinted" tintGradient={gradients.statWasted} style={styles.statCard} padding={16}>
            <Eyebrow>Wasted</Eyebrow>
            <HeroNumber value={homeStats.wasted} size="s" />
          </GlassCard>
        </Animated.View>

        {/* Recent activity */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(360)}
          style={styles.section}
        >
          <Eyebrow style={{ marginBottom: 12 }}>Recent activity</Eyebrow>
          {recentScans.slice(0, 1).map((scan) => (
            <ProductRow
              key={scan.id}
              name={scan.product}
              expiryText={`Last scan · ${scan.scannedAt}`}
              tone={scan.tone}
              thumbnailPlaceholder={scan.placeholder}
              trailing={
                <View style={styles.confidenceBadge}>
                  <LinearGradient
                    colors={gradients.verdictFresh}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={[typeScale.titleS, { color: colors.sageInk }]}>{scan.confidence}</Text>
                </View>
              }
              onPress={() => router.push('/scan/result')}
            />
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Scan CTA — pulse + shimmer */}
      <Animated.View
        entering={FadeInDown.duration(motion.slow).delay(520)}
        style={[styles.floatingCta, { bottom: insets.bottom + layout.floatingBottomClearance - 16 }]}
      >
        <PillCTA
          label="Scan"
          icon={<Scan size={22} color={colors.white} />}
          fullWidth
          pulse
          onPress={() => router.push('/scan/camera')}
        />
      </Animated.View>
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
    paddingBottom: 12,
    zIndex: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    color: colors.sageInk,
  },
  greeting: {
    marginBottom: spacing.xl,
    gap: 6,
  },
  heroCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroPhoto: {
    height: 156,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroGlow: {
    top: '50%',
    left: '50%',
    marginTop: -90,
    marginLeft: -90,
  },
  heroGlyphWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlyphBg: {
    width: 96,
    height: 96,
    borderRadius: radii.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  heroDroplet: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCaption: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.6,
    color: colors.white,
    marginTop: 12,
    textShadowColor: 'rgba(74,101,79,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  dotSpacer: {
    width: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  confidenceBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
