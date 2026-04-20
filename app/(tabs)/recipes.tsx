import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { DecorDots } from '@/components/ui/DecorDots';
import { Clock } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  toneColor,
  gradients,
  motion,
  Tone,
} from '@/constants/tokens';
import { recipes } from '@/mock/recipes';

const heroGradient = (tone: Tone) => {
  switch (tone) {
    case 'past':
      return gradients.monogramPast;
    case 'soon':
      return gradients.monogramSoon;
    default:
      return gradients.monogramSafe;
  }
};

/**
 * Recipes list — /(tabs)/recipes  (v2 — gradient hero tiles + staggered entrance + decor)
 */
export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const tonight = recipes.filter((r) => r.tone === 'past');
  const week = recipes.filter((r) => r.tone !== 'past');

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={[typeScale.titleL, { color: colors.ink }]}>What to cook</Text>
        <Eyebrow>Picked from what's in your fridge</Eyebrow>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 90,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 40,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {tonight.length > 0 && (
          <View style={styles.section}>
            <Animated.View entering={FadeInDown.duration(motion.moderate)}>
              <Eyebrow style={{ marginBottom: 12, color: colors.coralInk } as never}>
                Tonight · cook from what's expiring
              </Eyebrow>
            </Animated.View>
            {tonight.map((r, i) => (
              <Animated.View
                key={r.id}
                entering={FadeInDown.duration(motion.moderate).delay(80 + i * 80)}
              >
                <Pressable
                  onPress={() => router.push(`/recipe/${r.id}`)}
                  style={({ pressed }) => [pressed && { opacity: 0.88 }]}
                >
                  <GlassCard
                    variant="default"
                    style={[styles.recipeCard, { shadowColor: toneColor[r.tone].accent }]}
                    padding={0}
                  >
                    <View style={styles.recipePhoto}>
                      <LinearGradient
                        colors={heroGradient(r.tone)}
                        start={{ x: 0.1, y: 0 }}
                        end={{ x: 0.9, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <DecorDots />
                      <Text
                        style={[
                          typeScale.displayL,
                          {
                            color: toneColor[r.tone].text,
                            fontSize: 80,
                            lineHeight: 88,
                          },
                        ]}
                      >
                        {r.title.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.recipeBody}>
                      <Text style={[typeScale.titleM, { color: colors.ink }]}>{r.title}</Text>
                      <View style={styles.recipeMeta}>
                        <Clock size={14} color={colors.inkMuted} />
                        <Text
                          style={[typeScale.bodySmall, { color: colors.inkMuted, marginLeft: 4 }]}
                        >
                          {r.timeMinutes} min
                        </Text>
                        <View style={styles.metaDot} />
                        <Text style={[typeScale.bodySmall, { color: colors.inkMuted }]}>
                          Serves {r.servings}
                        </Text>
                      </View>
                      <VerdictPill
                        verdict={r.tone}
                        label={`Uses ${r.expiringCount} expiring`}
                        small
                        glow
                        style={{ marginTop: 10 }}
                      />
                    </View>
                  </GlassCard>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        {week.length > 0 && (
          <View style={styles.section}>
            <Animated.View entering={FadeInDown.duration(motion.moderate).delay(200)}>
              <Eyebrow style={{ marginBottom: 12 }}>This week · still plenty of time</Eyebrow>
            </Animated.View>
            {week.map((r, i) => (
              <Animated.View
                key={r.id}
                entering={FadeInDown.duration(motion.moderate).delay(260 + i * 80)}
              >
                <Pressable
                  onPress={() => router.push(`/recipe/${r.id}`)}
                  style={({ pressed }) => [pressed && { opacity: 0.88 }]}
                >
                  <GlassCard variant="default" style={styles.recipeCard} padding={0}>
                    <View style={styles.recipePhoto}>
                      <LinearGradient
                        colors={heroGradient(r.tone)}
                        start={{ x: 0.1, y: 0 }}
                        end={{ x: 0.9, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <DecorDots />
                      <Text
                        style={[
                          typeScale.displayL,
                          {
                            color: toneColor[r.tone].text,
                            fontSize: 80,
                            lineHeight: 88,
                          },
                        ]}
                      >
                        {r.title.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.recipeBody}>
                      <Text style={[typeScale.titleM, { color: colors.ink }]}>{r.title}</Text>
                      <View style={styles.recipeMeta}>
                        <Clock size={14} color={colors.inkMuted} />
                        <Text
                          style={[typeScale.bodySmall, { color: colors.inkMuted, marginLeft: 4 }]}
                        >
                          {r.timeMinutes} min
                        </Text>
                        <View style={styles.metaDot} />
                        <Text style={[typeScale.bodySmall, { color: colors.inkMuted }]}>
                          Serves {r.servings}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 12,
    gap: 4,
    zIndex: 10,
  },
  section: {
    marginBottom: spacing.xl,
  },
  recipeCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  recipePhoto: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  recipeBody: {
    padding: spacing.md,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.inkDim,
    marginHorizontal: 8,
  },
});
