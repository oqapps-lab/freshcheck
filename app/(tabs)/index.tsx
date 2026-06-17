import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
// Text copy lives in i18n under home.freshTips.items.<id>.{title,body}.
const FRESH_TIP_IDS = ['dangerZone', 'pestoSealedVsOpen', 'eggsKeepLonger', 'herbsLoveWater', 'washBerriesLast'] as const;

/**
 * Home — scan orb on top, then a discovery hub below (I1): your stats, a
 * recipe of the day, and rotating food-safety tips, so there's a reason to
 * come back. Scrolls; the orb stays the hero.
 */
export default function HomeScreen() {
  const { t } = useTranslation();
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
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>{t('home.wordmark')}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + layout.floatingBottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan hero */}
        <View style={styles.heroBlock}>
          <Text style={[typeScale.displayLarge, styles.title]}>{t('home.heroTitle')}</Text>
          <Text style={[typeScale.bodyLarge, styles.subtitle]}>{t('home.heroSubtitle')}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('home.a11y.tapToScan')}
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
        <Text style={[typeScale.label, styles.tapHint]}>{t('home.tapToScan')}</Text>

        {/* Recipe of the day */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('home.sections.recipeOfDay')}</Text>
        {recipeOfDay ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('home.a11y.openRecipe', { name: recipeOfDay.name })}
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
            accessibilityLabel={t('home.a11y.generateRecipes')}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              router.push('/(tabs)/recipes' as never);
            }}
          >
            <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.rotdEmpty}>
              <Sparkle size={24} color={colors.amber} strokeWidth={1.6} />
              <Text style={[typeScale.titleSmall, styles.rotdEmptyText]}>
                {t('home.recipeOfDayEmpty')}
              </Text>
              <Chevron size={18} color={colors.inkMuted} />
            </SoftSurface>
          </Pressable>
        )}

        {/* Fresh tips */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('home.sections.freshTips')}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tipsScrollOuter}
          contentContainerStyle={styles.tipsScroll}
        >
          {FRESH_TIP_IDS.map((id) => (
            <SoftSurface key={id} variant="cushion" radius="xxl" innerStyle={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Sparkle size={18} color={colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={[typeScale.titleSmall, styles.tipTitle]}>{t(`home.freshTips.items.${id}.title`)}</Text>
              <Text style={[typeScale.bodySmall, styles.tipBody]}>{t(`home.freshTips.items.${id}.body`)}</Text>
            </SoftSurface>
          ))}
        </ScrollView>

        {/* Storage guide */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('home.sections.storageGuide')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {STORAGE_GUIDE.map((it) => (
            <SoftSurface key={it.id} variant="cushion" radius="xxl" innerStyle={styles.storeCard}>
              <Text style={styles.storeEmoji}>{it.emoji}</Text>
              <Text style={[typeScale.titleSmall, styles.tipTitle]}>{t(`storageGuide.items.${it.id}.name`)}</Text>
              <Text style={[typeScale.bodySmall, styles.tipBody]}>{t(`storageGuide.items.${it.id}.store`)}</Text>
              <View style={styles.storeMeta}>
                <Text style={[typeScale.labelSmall, styles.storeMetaText]}>{t(`storageGuide.items.${it.id}.life`)}</Text>
                <Text style={[typeScale.labelSmall, styles.storeMetaText]}>{t(`storageGuide.items.${it.id}.temp`)}</Text>
              </View>
            </SoftSurface>
          ))}
        </ScrollView>

        {/* Chef tips */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('home.sections.chefTips')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {CHEF_TIPS.map((c) => (
            <SoftSurface key={c.id} variant="cushion" radius="xxl" innerStyle={styles.chefCard}>
              <Text style={[typeScale.body, styles.chefTip]}>{t(`chefTips.items.${c.id}.tip`)}</Text>
              <View style={styles.chefWho}>
                <Text style={[typeScale.titleSmall, styles.tipTitle]}>{t(`chefTips.items.${c.id}.name`)}</Text>
                <Text style={[typeScale.labelSmall, styles.chefRole]}>{t(`chefTips.items.${c.id}.role`)}</Text>
              </View>
            </SoftSurface>
          ))}
        </ScrollView>

        {/* Achievements */}
        <Text style={[typeScale.label, styles.sectionLabel]}>{t('home.sections.yourBadges')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollOuter} contentContainerStyle={styles.tipsScroll}>
          {ACHIEVEMENTS.map((a) => {
            const earned = ach.earned.includes(a.id);
            return (
              <SoftSurface key={a.id} variant="cushion" radius="xxl" innerStyle={[styles.badgeCard, earned ? null : styles.badgeLocked]}>
                <Text style={styles.badgeEmoji}>{a.emoji}</Text>
                <Text style={[typeScale.labelSmall, styles.badgeTitle]}>{a.title}</Text>
                <Text style={[typeScale.bodySmall, styles.badgeDesc]}>{earned ? t('home.badgeUnlocked') : a.desc}</Text>
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
