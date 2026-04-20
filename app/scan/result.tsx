import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, Share } from '@/components/ui/Glyphs';
import { colors, gradients, spacing, typeScale, radii, layout, motion } from '@/constants/tokens';
import { scanDetail } from '@/mock/scans';

/**
 * Scan Result v3 — Verdict Bloom
 * Hero is the verdict WORD ("fresh") in a soft-bloom circle, not a percent number.
 * Ref: Stitch §5 Verdict Bloom.
 */
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const verdictWord = 'fresh'; // from scanDetail.verdict, lowercased

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="back"
        >
          <Back size={20} color={colors.primary} />
        </Pressable>
        <Text style={[typeScale.label, { color: colors.secondary }]}>scan result</Text>
        <Pressable style={styles.circleBtn} accessibilityRole="button" accessibilityLabel="share">
          <Share size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 72,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 40,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Verdict Bloom — the hero */}
        <Animated.View entering={FadeIn.duration(motion.slow)} style={styles.bloomWrap}>
          {/* Ambient glow elements */}
          <View style={[styles.bloomGlow, styles.bloomGlow1]} />
          <View style={[styles.bloomGlow, styles.bloomGlow2]} />

          <Animated.View entering={ZoomIn.duration(motion.slow).delay(120)}>
            <View style={styles.bloomCircle}>
              <LinearGradient
                colors={gradients.verdictBloom}
                start={{ x: 0.2, y: 0.1 }}
                end={{ x: 0.9, y: 0.9 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={[typeScale.verdictBloom, { color: colors.primary }]}>
                {verdictWord}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Description lines */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(300)}
          style={styles.descriptionBlock}
        >
          <Text style={[typeScale.titleM, { color: colors.onSurface, textAlign: 'center' }]}>
            {scanDetail.confidence}% sure · {scanDetail.product.toLowerCase()}
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, textAlign: 'center', marginTop: 8 },
            ]}
          >
            looks evenly fresh, no dulling on the surface
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, textAlign: 'center', marginTop: 20 },
            ]}
          >
            use within {scanDetail.daysLeft} days, or freeze
          </Text>
        </Animated.View>

        {/* Storage note */}
        <Animated.View entering={FadeIn.duration(motion.moderate).delay(420)}>
          <GlassCard variant="glass" radius="xl" padding={20} style={styles.storageCard}>
            <Eyebrow uppercase style={{ marginBottom: 10 }}>
              keep in mind
            </Eyebrow>
            <Text style={[typeScale.body, { color: colors.onSurfaceVariant }]}>
              {scanDetail.storage.toLowerCase()}
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Action row */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(540)}
          style={styles.actionRow}
        >
          <PillCTA
            variant="primary"
            label="save to my fridge"
            onPress={() => router.back()}
            style={{ flex: 1.4 }}
          />
          <PillCTA
            variant="glass"
            label="scan another"
            onPress={() => router.replace('/scan/camera')}
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* Disclaimer chip */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(660)}
          style={styles.disclaimerWrap}
        >
          <View style={styles.disclaimerChip}>
            <Text style={[typeScale.caption, { color: colors.secondary }]}>
              visual check only — won't catch bacteria
            </Text>
          </View>
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  bloomWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    height: 300,
  },
  bloomGlow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.6,
  },
  bloomGlow1: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(194,238,192,0.35)',
    top: 30,
    left: 40,
  },
  bloomGlow2: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(125,166,125,0.18)',
    bottom: 10,
    right: 30,
  },
  bloomCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 60,
    elevation: 12,
  },
  descriptionBlock: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  storageCard: {
    marginBottom: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  disclaimerWrap: {
    alignItems: 'center',
  },
  disclaimerChip: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
