import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, spacing, Tone, toneColor } from '@/constants/tokens';
import { Text } from './Text';

export type EyebrowProps = {
  label: string;
  tone?: Tone;
  style?: ViewStyle;
};

/**
 * Small pill-shaped marker above a heading.
 * Not ALL-CAPS — DESIGN-GUIDE forbids all-caps typography.
 */
export function Eyebrow({ label, tone = 'safe', style }: EyebrowProps) {
  const pal = toneColor[tone];
  return (
    <View style={[styles.pill, { backgroundColor: pal.fill }, style]}>
      <View style={[styles.dot, { backgroundColor: pal.dot }]} />
      <Text variant="labelSmall" style={{ color: pal.text ?? colors.textPrimary }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
  },
});
