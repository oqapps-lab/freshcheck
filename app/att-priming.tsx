import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Sparkle } from '@/components/ui/Glyphs';
import { promptATT } from '@/src/lib/appsflyer';
import { useOnboardingAnswers } from '@/src/state/onboardingStore';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

// Pre-permission ('priming') screen shown at the END of onboarding, right
// before the paywall - after the user has seen the app value, when trust is
// highest and the whole install cohort is still present. It explains why we
// ask, then hands off to Apple native ATT dialog (Apple sanctions a
// transparent pre-prompt; the system dialog stays the real choice).
//
// AppsFlyer is already initialised at cold launch (VendorBoot -> initAppsFlyer)
// and holds the install payload until ATT resolves, so consent here still
// attaches the IDFA deterministically.
//
// COMPLIANCE: nothing is gated on consent and nothing is offered in exchange
// (Guideline 5.1.2(i)); the CTA is neutral ('Continue') and leads to the real
// system dialog, which the user can still decline with no penalty.
export default function AttPrimingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  // B01 (students QA): "families/parents" copy read wrong for a "Just me"
  // household — personalize from the quiz answer.
  const family = useOnboardingAnswers().household === 'family';

  const onContinue = async () => {
    if (busy) return;
    setBusy(true);
    // Apple native ATT dialog. Whatever happens — granted, denied, or the
    // module throwing — the user MUST move on: this screen has no other exit
    // (gestureEnabled: false), so a stranded busy state would dead-end the
    // entire onboarding funnel.
    try {
      await promptATT();
    } catch {
      /* never block the funnel on a tracking prompt */
    } finally {
      router.replace('/your-plan' as never);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.center}>
        <SoftSurface variant="cushion" radius="full" style={styles.iconGap} innerStyle={styles.icon}>
          <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
        </SoftSurface>

        <Text style={[typeScale.displayMedium, styles.headline]}>
          {family ? 'Make FreshCheck better for families' : 'Make FreshCheck better for you'}
        </Text>
        <Text style={[typeScale.bodyLarge, styles.body]}>
          {family
            ? 'With your permission, we measure which features actually help parents like you — so we can keep improving the parts that matter.'
            : 'With your permission, we measure which features actually help people like you — so we can keep improving the parts that matter.'}
        </Text>
        <Text style={[typeScale.bodyLarge, styles.body]}>
          We never sell your personal data, and your scans always stay private.
        </Text>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Text style={[typeScale.bodySmall, styles.micro]}>
          On the next screen you can Allow or decline. FreshCheck works fully
          either way, and you can change this anytime in Settings.
        </Text>
        <PrimaryPillCTA
          label="Continue"
          onPress={onContinue}
          iconLeft={<Sparkle size={20} color={colors.amber} strokeWidth={2} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: layout.screenPadding, gap: spacing.lg },
  // marginBottom lives on the OUTER style — putting it in innerStyle inflates
  // the outer card (documented SoftSurface margin bug class).
  iconGap: { marginBottom: spacing.sm },
  icon: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  headline: { color: colors.ink },
  body: { color: colors.inkSecondary, lineHeight: 24 },
  bottom: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
  micro: { color: colors.inkMuted, textAlign: 'center', lineHeight: 18 },
});
