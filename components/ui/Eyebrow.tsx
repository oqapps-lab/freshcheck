import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { colors, typeScale } from '@/constants/tokens';

type Props = {
  children: string;
  color?: keyof typeof colors;
  style?: TextStyle;
  center?: boolean;
  uppercase?: boolean; // opt-in UPPERCASE only for section-title eyebrows (Stitch uses it there)
};

/**
 * v3 — small tracked label. Sentence-case by default (lowercase copy rule).
 * Opt into uppercase only for section titles like "1. MORNING GREETING".
 *
 * Ref: code.html section-title h2 (uppercase) + section body (sentence)
 */
export const Eyebrow: React.FC<Props> = ({
  children,
  color = 'outline',
  style,
  center,
  uppercase,
}) => (
  <View style={[center && styles.center]}>
    <Text
      style={[
        typeScale.labelSmall,
        {
          color: colors[color],
          textTransform: uppercase ? 'uppercase' : 'none',
          letterSpacing: uppercase ? 2 : 0.8,
        },
        style,
      ]}
    >
      {children}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
});
