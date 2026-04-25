import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Back, User, Heart, Sprig, Check } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

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
  const [selected, setSelected] = useState<Family | null>(null);

  const handleSelect = (key: Family) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(key);
    setTimeout(() => router.push('/onboarding/preferences'), 120);
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
            <ProgressDots filled={3} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 3</Text>
          <Text style={[typeScale.displayL, { color: colors.ink, marginTop: spacing.sm }]}>
            Who Are You Feeding?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.outline, marginTop: spacing.sm },
            ]}
          >
            so the numbers land right when we show you what's saved.
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
    width: 44,
    height: 44,
  },
  backBtnInner: {
    width: 44,
    height: 44,
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
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
});
