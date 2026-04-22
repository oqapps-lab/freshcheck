import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, layout, radii } from '@/constants/tokens';

export type IconButtonVariant = 'ghost' | 'filled' | 'surface';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = {
  icon: ReactNode;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: ViewStyle;
};

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const dim = SIZE[size];
  const handlePress = () => {
    if (disabled) return;
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={8}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { width: dim, height: dim },
        variantStyle[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const SIZE: Record<IconButtonSize, number> = {
  sm: 36,
  md: layout.touchTargetMin,
  lg: 56,
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  disabled: { opacity: 0.4 },
});

const variantStyle: Record<IconButtonVariant, ViewStyle> = {
  ghost: { backgroundColor: 'transparent' },
  surface: { backgroundColor: colors.surface },
  filled: { backgroundColor: colors.primaryContainer },
};
