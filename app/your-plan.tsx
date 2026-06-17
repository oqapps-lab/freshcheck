import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
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

// Title-case waste labels for the "we'll keep an eye on" list. Values are i18n
// key suffixes resolved via t('yourPlan.waste.<key>') at the render site.
const WASTE_LABEL: Record<WasteItem, string> = {
  leftovers: 'leftovers',
  produce: 'produce',
  dairy: 'dairy',
  meat: 'meat',
  bread: 'bread',
};

// Each benefit holds i18n key suffixes (title/sub) resolved at render.
const BENEFITS = [
  { Icon: Sparkle, color: colors.amber, key: 'verdict' },
  { Icon: History, color: colors.primary, key: 'timeline' },
  { Icon: Bowl, color: colors.amber, key: 'recipes' },
] as const;

// Each tile holds an i18n key suffix resolved via t('yourPlan.tiles.<key>').
const TILES: { key: string; locked: boolean }[] = [
  { key: 'dailyScans', locked: false },
  { key: 'fridgeTimeline', locked: false },
  { key: 'expiryReminders', locked: false },
  { key: 'unlimitedScans', locked: true },
  { key: 'unlimitedRecipes', locked: true },
  { key: 'barcodeImport', locked: true },
];

export default function YourPlanScreen() {
  const { t } = useTranslation();
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
        <Text style={[typeScale.label, styles.eyebrow]}>{name ? t('yourPlan.eyebrowNamed', { name: name.toUpperCase() }) : t('yourPlan.eyebrowDefault')}</Text>
        <Text style={[typeScale.displayMedium, styles.headline]}>{personaHeadline(answers)}</Text>
        <Text style={[typeScale.bodyLarge, styles.promise]}>{fearPromise(answers)}</Text>

        {watch.length > 0 ? (
          <SoftSurface variant="cushion" radius="xxl" style={styles.watchCardOuter} innerStyle={styles.watchCard}>
            <Text style={[typeScale.label, styles.watchLabel]}>{t('yourPlan.watchLabel')}</Text>
            {watch.map((w) => (
              <View key={w} style={styles.watchRow}>
                <View style={styles.watchDot} />
                <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{t(`yourPlan.waste.${WASTE_LABEL[w]}`)}</Text>
              </View>
            ))}
          </SoftSurface>
        ) : null}

        <View style={styles.benefits}>
          {BENEFITS.map((b) => (
            <SoftSurface key={b.key} variant="cushion" radius="xl" innerStyle={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <b.Icon size={22} color={b.color} strokeWidth={1.8} />
              </View>
              <View style={styles.benefitText}>
                <Text style={[typeScale.titleSmall, { color: colors.ink }]}>{t(`yourPlan.benefits.${b.key}.title`)}</Text>
                <Text style={[typeScale.bodySmall, styles.benefitSub]}>{t(`yourPlan.benefits.${b.key}.sub`)}</Text>
              </View>
            </SoftSurface>
          ))}
        </View>

        <Text style={[typeScale.label, styles.sectionLabel]}>{t('yourPlan.whatIsInside')}</Text>
        <View style={styles.tiles}>
          {TILES.map((tile) => (
            <View key={tile.key} style={[styles.tile, tile.locked ? styles.tileLocked : null]}>
              {tile.locked ? (
                <Text style={styles.lock}>🔒</Text>
              ) : (
                <View style={styles.tileCheck}>
                  <Check size={12} color={colors.surfaceWhite} strokeWidth={3} />
                </View>
              )}
              <Text style={[typeScale.bodySmall, tile.locked ? styles.tileLockedText : styles.tileText]}>{t(`yourPlan.tiles.${tile.key}`)}</Text>
            </View>
          ))}
        </View>

        <Text style={[typeScale.bodySmall, styles.social]}>{t('yourPlan.socialProof')}</Text>

        <View style={styles.ctaInline}>
          <PrimaryPillCTA label={t('yourPlan.cta.seeMyPlan')} onPress={onContinue} iconLeft={<Sparkle size={20} color={colors.amber} strokeWidth={2} />} />
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
  watchCardOuter: { marginBottom: spacing.xl },
  watchCard: { padding: spacing.lg, gap: spacing.sm },
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
