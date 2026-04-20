import React from 'react';
import { Text, View, StyleSheet, TextStyle } from 'react-native';
import { colors, typeScale } from '@/constants/tokens';

type Props = {
  children: string;
  color?: keyof typeof colors;
  dotBefore?: boolean;
  style?: TextStyle;
  center?: boolean;
};

/**
 * Small tracked label — "Your kitchen · Tuesday", "Recent activity".
 * Sentence-case tracked (NOT uppercase — per design rule).
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §3.2 (eyebrow) + §5.7
 */
export const Eyebrow: React.FC<Props> = ({ children, color = 'inkDim', dotBefore, style, center }) => (
  <View style={[styles.row, center && styles.center]}>
    {dotBefore && <View style={[styles.dot, { backgroundColor: colors.sageInk }]} />}
    <Text style={[typeScale.eyebrow, { color: colors[color] }, style]}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
});
