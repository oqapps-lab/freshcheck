import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  children: React.ReactNode;
  tone?: 'light' | 'tinted';
  style?: ViewStyle;
};

/**
 * v4 — Paper & Pith. Calm flat warm-cream canvas.
 *
 * Drops the v3 morning gradient + OrbField. Just a full-bleed View
 * with the canvas background. `tone='tinted'` switches to canvasMist
 * for the rare nested/section surface case.
 *
 * Ref: docs/06-design/DESIGN-V4.md
 */
export const AtmosphericBackground: React.FC<Props> = ({
  children,
  tone = 'light',
  style,
}) => (
  <View
    style={[
      styles.root,
      { backgroundColor: tone === 'tinted' ? colors.canvasMist : colors.canvas },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
