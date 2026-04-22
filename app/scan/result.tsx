import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Share as RNShare } from 'react-native';
import * as Haptics from 'expo-haptics';
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
import { useCurrentScan, scanStore } from '@/src/lib/scanStore';
import { useFridge } from '@/src/hooks/useFridge';
import { categoryFor } from '@/components/ui/CategoryGlyph';

/**
 * Scan Result v3 — Verdict Bloom
 * Hero is the verdict WORD ("fresh") in a soft-bloom circle, not a percent number.
 * Ref: Stitch §5 Verdict Bloom.
 */
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const live = useCurrentScan();
  const { addItem } = useFridge();

  // Use live result if present; otherwise fall back to the mock preview.
  const r = live ?? {
    id: scanDetail.id,
    product: scanDetail.product,
    verdict: scanDetail.verdict,
    tone: scanDetail.tone,
    confidence: scanDetail.confidence,
    storageNote: scanDetail.storage,
    daysLeft: scanDetail.daysLeft,
    totalDays: scanDetail.totalDays,
    imagePath: null,
    analysis: scanDetail.analysis,
  };

  const verdictWord = r.tone;
  const productLc = r.product.toLowerCase();

  const shareResult = async () => {
    Haptics.selectionAsync().catch(() => {});
    try {
      await RNShare.share({
        message: `FreshCheck says my ${productLc} is ${verdictWord} (${r.confidence}% sure).`,
      });
    } catch {
      // user cancelled share — no-op
    }
  };

  const saveToFridge = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (live && r.daysLeft != null && r.totalDays != null) {
      await addItem({
        name: r.product,
        tone: r.tone === 'neutral' ? 'fresh' : r.tone,
        days_left: r.daysLeft,
        total_days: r.totalDays,
        expiry_text:
          r.daysLeft <= 1
            ? 'expires tomorrow'
            : `expires in ${r.daysLeft} days`,
        warn: r.tone === 'past' || r.tone === 'soon',
        source_scan_id: r.id.startsWith('ephemeral') || r.id === 'mock-scan' ? null : r.id,
      });
    }
    scanStore.clear();
    router.replace('/(tabs)/fridge');
  };

  const scanAnother = () => {
    scanStore.clear();
    router.replace('/scan/camera');
  };

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
        <Pressable
          onPress={shareResult}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="share result"
        >
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
                {verdictWord === 'past' ? 'toss' : verdictWord}
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
            {Math.round(r.confidence)}% sure · {productLc}
          </Text>
          {r.daysLeft != null && (
            <Text
              style={[
                typeScale.body,
                { color: colors.secondary, textAlign: 'center', marginTop: 20 },
              ]}
            >
              {r.tone === 'past'
                ? 'don\u2019t eat this one.'
                : r.daysLeft <= 1
                  ? 'use within a day, or freeze.'
                  : `use within ${r.daysLeft} days, or freeze.`}
            </Text>
          )}
        </Animated.View>

        {/* Analysis breakdown */}
        {r.analysis.length > 0 && (
          <Animated.View entering={FadeIn.duration(motion.moderate).delay(380)}>
            <GlassCard variant="glass" radius="xl" padding={20} style={styles.storageCard}>
              <Eyebrow uppercase style={{ marginBottom: 14 }}>
                what we looked at
              </Eyebrow>
              {r.analysis.map((row) => (
                <View key={row.label} style={styles.analysisRow}>
                  <Text style={[typeScale.body, { color: colors.onSurface }]}>
                    {row.label.toLowerCase()}
                  </Text>
                  <Text style={[typeScale.titleS, { color: colors.primary }]}>
                    {Math.round(row.value)}%
                  </Text>
                </View>
              ))}
            </GlassCard>
          </Animated.View>
        )}

        {/* Storage note */}
        {r.storageNote && (
          <Animated.View entering={FadeIn.duration(motion.moderate).delay(440)}>
            <GlassCard variant="glass" radius="xl" padding={20} style={styles.storageCard}>
              <Eyebrow uppercase style={{ marginBottom: 10 }}>
                keep in mind
              </Eyebrow>
              <Text style={[typeScale.body, { color: colors.onSurfaceVariant }]}>
                {r.storageNote.toLowerCase()}
              </Text>
            </GlassCard>
          </Animated.View>
        )}

        {/* Action row */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(540)}
          style={styles.actionRow}
        >
          <PillCTA
            variant="primary"
            label="save to my fridge"
            onPress={saveToFridge}
            style={{ flex: 1.4 }}
          />
          <PillCTA
            variant="glass"
            label="scan another"
            onPress={scanAnother}
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
  analysisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
});
