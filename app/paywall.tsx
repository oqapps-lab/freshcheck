import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check, Close } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, radii, fonts } from '@/constants/tokens';

/**
 * Paywall — /paywall (presented as modal)
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.7
 */
export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = React.useState<'monthly' | 'annual'>('annual');

  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  return (
    <AtmosphericBackground>
      {/* Close button */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={dismiss}
          style={styles.circleBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Close size={22} color={colors.ink} />
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
        <Text
          style={[
            typeScale.displayM,
            { color: colors.sageInk, textAlign: 'center', marginBottom: 10 },
          ]}
        >
          Protect your family
        </Text>
        <Text
          style={[
            typeScale.heroSerif,
            { fontFamily: fonts.serifHero, color: colors.ink, textAlign: 'center', marginBottom: spacing.xl },
          ]}
        >
          from expired food
        </Text>

        {/* Benefits */}
        <GlassCard variant="leafHighlight" showTopLight style={styles.benefitCard}>
          {[
            'Unlimited freshness scans',
            "Push alerts — 'Chicken, last day'",
            'Recipes from what expires first',
            'Fridge tracking without limits',
          ].map((benefit) => (
            <View key={benefit} style={styles.benefitRow}>
              <View style={styles.benefitCheck}>
                <Check size={16} color={colors.white} />
              </View>
              <Text style={[typeScale.body, { color: colors.ink, flex: 1 }]}>{benefit}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Plans */}
        <View style={styles.plansRow}>
          <Pressable
            onPress={() => setSelected('monthly')}
            style={[styles.planCard, selected === 'monthly' && styles.planCardSelected]}
          >
            <Eyebrow>Monthly</Eyebrow>
            <Text style={[typeScale.titleL, { color: colors.ink, marginTop: 4 }]}>$4.99</Text>
            <Text style={[typeScale.caption, { color: colors.inkDim }]}>per month</Text>
          </Pressable>

          <Pressable
            onPress={() => setSelected('annual')}
            style={[
              styles.planCard,
              styles.planCardAnnual,
              selected === 'annual' && styles.planCardSelected,
            ]}
          >
            <View style={styles.saveBadge}>
              <Text style={[typeScale.caption, { color: colors.white }]}>Save 33%</Text>
            </View>
            <Eyebrow>Annual</Eyebrow>
            <Text style={[typeScale.titleL, { color: colors.sageInk, marginTop: 4 }]}>$3.33</Text>
            <Text style={[typeScale.caption, { color: colors.inkDim }]}>per month · billed yearly</Text>
          </Pressable>
        </View>

        <Eyebrow center style={{ marginTop: spacing.lg }}>
          {'★ 4.5 · 12,400 families'}
        </Eyebrow>

        <View style={styles.linksRow}>
          <Text style={[typeScale.caption, styles.link]}>Restore</Text>
          <Text style={[typeScale.caption, { color: colors.inkDim }]}>·</Text>
          <Text style={[typeScale.caption, styles.link]}>Terms</Text>
          <Text style={[typeScale.caption, { color: colors.inkDim }]}>·</Text>
          <Text style={[typeScale.caption, styles.link]}>Privacy</Text>
        </View>
      </ScrollView>

      <View style={[styles.floatingCta, { bottom: insets.bottom + 16 }]}>
        <PillCTA label="Try 7 days free" fullWidth />
        <Pressable onPress={dismiss} style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={[typeScale.caption, { color: colors.inkDim }]}>Not now</Text>
        </Pressable>
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
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
  benefitCard: {
    marginBottom: spacing.xl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: colors.sageInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plansRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.hairline,
  },
  planCardAnnual: {
    backgroundColor: colors.sageMist,
    borderColor: colors.sageDim,
  },
  planCardSelected: {
    borderColor: colors.sageInk,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: colors.coral,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: spacing.md,
  },
  link: {
    color: colors.sageInk,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
