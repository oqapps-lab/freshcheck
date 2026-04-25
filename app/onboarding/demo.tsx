import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Chevron, Sprig } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  radii,
} from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { ensureNotificationPermission } from '@/src/lib/notifications';

export default function DemoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 200,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)}>
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="back"
            >
              <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.backBtn}>
                <View style={styles.backBtnInner}>
                  <Back size={18} color={colors.ink} strokeWidth={1.8} />
                </View>
              </NeumorphicCard>
            </Pressable>
            <ProgressDots filled={7} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 7</Text>
          <Text
            style={[
              typeScale.displayL,
              { color: colors.ink, textAlign: 'center', marginTop: spacing.sm },
            ]}
          >
            Here's What a Check Looks Like
          </Text>
        </Animated.View>

        {/* Verdict Bloom — neumorphic disc with sage face + "Fresh" */}
        <Animated.View
          entering={FadeInDown.duration(motion.slow).delay(180).springify().damping(16)}
          style={styles.bloomWrap}
        >
          <NeumorphicCard
            variant="raised"
            radius="full"
            padding={0}
            style={styles.bloomDisc}
          >
            <View style={styles.bloomFace}>
              <View style={styles.sprigBadge}>
                <Sprig size={20} color={colors.primary} strokeWidth={1.6} />
              </View>
              <Text style={[typeScale.displayL, styles.bloomText]}>Fresh</Text>
            </View>
          </NeumorphicCard>

          <View style={styles.bloomMeta}>
            <Text style={[typeScale.titleM, { color: colors.ink }]}>
              strawberry
            </Text>
            <Text
              style={[
                typeScale.body,
                { color: colors.outline, marginTop: 2 },
              ]}
            >
              92% sure · good for another 3 days
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(360)}
          style={{ marginTop: spacing.xl }}
        >
          <NeumorphicCard variant="raised" radius="md" padding={20}>
            <Text style={[typeScale.labelSmall, styles.cardEyebrow]}>
              THE QUIET NOTE
            </Text>
            <Text
              style={[
                typeScale.body,
                { color: colors.ink, marginTop: 6 },
              ]}
            >
              a photo. a verdict. nothing to throw away that didn't need to go.
              this is every scan.
            </Text>
          </NeumorphicCard>
        </Animated.View>
      </ScrollView>

      <View
        style={[
          styles.floatingCta,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        pointerEvents="box-none"
      >
        <PillCTA
          label="Scan My Own Food"
          fullWidth
          iconRight={<Chevron size={16} color={colors.onAccent} />}
          onPress={async () => {
            // Best-effort: ask for notif permission here so the paywall
            // stays distraction-free. Swallow errors silently — the
            // manager retries later when fridge items appear.
            void ensureNotificationPermission().catch(() => {});
            router.push('/paywall');
          }}
          accessibilityLabel="scan my own food"
        />
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  heading: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  bloomWrap: {
    alignItems: 'center',
  },
  bloomDisc: {
    width: 240,
    height: 240,
  },
  bloomFace: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: radii.full,
  },
  sprigBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bloomText: {
    color: colors.ink,
  },
  bloomMeta: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  cardEyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
  },
});
