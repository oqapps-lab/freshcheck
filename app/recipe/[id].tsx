import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import {
  Back,
  Sparkle,
  Nutrition,
  Cloud,
  Check,
  Star,
  Knife,
  Flame,
  Whisk,
  Hourglass,
  Bowl,
} from '@/components/ui/Glyphs';
import { getRecipe } from '@/src/state/recipeStore';
import { useFavorites, getFavorite, toggleFavorite } from '@/src/state/favoritesStore';
import { useRecipes, type RecipeStepIcon } from '@/src/hooks/useRecipes';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { LinearGradient } from 'expo-linear-gradient';

const STEP_ICON: Record<RecipeStepIcon, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  prep: Knife,
  cook: Flame,
  mix: Whisk,
  wait: Hourglass,
  serve: Bowl,
};

const STEP_LABEL: Record<RecipeStepIcon, string> = {
  prep: 'PREP',
  cook: 'COOK',
  mix: 'MIX',
  wait: 'WAIT',
  serve: 'SERVE',
};

// See recipes.tsx for rationale — keep aligned with the list-screen palette
// so a recipe doesn't change difficulty colour when the user drills in.
const DIFFICULTY_COLOR = {
  easy: colors.primary,
  medium: colors.amber,
  hard: colors.amberDeep,
} as const;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cached = id ? getRecipe(String(id)) : undefined;
  // Fallback chain: current batch cache → generated list → favorites store
  // (so a saved recipe opens even after the batch was regenerated/killed).
  const { recipes, status } = useRecipes();
  const favorites = useFavorites();
  const recipe =
    cached ??
    (id ? recipes.find((r) => r.id === String(id)) : undefined) ??
    (id ? getFavorite(String(id)) : undefined);
  const isFav = !!recipe && favorites.some((r) => r.id === recipe.id);

  if (!recipe) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <IconButton accessibilityLabel="back" onPress={() => router.back()}>
            <Back size={20} color={colors.ink} />
          </IconButton>
          <View style={styles.headerSpacer} />
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyCenter}>
          <Sparkle size={48} color={colors.amber} strokeWidth={1.6} />
          <Text style={[typeScale.titleMedium, styles.emptyText]}>
            {status === 'loading' ? 'Loading recipe…' : 'Recipe not found'}
          </Text>
          <Text style={[typeScale.bodySmall, styles.emptySub]}>
            {status === 'loading'
              ? 'Generating fresh recipes for you'
              : 'Head back and pick another recipe.'}
          </Text>
        </View>
      </View>
    );
  }

  const fridgeCount = recipe.ingredients.filter((i) => i.from_fridge).length;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.heroWrap}>
          {recipe.hero_image_url ? (
            <Image
              source={{ uri: recipe.hero_image_url }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.heroSkeleton}>
              <Cloud size={48} color={colors.inkMuted} strokeWidth={1.4} />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.28)', 'rgba(0,0,0,0)']}
            style={styles.headerScrim}
            pointerEvents="none"
          />
        </View>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={[typeScale.displayLarge, { color: colors.ink }]}>
            {recipe.name}
          </Text>
          <Text style={[typeScale.body, styles.blurb]}>{recipe.blurb}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={[typeScale.labelSmall, styles.metaLabel]}>TIME</Text>
              <Text style={[typeScale.titleMedium, styles.metaValue]}>
                {recipe.minutes}min
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[typeScale.labelSmall, styles.metaLabel]}>DIFFICULTY</Text>
              <Text
                style={[
                  typeScale.titleMedium,
                  { color: DIFFICULTY_COLOR[recipe.difficulty] },
                ]}
              >
                {recipe.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={[typeScale.labelSmall, styles.metaLabel]}>FROM FRIDGE</Text>
              <Text style={[typeScale.titleMedium, styles.metaValue]}>
                {fridgeCount}/{recipe.ingredients.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={[typeScale.label, styles.sectionLabel]}>INGREDIENTS</Text>
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
            {recipe.ingredients.map((ing, idx) => (
              <View
                key={`${ing.name}-${idx}`}
                style={[
                  styles.ingRow,
                  idx < recipe.ingredients.length - 1 && styles.ingRowBorder,
                ]}
              >
                <View
                  style={[
                    styles.checkBubble,
                    ing.from_fridge && styles.checkBubbleActive,
                  ]}
                >
                  {ing.from_fridge && (
                    <Check size={12} color={colors.surfaceWhite} strokeWidth={2.6} />
                  )}
                </View>
                <View style={styles.ingBody}>
                  <Text style={[typeScale.body, styles.ingName]} numberOfLines={1}>
                    {ing.name}
                  </Text>
                  <Text style={[typeScale.bodySmall, styles.ingAmount]}>
                    {ing.amount}
                  </Text>
                </View>
                {ing.from_fridge && (
                  <View style={styles.haveBadge}>
                    <Text style={[typeScale.labelTiny, styles.haveText]}>HAVE</Text>
                  </View>
                )}
              </View>
            ))}
          </SoftSurface>
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <Text style={[typeScale.label, styles.sectionLabel]}>STEPS</Text>
          <View style={styles.stepsList}>
            {recipe.steps.map((step) => {
              const Icon = STEP_ICON[step.icon] ?? Nutrition;
              return (
                <SoftSurface
                  key={step.order}
                  variant="cushion"
                  radius="xxl"
                  innerStyle={styles.stepCard}
                >
                  <View style={styles.stepRow}>
                    <SoftInset
                      radius="lg"
                      strength="medium"
                      style={styles.stepIcon}
                      contentStyle={styles.stepIconInner}
                    >
                      <Icon size={22} color={colors.primary} strokeWidth={1.8} />
                    </SoftInset>
                    <View style={styles.stepBody}>
                      <View style={styles.stepHeader}>
                        <Text style={[typeScale.labelSmall, styles.stepLabel]}>
                          STEP {step.order} · {STEP_LABEL[step.icon] ?? step.icon.toUpperCase()}
                        </Text>
                        <Text style={[typeScale.labelSmall, styles.stepTime]}>
                          {step.minutes} MIN
                        </Text>
                      </View>
                      <Text style={[typeScale.body, styles.stepText]}>
                        {step.text}
                      </Text>
                    </View>
                  </View>
                </SoftSurface>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Fixed header — stays pinned over the scroll so back + save don't
          slide away when the user scrolls down (K5). Icon buttons are
          neumorphic circles, legible over both the photo and white content. */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top + 16 }]} pointerEvents="box-none">
        <IconButton accessibilityLabel="back" onPress={() => router.back()}>
          <Back size={20} color={colors.ink} />
        </IconButton>
        <IconButton
          accessibilityLabel={isFav ? 'remove from saved' : 'save recipe'}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            toggleFavorite(recipe);
          }}
        >
          <Star size={20} color={isFav ? colors.amber : colors.ink} filled={isFav} strokeWidth={2} />
        </IconButton>
      </View>
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
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: spacing.sm,
  },
  headerScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  headerSpacer: { width: 48, height: 48 },
  emptyCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyText: { color: colors.ink },
  emptySub: { color: colors.inkSecondary, textAlign: 'center' },
  scroll: { paddingBottom: spacing.huge },
  heroWrap: {
    width: '100%',
    aspectRatio: 16 / 12,
    maxHeight: 360,
    backgroundColor: colors.canvas,
  },
  heroImage: { width: '100%', height: '100%' },
  heroSkeleton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.huge,
    gap: spacing.sm,
  },
  blurb: { color: colors.inkSecondary, marginTop: 4 },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  metaItem: { gap: 2 },
  metaLabel: { color: colors.inkSecondary, letterSpacing: 1.2 },
  metaValue: { color: colors.ink },
  section: {
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.huge,
  },
  sectionLabel: {
    color: colors.inkSecondary,
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  card: { padding: spacing.lg },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  ingRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: colors.inkMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBubbleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  ingBody: { flex: 1, gap: 2 },
  ingName: { color: colors.ink },
  ingAmount: { color: colors.inkSecondary },
  haveBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  haveText: { color: colors.primary, letterSpacing: 1.4 },
  stepsList: { gap: spacing.md },
  stepCard: { padding: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg },
  stepIcon: { width: 44, height: 44 },
  stepIconInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stepBody: { flex: 1, gap: 6 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  stepLabel: { color: colors.inkSecondary, letterSpacing: 1.4 },
  stepTime: { color: colors.amber, letterSpacing: 1.4 },
  stepText: { color: colors.ink, lineHeight: 22 },
});
