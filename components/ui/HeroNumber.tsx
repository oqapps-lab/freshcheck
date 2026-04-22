import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { colors, typeScale } from '@/constants/tokens';

type Size = 'bloom' | 'xl' | 'l' | 'm' | 's';

type Props = {
  value: string | number;
  size?: Size;
  color?: keyof typeof colors;
  center?: boolean;
  style?: TextStyle;
};

/**
 * v3 — simple number display. No count-up (rejected as cheap).
 * size='bloom' — Verdict Bloom hero ("fresh" at 72pt)
 * size='xl'    — 40pt
 * size='l'     — 32pt
 * size='m'     — 24pt
 * size='s'     — 20pt
 *
 * Ref: code.html verdict bloom "fresh"
 */
export const HeroNumber: React.FC<Props> = ({
  value,
  size = 'xl',
  color = 'primary',
  center,
  style,
}) => {
  const scaleStyle =
    size === 'bloom'
      ? typeScale.verdictBloom
      : size === 'xl'
      ? typeScale.displayL
      : size === 'l'
      ? typeScale.displayM
      : size === 'm'
      ? typeScale.titleL
      : typeScale.titleM;

  return (
    <View style={[styles.row, center && styles.center]}>
      <Text style={[scaleStyle, { color: colors[color] }, style]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
});
