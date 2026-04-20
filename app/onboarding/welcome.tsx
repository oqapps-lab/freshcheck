import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TokenDot } from '@/components/ui/TokenDot';
import { Sprig } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, fonts } from '@/constants/tokens';

/**
 * Onboarding Welcome — /onboarding/welcome
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.6
 */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <View style={[styles.root, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        {/* Wordmark at top */}
        <View style={styles.brand}>
          <Sprig size={24} color={colors.sageInk} />
          <Text style={[typeScale.label, { color: colors.sageInk, marginLeft: 8 }]}>FreshCheck</Text>
        </View>

        {/* Illustration placeholder */}
        <View style={styles.illustration}>
          <Text style={{ fontSize: 160 }}>🍃</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={[typeScale.displayL, { color: colors.sageInk, textAlign: 'center' }]}>
            Fresh or not?
          </Text>
          <Text
            style={[
              typeScale.heroSerif,
              { color: colors.ink, textAlign: 'center', fontFamily: fonts.serifHero, marginTop: 6 },
            ]}
          >
            Find out in 3 seconds
          </Text>
          <Text
            style={[typeScale.body, { color: colors.inkMuted, textAlign: 'center', marginTop: spacing.md }]}
          >
            Photograph any food in your fridge — AI reads freshness in an instant.
          </Text>
        </View>

        {/* Social proof */}
        <View style={styles.socialProof}>
          <Eyebrow dotBefore>{'★ 4.5 · 12,400 families'}</Eyebrow>
        </View>

        {/* CTA + progress dots */}
        <View style={styles.ctaBlock}>
          <PillCTA
            label="Get started"
            fullWidth
            onPress={() => router.replace('/(tabs)')}
          />
          <View style={styles.dots}>
            <TokenDot tone="safe" size={8} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: colors.sageDim }} />
          </View>
          <Eyebrow center style={{ marginTop: 10 }}>Step 1 of 7</Eyebrow>
        </View>
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  illustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
  },
  socialProof: {
    alignItems: 'center',
  },
  ctaBlock: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.sm,
  },
});
