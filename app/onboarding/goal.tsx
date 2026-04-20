import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { Eyebrow } from '@/components/ui/Eyebrow';
import {
  Back,
  Sprig,
  Droplet,
  Heart,
  ChefHat,
} from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { OptionCard } from '@/components/onboarding/OptionCard';

type Goal = 'safety' | 'waste' | 'money' | 'recipes';

type Option = {
  key: Goal;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
};

const options: Option[] = [
  {
    key: 'safety',
    label: 'family safety',
    sublabel: 'nobody eats anything questionable',
    icon: <Heart size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'waste',
    label: 'less food waste',
    sublabel: 'stop tossing things we forgot about',
    icon: <Sprig size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'money',
    label: 'save money',
    sublabel: 'grocery budget stays where it should',
    icon: <Droplet size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'recipes',
    label: 'recipes from leftovers',
    sublabel: 'something to cook with what is here',
    icon: <ChefHat size={22} color={colors.primary} strokeWidth={1.6} />,
  },
];

export default function GoalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSelect = (_key: Goal) => {
    router.push('/onboarding/family-size');
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
            <ProgressDots filled={2} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Eyebrow uppercase color="primary" style={{ marginBottom: spacing.sm }}>
            step two
          </Eyebrow>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>
            what matters most{'\n'}to you?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, marginTop: spacing.sm },
            ]}
          >
            pick the one that feels closest. we'll lean into it.
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
                icon={opt.icon}
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
