import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Sprig } from '@/components/ui/Glyphs';
import { CategoryGlyph, categoryFor } from '@/components/ui/CategoryGlyph';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { useScans, type ScanRecord } from '@/src/hooks/useScans';

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
}

/** Days between two timestamps using local-midnight buckets. */
function daysBetween(then: Date, now: Date): number {
  const t = new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime();
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((n - t) / 86400000);
}

type Bucket = 'Today' | 'Yesterday' | '2 Days Ago' | 'This Week' | 'Earlier';
const BUCKET_ORDER: Bucket[] = ['Today', 'Yesterday', '2 Days Ago', 'This Week', 'Earlier'];

function bucketFor(iso: string): Bucket {
  const t = new Date(iso);
  if (isNaN(t.getTime())) {
    // mock labels ("Yesterday", "2 days ago") — best-effort string match
    const s = iso.toLowerCase();
    if (s.includes('today')) return 'Today';
    if (s.includes('yesterday')) return 'Yesterday';
    if (s.includes('2 day')) return '2 Days Ago';
    if (s.includes('day') || s.includes('week')) return 'This Week';
    return 'Earlier';
  }
  const d = daysBetween(t, new Date());
  if (d <= 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d === 2) return '2 Days Ago';
  if (d <= 7) return 'This Week';
  return 'Earlier';
}

/** Short relative time for the row body (e.g. "12m ago", "yesterday"). */
function relative(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return iso.toLowerCase();
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

  const grouped = useMemo(() => {
    const map = new Map<Bucket, ScanRecord[]>();
    for (const s of scans) {
      const b = bucketFor(s.scannedAt);
      const arr = map.get(b) ?? [];
      arr.push(s);
      map.set(b, arr);
    }
    return BUCKET_ORDER.filter((b) => map.has(b)).map((b) => ({
      bucket: b,
      items: map.get(b)!,
    }));
  }, [scans]);

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.circleBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="back"
          hitSlop={10}
        >
          <Back size={18} color={colors.primary} />
        </Pressable>
        <Text style={[typeScale.labelSmall, styles.headerTitle]}>SCAN HISTORY</Text>
        <View style={styles.headerSpacer} />
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
          <Animated.View
            entering={FadeIn.duration(motion.moderate)}
            style={styles.emptyWrap}
          >
            <NeumorphicCard variant="raised" radius="lg" padding={28} style={styles.emptyCard}>
              <View style={styles.emptyOrb}>
                <Sprig size={36} color={colors.primary} strokeWidth={1.4} />
              </View>
              <Text style={[typeScale.titleL, styles.emptyTitle]}>No Scans Yet</Text>
              <Text style={[typeScale.body, styles.emptyBody]}>
                your scan history will appear here.
              </Text>
              <PillCTA
                label="scan a food"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  router.push('/scan/camera');
                }}
                style={{ marginTop: spacing.xl }}
              />
            </NeumorphicCard>
          </Animated.View>
        )}

        {grouped.map((group, gi) => (
          <Animated.View
            key={group.bucket}
            entering={FadeIn.duration(motion.moderate).delay(gi * 60)}
            style={styles.group}
          >
            <Text style={[typeScale.labelSmall, styles.groupHeader]}>
              {group.bucket.toUpperCase()}
            </Text>
            {group.items.map((s, i) => (
              <Animated.View
                key={s.id}
                entering={FadeIn.duration(motion.moderate).delay(gi * 60 + i * 30)}
                style={styles.cardWrap}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    // No detail screen for history rows yet — leave as no-op tap.
                  }}
                  style={({ pressed }) => [pressed && { opacity: 0.92 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.product.toLowerCase()}, ${s.verdict}, ${relative(s.scannedAt)}`}
                >
                  <NeumorphicCard variant="raised" radius="md" padding={16}>
                    <View style={styles.row}>
                      <View style={styles.thumb}>
                        <CategoryGlyph
                          category={categoryFor(s.product)}
                          size={28}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.rowBody}>
                        <Text style={[typeScale.titleM, styles.rowTitle]} numberOfLines={1}>
                          {toTitleCase(s.product)}
                        </Text>
                        <Text style={[typeScale.bodySmall, styles.rowDate]} numberOfLines={1}>
                          {relative(s.scannedAt)}
                        </Text>
                      </View>
                      <VerdictPill verdict={s.tone} small />
                    </View>
                  </NeumorphicCard>
                </Pressable>
              </Animated.View>
            ))}
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
  headerTitle: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    shadowColor: '#bcb9b0',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupHeader: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardWrap: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    color: colors.ink,
  },
  rowDate: {
    color: colors.outline,
    marginTop: 2,
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyOrb: {
    width: 88,
    height: 88,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.sm,
  },
});
