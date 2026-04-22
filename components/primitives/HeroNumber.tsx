import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing, Tone, toneColor } from '@/constants/tokens';
import { Text } from './Text';

export type HeroNumberProps = {
  value: number | string;
  unit?: string;
  caption?: string;
  tone?: Tone;
  style?: ViewStyle;
};

export function HeroNumber({
  value,
  unit,
  caption,
  tone = 'safe',
  style,
}: HeroNumberProps) {
  const color = toneColor[tone].accent;
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
        <Text variant="display" tabularNumbers style={{ color }}>
          {String(value)}
        </Text>
        {unit ? (
          <Text variant="h2" style={[styles.unit, { color }]}>
            {unit}
          </Text>
        ) : null}
      </View>
      {caption ? (
        <Text variant="label" tone="secondary" align="center">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xxs },
  unit: { marginBottom: spacing.xs },
});
