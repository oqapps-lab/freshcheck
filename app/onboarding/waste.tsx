import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { OptionCard } from '@/components/onboarding/OptionCard';

type Frequency = 'daily' | 'weekly-few' | 'weekly-once' | 'rarely';

type Option = {
  key: Frequency;
  label: string;
  sublabel: string;
  accent?: 'sage' | 'amber' | 'coral';
};

const options: Option[] = [
  {
    key: 'daily',
    label: 'almost every day',
    sublabel: 'something slips through most of the time',
    accent: 'coral',
  },
  {
    key: 'weekly-few',
    label: '2–3 times a week',
    sublabel: 'a steady trickle of tossed things',
    accent: 'amber',
  },
  {
    key: 'weekly-once',
    label: 'about once a week',
    sublabel: 'one small forgetting per week',
  },
  {
    key: 'rarely',
    label: 'rarely',
    sublabel: 'almost everything gets used up',
  },
];

export default function WasteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSelect = (_key: Frequency) => {
    router.push('/onboarding/plan');
  };

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
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
            <ProgressDots filled={5} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Eyebrow uppercase color="primary" style={{ marginBottom: spacing.sm }}>
            step five
          </Eyebrow>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>
            how often do you{'\n'}throw out food?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, marginTop: spacing.sm },
            ]}
          >
            honest answer, not the polite one. just us.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(160)}
          style={styles.optionsList}
        >
          {options.map((opt, i) => (
            <Animated.View
              key={opt.key}
              entering={FadeIn.duration(motion.slow).delay(220 + i * 60)}
              style={{ marginBottom: spacing.sm }}
            >
              <OptionCard
                label={opt.label}
                sublabel={opt.sublabel}
                accent={opt.accent}
                onPress={() => handleSelect(opt.key)}
              />
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
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
  },
  optionsList: {
    width: '100%',
  },
});
