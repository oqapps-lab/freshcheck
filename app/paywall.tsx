import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Check, Close } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { startTrial as adaptyStartTrial, restorePurchases } from '@/src/lib/adapty';

type Plan = 'monthly' | 'annual';

/**
 * Paywall — v4 "Paper & Pith". Cream canvas, neumorphic surfaces,
 * Inter Title-Case hero, amber primary CTA.
 *
 *   [             close X ]
 *   MEMBERSHIP
 *   A Calmer Kitchen
 *   unlimited checks, gentle reminders…
 *   ┌── benefits card (4 sage-check rows) ──┐
 *   ┌─ MONTHLY $4.99 ─┐ ┌─ ANNUAL $3.33 ─┐
 *   │                 │ │  save 33% chip │
 *   │                 │ │  per month     │
 *   └─────────────────┘ └────────────────┘
 *   [ Try 7 Days Free ]                   amber primary
 *   restore · terms · privacy             links row
 *   not now                               ghost
 *   ★ 4.5 · 12,400 FAMILIES TEND HERE     eyebrow
 */
export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Plan>('annual');

  const dismiss = () => {
    Haptics.selectionAsync().catch(() => {});
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const startTrial = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const result = await adaptyStartTrial({ plan: selected });
    if (result.ok) {
      dismiss();
      return;
    }
    if (result.error && result.error !== 'adapty-not-configured') {
      Alert.alert('purchase failed', result.error);
    }
  };

  const restore = async () => {
    Haptics.selectionAsync().catch(() => {});
    const result = await restorePurchases();
    if (result.ok) {
      Alert.alert('restored', 'your subscription is active again.');
      dismiss();
    } else if (result.error && result.error !== 'adapty-not-configured') {
      Alert.alert('restore failed', result.error);
    }
  };

  const openTerms = () => Linking.openURL('https://example.com/terms').catch(() => {});
  const openPrivacy = () => Linking.openURL('https://example.com/privacy').catch(() => {});

  const selectMonthly = () => {
    Haptics.selectionAsync().catch(() => {});
    setSelected('monthly');
  };
  const selectAnnual = () => {
    Haptics.selectionAsync().catch(() => {});
    setSelected('annual');
  };

  const benefits = [
    'unlimited freshness checks',
    'gentle reminders before anything expires',
    'recipes suggested from what you already have',
    'a fridge that tends itself',
  ];

  return (
    <AtmosphericBackground tone="light">
      {/* Top header — single close button on the right */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ width: 40 }} />
        <Pressable
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="close"
          hitSlop={8}
        >
          <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.closeBtn}>
            <Close size={18} color={colors.ink} />
          </NeumorphicCard>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 80,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.hero}>
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>MEMBERSHIP</Text>
          <Text style={[typeScale.displayL, styles.heroTitle]}>A Calmer Kitchen</Text>
          <Text style={[typeScale.body, styles.heroBody]}>
            unlimited checks, gentle reminders, recipes that use what's already here
          </Text>
        </Animated.View>

        {/* Benefits */}
        <Animated.View entering={FadeIn.duration(motion.moderate).delay(100)}>
          <NeumorphicCard variant="raised" radius="md" padding={24} style={styles.benefits}>
            {benefits.map((b, i) => (
              <View
                key={b}
                style={[styles.benefitRow, i === benefits.length - 1 && styles.benefitRowLast]}
              >
                <View style={styles.checkCircle}>
                  <Check size={14} color={colors.white} strokeWidth={2.25} />
                </View>
                <Text style={[typeScale.body, styles.benefitLabel]}>{b}</Text>
              </View>
            ))}
          </NeumorphicCard>
        </Animated.View>

        {/* Plan toggle row */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(180)}
          style={styles.plans}
        >
          {/* MONTHLY */}
          <Pressable
            onPress={selectMonthly}
            accessibilityRole="button"
            accessibilityLabel="monthly plan $4.99"
            accessibilityState={{ selected: selected === 'monthly' }}
            style={styles.planPressable}
          >
            <NeumorphicCard
              variant="raised"
              radius="md"
              padding={20}
              style={StyleSheet.flatten([
                styles.planCard,
                selected === 'monthly' && styles.planCardSelected,
              ])}
            >
              <Text style={[typeScale.labelSmall, styles.planEyebrow]}>MONTHLY</Text>
              <Text style={[typeScale.displayM, styles.planPrice]}>$4.99</Text>
              <Text style={[typeScale.bodySmall, styles.planCaption]}>per month</Text>
            </NeumorphicCard>
          </Pressable>

          {/* ANNUAL */}
          <Pressable
            onPress={selectAnnual}
            accessibilityRole="button"
            accessibilityLabel="annual plan $3.33 per month, save 33%"
            accessibilityState={{ selected: selected === 'annual' }}
            style={styles.planPressable}
          >
            <NeumorphicCard
              variant="raised"
              radius="md"
              padding={20}
              style={StyleSheet.flatten([
                styles.planCard,
                selected === 'annual' && styles.planCardSelected,
              ])}
            >
              <Text style={[typeScale.labelSmall, styles.planEyebrow]}>ANNUAL</Text>
              <Text style={[typeScale.displayM, styles.planPrice]}>$3.33</Text>
              <Text style={[typeScale.bodySmall, styles.planCaption]}>
                per month · billed yearly
              </Text>
            </NeumorphicCard>
            <View style={styles.saveChip} pointerEvents="none">
              <Text style={[typeScale.labelSmall, styles.saveChipText]}>save 33%</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Footer block (in scroll, not floating) */}
        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(260)}
          style={styles.footer}
        >
          <PillCTA
            label="Try 7 Days Free"
            onPress={startTrial}
            fullWidth
            accessibilityLabel="try 7 days free"
          />

          <View style={styles.linksRow}>
            <Pressable
              onPress={restore}
              accessibilityRole="button"
              accessibilityLabel="restore purchases"
              hitSlop={8}
            >
              <Text style={[typeScale.caption, styles.linkText]}>restore</Text>
            </Pressable>
            <Text style={[typeScale.caption, styles.linkSep]}>·</Text>
            <Pressable
              onPress={openTerms}
              accessibilityRole="link"
              accessibilityLabel="terms of service"
              hitSlop={8}
            >
              <Text style={[typeScale.caption, styles.linkText]}>terms</Text>
            </Pressable>
            <Text style={[typeScale.caption, styles.linkSep]}>·</Text>
            <Pressable
              onPress={openPrivacy}
              accessibilityRole="link"
              accessibilityLabel="privacy policy"
              hitSlop={8}
            >
              <Text style={[typeScale.caption, styles.linkText]}>privacy</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={dismiss}
            accessibilityRole="button"
            accessibilityLabel="not now, dismiss paywall"
            hitSlop={8}
            style={styles.notNow}
          >
            <Text style={[typeScale.label, styles.notNowText]}>not now</Text>
          </Pressable>

          <Text style={[typeScale.labelSmall, styles.socialProof]}>
            ★ 4.5 · 12,400 FAMILIES TEND HERE
          </Text>
        </Animated.View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  heroBody: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: 12,
  },
  benefits: {
    marginBottom: spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  benefitRowLast: {
    paddingBottom: 0,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  benefitLabel: {
    color: colors.onSurface,
    flex: 1,
  },
  plans: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.xl,
  },
  planPressable: {
    flex: 1,
    position: 'relative',
  },
  planCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: colors.primary,
  },
  planEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  planPrice: {
    color: colors.ink,
    marginTop: 6,
  },
  planCaption: {
    color: colors.outline,
    marginTop: 4,
  },
  saveChip: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    zIndex: 5,
  },
  saveChipText: {
    color: colors.onAccent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  footer: {
    marginTop: spacing.sm,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.md,
  },
  linkText: {
    color: colors.outline,
  },
  linkSep: {
    color: colors.outlineVariant,
  },
  notNow: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  notNowText: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  socialProof: {
    color: colors.outline,
    textAlign: 'center',
    marginTop: spacing.xl,
    textTransform: 'uppercase',
  },
});
