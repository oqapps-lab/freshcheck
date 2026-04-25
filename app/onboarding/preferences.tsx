import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { PillCTA } from '@/components/ui/PillCTA';
import { Back, Chevron, Check } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  radii,
} from '@/constants/tokens';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

type Pref =
  | 'meat'
  | 'fish'
  | 'dairy'
  | 'fruits'
  | 'vegetables'
  | 'bread'
  | 'prepared'
  | 'frozen';

const chips: { key: Pref; label: string }[] = [
  { key: 'meat', label: 'meat' },
  { key: 'fish', label: 'fish' },
  { key: 'dairy', label: 'dairy' },
  { key: 'fruits', label: 'fruits' },
  { key: 'vegetables', label: 'vegetables' },
  { key: 'bread', label: 'bread' },
  { key: 'prepared', label: 'prepared' },
  { key: 'frozen', label: 'frozen' },
];

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<Set<Pref>>(new Set());

  const toggle = (key: Pref) => {
    Haptics.selectionAsync().catch(() => {});
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const canContinue = selected.size > 0;

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 140,
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
            <ProgressDots filled={4} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>STEP 4</Text>
          <Text style={[typeScale.displayL, { color: colors.ink, marginTop: spacing.sm }]}>
            What Do You Buy Often?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.outline, marginTop: spacing.sm },
            ]}
          >
            pick a few — no right answers. just so we know where to look.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(160)}
          style={styles.chipsWrap}
        >
          {chips.map((c) => {
            const on = selected.has(c.key);
            return (
              <Chip
                key={c.key}
                label={c.label}
                selected={on}
                onPress={() => toggle(c.key)}
              />
            );
          })}
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
          label="Continue"
          fullWidth
          disabled={!canContinue}
          iconRight={<Chevron size={16} color={colors.onAccent} />}
          onPress={() => router.push('/onboarding/waste')}
          accessibilityLabel="continue"
        />
      </View>
    </AtmosphericBackground>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

const Chip: React.FC<ChipProps> = ({ label, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <NeumorphicCard
        variant={selected ? 'flat' : 'raised'}
        radius="full"
        padding={0}
        style={selected ? styles.chipSelected : styles.chip}
      >
        <View style={styles.chipInner}>
          {selected ? (
            <View style={styles.chipCheckWrap}>
              <Check size={14} color={colors.primary} strokeWidth={2.2} />
            </View>
          ) : null}
          <Text
            style={[
              typeScale.titleS,
              { color: selected ? colors.primary : colors.ink },
            ]}
          >
            {label}
          </Text>
        </View>
      </NeumorphicCard>
    </Pressable>
  );
};

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
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryFixed,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radii.full,
  },
  chipCheckWrap: {
    marginRight: 8,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
  },
});
