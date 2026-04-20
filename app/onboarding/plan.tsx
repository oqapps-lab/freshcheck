import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check, Sprig } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
} from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

const steps = [
  'tuning your categories',
  "calculating what's been slipping away",
  'pairing recipes to your fridge',
];

const STEP_DELAY = 900;
const TOTAL_MS = steps.length * STEP_DELAY + 800; // reveal + ~4s total
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
            <View style={styles.sprigDisc}>
              <Sprig size={36} color={colors.primary} strokeWidth={1.3} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(motion.slow).delay(80)}
            style={{ alignItems: 'center', marginTop: spacing.xl }}
          >
            <Eyebrow uppercase color="primary">
              step six
            </Eyebrow>
            <Text
              style={[
                typeScale.displayM,
                {
                  color: colors.onSurface,
                  textAlign: 'center',
                  marginTop: spacing.sm,
                },
              ]}
            >
              tending to{'\n'}your kitchen…
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
                          : 'rgba(255,255,255,0.6)',
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
                        color: isDone ? colors.onSurface : colors.secondary,
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
              <GlassCard variant="glass" radius="xl" padding={spacing.xl}>
                <Eyebrow uppercase color="primary" style={{ marginBottom: 6 }}>
                  the real cost
                </Eyebrow>
                <Text style={[typeScale.displayL, { color: colors.primary }]}>
                  $2,913
                </Text>
                <Text
                  style={[
                    typeScale.body,
                    { color: colors.onSurface, marginTop: 4 },
                  ]}
                >
                  a year is lost by the average family
                </Text>
                <Text
                  style={[
                    typeScale.bodySmall,
                    { color: colors.secondary, marginTop: spacing.sm },
                  ]}
                >
                  freshcheck can help you keep most of that.
                </Text>
              </GlassCard>
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
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 4,
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
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
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
});
