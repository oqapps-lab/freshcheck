import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Clock, ChefHat } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { recipes } from '@/mock/recipes';

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heading}>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>what to cook</Text>
          <Text style={[typeScale.body, { color: colors.secondary, marginTop: 4 }]}>
            picked from what's in your fridge today
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(80)} style={styles.section}>
          <Eyebrow uppercase style={{ marginBottom: 12 }}>
            tonight
          </Eyebrow>
          {recipes
            .filter((r) => r.tone === 'past')
            .map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/recipe/${r.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`open recipe ${r.title.toLowerCase()}`}
                accessibilityHint={`${r.timeMinutes} minutes, serves ${r.servings}`}
                style={({ pressed }) => [pressed && { opacity: 0.88 }]}
              >
                <GlassCard variant="glass" radius="xl" padding={0} style={styles.card}>
                  <View style={styles.cardThumb}>
                    <ChefHat size={40} color={colors.primary} strokeWidth={1.3} />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={[typeScale.titleL, { color: colors.onSurface }]}>
                      {r.title.toLowerCase()}
                    </Text>
                    <View style={styles.metaRow}>
                      <Clock size={14} color={colors.secondary} />
                      <Text
                        style={[typeScale.bodySmall, { color: colors.secondary, marginLeft: 6 }]}
                      >
                        {r.timeMinutes} min · serves {r.servings}
                      </Text>
                    </View>
                    <VerdictPill
                      verdict={r.tone}
                      label={`uses ${r.expiringCount} expiring`}
                      small
                      style={{ marginTop: 12 }}
                    />
                  </View>
                </GlassCard>
              </Pressable>
            ))}
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(160)} style={styles.section}>
          <Eyebrow uppercase style={{ marginBottom: 12 }}>
            this week
          </Eyebrow>
          {recipes
            .filter((r) => r.tone !== 'past')
            .map((r) => (
              <Pressable
                key={r.id}
                onPress={() => router.push(`/recipe/${r.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`open recipe ${r.title.toLowerCase()}`}
                accessibilityHint={`${r.timeMinutes} minutes, serves ${r.servings}`}
                style={({ pressed }) => [pressed && { opacity: 0.88 }]}
              >
                <GlassCard variant="glass" radius="xl" padding={0} style={styles.card}>
                  <View style={styles.cardThumb}>
                    <ChefHat size={36} color={colors.primary} strokeWidth={1.3} />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={[typeScale.titleL, { color: colors.onSurface }]}>
                      {r.title.toLowerCase()}
                    </Text>
                    <View style={styles.metaRow}>
                      <Clock size={14} color={colors.secondary} />
                      <Text
                        style={[typeScale.bodySmall, { color: colors.secondary, marginLeft: 6 }]}
                      >
                        {r.timeMinutes} min · serves {r.servings}
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </Pressable>
            ))}
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardThumb: {
    width: 96,
    height: 96,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  cardBody: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});
