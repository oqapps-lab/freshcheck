import React from 'react';
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
import { Back, Chevron, Sparkle } from '@/components/ui/Glyphs';
import { useRecipes, type Recipe } from '@/src/hooks/useRecipes';
import { useFridge } from '@/src/hooks/useFridge';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const DIFFICULTY_COLOR: Record<Recipe['difficulty'], string> = {
  easy: colors.primary,
  medium: colors.amber,
  hard: colors.red,
};

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { status, error, recipes, refresh } = useRecipes();
  const { items: fridgeItems } = useFridge();
  const fridgeEmpty = fridgeItems.length === 0;

  const onOpen = (recipe: Recipe) => {
    Haptics.selectionAsync().catch(() => {});
    router.push(`/recipe/${recipe.id}` as never);
  };

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // Confirm if we already have a batch — each regeneration calls the
    // gpt-5.5 + gpt-image-1 pipeline (~$0.13). Cheap to skip, expensive
    // to thrash.
    if (recipes.length > 0) {
      Alert.alert(
        'Generate fresh recipes?',
        'This replaces your current 3 picks with brand-new ones based on your fridge right now.',
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
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
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
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={[typeScale.displayLarge, { color: colors.ink }]}>
            {fridgeEmpty ? 'Starter recipes' : 'Cook with what you have'}
          </Text>
          <Text style={[typeScale.label, styles.eyebrow2]}>
            {fridgeEmpty
              ? 'SCAN ITEMS FOR PERSONALIZED PICKS'
              : 'AI-CRAFTED FROM YOUR FRIDGE'}
          </Text>
        </View>

        {fridgeEmpty && recipes.length > 0 && (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.emptyBanner}>
            <Sparkle size={20} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.bodySmall, styles.emptyBannerText]}>
              Your fridge is empty — these are generic starter ideas. Scan a few items first for recipes built around what you actually have.
            </Text>
          </SoftSurface>
        )}

        {status === 'loading' && recipes.length === 0 && (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[typeScale.body, styles.loadingText]}>
              Reading your fridge and dreaming up recipes…
            </Text>
            <Text style={[typeScale.bodySmall, styles.loadingSub]}>
              Recipes appear in ~10 seconds. Photos load right after.
            </Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.loadingState}>
            <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
            <Text style={[typeScale.titleMedium, styles.loadingText]}>
              Couldn't generate recipes
            </Text>
            <Text style={[typeScale.bodySmall, styles.loadingSub]}>{error}</Text>
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
  list: { gap: spacing.xl, paddingHorizontal: 8 },
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
