import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, layout, radii, spacing } from '@/constants/tokens';
import { Text, TextVariant, TextTone } from './Text';

export type GhostButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  tone?: TextTone;
  variant?: 'text' | 'outlined';
  textVariant?: TextVariant;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function GhostButton({
  label,
  onPress,
  disabled,
  tone = 'primary',
  variant = 'text',
  textVariant = 'label',
  accessibilityLabel,
  style,
}: GhostButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'outlined' && styles.outlined,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text variant={textVariant} tone={disabled ? 'muted' : tone} align="center">
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touchTargetMin,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
});
