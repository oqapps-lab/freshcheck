import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Scan } from '@/components/ui/Glyphs';
import { CategoryGlyph, categoryFor } from '@/components/ui/CategoryGlyph';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { useScans } from '@/src/hooks/useScans';

function relative(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return iso.toLowerCase(); // mock labels ("Yesterday", "2 days ago")
  const deltaSec = Math.max(0, (Date.now() - then) / 1000);
  if (deltaSec < 60) return 'just now';
  if (deltaSec < 3600) return `${Math.floor(deltaSec / 60)}m ago`;
  if (deltaSec < 86400) return `${Math.floor(deltaSec / 3600)}h ago`;
  const days = Math.floor(deltaSec / 86400);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scans, loading } = useScans();

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
        <Text style={[typeScale.label, { color: colors.secondary }]}>scan history</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 72,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: layout.screenPadding,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading && scans.length === 0 && (
          <View style={styles.centerBlock}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}

        {!loading && scans.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyOrb}>
              <Scan size={40} color={colors.primary} strokeWidth={1.3} />
            </View>
            <Text style={[typeScale.titleS, styles.emptyTitle]}>no scans yet</Text>
            <Text style={[typeScale.body, styles.emptyBody]}>
              every scan you make lands here with the verdict and a short note. try one now.
            </Text>
            <PillCTA
              label="scan a food"
              onPress={() => router.push('/scan/camera')}
              style={{ marginTop: spacing.xl }}
            />
          </View>
        )}

        {scans.length > 0 &&
          scans.map((s, i) => (
            <Animated.View
              key={s.id}
              entering={FadeIn.duration(motion.moderate).delay(40 * i)}
              style={{ marginBottom: spacing.md }}
            >
              <GlassCard variant="glass" radius="xl" padding={0}>
                <View style={styles.row}>
                  <View style={styles.thumb}>
                    <CategoryGlyph category={categoryFor(s.product)} size={26} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={styles.titleRow}>
                      <Text style={[typeScale.titleS, { color: colors.onSurface }]} numberOfLines={1}>
                        {s.product.toLowerCase()}
                      </Text>
                      <VerdictPill verdict={s.tone} small />
                    </View>
                    <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 2 }]}>
                      {relative(s.scannedAt)} · {Math.round(s.confidence)}% sure
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyOrb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: spacing.xl,
  },
});
