import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftInset } from './SoftInset';
import { colors, spacing, typeScale } from '@/constants/tokens';

const pillShadow = Platform.select({
  web: {
    boxShadow: '6px 6px 12px #cbd5e1, -6px -6px 12px #ffffff',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 6,
  },
});

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
              <View style={[styles.pillInactive, pillShadow]}>
                {label}
              </View>
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
    gap: spacing.xs,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillInactive: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#ECEDEF',
  },
});
