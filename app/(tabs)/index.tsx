import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { HeroNumber } from '@/components/ui/HeroNumber';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TokenDot } from '@/components/ui/TokenDot';
import { ProductRow } from '@/components/ui/ProductRow';
import { Sprig, Scan, Fridge as FridgeGlyph, Droplet } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout } from '@/constants/tokens';
import { user, dayOfWeek } from '@/mock/user';
import { fridgeSummary } from '@/mock/fridge';
import { recentScans, homeStats } from '@/mock/scans';

/**
 * Home Dashboard — /(tabs)/index
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.1
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Sprig size={22} color={colors.sageInk} />
        <Text style={[typeScale.label, styles.wordmark]}>FreshCheck</Text>
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
        <View style={styles.greeting}>
          <Text style={[typeScale.displayM, { color: colors.sageInk }]}>Hi {user.name}</Text>
          <Eyebrow>{`Your kitchen · ${dayOfWeek}`}</Eyebrow>
        </View>

        {/* Hero card */}
        <GlassCard variant="leafHighlight" showTopLight style={styles.heroCard} padding={0}>
          <View style={styles.heroPhoto}>
            <View style={styles.heroGlyphWrap}>
              <FridgeGlyph size={72} color={colors.sageInk} strokeWidth={1.5} />
              <View style={styles.heroDroplet}>
                <Droplet size={18} color={colors.sageInk} />
              </View>
            </View>
            <Eyebrow style={{ marginTop: 12 }}>Inside your fridge</Eyebrow>
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

        {/* Stats row */}
        <View style={styles.statsRow}>
          <GlassCard variant="default" style={styles.statCard} padding={16}>
            <Eyebrow>Saved</Eyebrow>
            <HeroNumber value={`$${homeStats.saved}`} size="s" />
          </GlassCard>
          <GlassCard variant="default" style={styles.statCard} padding={16}>
            <Eyebrow>Scans</Eyebrow>
            <HeroNumber value={homeStats.scans} size="s" />
          </GlassCard>
          <GlassCard variant="default" style={styles.statCard} padding={16}>
            <Eyebrow>Wasted</Eyebrow>
            <HeroNumber value={homeStats.wasted} size="s" />
          </GlassCard>
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
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
                  <Text style={[typeScale.titleS, { color: colors.sageInk }]}>{scan.confidence}</Text>
                </View>
              }
              onPress={() => router.push('/scan/result')}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Scan CTA */}
      <View style={[styles.floatingCta, { bottom: insets.bottom + layout.floatingBottomClearance - 16 }]}>
        <PillCTA
          label="Scan"
          icon={<Scan size={22} color={colors.white} />}
          fullWidth
          onPress={() => router.push('/scan/camera')}
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
    height: 180,
    backgroundColor: colors.sageMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlyphWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDroplet: {
    position: 'absolute',
    top: -6,
    right: -18,
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
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.sageMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
