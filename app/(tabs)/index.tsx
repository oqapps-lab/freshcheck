import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DewDrop } from '@/components/ui/DewDrop';
import { ProductRow } from '@/components/ui/ProductRow';
import { VerdictPill } from '@/components/ui/VerdictPill';
import {
  Sprig,
  Droplet,
  Fridge as FridgeGlyph,
  Chevron,
} from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { user, scanQuota } from '@/mock/user';
import { fridgeSummary, fridgeItems } from '@/mock/fridge';
import { recentScans } from '@/mock/scans';

/**
 * Home Dashboard v3 — The Dew-Drenched Conservatory
 * Inspired directly by Stitch "Morning Greeting" + "Last Answer" composition.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Take the 3 most-expiring items for the "three things want attention soon" row
  const attentionItems = [...fridgeItems]
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const lastScan = recentScans[0];

  return (
    <AtmosphericBackground>
      {/* Top wordmark */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.brand}>
          <Sprig size={20} color={colors.primary} />
          <Text style={[typeScale.label, { color: colors.primary, marginLeft: 8 }]}>
            freshcheck
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 64,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. MORNING GREETING */}
        <Animated.View entering={FadeIn.duration(motion.moderate)}>
          <Eyebrow uppercase style={{ marginBottom: 12 }}>
            morning greeting
          </Eyebrow>

          <GlassCard variant="glass" radius="xxl" padding={28} style={styles.greetingCard}>
            <View style={styles.greetingHeader}>
              <View style={styles.avatar}>
                <Sprig size={22} color={colors.primary} strokeWidth={1.4} />
              </View>
              <Text style={[typeScale.displayL, { color: colors.onSurface }]}>
                hi, {user.name.toLowerCase()}
              </Text>
            </View>

            {/* Inner nested panel — "three things want attention soon" */}
            <View style={styles.attentionCard}>
              <Text style={[typeScale.body, { color: colors.secondary, marginBottom: 18 }]}>
                {attentionItems.length === 1
                  ? 'one thing wants attention soon'
                  : `${spellOut(attentionItems.length)} things want attention soon`}
              </Text>
              <View style={styles.dewRow}>
                {attentionItems.map((item) => (
                  <DewDrop
                    key={item.id}
                    size={48}
                    accessibilityLabel={item.name.toLowerCase()}
                  >
                    <Text style={[typeScale.titleM, { color: colors.primary }]}>
                      {item.name.charAt(0).toLowerCase()}
                    </Text>
                  </DewDrop>
                ))}
              </View>
            </View>

            <PillCTA
              label="see the fridge"
              iconRight={<Chevron size={16} color={colors.white} />}
              onPress={() => router.navigate('/(tabs)/fridge')}
              style={styles.greetingCTA}
            />
          </GlassCard>
        </Animated.View>

        {/* 2. THE LAST ANSWER */}
        {lastScan && (
          <Animated.View entering={FadeIn.duration(motion.moderate).delay(80)} style={styles.section}>
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              the last answer
            </Eyebrow>

            <GlassCard variant="glass" radius="xl" padding={16}>
              <Pressable
                onPress={() => router.push('/scan/result')}
                style={styles.lastAnswerRow}
                accessibilityRole="button"
                accessibilityLabel="Open last scan"
              >
                <View style={styles.lastAnswerThumb}>
                  <FridgeGlyph size={28} color={colors.primary} strokeWidth={1.4} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <View style={styles.lastAnswerTitleRow}>
                    <Text style={[typeScale.titleL, { color: colors.onSurface }]}>
                      {lastScan.product.toLowerCase()}
                    </Text>
                    <VerdictPill verdict={lastScan.tone} small />
                  </View>
                  <Text
                    style={[
                      typeScale.body,
                      { color: colors.secondary, marginTop: 2 },
                    ]}
                  >
                    {lastScan.scannedAt.toLowerCase()} · {lastScan.confidence}% sure
                  </Text>
                </View>
              </Pressable>
            </GlassCard>
          </Animated.View>
        )}

        {/* 3. TODAY — quiet inline stats (merged to avoid tab-bar anchor overlap) */}
        <Animated.View entering={FadeIn.duration(motion.moderate).delay(160)} style={styles.todayInline}>
          <Text style={[typeScale.caption, { color: colors.secondary }]}>
            {scanQuota.usedToday} of {scanQuota.perDay} scans today · {fridgeSummary.total} items tracked · {fridgeSummary.expiring} need soon
          </Text>
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

function spellOut(n: number): string {
  const map: Record<number, string> = {
    0: 'no',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
  };
  return map[n] ?? String(n);
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
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingCard: {
    marginBottom: spacing.xl,
  },
  greetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  attentionCard: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  dewRow: {
    flexDirection: 'row',
    gap: 14,
  },
  greetingCTA: {
    alignSelf: 'flex-start',
    paddingHorizontal: 28,
  },
  section: {
    marginBottom: spacing.xl,
  },
  lastAnswerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastAnswerThumb: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  lastAnswerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  todayInline: {
    alignItems: 'center',
    marginTop: 4,
  },
});
