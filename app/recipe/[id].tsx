import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, Heart, ChefHat, Clock } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout, toneColor } from '@/constants/tokens';
import { recipes, garlicHerbChicken } from '@/mock/recipes';

/**
 * Recipe Detail — /recipe/[id]
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.4
 */
export default function RecipeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const recipe = recipes.find((r) => r.id === id) ?? garlicHerbChicken;

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Back size={22} color={colors.ink} />
        </Pressable>
        <Pressable style={styles.circleBtn} accessibilityRole="button" accessibilityLabel="Save">
          <Heart size={22} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo */}
        <View style={[styles.heroPhoto, { backgroundColor: toneColor[recipe.tone].fill }]}>
          <Text style={styles.emoji}>{recipe.placeholder}</Text>
        </View>

        <View style={{ paddingHorizontal: layout.screenPadding }}>
          <Text style={[typeScale.titleXL, { color: colors.ink, marginTop: spacing.lg }]}>
            {recipe.title}
          </Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Clock size={14} color={colors.sageInk} />
              <Text style={[typeScale.bodySmall, { color: colors.sageInk, marginLeft: 5 }]}>
                {recipe.timeMinutes} min
              </Text>
            </View>
            <View style={styles.metaDot} />
            <Text style={[typeScale.bodySmall, { color: colors.inkMuted }]}>
              Serves {recipe.servings}
            </Text>
            <View style={styles.metaDot} />
            <Text style={[typeScale.bodySmall, { color: colors.coralInk }]}>
              Uses {recipe.expiringCount} expiring
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.tagRow}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={[typeScale.caption, { color: colors.sageInk }]}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Ingredients from fridge */}
          {recipe.ingredients.length > 0 && (
            <>
              <View style={styles.sectionHead}>
                <Text style={[typeScale.titleM, { color: colors.ink }]}>Ingredients</Text>
                <Eyebrow>From your fridge</Eyebrow>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ingredientScroll}
              >
                {recipe.ingredients
                  .filter((i) => i.fromFridge)
                  .map((ingredient) => (
                    <GlassCard
                      key={ingredient.id}
                      variant="default"
                      style={styles.ingredientCard}
                      padding={14}
                    >
                      <View
                        style={[
                          styles.ingredientThumb,
                          { backgroundColor: toneColor[ingredient.tone].fill },
                        ]}
                      >
                        <Text style={{ fontSize: 34 }}>{ingredient.placeholder}</Text>
                      </View>
                      <Text style={[typeScale.titleS, { color: colors.ink, marginTop: 10 }]}>
                        {ingredient.name}
                      </Text>
                      <VerdictPill
                        verdict={ingredient.tone}
                        label={ingredient.status}
                        small
                        style={{ marginTop: 6 }}
                      />
                    </GlassCard>
                  ))}
              </ScrollView>

              {/* You need this — list */}
              <View style={styles.needRow}>
                <Eyebrow style={{ marginBottom: 8 }}>You'll also need</Eyebrow>
                {recipe.ingredients
                  .filter((i) => !i.fromFridge)
                  .map((i) => (
                    <Text key={i.id} style={[typeScale.body, { color: colors.inkMuted, marginBottom: 4 }]}>
                      · {i.name} {i.quantity ? `— ${i.quantity}` : ''}
                    </Text>
                  ))}
              </View>

              {/* Steps */}
              <Text style={[typeScale.titleM, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md }]}>
                Steps
              </Text>
              {recipe.steps.map((step) => (
                <View key={step.number} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={[typeScale.titleS, { color: colors.white }]}>{step.number}</Text>
                  </View>
                  <Text style={[typeScale.body, styles.stepBody]}>{step.body}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTAs */}
      <View style={[styles.floatingRow, { bottom: insets.bottom + 16 }]}>
        <PillCTA
          label="Save"
          icon={<Heart size={20} color={colors.sageInk} />}
          variant="glass"
          style={{ flex: 1 }}
        />
        <PillCTA
          label="Start cooking"
          icon={<ChefHat size={20} color={colors.white} />}
          variant="primary"
          style={{ flex: 1.6 }}
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
    paddingBottom: 12,
    zIndex: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  heroPhoto: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 120,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageMist,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.inkDim,
    marginHorizontal: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.mint,
    borderRadius: radii.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sectionHead: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    gap: 4,
  },
  ingredientScroll: {
    gap: spacing.sm,
    paddingRight: layout.screenPadding,
  },
  ingredientCard: {
    width: 140,
  },
  ingredientThumb: {
    height: 72,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needRow: {
    marginTop: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.sageInk,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBody: {
    flex: 1,
    color: colors.inkMuted,
  },
  floatingRow: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
