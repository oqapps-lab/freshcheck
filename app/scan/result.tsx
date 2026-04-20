import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CountdownBar } from '@/components/ui/CountdownBar';
import { Back, Share, Scan } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout, toneColor } from '@/constants/tokens';
import { scanDetail } from '@/mock/scans';

/**
 * Scan Result — /scan/result
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
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 40,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Product hero thumbnail */}
        <View style={styles.heroThumbWrap}>
          <View style={styles.heroThumb}>
            <Text style={styles.heroEmoji}>{scanDetail.placeholder}</Text>
          </View>
        </View>

        {/* Hero verdict: number + serif pill */}
        <HeroNumber value={scanDetail.confidence} suffix="%" size="xl" center />
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <VerdictPill verdict={scanDetail.tone} serif />
        </View>
        <Eyebrow center style={{ marginTop: 10 }}>
          {scanDetail.subheader}
        </Eyebrow>

        {/* Detailed analysis */}
        <GlassCard variant="elevated" showTopLight style={styles.analysisCard}>
          <Text style={[typeScale.titleM, { color: colors.ink, marginBottom: 14 }]}>
            Detailed analysis
          </Text>
          {scanDetail.analysis.map((row) => (
            <View key={row.label} style={styles.analysisRow}>
              <Text style={[typeScale.body, { color: colors.ink }]}>{row.label}</Text>
              <CountdownBar daysLeft={100 - row.value} totalDays={100} style={styles.analysisBar} />
              <Text style={[typeScale.label, { color: colors.inkMuted, minWidth: 48, textAlign: 'right' }]}>
                {row.value}/100
              </Text>
            </View>
          ))}
        </GlassCard>

        {/* Storage advice */}
        <View style={styles.section}>
          <Eyebrow style={{ marginBottom: 10 }}>Storage</Eyebrow>
          <Text style={[typeScale.body, { color: colors.inkMuted }]}>{scanDetail.storage}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[typeScale.caption, { color: colors.inkDim, fontStyle: 'italic' }]}>
            {scanDetail.disclaimer}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.floatingCta, { bottom: insets.bottom + 16 }]}>
        <PillCTA
          label="Scan another"
          icon={<Scan size={22} color={colors.white} />}
          fullWidth
          onPress={() => router.replace('/scan/camera')}
        />
      </View>
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
  heroThumb: {
    width: 220,
    height: 220,
    borderRadius: radii.xxl,
    backgroundColor: colors.sageMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 140,
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
