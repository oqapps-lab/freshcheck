import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { BarcodeScanner, Bowl, Chevron, Sparkle } from '@/components/ui/Glyphs';
import { useFridge } from '@/src/hooks/useFridge';
import { useAchievements, hydrateAchievements } from '@/src/state/achievementsStore';
import { useFavorites, hydrateFavorites } from '@/src/state/favoritesStore';
import { getRecipeList, hydrateRecipes } from '@/src/state/recipeStore';
import type { Recipe } from '@/src/hooks/useRecipes';
import { colors, typeScale, spacing, layout } from '@/constants/tokens';

// Curated, honest food-safety mini-articles. Static (no backend) — these
// give the user a reason to come back and learn, per the user's request.
const TIPS: { title: string; body: string }[] = [
  { title: 'The danger zone', body: 'Bacteria multiply fastest between 4–60°C. Refrigerate leftovers within 2 hours of cooking.' },
  { title: 'Pesto: sealed vs open', body: 'A sealed jar keeps for months. Once opened, use within about 5–7 days — or freeze it.' },
  { title: 'Eggs keep longer than you think', body: 'Refrigerated eggs are usually good 3–5 weeks past purchase. Float test: fresh ones sink.' },
  { title: 'Herbs love water', body: 'Stand fresh herbs upright in a glass of water, loosely covered — they last about twice as long.' },
  { title: 'Wash berries last', body: 'Moisture speeds up mould. Only rinse berries right before you eat them.' },
];

/**
 * Home — scan orb on top, then a discovery hub below (I1): your stats, a
 * recipe of the day, and rotating food-safety tips, so there's a reason to
 * come back. Scrolls; the orb stays the hero.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { summary } = useFridge();
  const achievements = useAchievements();
  const favorites = useFavorites();

  useEffect(() => {
    void hydrateAchievements();
    void hydrateFavorites();
    void hydrateRecipes();
  }, []);

  const onScan = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/capture');
  };

  // Recipe of the day: a favorite if any, else the latest generated batch.
  const recipeOfDay: Recipe | undefined = favorites[0] ?? getRecipeList()[0];

  // ~$4.5 average value of a grocery item kept from the bin.
  const moneySaved = Math.round(summary.total * 4.5);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>FRESHCHECK</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + layout.floatingBottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan hero */}
        <View style={styles.heroBlock}>
          <Text style={[typeScale.displayLarge, styles.title]}>Ready to Scan</Text>
          <Text style={[typeScale.bodyLarge, styles.subtitle]}>Point at food. Result in 3 seconds.</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tap to scan"
          onPress={onScan}
          style={styles.orbWrap}
        >
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.orbOuter}>
            <SoftInset radius="full" strength="thick" style={styles.orbCup} contentStyle={styles.orbCupInner}>
              <BarcodeScanner size={88} color={colors.primary} strokeWidth={1.5} />
            </SoftInset>
          </SoftSurface>
        </Pressable>
        <Text style={[typeScale.label, styles.tapHint]}>TAP TO SCAN</Text>

        {/* Achievements */}
        <View style={styles.statsRow}>
          <Stat value={String(achievements.scans)} label="SCANS" />
          <Stat value={String(summary.total)} label="TRACKED" />
          <Stat value={`$${moneySaved}`} label="SAVED" />
        </View>

        {/* Recipe of the day */}
        <Text style={[typeScale.label, styles.sectionLabel]}>RECIPE OF THE DAY</Text>
        {recipeOfDay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`open ${recipeOfDay.name}`}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.push(`/recipe/${recipeOfDay.id}` as never);
            }}
          >
            <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.rotdCard}>
              {recipeOfDay.hero_image_url ? (
                <Image source={{ uri: recipeOfDay.hero_image_url }} style={styles.rotdImage} resizeMode="cover" />
              ) : (
                <View style={styles.rotdFallback}>
                  <Bowl size={36} color={colors.amber} strokeWidth={1.6} />
                </View>
              )}
              <View style={styles.rotdBody}>
                <Text style={[typeScale.titleMedium, { color: colors.ink, flex: 1 }]} numberOfLines={1}>
                  {recipeOfDay.name}
                </Text>
                <Chevron size={18} color={colors.inkMuted} />
              </View>
            </SoftSurface>
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="generate recipes"
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.push('/(tabs)/recipes' as never);
            }}
          >
            <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.rotdEmpty}>
              <Sparkle size={24} color={colors.amber} strokeWidth={1.6} />
              <Text style={[typeScale.titleSmall, styles.rotdEmptyText]}>
                Generate recipes from your fridge
              </Text>
              <Chevron size={18} color={colors.inkMuted} />
            </SoftSurface>
          </Pressable>
        )}

        {/* Fresh tips */}
        <Text style={[typeScale.label, styles.sectionLabel]}>FRESH TIPS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsScroll}
        >
          {TIPS.map((tip) => (
            <SoftSurface key={tip.title} variant="cushion" radius="xxl" innerStyle={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Sparkle size={18} color={colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={[typeScale.titleSmall, styles.tipTitle]}>{tip.title}</Text>
              <Text style={[typeScale.bodySmall, styles.tipBody]}>{tip.body}</Text>
            </SoftSurface>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <SoftSurface variant="cushion" radius="xl" innerStyle={styles.statCard}>
      <Text style={[typeScale.numberLarge, styles.statNum]}>{value}</Text>
      <Text style={[typeScale.labelTiny, styles.statLabel]}>{label}</Text>
    </SoftSurface>
  );
}

const ORB_OUTER = 248;
const ORB_CUP = 196;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xl,
  },
  heroBlock: {
    paddingHorizontal: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  title: { color: colors.ink, textAlign: 'center' },
  subtitle: { color: colors.inkSecondary, textAlign: 'center', marginTop: spacing.sm },
  orbWrap: { marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  orbOuter: { width: ORB_OUTER, height: ORB_OUTER, alignItems: 'center', justifyContent: 'center' },
  orbCup: { width: ORB_CUP, height: ORB_CUP },
  orbCupInner: { width: ORB_CUP, height: ORB_CUP, alignItems: 'center', justifyContent: 'center' },
  tapHint: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    letterSpacing: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.enormous,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 2,
  },
  statNum: { color: colors.primary },
  statLabel: { color: colors.inkSecondary, letterSpacing: 1.4 },
  sectionLabel: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.enormous,
    marginBottom: spacing.md,
    marginLeft: 4,
    letterSpacing: 1.6,
  },
  rotdCard: { padding: 0, overflow: 'hidden' },
  rotdImage: { width: '100%', aspectRatio: 16 / 9 },
  rotdFallback: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotdBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  rotdEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  rotdEmptyText: { flex: 1, color: colors.ink },
  tipsScroll: { paddingRight: spacing.xl, gap: spacing.md, paddingBottom: 8 },
  tipCard: {
    width: 240,
    marginRight: spacing.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTitle: { color: colors.ink },
  tipBody: { color: colors.inkSecondary, lineHeight: 18 },
});
