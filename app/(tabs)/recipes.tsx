import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { RecipeCookingLoader } from '@/components/ui/RecipeCookingLoader';
import { Shimmer } from '@/components/ui/Shimmer';
import { Chevron, Sparkle, Star, Trash } from '@/components/ui/Glyphs';
import { useRecipes, type Recipe } from '@/src/hooks/useRecipes';
import { useFridge } from '@/src/hooks/useFridge';
import { clearRecipes } from '@/src/state/recipeStore';
import {
  useFavorites,
  toggleFavorite,
  hydrateFavorites,
} from '@/src/state/favoritesStore';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

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

  const onClear = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(
      'Clear these recipes?',
      'Removes the current picks. Saved (★) recipes are kept. You can generate fresh ones anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearRecipes() },
      ],
    );
  };

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // Confirm if we already have a batch — each regeneration calls the
    // gpt-5.5 + gpt-image-1 pipeline (~$0.13). Cheap to skip, expensive
    // to thrash.
    if (recipes.length > 0) {
      Alert.alert(
        'Generate fresh recipes?',
        'This replaces your current picks with brand-new ones based on your fridge right now.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Generate', onPress: () => refresh() },
        ],
      );
      return;
    }
    refresh();
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        {recipes.length > 0 && status !== 'loading' ? (
          <IconButton accessibilityLabel="clear recipes" onPress={onClear}>
            <Trash size={20} color={colors.inkSecondary} strokeWidth={2} />
          </IconButton>
        ) : (
          <View style={styles.headerSpacer} />
        )}
        <Text style={[typeScale.wordmark, styles.eyebrow]}>RECIPES</Text>
        <IconButton
          accessibilityLabel="regenerate recipes"
          onPress={status === 'loading' ? () => {} : onRefresh}
        >
          <Sparkle size={20} color={status === 'loading' ? colors.inkMuted : colors.amber} strokeWidth={1.8} />
        </IconButton>
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
                {fridgeEmpty ? 'Starter recipes' : 'Cook with what you have'}
              </Text>
              <Text style={[typeScale.label, styles.eyebrow2]}>
                {fridgeEmpty ? 'SCAN ITEMS FOR PERSONALIZED PICKS' : 'AI-CRAFTED FROM YOUR FRIDGE'}
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
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.emptyBanner}>
            <Sparkle size={20} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.bodySmall, styles.emptyBannerText]}>
              Your fridge is empty — these are generic starter ideas. Scan a few items first for recipes built around what you actually have.
            </Text>
          </SoftSurface>
        )}

        {ready && status === 'idle' && recipes.length === 0 && (
          <View style={styles.idleState}>
            <SoftSurface variant="cushion" radius="full" innerStyle={styles.idleIcon}>
              <Sparkle size={56} color={colors.amber} strokeWidth={1.6} />
            </SoftSurface>
            <Text style={[typeScale.titleLarge, styles.idleTitle]}>
              {fridgeEmpty ? 'Try AI starter recipes' : 'Pick a recipe in 10 seconds'}
            </Text>
            <Text style={[typeScale.bodySmall, styles.idleSub]}>
              {fridgeEmpty
                ? 'No fridge items yet — get 3 simple ideas you can shop for.'
                : `We'll dream up 3 recipes from the ${fridgeItems.length} items in your fridge, prioritizing what expires soon.`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Generate recipes"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                refresh();
              }}
              style={({ pressed }) => [styles.idleCta, { opacity: pressed ? 0.85 : 1 }]}
            >
              <SoftSurface variant="cushion" radius="full" innerStyle={styles.idleCtaInner}>
                <Sparkle size={20} color={colors.amber} strokeWidth={1.8} />
                <Text style={[typeScale.titleMedium, styles.idleCtaText]}>
                  Generate recipes
                </Text>
              </SoftSurface>
            </Pressable>
          </View>
        )}

        {status === 'loading' && recipes.length === 0 && (
          <RecipeCookingLoader itemCount={fridgeItems.length} />
        )}

        {status === 'error' && (
          <View style={styles.loadingState}>
            <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.loadingText]}>
              {error?.includes('Free plan') ? 'Daily limit reached' : "Couldn't generate recipes"}
            </Text>
            <Text style={[typeScale.bodySmall, styles.loadingSub]}>{error}</Text>
            {error?.includes('Free plan') && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Upgrade to FreshCheck Pro"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                  router.push('/paywall' as never);
                }}
                style={({ pressed }) => [styles.idleCta, { opacity: pressed ? 0.85 : 1 }]}
              >
                <SoftSurface variant="cushion" radius="full" innerStyle={styles.idleCtaInner}>
                  <Sparkle size={20} color={colors.amber} strokeWidth={1.8} />
                  <Text style={[typeScale.titleMedium, styles.idleCtaText]}>
                    Unlock unlimited recipes
                  </Text>
                </SoftSurface>
              </Pressable>
            )}
          </View>
        )}

        {/* Saved recipes — persist across regeneration (G4). */}
        {ready && favorites.length > 0 && (
          <View style={styles.savedSection}>
            <Text style={[typeScale.label, styles.savedHeader]}>★ SAVED</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.savedScroll}
            >
              {favorites.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  accessibilityRole="button"
                  accessibilityLabel={`open ${recipe.name}`}
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
          {recipes.map((recipe) => (
            <Pressable
              key={recipe.id}
              accessibilityRole="button"
              accessibilityLabel={`${recipe.name}, ${recipe.minutes} minutes`}
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
                      <ActivityIndicator size="small" color={colors.inkMuted} />
                    </SoftInset>
                  )}
                  {/* Favorite toggle — tapping the star saves the recipe so it
                      survives regeneration (nested Pressable captures the tap,
                      so it doesn't also open the recipe). */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={favIds.has(recipe.id) ? 'remove from saved' : 'save recipe'}
                    accessibilityState={{ selected: favIds.has(recipe.id) }}
                    onPress={() => onToggleFav(recipe)}
                    style={styles.starBtn}
                    hitSlop={8}
                  >
                    <Star size={20} color={favIds.has(recipe.id) ? colors.amber : colors.surfaceWhite} filled={favIds.has(recipe.id)} strokeWidth={2} />
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
                      {recipe.minutes} MIN
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
                          {recipe.ingredients.filter((i) => i.from_fridge).length} FROM FRIDGE
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </SoftSurface>
            </Pressable>
          ))}
        </View>
      </ScrollView>
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
  emptyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    marginHorizontal: 8,
    marginBottom: spacing.lg,
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
  savedSection: { marginBottom: spacing.xl },
  savedHeader: {
    color: colors.amber,
    textTransform: 'uppercase',
    marginLeft: 8,
    marginBottom: spacing.sm,
  },
  savedScroll: { paddingHorizontal: 8, paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.md },
  savedChip: { width: 128, marginRight: spacing.md },
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
  list: { gap: spacing.xxl, paddingHorizontal: 8 },
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
});
