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
    // Was 32 — that pushed Poultry/Bakery/Pantry off-screen on a 402-pt
    // device with 4+ categories. 20 keeps tap-area generous while
    // letting 4 chips fit visibly inside the 402-pt viewport.
    paddingHorizontal: 20,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
