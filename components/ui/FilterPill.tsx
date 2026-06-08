import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { SoftInset } from './SoftInset';
import { colors, spacing, typeScale } from '@/constants/tokens';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (next: T) => void;
};

/**
 * FilterPillRow — horizontal row of neomorph-pill filter pills.
 * Active pill = neomorph-pill-active (RECESSED). Inactive = neomorph-pill (RAISED).
 * Stitch CSS values: px-8 py-3 font-bold text-sm tracking-wide.
 */
export function FilterPillRow<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        const label = (
          <Text
            numberOfLines={1}
            style={[
              typeScale.titleSmall,
              { color: active ? colors.ink : colors.inkSecondary },
            ]}
          >
            {opt.label}
          </Text>
        );

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
          >
            {active ? (
              <SoftInset
                radius="full"
                strength="thin"
                contentStyle={styles.pill}
              >
                {label}
              </SoftInset>
            ) : (
              <SoftSurface variant="pill" radius="full" innerStyle={styles.pill}>
                {label}
              </SoftSurface>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pill: {
    paddingVertical: 10,
    // 393-pt iPhone 17 Pro viewport minus 24pt screen padding × 2 = 345pt
    // available. With paddingH 16 + minWidth 64, "All / Produce / Dairy /
    // Poultry" fits at ~338pt with no clipping. Smoke-test 2026-04-28
    // saw "Poultr" cut off at paddingH=20.
    paddingHorizontal: 16,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
