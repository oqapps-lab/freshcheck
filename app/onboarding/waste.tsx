import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { Back, Check } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

type Frequency = 'daily' | 'weekly-few' | 'weekly-once' | 'rarely';
type Accent = 'sage' | 'amber' | 'coral';

type Option = {
  key: Frequency;
  label: string;
  sublabel: string;
  accent?: Accent;
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

const accentDotColor = (accent?: Accent) => {
  if (accent === 'amber') return colors.verdictWarn;
  if (accent === 'coral') return colors.verdictDanger;
  return colors.verdictSafe;
};

export default function WasteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Frequency | null>(null);

  const handleSelect = (key: Frequency) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected(key);
    setTimeout(() => router.push('/onboarding/plan'), 120);
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
            <ProgressDots filled={5} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 5</Text>
          <Text style={[typeScale.displayL, { color: colors.ink, marginTop: spacing.sm }]}>
            How Often Does Food Get Tossed?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.outline, marginTop: spacing.sm },
            ]}
          >
            honest answer, not the polite one. just us.
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
                      <View
                        style={[
                          styles.accentDot,
                          { backgroundColor: accentDotColor(opt.accent) },
                        ]}
                      />
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
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: radii.full,
    marginRight: spacing.md,
  },
});
