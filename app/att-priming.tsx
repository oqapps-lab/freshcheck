import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Sparkle } from '@/components/ui/Glyphs';
import { promptATT } from '@/src/lib/appsflyer';
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

  const onContinue = async () => {
    if (busy) return;
    setBusy(true);
    // Apple native ATT dialog. Resolves regardless of the choice; either way
    // we proceed to the plan / paywall - we never gate on the answer.
    await promptATT();
    router.replace('/your-plan' as never);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xl }]}>
      <View style={styles.center}>
        <SoftSurface variant="cushion" radius="full" innerStyle={styles.icon}>
          <Sparkle size={40} color={colors.amber} strokeWidth={1.6} />
        </SoftSurface>

        <Text style={[typeScale.displayMedium, styles.headline]}>
          Help keep FreshCheck free for families
        </Text>
        <Text style={[typeScale.bodyLarge, styles.body]}>
          FreshCheck stays free thanks to a few trusted partners. With your
          permission, we measure which features actually reach parents like you,
          so we can keep improving the app and keep the scanner free.
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
  icon: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  headline: { color: colors.ink },
  body: { color: colors.inkSecondary, lineHeight: 24 },
  bottom: { paddingHorizontal: layout.screenPadding, gap: spacing.md },
  micro: { color: colors.inkMuted, textAlign: 'center', lineHeight: 18 },
});
