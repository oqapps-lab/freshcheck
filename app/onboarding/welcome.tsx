import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Sprig, Chevron } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion } from '@/constants/tokens';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.brand}>
          <Sprig size={20} color={colors.primary} strokeWidth={1.6} />
          <Text style={[typeScale.labelSmall, styles.brandLabel]}>FRESHCHECK</Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heroBlock}
        >
          <NeumorphicCard
            variant="raised"
            radius="full"
            padding={0}
            style={styles.heroDisc}
          >
            <View style={styles.heroDiscInner}>
              <Sprig size={84} color={colors.primary} strokeWidth={1.2} />
            </View>
          </NeumorphicCard>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(160)}
          style={styles.text}
        >
          <Text
            style={[
              typeScale.labelSmall,
              {
                color: colors.outline,
                textAlign: 'center',
                marginBottom: spacing.md,
                textTransform: 'uppercase',
              },
            ]}
          >
            STEP 1
          </Text>
          <Text
            style={[
              typeScale.displayL,
              { color: colors.ink, textAlign: 'center' },
            ]}
          >
            Welcome to FreshCheck
          </Text>
          <Text
            style={[
              typeScale.body,
              {
                color: colors.outline,
                textAlign: 'center',
                marginTop: spacing.md,
                maxWidth: 320,
                alignSelf: 'center',
              },
            ]}
          >
            a quiet check before the fridge bites back. snap a photo — we'll
            tell you if the food still wants to be used.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(240)}
          style={styles.cta}
        >
          <Text
            style={[
              typeScale.labelSmall,
              {
                color: colors.outline,
                textAlign: 'center',
                marginBottom: spacing.md,
                textTransform: 'uppercase',
              },
            ]}
          >
            ★ 4.5 · 12,400 FAMILIES TEND HERE
          </Text>
          <PillCTA
            label="Get Started"
            fullWidth
            iconRight={<Chevron size={16} color={colors.onAccent} />}
            onPress={() => router.push('/onboarding/goal')}
            accessibilityLabel="Get started"
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
  brandLabel: {
    color: colors.primary,
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  heroBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDisc: {
    width: 220,
    height: 220,
  },
  heroDiscInner: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: '100%',
  },
  cta: {
    width: '100%',
  },
});
