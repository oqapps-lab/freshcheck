import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, Tone, toneColor } from '@/constants/tokens';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tone?: Tone;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

/**
 * Filter / tag pill. Interactive when onPress provided.
 * Active state uses primaryFixed background + semibold text.
 */
export function Chip({
  label,
  active = false,
  onPress,
  tone = 'safe',
  style,
  accessibilityLabel,
}: ChipProps) {
  const handlePress = () => {
    if (!onPress) return;
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  const bg = active ? toneColor[tone].fill : colors.surfaceMuted;
  const textColor = active ? toneColor[tone].text : colors.textSecondary;
  const interactive = !!onPress;

  return (
    <Pressable
      disabled={!interactive}
      accessibilityRole={interactive ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={interactive ? { selected: active } : undefined}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg },
        pressed && interactive && styles.pressed,
        style,
      ]}
    >
      <Text variant="label" style={{ color: textColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
