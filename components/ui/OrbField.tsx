import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/tokens';

/**
 * v3 — gentle mint-dew morning gradient + 3 hairline leaf-veins as decoration.
 * Replaces the v2 rainbow orbs (user rejection: "все цвета радуги, блядь").
 * Monochromatic sage only, per Stitch reference sheet.
 *
 * Ref: code.html .bg-morning-gradient + .leaf-vein
 */
export const OrbField: React.FC = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <LinearGradient
      colors={gradients.morning}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {/* Three decorative leaf-veins at 30% opacity, slight rotations */}
    <View style={[styles.vein, styles.vein1]} />
    <View style={[styles.vein, styles.vein2]} />
    <View style={[styles.vein, styles.vein3]} />
  </View>
);

const styles = StyleSheet.create({
  vein: {
    position: 'absolute',
    left: -100,
    right: -100,
    height: 1,
    backgroundColor: colors.leafVein,
    opacity: 0.3,
  },
  vein1: {
    top: '25%',
    transform: [{ rotate: '-12deg' }],
  },
  vein2: {
    top: '52%',
    transform: [{ rotate: '6deg' }],
  },
  vein3: {
    top: '75%',
    transform: [{ rotate: '-6deg' }],
  },
});
