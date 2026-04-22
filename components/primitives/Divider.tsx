import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '@/constants/tokens';

export type DividerProps = {
  spacingY?: keyof typeof spacing;
  inset?: number;
  style?: ViewStyle;
};

/**
 * Hairline divider. Used only when tonal shift isn't possible.
 * DESIGN-GUIDE §4: "NO 1px solid borders" — prefer Card layering first.
 */
export function Divider({ spacingY = 'md', inset = 0, style }: DividerProps) {
  return (
    <View
      style={[
        styles.base,
        {
          marginVertical: spacing[spacingY],
          marginHorizontal: inset,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },
});
