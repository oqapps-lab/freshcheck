import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
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

  const startTrial = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert(
      'coming soon',
      'subscriptions wire up with Adapty in Stage 4. selected plan: ' + selected,
    );
  };

  const restore = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('no active subscription', 'once Adapty is wired, this will restore your purchases.');
  };

  const openTerms = () => Linking.openURL('https://example.com/terms').catch(() => {});
  const openPrivacy = () => Linking.openURL('https://example.com/privacy').catch(() => {});

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
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 150,
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

        <Animated.View entering={FadeIn.duration(motion.moderate).delay(200)} style={styles.plans}>
          <View style={styles.planWrap}>
            <Pressable
              onPress={() => setSelected('monthly')}
              accessibilityRole="button"
              accessibilityLabel="monthly plan $4.99"
              accessibilityState={{ selected: selected === 'monthly' }}
              style={[
                styles.planCardInner,
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
          </View>

          <View style={styles.planWrap}>
            <View style={styles.saveChip} pointerEvents="none">
              <Text style={[typeScale.caption, { color: colors.onPrimary }]}>save 33%</Text>
            </View>
            <Pressable
              onPress={() => setSelected('annual')}
              accessibilityRole="button"
              accessibilityLabel="annual plan $3.33 per month, save 33%"
              accessibilityState={{ selected: selected === 'annual' }}
              style={[
                styles.planCardInner,
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
              <Eyebrow uppercase color="primary">annual</Eyebrow>
              <Text style={[typeScale.displayM, { color: colors.primary, marginTop: 4 }]}>
                $3.33
              </Text>
              <Text style={[typeScale.bodySmall, { color: colors.secondary, marginTop: 2 }]}>
                per month · billed yearly
              </Text>
            </Pressable>
          </View>
        </Animated.View>

      </ScrollView>

      <LinearGradient
        colors={['rgba(253,249,240,0)', colors.canvas]}
        locations={[0, 1]}
        pointerEvents="none"
        style={[styles.floatingFade, { bottom: insets.bottom + 128 }]}
      />

      <View
        style={[
          styles.floatingCta,
          {
            bottom: 0,
            paddingBottom: insets.bottom + 14,
            paddingTop: 14,
          },
        ]}
      >
        <View style={styles.socialProofFooter}>
          <Eyebrow uppercase>★ 4.5 · 12,400 families tend here</Eyebrow>
        </View>
        <PillCTA label="try 7 days free" onPress={startTrial} fullWidth />
        <View style={styles.links}>
          <Pressable onPress={dismiss} accessibilityRole="button" accessibilityLabel="not now, dismiss paywall" hitSlop={8}>
            <Text style={[typeScale.caption, { color: colors.secondary }]}>not now</Text>
          </Pressable>
          <Text style={[typeScale.caption, { color: colors.outline }]}>·</Text>
          <Pressable onPress={restore} accessibilityRole="button" accessibilityLabel="restore purchases" hitSlop={8}>
            <Text style={[typeScale.caption, { color: colors.secondary }]}>restore</Text>
          </Pressable>
          <Text style={[typeScale.caption, { color: colors.outline }]}>·</Text>
          <Pressable onPress={openTerms} accessibilityRole="link" accessibilityLabel="terms of service" hitSlop={8}>
            <Text style={[typeScale.caption, { color: colors.secondary }]}>terms</Text>
          </Pressable>
          <Text style={[typeScale.caption, { color: colors.outline }]}>·</Text>
          <Pressable onPress={openPrivacy} accessibilityRole="link" accessibilityLabel="privacy policy" hitSlop={8}>
            <Text style={[typeScale.caption, { color: colors.secondary }]}>privacy</Text>
          </Pressable>
        </View>
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
    marginBottom: spacing.lg,
  },
  benefits: {
    marginBottom: spacing.lg,
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
    marginTop: 14,
  },
  planWrap: {
    flex: 1,
  },
  planCardInner: {
    width: '100%',
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
    zIndex: 2,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  floatingCta: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPadding,
    backgroundColor: colors.canvas,
  },
  floatingFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 48,
  },
  socialProofFooter: {
    alignItems: 'center',
    marginBottom: 12,
  },
  notNow: {
    alignItems: 'center',
    marginTop: 14,
  },
});
