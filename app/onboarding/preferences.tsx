import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { PillCTA } from '@/components/ui/PillCTA';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Back, Chevron } from '@/components/ui/Glyphs';
import {
  colors,
  spacing,
  typeScale,
  layout,
  motion,
  radii,
  shadows,
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
            <ProgressDots filled={4} />
            <View style={styles.backBtn} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.slow).delay(80)}
          style={styles.heading}
        >
          <Eyebrow uppercase color="primary" style={{ marginBottom: spacing.sm }}>
            step four
          </Eyebrow>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>
            what do you{'\n'}buy often?
          </Text>
          <Text
            style={[
              typeScale.body,
              { color: colors.secondary, marginTop: spacing.sm },
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
          label="continue"
          fullWidth
          disabled={!canContinue}
          iconRight={<Chevron size={16} color={colors.white} />}
          onPress={() => router.push('/onboarding/waste')}
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
  const useBlur = Platform.OS === 'ios' && !selected;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.chip, shadows.soft]}
    >
      {!selected && useBlur && (
        <>
          <BlurView intensity={18} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
        </>
      )}
      {!selected && !useBlur && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.92)' }]}
        />
      )}
      {selected && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(125,166,125,0.85)' },
          ]}
        />
      )}
      <View pointerEvents="none" style={styles.chipHighlight} />
      <Text
        style={[
          typeScale.titleS,
          { color: selected ? colors.white : colors.onSurface },
        ]}
      >
        {label}
      </Text>
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radii.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassInnerHighlight,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
  },
});
