import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { radii, typeScale, toneColor, Tone } from '@/constants/tokens';

type Props = {
  verdict?: Tone;
  label?: string;
  small?: boolean;
  style?: ViewStyle;
};

/**
 * v4 — solid tone-fill chip. No gradient, no icon, no border.
 *
 * Background = toneColor[verdict].fill
 * Text       = toneColor[verdict].text
 * Label      = `label ?? verdict.toUpperCase()`
 *
 * Ref: docs/06-design/DESIGN-V4.md
 */
export const VerdictPill: React.FC<Props> = ({
  verdict = 'fresh',
  label,
  small,
  style,
}) => {
  const t = toneColor[verdict];
  const text = label ?? verdict.toUpperCase();

  return (
    <View
      style={[
        styles.pill,
        {
          paddingHorizontal: small ? 10 : 12,
          paddingVertical: small ? 4 : 6,
          backgroundColor: t.fill,
        },
        style,
      ]}
    >
      <Text style={[small ? typeScale.labelSmall : typeScale.label, { color: t.text }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
});
