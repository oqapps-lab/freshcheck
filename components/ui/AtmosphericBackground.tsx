import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';
import { OrbField } from './OrbField';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

/**
 * Full-bleed wrapper for every screen.
 * Layer 1 — absolute fill. NEVER put inside ScrollView.
 *
 * Composition:
 *   <View bgcolor canvas>
 *     <OrbField />      ← three blurred radial orbs in corners
 *     {children}
 *   </View>
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.1 + §6
 */
export const AtmosphericBackground: React.FC<Props> = ({ children, style }) => (
  <View style={[styles.root, style]}>
    <OrbField />
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
