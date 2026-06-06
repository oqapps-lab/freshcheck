import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Sparkle, History, Bowl, Check } from '@/components/ui/Glyphs';
import {
  useOnboardingAnswers,
  personaHeadline,
  fearPromise,
  type WasteItem,
} from '@/src/state/onboardingStore';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

const WASTE_LABEL: Record<WasteItem, string> = {
  leftovers: 'Leftovers',
  produce: 'Produce & greens',
  dairy: 'Dairy',
  meat: 'Meat & poultry',
  bread: 'Bread',
};

const BENEFITS = [
  { Icon: Sparkle, color: colors.amber, title: 'Instant safe / caution / danger verdict', sub: 'Scan any food, know in 3 seconds.' },
  { Icon: History, color: colors.primary, title: 'Your fridge on a freshness timeline', sub: 'Everything sorted by what expires next.' },
  { Icon: Bowl, color: colors.amber, title: 'Recipes from what is expiring', sub: 'Turn soon-to-spoil items into dinner.' },
];

const TILES: { label: string; locked: boolean }[] = [
  { label: 'Daily freshness scans', locked: false },
  { label: 'Fridge timeline', locked: false },
  { label: 'Expiry reminders', locked: false },
  { label: 'Unlimited scans', locked: true },
  { label: 'Unlimited AI recipes', locked: true },
  { label: 'Barcode import', locked: true },
];

export default function YourPlanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const answers = useOnboardingAnswers();
  const name = answers.name?.trim();
  const watch = answers.topWaste.slice(0, 3);

  const onContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/paywall' as never);
  };

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + spacing.sm }} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../assets/onboarding/fresh-abundance.webp')} style={styles.hero} resizeMode="cover" />
        <Text style={[typeScale.label, styles.eyebrow]}>{name ? `${name.toUpperCase()}'S PLAN` : 'YOUR FRESHCHECK PLAN'}</Text>
        <Text style={[typeScale.displayMedium, styles.headline]}>{personaHeadline(answers)}</Text>
        <Text style={[typeScale.bodyLarge, styles.promise]}>{fearPromise(answers)}</Text>

        {watch.length > 0 ? (
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.watchCard}>
            <Text style={[typeScale.label, styles.watchLabel]}>WE WILL KEEP AN EYE ON</Text>
            {watch.map((w) => (
              <View key={w} style={styles.watchRow}>
                <View style={styles.watchDot} />
                <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{WASTE_LABEL[w]}</Text>
              </View>
            ))}
          </SoftSurface>
        ) : null}

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <SoftSurface key={b.title} variant="cushion" radius="xl" innerStyle={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <b.Icon size={22} color={b.color} strokeWidth={1.8} />
              </View>
              <View style={styles.benefitText}>
                <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{b.title}</Text>
                <Text style={[typeScale.bodySmall, styles.benefitSub]}>{b.sub}</Text>
              </View>
            </SoftSurface>
          ))}
        </View>

        <Text style={[typeScale.label, styles.sectionLabel]}>WHAT IS INSIDE</Text>
        <View style={styles.tiles}>
          {TILES.map((t) => (
            <View key={t.label} style={[styles.tile, t.locked ? styles.tileLocked : null]}>
              {t.locked ? (
                <Text style={styles.lock}>🔒</Text>
              ) : (
                <View style={styles.tileCheck}>
                  <Check size={12} color={colors.surfaceWhite} strokeWidth={3} />
                </View>
              )}
              <Text style={[typeScale.bodySmall, t.locked ? styles.tileLockedText : styles.tileText]}>{t.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[typeScale.bodySmall, styles.social]}>Join families saving about $2,913 a year with FreshCheck.</Text>

        <View style={styles.ctaInline}>
          <PrimaryPillCTA label="See my plan" onPress={onContinue} iconLeft={<Sparkle size={20} color={colors.amber} strokeWidth={2} />} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  skipRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xs },
  scroll: { paddingHorizontal: layout.screenPadding, paddingTop: spacing.sm },
  hero: { width: '100%', height: 180, borderRadius: 24, marginBottom: spacing.lg },
  eyebrow: { color: colors.inkSecondary, letterSpacing: 1.6, marginLeft: 2, marginBottom: spacing.xs },
  headline: { color: colors.ink, marginBottom: spacing.sm },
  promise: { color: colors.inkSecondary, lineHeight: 24, marginBottom: spacing.xl },
  watchCard: { padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.xl },
  watchLabel: { color: colors.inkSecondary, letterSpacing: 1.4, marginBottom: spacing.xs },
  watchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  watchDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  benefits: { gap: spacing.md, marginBottom: spacing.xl },
  benefitCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  benefitIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  benefitText: { flex: 1, gap: 2 },
  benefitSub: { color: colors.inkSecondary },
  sectionLabel: { color: colors.inkSecondary, letterSpacing: 1.6, marginLeft: 2, marginBottom: spacing.md },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  tile: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceWhite, borderRadius: 14, paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  tileLocked: { backgroundColor: colors.surfaceTint },
  tileCheck: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  lock: { fontSize: 16 },
  tileText: { color: colors.ink, flex: 1 },
  tileLockedText: { color: colors.inkSecondary, flex: 1 },
  social: { color: colors.inkMuted, textAlign: 'center', marginTop: spacing.sm },
  ctaInline: { marginTop: spacing.xl },
});
