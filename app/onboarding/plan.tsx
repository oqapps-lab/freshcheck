import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Check, Sprig } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  radii,
} from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

const steps = [
  'tuning your categories',
  "calculating what's been slipping away",
  'pairing recipes to your fridge',
];

const STEP_DELAY = 900;
const TOTAL_MS = steps.length * STEP_DELAY + 800;
const ADVANCE_MS = 4600;

export default function PlanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [completed, setCompleted] = useState(0);
  const [showReveal, setShowReveal] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      timers.push(
        setTimeout(() => setCompleted((c) => Math.max(c, i + 1)), STEP_DELAY * (i + 1))
      );
    });
    timers.push(setTimeout(() => setShowReveal(true), TOTAL_MS));
    timers.push(setTimeout(() => router.replace('/onboarding/demo'), ADVANCE_MS));
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [router]);

  return (
    <AtmosphericBackground>
      <View
        style={[
          styles.root,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 40,
          },
        ]}
      >
        <View style={styles.topRow}>
          <ProgressDots filled={6} />
        </View>

        <View style={styles.center}>
          <Animated.View entering={FadeIn.duration(motion.moderate)}>
            <NeumorphicCard
              variant="raised"
              radius="full"
              padding={0}
              style={styles.sprigDisc}
            >
              <View style={styles.sprigDiscInner}>
                <Sprig size={36} color={colors.primary} strokeWidth={1.3} />
              </View>
            </NeumorphicCard>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(motion.slow).delay(80)}
            style={{ alignItems: 'center', marginTop: spacing.xl }}
          >
            <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 6</Text>
            <Text
              style={[
                typeScale.displayL,
                {
                  color: colors.ink,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                },
              ]}
            >
              Tending to Your Kitchen
            </Text>
          </Animated.View>

          <View style={styles.stepsWrap}>
            {steps.map((label, i) => {
              const isDone = i < completed;
              return (
                <Animated.View
                  key={label}
                  entering={FadeIn.duration(motion.moderate).delay(200 + i * 140)}
                  style={styles.stepRow}
                >
                  <View
                    style={[
                      styles.check,
                      {
                        backgroundColor: isDone
                          ? colors.primaryFixed
                          : colors.surfaceLow,
                      },
                    ]}
                  >
                    {isDone ? (
                      <Check size={16} color={colors.primary} strokeWidth={2} />
                    ) : (
                      <View style={styles.pendingDot} />
                    )}
                  </View>
                  <Text
                    style={[
                      typeScale.titleS,
                      {
                        color: isDone ? colors.ink : colors.outline,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </Animated.View>
              );
            })}
          </View>

          {showReveal && (
            <Animated.View
              entering={FadeInDown.duration(motion.slow).springify().damping(16)}
              style={styles.revealWrap}
            >
              <NeumorphicCard variant="raised" radius="lg" padding={spacing.xl}>
                <Text style={[typeScale.labelSmall, styles.revealEyebrow]}>
                  THE REAL COST
                </Text>
                <Text
                  style={[
                    typeScale.displayL,
                    { color: colors.primary, marginTop: 6 },
                  ]}
                >
                  $2,913
                </Text>
                <Text
                  style={[
                    typeScale.body,
                    { color: colors.ink, marginTop: 4 },
                  ]}
                >
                  a year is lost by the average family
                </Text>
                <Text
                  style={[
                    typeScale.bodySmall,
                    { color: colors.outline, marginTop: spacing.sm },
                  ]}
                >
                  freshcheck can help you keep most of that.
                </Text>
              </NeumorphicCard>
            </Animated.View>
          )}
        </View>
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprigDisc: {
    width: 88,
    height: 88,
  },
  sprigDiscInner: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  stepsWrap: {
    marginTop: spacing.huge,
    alignSelf: 'stretch',
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outlineVariant,
  },
  revealWrap: {
    marginTop: spacing.xxl,
    alignSelf: 'stretch',
  },
  revealEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
});
