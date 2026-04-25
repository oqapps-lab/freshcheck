import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { PillCTA } from '@/components/ui/PillCTA';
import { Clock, ChefHat, Sprig } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { recipes, type Recipe } from '@/mock/recipes';
import { useFridge } from '@/src/hooks/useFridge';

/**
 * Capitalize each whitespace-separated word — Title Case for hero copy
 * and recipe names per Stitch v4.
 */
function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
}

export default function RecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items: fridge } = useFridge();

  const tonight = recipes.filter((r) => r.tone === 'past');
  const thisWeek = recipes.filter((r) => r.tone !== 'past');

  const openRecipe = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/recipe/${id}`);
  };

  // Empty fridge — suggest scanning first.
  if (fridge.length === 0) {
    return (
      <AtmosphericBackground>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
            paddingHorizontal: layout.screenPadding,
            flexGrow: 1,
          }}
        >
          <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heroBlock}>
            <Text style={[typeScale.labelSmall, styles.eyebrow]}>WHAT'S COOKING</Text>
            <Text style={[typeScale.displayL, styles.headline]}>Your Recipes</Text>
            <Text style={[typeScale.body, styles.subtitle]}>
              Picked from what's in your fridge today.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(80)}
            style={styles.emptyWrap}
          >
            <NeumorphicCard variant="raised" radius="lg" padding={28} style={styles.emptyCard}>
              <View style={styles.emptyOrb}>
                <Sprig size={40} color={colors.primary} strokeWidth={1.4} />
              </View>
              <Text style={[typeScale.titleL, styles.emptyTitle]}>No Recipes Yet</Text>
              <Text style={[typeScale.body, styles.emptyBody]}>
                scan something for your fridge, and recipes will show up here — starting
                with the ingredients closest to expiry.
              </Text>
              <PillCTA
                label="scan a food"
                onPress={() => router.push('/scan/camera')}
                style={{ marginTop: spacing.xl }}
              />
            </NeumorphicCard>
          </Animated.View>
        </ScrollView>
      </AtmosphericBackground>
    );
  }

  const renderCard = (r: Recipe, withExpiringChip: boolean) => (
    <Pressable
      key={r.id}
      onPress={() => openRecipe(r.id)}
      accessibilityRole="button"
      accessibilityLabel={`open recipe ${r.title.toLowerCase()}`}
      accessibilityHint={`${r.timeMinutes} minutes, serves ${r.servings}`}
      style={({ pressed }) => [styles.cardPressable, pressed && { opacity: 0.92 }]}
    >
      <NeumorphicCard variant="raised" radius="md" padding={0} style={styles.card}>
        <View style={styles.cardThumb}>
          <ChefHat size={42} color={colors.primary} strokeWidth={1.3} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[typeScale.titleL, styles.cardTitle]} numberOfLines={1}>
            {toTitleCase(r.title)}
          </Text>
          <View style={styles.metaRow}>
            <Clock size={14} color={colors.outline} />
            <Text style={[typeScale.bodySmall, styles.metaText]}>
              {r.timeMinutes} min · serves {r.servings}
            </Text>
          </View>
          {withExpiringChip && (
            <VerdictPill
              verdict="soon"
              label={`uses ${r.expiringCount} expiring`}
              small
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </NeumorphicCard>
    </Pressable>
  );

  const renderEmptySection = (label: string) => (
    <NeumorphicCard variant="flat" radius="md" padding={24} style={styles.sectionEmpty}>
      <View style={styles.sectionEmptyOrb}>
        <Sprig size={26} color={colors.primary} strokeWidth={1.4} />
      </View>
      <Text style={[typeScale.titleM, styles.sectionEmptyTitle]}>No Recipes Yet</Text>
      <Text style={[typeScale.bodySmall, styles.sectionEmptyBody]}>{label}</Text>
    </NeumorphicCard>
  );

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
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heroBlock}>
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>WHAT'S COOKING</Text>
          <Text style={[typeScale.displayL, styles.headline]}>Your Recipes</Text>
          <Text style={[typeScale.body, styles.subtitle]}>
            Picked from what's in your fridge today.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(80)}
          style={styles.section}
        >
          <Text style={[typeScale.labelSmall, styles.sectionEyebrow]}>TONIGHT</Text>
          {tonight.length > 0
            ? tonight.map((r) => renderCard(r, true))
            : renderEmptySection('nothing flagged for tonight yet.')}
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(160)}
          style={styles.section}
        >
          <Text style={[typeScale.labelSmall, styles.sectionEyebrow]}>THIS WEEK</Text>
          {thisWeek.length > 0
            ? thisWeek.map((r) => renderCard(r, false))
            : renderEmptySection('check back later for week-ahead picks.')}
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  heroBlock: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  headline: {
    color: colors.ink,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.outline,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardPressable: {
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardThumb: {
    width: 96,
    height: 96,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 20,
  },
  cardTitle: {
    color: colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    color: colors.outline,
    marginLeft: 6,
  },
  sectionEmpty: {
    alignItems: 'center',
  },
  sectionEmptyOrb: {
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sectionEmptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  sectionEmptyBody: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyOrb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: spacing.sm,
  },
});
