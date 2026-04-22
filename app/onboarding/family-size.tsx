import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, User, Heart, Sprig } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { OptionCard } from '@/components/onboarding/OptionCard';

type Family = 'solo' | 'couple' | 'family' | 'big';

type Option = {
  key: Family;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
};

const options: Option[] = [
  {
    key: 'solo',
    label: 'just me',
    sublabel: 'one kitchen, one mouth to feed',
    icon: <User size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'couple',
    label: 'a couple',
    sublabel: 'two of us share the groceries',
    icon: <Heart size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'family',
    label: 'family with kids',
    sublabel: 'little eaters, big opinions',
    icon: <Sprig size={22} color={colors.primary} strokeWidth={1.6} />,
  },
  {
    key: 'big',
    label: 'big family (5+)',
    sublabel: 'the fridge never rests',
    icon: <User size={22} color={colors.primary} strokeWidth={1.6} />,
  },
];

export default function FamilySizeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleSelect = (_key: Family) => {
    router.push('/onboarding/preferences');
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
            <ProgressDots filled={3} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Eyebrow uppercase color="primary" style={{ marginBottom: spacing.sm }}>
            step three
          </Eyebrow>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>
            who are you{'\n'}checking food for?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, marginTop: spacing.sm },
            ]}
          >
            so the numbers land right when we show you what's saved.
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
