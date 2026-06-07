import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { BarcodeScanner, Bowl, Chevron, Sparkle } from '@/components/ui/Glyphs';
import { useFavorites, hydrateFavorites } from '@/src/state/favoritesStore';
import { useRecipeList, hydrateRecipes } from '@/src/state/recipeStore';
import type { Recipe } from '@/src/hooks/useRecipes';
import { colors, typeScale, spacing, layout, shadowReach } from '@/constants/tokens';
import { STORAGE_GUIDE, CHEF_TIPS } from '@/constants/homeContent';
import { useAchievements, ACHIEVEMENTS } from '@/src/state/achievementsStore';

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
  const favorites = useFavorites();
  const recipes = useRecipeList();
  const ach = useAchievements();

  useEffect(() => {
    void hydrateFavorites();
    void hydrateRecipes();
  }, []);

  const onScan = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/capture');
  };

  // Recipe of the day: a favorite if any, else the latest generated batch.
  const recipeOfDay: Recipe | undefined = favorites[0] ?? recipes[0];

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
          <View style={styles.orbGlow} />
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.orbOuter}>
            <SoftInset radius="full" strength="thick" style={styles.orbCup} contentStyle={styles.orbCupInner}>
              <View style={styles.orbRing}>
                <BarcodeScanner size={84} color={colors.primary} strokeWidth={1.5} />
              </View>
            </SoftInset>
          </SoftSurface>
        </Pressable>
        <Text style={[typeScale.label, styles.tapHint]}>TAP TO SCAN</Text>

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
          style={styles.tipsScrollOuter}
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

        {/* Storage guide */}
        <Text style={[typeScale.label, styles.sectionLabel]}>STORAGE GUIDE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {STORAGE_GUIDE.map((it) => (
            <SoftSurface key={it.food} variant="cushion" radius="xxl" innerStyle={styles.storeCard}>
              <Text style={styles.storeEmoji}>{it.emoji}</Text>
              <Text style={[typeScale.titleSmall, styles.tipTitle]}>{it.food}</Text>
              <Text style={[typeScale.bodySmall, styles.tipBody]}>{it.store}</Text>
              <View style={styles.storeMeta}>
                <Text style={[typeScale.labelSmall, styles.storeMetaText]}>{it.life}</Text>
                <Text style={[typeScale.labelSmall, styles.storeMetaText]}>{it.temp}</Text>
              </View>
            </SoftSurface>
          ))}
        </ScrollView>

        {/* Chef tips */}
        <Text style={[typeScale.label, styles.sectionLabel]}>CHEF TIPS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {CHEF_TIPS.map((c) => (
            <SoftSurface key={c.chef} variant="cushion" radius="xxl" innerStyle={styles.chefCard}>
              <Text style={[typeScale.body, styles.chefTip]}>{c.tip}</Text>
              <View style={styles.chefWho}>
                <Text style={[typeScale.titleSmall, styles.tipTitle]}>{c.chef}</Text>
                <Text style={[typeScale.labelSmall, styles.chefRole]}>{c.role}</Text>
              </View>
            </SoftSurface>
          ))}
        </ScrollView>

        {/* Achievements */}
        <Text style={[typeScale.label, styles.sectionLabel]}>YOUR BADGES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {ACHIEVEMENTS.map((a) => {
            const earned = ach.earned.includes(a.id);
            return (
              <SoftSurface key={a.id} variant="cushion" radius="xxl" innerStyle={[styles.badgeCard, earned ? null : styles.badgeLocked]}>
                <Text style={styles.badgeEmoji}>{a.emoji}</Text>
                <Text style={[typeScale.labelSmall, styles.badgeTitle]}>{a.title}</Text>
                <Text style={[typeScale.bodySmall, styles.badgeDesc]}>{earned ? "Unlocked" : a.desc}</Text>
              </SoftSurface>
            );
          })}
        </ScrollView>
      </ScrollView>
    </View>
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
  orbGlow: {
    position: 'absolute',
    width: ORB_OUTER,
    height: ORB_OUTER,
    borderRadius: ORB_OUTER / 2,
    backgroundColor: colors.canvas,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 0,
  },
  orbRing: {
    width: ORB_CUP - 48,
    height: ORB_CUP - 48,
    borderRadius: (ORB_CUP - 48) / 2,
    borderWidth: 1.5,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    letterSpacing: 2,
    textAlign: 'center',
  },
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
  // The carousel breaks out of the screen's horizontal padding (negative
  // margin) so its frame is full-width; the contentContainer then re-insets
  // by screenPadding AND pads ≥ shadowReach on every side + uses a gap ≥
  // reach between cards. Result: every card's shadow renders inside the
  // full-width frame and never clips (top/bottom/left/right).
  tipsScrollOuter: { marginHorizontal: -layout.screenPadding },
  tipsScroll: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: shadowReach.cushion,
    gap: shadowReach.cushion,
  },
  tipCard: {
    width: 240,
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
  storeCard: { width: 210, padding: spacing.lg, gap: spacing.xs },
  storeEmoji: { fontSize: 28 },
  storeMeta: { flexDirection: "column", gap: 2, marginTop: 6, alignSelf: "stretch" },
  storeMetaText: { color: colors.primary, letterSpacing: 0.6 },
  storeMetaDot: { color: colors.inkMuted },
  chefCard: { width: 250, padding: spacing.lg, gap: spacing.md, justifyContent: "space-between" },
  chefTip: { color: colors.ink, lineHeight: 22 },
  chefWho: { gap: 1 },
  chefRole: { color: colors.inkMuted, letterSpacing: 0.6 },
  badgeCard: { width: 132, padding: spacing.lg, gap: spacing.xs, alignItems: "center" },
  badgeLocked: { opacity: 0.5 },
  badgeEmoji: { fontSize: 32 },
  badgeTitle: { color: colors.ink, textAlign: "center" },
  badgeDesc: { color: colors.inkSecondary, textAlign: "center", fontSize: 11, lineHeight: 14 },
});
