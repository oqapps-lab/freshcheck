import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Sprig, Chevron } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <View style={styles.brand}>
          <Sprig size={22} color={colors.primary} strokeWidth={1.4} />
          <Text style={[typeScale.label, { color: colors.primary, marginLeft: 8 }]}>
            freshcheck
          </Text>
        </View>

        <Animated.View entering={FadeIn.duration(motion.slow)} style={styles.illustration}>
          <View style={styles.illustrationDisc}>
            <Sprig size={72} color={colors.primary} strokeWidth={1.1} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(motion.slow).delay(120)} style={styles.text}>
          <Text
            style={[
              typeScale.displayL,
              { color: colors.onSurface, textAlign: 'center' },
            ]}
          >
            fresh or not?
          </Text>
          <Text
            style={[
              typeScale.titleM,
              { color: colors.secondary, textAlign: 'center', marginTop: 10 },
            ]}
          >
            a quiet check before the fridge bites back
          </Text>
          <Text
            style={[
              typeScale.body,
              {
                color: colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: spacing.lg,
                maxWidth: 300,
                alignSelf: 'center',
              },
            ]}
          >
            photograph anything in your kitchen — we'll tell you if it still
            wants to be used.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(260)}
          style={styles.cta}
        >
          <Eyebrow center uppercase style={{ marginBottom: 14 }}>
            ★ 4.5 · 12,400 families tend here
          </Eyebrow>
          <PillCTA
            label="get started"
            fullWidth
            iconRight={<Chevron size={16} color={colors.white} />}
            onPress={() => router.push('/onboarding/goal')}
          />
        </Animated.View>
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
  illustrationDisc: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 40,
    elevation: 6,
  },
  text: {
    width: '100%',
  },
  cta: {
    width: '100%',
  },
});
