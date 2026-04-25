import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Back, Heart, ChefHat, Clock } from '@/components/ui/Glyphs';
import { CategoryGlyph, categoryFor } from '@/components/ui/CategoryGlyph';
import {
  colors,
  spacing,
  typeScale,
  radii,
  layout,
  motion,
} from '@/constants/tokens';
import { recipes, garlicHerbChicken } from '@/mock/recipes';

/** "garlic herb chicken" → "Garlic Herb Chicken" */
const titleCase = (s: string): string =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');

/**
 * Recipe Detail v4 — Stitch "Paper & Pith".
 *
 * Layout:
 *   1. Top bar     → 40-circle Back / Heart neumorphic buttons.
 *   2. Hero disc   → 240×240 NeumorphicCard with placeholder photo or
 *                    category glyph on primaryFixed face.
 *   3. Title block → eyebrow RECIPE, Title-Cased headline, meta row,
 *                    optional "uses N expiring" pill.
 *   4. Sections    → FROM YOUR FRIDGE (card with rows + dividers),
 *                    YOU'LL ALSO NEED (bullet list), THE METHOD
 *                    (numbered sage step-circles).
 *   5. Floating    → save / Start Cooking PillCTAs at the bottom.
 *
 * Ref: docs/06-design/DESIGN-V4.md + stitch-v2/result-1 card style.
 */
export default function RecipeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const recipe = recipes.find((r) => r.id === id) ?? garlicHerbChicken;
  const [saved, setSaved] = useState(false);

  const toggleSave = () => {
    Haptics.selectionAsync().catch(() => {});
    setSaved((s) => !s);
  };

  const startCooking = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    // TODO wire step-by-step mode when cooking UI lands
  };

  const fridgeIngredients = recipe.ingredients.filter((i) => i.fromFridge);
  const pantryIngredients = recipe.ingredients.filter((i) => !i.fromFridge);

  return (
    <AtmosphericBackground>
      {/* Top bar */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <NeumorphicCard
          variant="raised"
          radius="full"
          padding={0}
          style={styles.iconBtnCard}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtnHit}
            accessibilityRole="button"
            accessibilityLabel="back"
          >
            <Back size={18} color={colors.ink} />
          </Pressable>
        </NeumorphicCard>

        <NeumorphicCard
          variant="raised"
          radius="full"
          padding={0}
          style={
            saved
              ? { ...styles.iconBtnCard, backgroundColor: colors.accent }
              : styles.iconBtnCard
          }
        >
          <Pressable
            onPress={toggleSave}
            style={
              saved
                ? { ...styles.iconBtnHit, backgroundColor: colors.accent }
                : styles.iconBtnHit
            }
            accessibilityRole="button"
            accessibilityLabel={saved ? 'unsave recipe' : 'save recipe'}
            accessibilityState={{ selected: saved }}
          >
            <Heart
              size={18}
              color={saved ? colors.white : colors.primary}
            />
          </Pressable>
        </NeumorphicCard>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 76,
          paddingBottom: insets.bottom + 200,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero disc */}
        <Animated.View
          entering={FadeIn.duration(motion.slow)}
          style={styles.heroWrap}
        >
          <NeumorphicCard
            variant="raised"
            radius="md"
            padding={0}
            style={styles.heroCard}
          >
            <View style={styles.heroFace}>
              {recipe.heroPhoto ? (
                <Image
                  source={{ uri: recipe.heroPhoto }}
                  style={styles.heroPhoto}
                  resizeMode="cover"
                  accessibilityLabel={`${recipe.title} photo`}
                />
              ) : (
                <CategoryGlyph
                  category={categoryFor(recipe.title)}
                  size={80}
                  color={colors.primary}
                />
              )}
            </View>
          </NeumorphicCard>
        </Animated.View>

        {/* Title block */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(120)}
          style={styles.titleBlock}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>RECIPE</Text>
          <Text
            style={[typeScale.displayM, styles.heroTitle]}
            accessibilityRole="header"
          >
            {titleCase(recipe.title)}
          </Text>
          <View style={styles.metaRow}>
            <Clock size={14} color={colors.outline} />
            <Text style={[typeScale.bodySmall, styles.metaText]}>
              {recipe.timeMinutes} min · serves {recipe.servings}
            </Text>
          </View>
          {recipe.expiringCount > 0 && (
            <View style={styles.expiringWrap}>
              <View style={styles.expiringPill}>
                <Text style={[typeScale.label, styles.expiringText]}>
                  uses {recipe.expiringCount} expiring
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Empty-state for recipes without data yet */}
        {recipe.ingredients.length === 0 && recipe.steps.length === 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(220)}
            style={styles.section}
          >
            <NeumorphicCard variant="raised" radius="md" padding={24}>
              <Text style={[typeScale.titleM, styles.emptyTitle]}>
                full recipe coming soon
              </Text>
              <Text style={[typeScale.body, styles.emptyBody]}>
                we're still writing up the ingredients and steps — check back
                shortly.
              </Text>
            </NeumorphicCard>
          </Animated.View>
        )}

        {/* From your fridge */}
        {fridgeIngredients.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(220)}
            style={styles.section}
          >
            <Text style={[typeScale.labelSmall, styles.sectionEyebrow]}>
              FROM YOUR FRIDGE
            </Text>
            <NeumorphicCard variant="raised" radius="md" padding={0}>
              {fridgeIngredients.map((ing, i, arr) => (
                <View
                  key={ing.id}
                  style={[
                    styles.ingredientRow,
                    i < arr.length - 1 && styles.ingredientDivider,
                  ]}
                >
                  <View style={styles.ingredientThumb}>
                    <CategoryGlyph
                      category={categoryFor(ing.name)}
                      size={24}
                      color={colors.primary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <View style={styles.ingredientText}>
                    <Text style={[typeScale.titleS, styles.ingredientName]}>
                      {ing.name.toLowerCase()}
                    </Text>
                    {ing.quantity ? (
                      <Text
                        style={[
                          typeScale.bodySmall,
                          styles.ingredientQuantity,
                        ]}
                      >
                        {ing.quantity}
                      </Text>
                    ) : null}
                  </View>
                  <VerdictPill
                    verdict={ing.tone}
                    label={ing.status.toLowerCase()}
                    small
                  />
                </View>
              ))}
            </NeumorphicCard>
          </Animated.View>
        )}

        {/* You'll also need */}
        {pantryIngredients.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(280)}
            style={styles.section}
          >
            <Text style={[typeScale.labelSmall, styles.sectionEyebrow]}>
              YOU'LL ALSO NEED
            </Text>
            <View style={styles.needList}>
              {pantryIngredients.map((i) => (
                <Text
                  key={i.id}
                  style={[typeScale.body, styles.needLine]}
                >
                  · {i.name.toLowerCase()}
                  {i.quantity ? ` — ${i.quantity}` : ''}
                </Text>
              ))}
            </View>
          </Animated.View>
        )}

        {/* The method */}
        {recipe.steps.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(340)}
            style={styles.section}
          >
            <Text style={[typeScale.labelSmall, styles.sectionEyebrow]}>
              THE METHOD
            </Text>
            {recipe.steps.map((step, i) => (
              <View
                key={step.number}
                style={[
                  styles.step,
                  i === recipe.steps.length - 1 && { marginBottom: 0 },
                ]}
              >
                <View style={styles.stepNumber}>
                  <Text style={[typeScale.label, styles.stepNumberText]}>
                    {step.number}
                  </Text>
                </View>
                <Text style={[typeScale.body, styles.stepBody]}>
                  {step.body.toLowerCase()}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* Floating CTA row */}
      <View style={[styles.floatingRow, { bottom: insets.bottom + 24 }]}>
        <PillCTA
          label={saved ? 'saved' : 'save'}
          variant="secondary"
          icon={
            <Heart
              size={16}
              color={saved ? colors.accent : colors.primary}
            />
          }
          compact
          onPress={toggleSave}
          style={styles.saveCta}
          accessibilityLabel={saved ? 'unsave recipe' : 'save recipe'}
        />
        <PillCTA
          label="Start Cooking"
          variant="primary"
          icon={<ChefHat size={18} color={colors.onAccent} />}
          onPress={startCooking}
          style={styles.startCta}
          accessibilityLabel="start cooking"
        />
      </View>
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
  iconBtnCard: {
    width: 40,
    height: 40,
  },
  iconBtnHit: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  heroWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  heroCard: {
    width: 240,
    height: 240,
  },
  heroFace: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  metaText: {
    color: colors.outline,
    marginLeft: 6,
  },
  expiringWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  expiringPill: {
    backgroundColor: colors.amberContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  expiringText: {
    color: colors.onAmberContainer,
    textTransform: 'none',
    letterSpacing: 0.2,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  ingredientDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  ingredientThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  ingredientName: {
    color: colors.ink,
  },
  ingredientQuantity: {
    color: colors.outline,
    marginTop: 2,
  },
  needList: {
    paddingHorizontal: 6,
  },
  needLine: {
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.white,
  },
  stepBody: {
    flex: 1,
    color: colors.onSurfaceVariant,
  },
  floatingRow: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  saveCta: {
    flex: 1,
  },
  startCta: {
    flex: 2,
  },
});
