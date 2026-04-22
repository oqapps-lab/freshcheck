import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '@/constants/tokens';
import { Text, TextTone } from './Text';

export type StatProps = {
  label: string;
  value: string | number;
  caption?: string;
  tone?: TextTone;
  align?: 'left' | 'center';
  style?: ViewStyle;
};

/**
 * Small numerical block — label above, big value below, optional caption.
 * Used inside Card or rows. Label is semantic metadata (e.g. "Color", "Expires in").
 */
export function Stat({
  label,
  value,
  caption,
  tone = 'primary',
  align = 'left',
  style,
}: StatProps) {
  return (
    <View style={[styles.wrap, align === 'center' && styles.center, style]}>
      <Text variant="labelSmall" tone="secondary">
        {label}
      </Text>
      <Text variant="titleL" tone={tone} tabularNumbers>
        {String(value)}
      </Text>
      {caption ? (
        <Text variant="caption" tone="secondary">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xxs },
  center: { alignItems: 'center' },
});
