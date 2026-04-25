import React from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, typeScale, shadows } from '@/constants/tokens';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
  style?: ViewStyle;
};

/**
 * Stitch-style chip filter row: All / Produce / Dairy.
 * Selected option is a raised neumorphic pill; unselected is canvas-tinted
 * with `outline`-color label. Whole row sits on `canvasMist` track.
 */
export function SegmentedControl<T extends string>({ options, value, onChange, style }: Props<T>) {
  return (
    <View style={[styles.track, style]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              if (opt.value === value) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(opt.value);
            }}
            accessibilityRole="button"
            accessibilityLabel={opt.label}
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && [styles.chipActive, shadows.soft]]}
          >
            <Text
              style={[
                typeScale.titleM,
                styles.chipLabel,
                active ? styles.chipLabelActive : styles.chipLabelInactive,
              ]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.canvasMist,
    borderRadius: radii.full,
    padding: 4,
    gap: 4,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  chipActive: {
    backgroundColor: colors.surface,
  },
  chipLabel: {
    fontSize: 14,
  },
  chipLabelActive: {
    color: colors.onSurface,
  },
  chipLabelInactive: {
    color: colors.outline,
  },
});
