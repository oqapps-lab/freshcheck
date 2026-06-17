import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { RecipeCookingLoader } from '@/components/ui/RecipeCookingLoader';
import { RecipeImageLoading } from '@/components/ui/RecipeImageLoading';
import { Shimmer } from '@/components/ui/Shimmer';
import { FadeIn } from '@/components/ui/FadeIn';
import { Check, Chevron, Close, Sparkle, Star } from '@/components/ui/Glyphs';
import { useRecipes, type Recipe } from '@/src/hooks/useRecipes';
import { useFridge } from '@/src/hooks/useFridge';
import { removeRecipe } from '@/src/state/recipeStore';
import {
  useFavorites,
  toggleFavorite,
  hydrateFavorites,
} from '@/src/state/favoritesStore';
import { colors, layout, spacing, typeScale, shadowReach } from '@/constants/tokens';

// Difficulty != freshness. `hard: red` overlapped with the `past`
// (spoiled-food) verdict colour, so a recipe labelled HARD read as a
// food-safety warning. amberDeep keeps the "challenging" signal without
// borrowing the spoilage red.
const DIFFICULTY_COLOR: Record<Recipe['difficulty'], string> = {
  easy: colors.primary,
  medium: colors.amber,
  hard: colors.amberDeep,
};

/**
 * Recipes tab — AI recipes generated from the user's fridge. Now a
 * first-class tab (was a pushed screen with no way back to it). The last
 * generated batch is persisted in recipeStore, so opening the tab shows
 * the user's recipes instead of resetting to the empty "Generate" state.
 */
export default function RecipesTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { status, error, recipes, hydrated, refresh } = useRecipes();
  const { items: fridgeItems, loading: fridgeLoading } = useFridge();
  const fridgeEmpty = fridgeItems.length === 0;
  // Don't render any contextual title or empty/idle state until BOTH the
  // persisted recipes have hydrated AND the fridge has loaded — otherwise the
  // screen flashes "Starter recipes"/"fridge empty" for a frame, then snaps
  // to the real content (user-flagged G1 + G3).
  const ready = hydrated && !fridgeLoading;
  const favorites = useFavorites();
  const favIds = new Set(favorites.map((r) => r.id));

  useEffect(() => {
    void hydrateFavorites();
  }, []);

  const onOpen = (recipe: Recipe) => {
    Haptics.selectionAsync().catch(() => {});
    router.push(`/recipe/${recipe.id}` as never);
  };

  const onToggleFav = (recipe: Recipe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    toggleFavorite(recipe);
  };

  const onDeleteRecipe = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    removeRecipe(id); // L3 — per-recipe delete; favorites are kept separately.
  };

  // K7: ingredient picker. Empty fridge → straight to starter recipes;
  // otherwise let the user tick which items to cook with, then generate.
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // The sheet slides up over an instantly-dimmed backdrop, driven by a
  // reanimated shared value so the grey grabber can be DRAGGED to dismiss. The
  // old PanResponder never fired because RN <Modal> renders outside the app's
  // GestureHandlerRootView — so the Modal subtree gets its own root view below.
  const screenH = Dimensions.get('window').height;
  const ty = useSharedValue(screenH);
  useEffect(() => {
    if (selectorOpen) {
      ty.value = screenH;
      ty.value = withTiming(0, { duration: 300 });
    }
  }, [selectorOpen, screenH, ty]);

  const closeSheet = (after?: () => void) => {
    ty.value = withTiming(screenH, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(setSelectorOpen)(false);
        if (after) runOnJS(after)();
      }
    });
  };

  // Drag-down-to-dismiss on the grey grabber only (so the ingredient list still
  // scrolls). Past dy>110 or a fast flick → close; otherwise snap back up.
  const sheetPan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 110 || e.velocityY > 0.6) {
        ty.value = withTiming(screenH, { duration: 200 }, (finished) => {
          if (finished) runOnJS(setSelectorOpen)(false);
        });
      } else {
        ty.value = withTiming(0, { duration: 180 });
      }
    });

  const sheetAnimStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  const openGenerate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (fridgeEmpty) {
      refresh();
      return;
    }
    setSelectedIds(new Set(fridgeItems.map((i) => i.id)));
    setSelectorOpen(true);
  };

  const confirmGenerate = () => {
    if (selectedIds.size === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const ids = Array.from(selectedIds);
    closeSheet(() => refresh({ itemIds: ids }));
  };

  const toggleItem = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={[typeScale.wordmark, styles.eyebrow]}>{t('recipes.eyebrow')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.floatingBottomClearance },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          {ready ? (
            <>
              <Text style={[typeScale.displayLarge, { color: colors.ink }]}>
                {fridgeEmpty ? t('recipes.hero.titleEmpty') : t('recipes.hero.title')}
              </Text>
              <Text style={[typeScale.label, styles.eyebrow2]}>
                {fridgeEmpty ? t('recipes.hero.subtitleEmpty') : t('recipes.hero.subtitle')}
              </Text>
            </>
          ) : (
            // Shimmer the title instead of showing placeholder words that then
            // swap to the real title (user-flagged jumping text).
            <>
              <Shimmer width="78%" height={40} radius={12} />
              <Shimmer width="46%" height={12} radius={6} style={{ marginTop: 10 }} />
            </>
          )}
        </View>

        {/* PRIMARY action — cook from what's already in the fridge. Fulfils the
            hero heading, so it must be the FIRST thing under it. Opens the
            ingredient picker for a real fridge, or makes starter recipes for an
            empty one. (One stable name in the populated state — no 3-way label.) */}
        {ready && status !== 'loading' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={fridgeEmpty ? t('recipes.a11y.generateStarter') : t('recipes.a11y.cookWithWhatYouHave')}
            onPress={openGenerate}
            style={({ pressed }) => [styles.cookBlockWrap, { opacity: pressed ? 0.9 : 1 }]}
          >
            <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cookBlock}>
              <View style={styles.cookIcon}>
                <Sparkle size={22} color={colors.amber} strokeWidth={1.8} />
              </View>
              <View style={styles.cookText}>
                <Text style={[typeScale.titleMedium, { color: colors.ink }]}>
                  {fridgeEmpty ? t('recipes.cook.titleEmpty') : t('recipes.cook.title')}
                </Text>
                <Text style={[typeScale.bodySmall, styles.cookSub]}>
                  {fridgeEmpty ? t('recipes.cook.subtitleEmpty') : t('recipes.cook.subtitle')}
                </Text>
              </View>
              <Chevron size={18} color={colors.inkMuted} />
            </SoftSurface>
          </Pressable>
        )}

        {/* SECONDARY — manual builder (type your own ingredients; ignores fridge). */}
        {ready && status !== 'loading' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('recipes.a11y.buildCustom')}
            onPress={() => { Haptics.selectionAsync().catch(() => {}); router.push('/recipe-builder' as never); }}
            style={({ pressed }) => [styles.cookBlockWrap, { opacity: pressed ? 0.9 : 1 }]}
          >
            <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.cookBlock}>
              <View style={styles.cookIcon}>
                <Sparkle size={22} color={colors.primary} strokeWidth={1.8} />
              </View>
              <View style={styles.cookText}>
                <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{t('recipes.build.title')}</Text>
                <Text style={[typeScale.bodySmall, styles.cookSub]}>{t('recipes.build.subtitle')}</Text>
              </View>
              <Chevron size={18} color={colors.inkMuted} />
            </SoftSurface>
          </Pressable>
        )}

        {/* Settling state — wait for hydration + fridge load before deciding
            between idle/empty/recipes. Show shimmer recipe cards, not a bare
            spinner, so it reads as content loading. */}
        {!ready && recipes.length === 0 && status !== 'loading' && (
          <View style={styles.list}>
            {[0, 1].map((i) => (
              <View key={i} style={styles.skeletonCard}>
                <Shimmer width="100%" height={150} radius={0} />
                <View style={styles.skeletonBody}>
                  <Shimmer width="70%" height={18} radius={8} />
                  <Shimmer width="90%" height={12} radius={6} style={{ marginTop: 8 }} />
                </View>
              </View>
            ))}
          </View>
        )}

        {ready && fridgeEmpty && recipes.length > 0 && (
          <SoftSurface variant="cushion" radius="xxl" style={styles.emptyBannerOuter} innerStyle={styles.emptyBanner}>
            <Sparkle size={20} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.bodySmall, styles.emptyBannerText]}>
              {t('recipes.emptyBanner')}
            </Text>
          </SoftSurface>
        )}

        {status === 'loading' && recipes.length === 0 && (
          <RecipeCookingLoader itemCount={fridgeItems.length} />
        )}

        {status === 'error' && (
          <View style={styles.loadingState}>
            <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.loadingText]}>
              {error?.includes('Free plan') ? t('recipes.errors.dailyLimitTitle') : t('recipes.errors.generateFailedTitle')}
            </Text>
            <Text style={[typeScale.bodySmall, styles.loadingSub]}>{error}</Text>
            {error?.includes('Free plan') && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('recipes.a11y.upgradeToPro')}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                  router.push('/paywall?src=recipe-limit' as never);
                }}
                style={({ pressed }) => [styles.idleCta, { opacity: pressed ? 0.85 : 1 }]}
              >
                <SoftSurface variant="cushion" radius="full" innerStyle={styles.idleCtaInner}>
                  <Sparkle size={20} color={colors.amber} strokeWidth={1.8} />
                  <Text style={[typeScale.titleMedium, styles.idleCtaText]}>
                    {t('recipes.errors.unlockUnlimited')}
                  </Text>
                </SoftSurface>
              </Pressable>
            )}
          </View>
        )}

        {/* Saved recipes — persist across regeneration (G4). */}
        {ready && favorites.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={[typeScale.label, styles.savedHeader]}>{t('recipes.sections.saved')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.savedScrollOuter}
              contentContainerStyle={styles.savedScroll}
            >
              {favorites.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  accessibilityRole="button"
                  accessibilityLabel={t('recipes.a11y.openRecipe', { name: recipe.name })}
                  onPress={() => onOpen(recipe)}
                  style={styles.savedChip}
                >
                  <SoftSurface variant="cushion" radius="lg" innerStyle={styles.savedChipInner}>
                    <View style={styles.savedThumbWrap}>
                      {recipe.hero_image_url ? (
                        <Image source={{ uri: recipe.hero_image_url }} style={styles.savedThumb} />
                      ) : (
                        <View style={styles.savedThumbFallback}>
                          <Sparkle size={20} color={colors.inkMuted} strokeWidth={1.6} />
                        </View>
                      )}
                    </View>
                    <Text style={[typeScale.labelSmall, styles.savedName]} numberOfLines={2}>
                      {recipe.name}
                    </Text>
                  </SoftSurface>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.list}>
          {recipes.map((recipe, idx) => (
            <FadeIn key={recipe.id} delay={idx * 80}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('recipes.a11y.recipeCard', { name: recipe.name, count: recipe.minutes })}
              onPress={() => onOpen(recipe)}
            >
              <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
                <View style={styles.heroImageWrap}>
                  {recipe.hero_image_url ? (
                    <Image
                      source={{ uri: recipe.hero_image_url }}
                      style={styles.heroImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <SoftInset
                      radius="xxl"
                      strength="medium"
                      style={styles.heroSkeleton}
                      contentStyle={styles.heroSkeletonInner}
                    >
                      <RecipeImageLoading />
                    </SoftInset>
                  )}
                  {/* Favorite toggle — tapping the star saves the recipe so it
                      survives regeneration (nested Pressable captures the tap,
                      so it doesn't also open the recipe). */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={favIds.has(recipe.id) ? t('recipes.a11y.removeFromSaved') : t('recipes.a11y.saveRecipe')}
                    accessibilityState={{ selected: favIds.has(recipe.id) }}
                    onPress={() => onToggleFav(recipe)}
                    style={styles.starBtn}
                    hitSlop={8}
                  >
                    <Star size={20} color={favIds.has(recipe.id) ? colors.amber : colors.surfaceWhite} filled={favIds.has(recipe.id)} strokeWidth={2} />
                  </Pressable>
                  {/* L3 — remove this recipe from the batch (favorites kept). */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('recipes.a11y.removeRecipe', { name: recipe.name })}
                    onPress={() => onDeleteRecipe(recipe.id)}
                    style={styles.deleteBtn}
                    hitSlop={8}
                  >
                    <Close size={18} color={colors.surfaceWhite} strokeWidth={2.4} />
                  </Pressable>
                </View>

                <View style={styles.body}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[typeScale.titleLarge, { color: colors.ink, flex: 1 }]}
                      numberOfLines={2}
                    >
                      {recipe.name}
                    </Text>
                    <Chevron size={20} color={colors.inkMuted} />
                  </View>
                  <Text style={[typeScale.bodySmall, styles.blurb]} numberOfLines={2}>
                    {recipe.blurb}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={[typeScale.labelSmall, styles.metaTime]}>
                      {t('recipes.labels.minutesShort', { count: recipe.minutes })}
                    </Text>
                    <View
                      style={[
                        styles.difficultyPill,
                        { borderColor: DIFFICULTY_COLOR[recipe.difficulty] },
                      ]}
                    >
                      <Text
                        style={[
                          typeScale.labelTiny,
                          { color: DIFFICULTY_COLOR[recipe.difficulty], letterSpacing: 1.4 },
                        ]}
                      >
                        {recipe.difficulty.toUpperCase()}
                      </Text>
                    </View>
                    {recipe.ingredients.filter((i) => i.from_fridge).length > 0 && (
                      <View style={styles.fridgePill}>
                        <Text style={[typeScale.labelTiny, styles.fridgeText]}>
                          {t('recipes.labels.fromFridge', { count: recipe.ingredients.filter((i) => i.from_fridge).length })}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </SoftSurface>
            </Pressable>
            </FadeIn>
          ))}
        </View>
      </ScrollView>

      {/* K7 — ingredient picker before generating. */}
      {/* L7: animationType="none" → the dim backdrop appears instantly over
          the whole screen; only the sheet slides up (sheetY). */}
      <Modal visible={selectorOpen} transparent animationType="none" onRequestClose={() => closeSheet()}>
        <GestureHandlerRootView style={styles.sheetBackdropView}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => closeSheet()} accessibilityLabel={t('recipes.a11y.close')} />
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }, sheetAnimStyle]}>
            <GestureDetector gesture={sheetPan}>
              <View style={styles.sheetHandleZone}>
                <View style={styles.sheetHandle} />
              </View>
            </GestureDetector>
            <Text style={[typeScale.titleLarge, styles.sheetTitle]}>{t('recipes.sheet.title')}</Text>
            <Text style={[typeScale.bodySmall, styles.sheetSub]}>
              {t('recipes.sheet.subtitle')}
            </Text>
            <ScrollView style={styles.sheetList} contentContainerStyle={styles.sheetListContent} showsVerticalScrollIndicator={false}>
              {fridgeItems.map((item) => {
                const on = selectedIds.has(item.id);
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={item.name}
                    onPress={() => toggleItem(item.id)}
                    style={({ pressed }) => [styles.sheetRow, { opacity: pressed ? 0.7 : 1 }]}
                  >
                    <View style={[styles.checkbox, on && styles.checkboxOn]}>
                      {on ? <Check size={14} color={colors.surfaceWhite} strokeWidth={3} /> : null}
                    </View>
                    <Text style={[typeScale.titleSmall, styles.sheetItemName]} numberOfLines={1}>{item.name}</Text>
                    <Text style={[typeScale.labelSmall, styles.sheetItemDays]}>
                      {item.daysLeft <= 0 ? t('recipes.labels.today') : t('recipes.labels.daysShort', { count: item.daysLeft })}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {/* L6: our standard pill CTA, not a flat green button. */}
            <View style={[styles.sheetCtaWrap, { opacity: selectedIds.size === 0 ? 0.4 : 1 }]}>
              <PrimaryPillCTA
                label={t('recipes.cta.generateFromItems', { count: selectedIds.size })}
                onPress={confirmGenerate}
                iconLeft={<Sparkle size={20} color={colors.amber} strokeWidth={2} />}
              />
            </View>
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
  },
  headerSpacer: { width: 48, height: 48 },
  eyebrow: { color: colors.inkSecondary },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.lg },
  hero: { paddingHorizontal: 8, marginBottom: spacing.huge },
  eyebrow2: {
    color: colors.inkSecondary,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: spacing.huge * 2,
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  loadingText: { color: colors.ink, textAlign: 'center' },
  loadingSub: { color: colors.inkSecondary, textAlign: 'center' },
  emptyBannerOuter: { marginHorizontal: 8, marginBottom: spacing.lg },
  emptyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  emptyBannerText: { color: colors.inkSecondary, flex: 1, lineHeight: 18 },
  idleState: {
    alignItems: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  idleIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  idleTitle: { color: colors.ink, textAlign: 'center' },
  idleSub: { color: colors.inkSecondary, textAlign: 'center', lineHeight: 20 },
  idleCta: { marginTop: spacing.lg, alignSelf: 'stretch' },
  idleCtaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  idleCtaText: { color: colors.ink },
  cookBlockWrap: { marginHorizontal: 8, marginBottom: spacing.xl },
  cookBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cookIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookText: { flex: 1, gap: 2 },
  cookSub: { color: colors.inkSecondary },
  savedSection: { marginBottom: spacing.xl },
  savedHeader: {
    color: colors.amber,
    textTransform: 'uppercase',
    marginLeft: 8,
    marginBottom: spacing.sm,
  },
  savedScrollOuter: { marginHorizontal: -layout.screenPadding },
  savedScroll: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: shadowReach.cushion,
    gap: shadowReach.cushion,
  },
  savedChip: { width: 128 },
  savedChipInner: { padding: 0, overflow: 'hidden' },
  savedThumbWrap: { width: '100%', aspectRatio: 16 / 10, backgroundColor: colors.surfaceTint },
  savedThumb: { width: '100%', height: '100%' },
  savedThumbFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  savedName: { color: colors.ink, padding: spacing.sm },
  starBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: spacing.xxl },
  skeletonCard: {
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: colors.surfaceWhite,
  },
  skeletonBody: { padding: spacing.lg },
  card: { padding: 0, overflow: 'hidden' },
  heroImageWrap: { width: '100%', aspectRatio: 16 / 10 },
  heroImage: { width: '100%', height: '100%' },
  heroSkeleton: { width: '100%', height: '100%' },
  heroSkeletonInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { gap: 6, padding: spacing.lg },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  blurb: { color: colors.inkSecondary, lineHeight: 18 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaTime: { color: colors.amber, letterSpacing: 1.4 },
  difficultyPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1.2,
    backgroundColor: 'transparent',
  },
  fridgePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  fridgeText: { color: colors.surfaceWhite, letterSpacing: 1.4 },
  // K7 ingredient-picker sheet
  sheetBackdropView: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.sm,
    paddingHorizontal: layout.screenPadding,
    maxHeight: '80%',
  },
  sheetHandleZone: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inkMuted,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: { color: colors.ink, textAlign: 'center' },
  sheetSub: { color: colors.inkSecondary, textAlign: 'center', marginTop: 4, marginBottom: spacing.md, lineHeight: 18 },
  sheetList: { flexGrow: 0 },
  sheetListContent: { paddingVertical: spacing.xs },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.inkMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  sheetItemName: { flex: 1, color: colors.ink },
  sheetItemDays: { color: colors.inkSecondary },
  sheetCtaWrap: { marginTop: spacing.lg },
});
