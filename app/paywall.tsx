import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check, Close } from '@/components/ui/Glyphs';
import { colors, gradients, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<'monthly' | 'annual'>('annual');

  const dismiss = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  const benefits = [
    'unlimited freshness checks',
    'gentle reminders before anything expires',
    'recipes suggested from what you already have',
    'a fridge that tends itself',
  ];

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ width: 40 }} />
        <Pressable
          onPress={dismiss}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="close"
        >
          <Close size={18} color={colors.secondary} />
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
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.hero}>
          <Text
            style={[
              typeScale.displayM,
              { color: colors.onSurface, textAlign: 'center' },
            ]}
          >
            a calmer kitchen
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, textAlign: 'center', marginTop: 10 },
            ]}
          >
            unlimited checks, gentle reminders, recipes that use what's already here
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(100)}>
          <GlassCard variant="glass" radius="xl" padding={24} style={styles.benefits}>
            {benefits.map((b) => (
              <View key={b} style={styles.benefitRow}>
                <View style={styles.checkCircle}>
                  <Check size={14} color={colors.white} />
                </View>
                <Text style={[typeScale.body, { color: colors.onSurface, flex: 1 }]}>{b}</Text>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(180)} style={styles.plans}>
          <Pressable
            onPress={() => setSelected('monthly')}
            style={[
              styles.planCard,
              selected === 'monthly' && styles.planCardSelected,
            ]}
          >
            <Eyebrow uppercase>monthly</Eyebrow>
            <Text style={[typeScale.displayM, { color: colors.onSurface, marginTop: 4 }]}>
              $4.99
            </Text>
            <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 2 }]}>
              per month
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected('annual')}
            style={[
              styles.planCard,
              styles.planCardAnnual,
              selected === 'annual' && styles.planCardSelected,
            ]}
          >
            <LinearGradient
              colors={gradients.verdictFresh}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.saveChip}>
              <Text style={[typeScale.caption, { color: colors.onPrimary }]}>save 33%</Text>
            </View>
            <Eyebrow uppercase color="primary">annual</Eyebrow>
            <Text style={[typeScale.displayM, { color: colors.primary, marginTop: 4 }]}>
              $3.33
            </Text>
            <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 2 }]}>
              per month · billed yearly
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(280)}
          style={{ alignItems: 'center', marginTop: spacing.xl }}
        >
          <Eyebrow uppercase>★ 4.5 · 12,400 families tend here</Eyebrow>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(340)}
          style={styles.links}
        >
          <Text style={[typeScale.caption, { color: colors.secondary }]}>restore</Text>
          <Text style={[typeScale.caption, { color: colors.outline }]}>·</Text>
          <Text style={[typeScale.caption, { color: colors.secondary }]}>terms</Text>
          <Text style={[typeScale.caption, { color: colors.outline }]}>·</Text>
          <Text style={[typeScale.caption, { color: colors.secondary }]}>privacy</Text>
        </Animated.View>
      </ScrollView>

      <View style={[styles.floatingCta, { bottom: insets.bottom + 24 }]}>
        <PillCTA label="try 7 days free" fullWidth />
        <Pressable onPress={dismiss} style={{ alignItems: 'center', marginTop: 14 }}>
          <Text style={[typeScale.caption, { color: colors.secondary }]}>not now</Text>
        </Pressable>
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
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  benefits: {
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  plans: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  planCardAnnual: {
    borderColor: colors.primaryContainer,
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  saveChip: {
    position: 'absolute',
    top: -10,
    right: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: spacing.md,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
