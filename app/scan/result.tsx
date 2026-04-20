import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CountdownBar } from '@/components/ui/CountdownBar';
import { MonogramTile } from '@/components/ui/MonogramTile';
import { Back, Share, Scan } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout, motion } from '@/constants/tokens';
import { scanDetail } from '@/mock/scans';

/**
 * Scan Result — /scan/result  (v2 — animated reveal + gradient monogram + rich Safe pill)
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.2
 */
export default function ScanResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Back size={22} color={colors.ink} />
        </Pressable>
        <Text style={[typeScale.titleM, { color: colors.ink }]}>Scan result</Text>
        <Pressable style={styles.circleBtn} accessibilityRole="button" accessibilityLabel="Share">
          <Share size={18} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 88,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 120,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero monogram with pulse glow behind */}
        <Animated.View
          entering={ZoomIn.duration(motion.moderate).delay(60)}
          style={styles.heroThumbWrap}
        >
          <MonogramTile
            letter={scanDetail.product.charAt(0).toUpperCase()}
            tone={scanDetail.tone}
            size={220}
            showGlow
            showDots
          />
        </Animated.View>

        {/* Animated count-up number */}
        <Animated.View entering={FadeInDown.duration(motion.moderate).delay(260)} style={{ alignItems: 'center' }}>
          <HeroNumber value={scanDetail.confidence} suffix="%" size="xl" center animate />
        </Animated.View>

        {/* Serif "Safe" verdict */}
        <Animated.View
          entering={FadeInDown.duration(motion.moderate).delay(520)}
          style={{ alignItems: 'center', marginTop: 14 }}
        >
          <VerdictPill verdict={scanDetail.tone} serif glow />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(700)} style={{ alignItems: 'center' }}>
          <Eyebrow center style={{ marginTop: 12 }}>{scanDetail.subheader}</Eyebrow>
        </Animated.View>

        {/* Detailed analysis card */}
        <Animated.View entering={FadeInDown.duration(motion.moderate).delay(820)}>
          <GlassCard variant="leafHighlight" showTopLight showInnerGlow style={styles.analysisCard}>
            <Text style={[typeScale.titleM, { color: colors.ink, marginBottom: 14 }]}>
              Detailed analysis
            </Text>
            {scanDetail.analysis.map((row, index) => (
              <Animated.View
                key={row.label}
                entering={FadeInDown.duration(motion.moderate).delay(900 + index * 120)}
                style={styles.analysisRow}
              >
                <Text style={[typeScale.body, { color: colors.ink, width: 80 }]}>{row.label}</Text>
                <CountdownBar daysLeft={100 - row.value} totalDays={100} style={styles.analysisBar} />
                <Text
                  style={[
                    typeScale.label,
                    { color: colors.inkMuted, minWidth: 48, textAlign: 'right' },
                  ]}
                >
                  {row.value}/100
                </Text>
              </Animated.View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Storage advice */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(1300)}
          style={styles.section}
        >
          <Eyebrow style={{ marginBottom: 10 }}>Storage</Eyebrow>
          <Text style={[typeScale.body, { color: colors.inkMuted }]}>{scanDetail.storage}</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(1500)} style={styles.section}>
          <Text style={[typeScale.caption, { color: colors.inkDim, fontStyle: 'italic' }]}>
            {scanDetail.disclaimer}
          </Text>
        </Animated.View>
      </ScrollView>

      <Animated.View
        entering={FadeInDown.duration(motion.slow).delay(1100)}
        style={[styles.floatingCta, { bottom: insets.bottom + 16 }]}
      >
        <PillCTA
          label="Scan another"
          icon={<Scan size={22} color={colors.white} />}
          fullWidth
          onPress={() => router.replace('/scan/camera')}
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  heroThumbWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  analysisCard: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
  },
  analysisBar: {
    flex: 1,
    height: 6,
  },
  section: {
    marginBottom: spacing.lg,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
