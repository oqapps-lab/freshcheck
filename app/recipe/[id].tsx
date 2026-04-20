import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, Heart, ChefHat, Clock } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, radii, layout, motion } from '@/constants/tokens';
import { recipes, garlicHerbChicken } from '@/mock/recipes';

export default function RecipeDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const recipe = recipes.find((r) => r.id === id) ?? garlicHerbChicken;

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="back"
        >
          <Back size={20} color={colors.primary} />
        </Pressable>
        <Pressable style={styles.circleBtn} accessibilityRole="button" accessibilityLabel="save">
          <Heart size={18} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 72,
          paddingBottom: insets.bottom + 140,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero disc */}
        <Animated.View entering={FadeIn.duration(motion.slow)} style={styles.heroWrap}>
          <View style={styles.heroDisc}>
            <ChefHat size={80} color={colors.primary} strokeWidth={1.1} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(120)}>
          <Text
            style={[
              typeScale.displayM,
              { color: colors.onSurface, textAlign: 'center', marginTop: spacing.lg },
            ]}
          >
            {recipe.title.toLowerCase()}
          </Text>
          <View style={styles.metaRow}>
            <Clock size={14} color={colors.secondary} />
            <Text style={[typeScale.bodySmall, { color: colors.secondary, marginLeft: 6 }]}>
              {recipe.timeMinutes} min · serves {recipe.servings}
            </Text>
          </View>
          {recipe.expiringCount > 0 && (
            <View style={styles.verdictCenter}>
              <VerdictPill
                verdict={recipe.tone}
                label={`uses ${recipe.expiringCount} expiring`}
                small
              />
            </View>
          )}
        </Animated.View>

        {/* Ingredients */}
        {recipe.ingredients.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(220)}
            style={styles.section}
          >
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              from your fridge
            </Eyebrow>
            <GlassCard variant="glass" radius="xl" padding={0}>
              {recipe.ingredients
                .filter((i) => i.fromFridge)
                .map((ing, i, arr) => (
                  <View
                    key={ing.id}
                    style={[
                      styles.ingredientRow,
                      i < arr.length - 1 && styles.ingredientDivider,
                    ]}
                  >
                    <View style={styles.ingredientThumb}>
                      <Text style={[typeScale.titleM, { color: colors.primary }]}>
                        {ing.name.charAt(0).toLowerCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={[typeScale.titleS, { color: colors.onSurface }]}>
                        {ing.name.toLowerCase()}
                      </Text>
                      <Text
                        style={[
                          typeScale.bodySmall,
                          { color: colors.secondary, marginTop: 2 },
                        ]}
                      >
                        {ing.quantity ?? ''}
                      </Text>
                    </View>
                    <VerdictPill verdict={ing.tone} label={ing.status.toLowerCase()} small />
                  </View>
                ))}
            </GlassCard>

            {recipe.ingredients.some((i) => !i.fromFridge) && (
              <View style={styles.needList}>
                <Eyebrow uppercase style={{ marginBottom: 8 }}>
                  you'll also need
                </Eyebrow>
                {recipe.ingredients
                  .filter((i) => !i.fromFridge)
                  .map((i) => (
                    <Text
                      key={i.id}
                      style={[typeScale.body, { color: colors.onSurfaceVariant, marginBottom: 4 }]}
                    >
                      · {i.name.toLowerCase()} {i.quantity ? `— ${i.quantity}` : ''}
                    </Text>
                  ))}
              </View>
            )}
          </Animated.View>
        )}

        {/* Steps */}
        {recipe.steps.length > 0 && (
          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(340)}
            style={styles.section}
          >
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              the method
            </Eyebrow>
            {recipe.steps.map((step, i) => (
              <View key={step.number} style={[styles.step, i === recipe.steps.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.stepNumber}>
                  <Text style={[typeScale.label, { color: colors.white }]}>{step.number}</Text>
                </View>
                <Text style={[typeScale.body, styles.stepBody]}>{step.body.toLowerCase()}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.floatingRow, { bottom: insets.bottom + 24 }]}>
        <PillCTA
          label="save for later"
          variant="glass"
          icon={<Heart size={16} color={colors.primary} />}
          style={{ flex: 1 }}
        />
        <PillCTA
          label="start cooking"
          variant="primary"
          icon={<ChefHat size={18} color={colors.white} />}
          style={{ flex: 1.4 }}
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
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  heroDisc: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 48,
    elevation: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  verdictCenter: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  section: {
    marginTop: spacing.xl,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  ingredientDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(65,103,67,0.08)',
  },
  ingredientThumb: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  needList: {
    marginTop: spacing.lg,
    paddingHorizontal: 6,
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
});
