import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Clock } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, radii, toneColor } from '@/constants/tokens';
import { recipes } from '@/mock/recipes';

/**
 * Recipes list — /(tabs)/recipes
 * Shows recipes sorted by expiring-first ingredient urgency.
 */
export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        <View style={styles.section}>
          <Eyebrow style={{ marginBottom: 10, color: colors.coralInk } as never}>Tonight</Eyebrow>
          {recipes
            .filter((r) => r.tone === 'past')
            .map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/recipe/${r.id}`)}
                style={({ pressed }) => [pressed && { opacity: 0.85 }]}
              >
                <GlassCard
                  variant="default"
                  style={[styles.recipeCard, { shadowColor: toneColor[r.tone].accent }]}
                  padding={0}
                >
                  <View style={[styles.recipePhoto, { backgroundColor: toneColor[r.tone].fill }]}>
                    <Text style={[typeScale.displayL, { color: toneColor[r.tone].text, fontSize: 72, lineHeight: 80 }]}>
                      {r.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.recipeBody}>
                    <Text style={[typeScale.titleM, { color: colors.ink }]}>{r.title}</Text>
                    <View style={styles.recipeMeta}>
                      <Clock size={14} color={colors.inkMuted} />
                      <Text style={[typeScale.bodySmall, { color: colors.inkMuted, marginLeft: 4 }]}>
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
                      style={{ marginTop: 10 }}
                    />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
        </View>

        <View style={styles.section}>
          <Eyebrow style={{ marginBottom: 10 }}>This week</Eyebrow>
          {recipes
            .filter((r) => r.tone !== 'past')
            .map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/recipe/${r.id}`)}
                style={({ pressed }) => [pressed && { opacity: 0.85 }]}
              >
                <GlassCard variant="default" style={styles.recipeCard} padding={0}>
                  <View style={[styles.recipePhoto, { backgroundColor: toneColor[r.tone].fill }]}>
                    <Text style={[typeScale.displayL, { color: toneColor[r.tone].text, fontSize: 72, lineHeight: 80 }]}>
                      {r.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.recipeBody}>
                    <Text style={[typeScale.titleM, { color: colors.ink }]}>{r.title}</Text>
                    <View style={styles.recipeMeta}>
                      <Clock size={14} color={colors.inkMuted} />
                      <Text style={[typeScale.bodySmall, { color: colors.inkMuted, marginLeft: 4 }]}>
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
            ))}
        </View>
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
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
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
