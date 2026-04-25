import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import {
  Back,
  Sprig,
  Droplet,
  Heart,
  ChefHat,
  Check,
} from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

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
  const [selected, setSelected] = useState<Goal | null>(null);

  const handleSelect = (key: Goal) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(key);
    setTimeout(() => router.push('/onboarding/family-size'), 120);
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
            >
              <NeumorphicCard variant="raised" radius="full" padding={0} style={styles.backBtn}>
                <View style={styles.backBtnInner}>
                  <Back size={18} color={colors.ink} strokeWidth={1.8} />
                </View>
              </NeumorphicCard>
            </Pressable>
            <ProgressDots filled={2} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 2</Text>
          <Text style={[typeScale.displayL, { color: colors.ink, marginTop: spacing.sm }]}>
            What's Your Goal?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.outline, marginTop: spacing.sm },
            ]}
          >
            pick the one that feels closest. we'll lean into it.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(160)}
          style={styles.optionsList}
        >
          {options.map((opt, i) => {
            const isSelected = selected === opt.key;
            return (
              <Animated.View
                key={opt.key}
                entering={FadeIn.duration(motion.slow).delay(220 + i * 60)}
                style={{ marginBottom: spacing.sm }}
              >
                <Pressable
                  onPress={() => handleSelect(opt.key)}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  accessibilityState={{ selected: isSelected }}
                >
                  <NeumorphicCard
                    variant="raised"
                    radius="md"
                    padding={20}
                    style={isSelected ? styles.optionCardSelected : styles.optionCard}
                  >
                    <View style={styles.optionRow}>
                      <View style={styles.iconWrap}>{opt.icon}</View>
                      <View style={{ flex: 1 }}>
                        <Text style={[typeScale.titleM, { color: colors.ink }]}>
                          {opt.label}
                        </Text>
                        <Text
                          style={[
                            typeScale.bodySmall,
                            { color: colors.outline, marginTop: 2 },
                          ]}
                        >
                          {opt.sublabel}
                        </Text>
                      </View>
                      {isSelected ? (
                        <Check size={20} color={colors.primary} strokeWidth={2} />
                      ) : null}
                    </View>
                  </NeumorphicCard>
                </Pressable>
              </Animated.View>
            );
          })}
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
  },
  heading: {
    marginBottom: spacing.xxl,
  },
  optionsList: {
    width: '100%',
  },
  optionCard: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});
