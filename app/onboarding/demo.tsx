import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, Chevron, Sprig } from '@/components/ui/Glyphs';
import {
  colors,
  gradients,
  spacing,
  typeScale,
  layout,
  motion,
} from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

export default function DemoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 120,
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
              style={styles.backBtn}
            >
              <Back size={22} color={colors.primary} strokeWidth={1.6} />
            </Pressable>
            <ProgressDots filled={7} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Eyebrow uppercase color="primary" style={{ marginBottom: spacing.sm }}>
            a first glance
          </Eyebrow>
          <Text
            style={[
              typeScale.displayM,
              { color: colors.onSurface, textAlign: 'center' },
            ]}
          >
            here's what{'\n'}a check looks like
          </Text>
        </Animated.View>

        {/* Mini Verdict Bloom */}
        <Animated.View
          entering={FadeInDown.duration(motion.slow).delay(180).springify().damping(16)}
          style={styles.bloomWrap}
        >
          <View style={styles.bloomDisc}>
            <LinearGradient
              colors={gradients.verdictBloom}
              start={{ x: 0.5, y: 0.2 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.bloomInner}>
              <View style={styles.sprigBadge}>
                <Sprig size={18} color={colors.primary} strokeWidth={1.6} />
              </View>
              <Text style={[typeScale.verdictBloom, styles.bloomText]}>fresh</Text>
            </View>
          </View>

          <View style={styles.bloomMeta}>
            <Text style={[typeScale.titleM, { color: colors.onSurface }]}>
              strawberry
            </Text>
            <Text
              style={[
                typeScale.body,
                { color: colors.secondary, marginTop: 2 },
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
          <GlassCard variant="glass" radius="xl" padding={spacing.lg}>
            <Eyebrow uppercase color="primary" style={{ marginBottom: 6 }}>
              the quiet note
            </Eyebrow>
            <Text style={[typeScale.body, { color: colors.onSurface }]}>
              a photo. a verdict. nothing to throw away that didn't need to go.
              this is every scan.
            </Text>
          </GlassCard>
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
          label="scan my own food"
          fullWidth
          iconRight={<Chevron size={16} color={colors.white} />}
          onPress={() => router.push('/paywall')}
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
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 120,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 8,
  },
  bloomInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprigBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  bloomText: {
    color: colors.primary,
  },
  bloomMeta: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
  },
});
