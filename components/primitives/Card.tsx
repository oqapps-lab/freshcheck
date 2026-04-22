import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadows, spacing } from '@/constants/tokens';

export type CardVariant = 'default' | 'elevated' | 'muted' | 'flat';

export type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padded?: boolean;
};

export function Card({
  children,
  variant = 'default',
  style,
  padded = true,
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        padded && styles.padded,
        variantStyle[variant],
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.md,
  },
});

const variantStyle: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    ...shadows.panel,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  flat: {
    backgroundColor: colors.surface,
  },
};
