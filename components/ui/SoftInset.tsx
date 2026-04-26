import React from 'react';
import { View, ViewProps, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, insetRim } from '@/constants/tokens';

type RadiusKey = keyof typeof radii;
type Strength = 'thin' | 'medium' | 'thick';

type Props = ViewProps & {
  radius?: RadiusKey | number;
  /** thin → matches CSS `inset 4/4/8` (pill-active). thick → `inset 8/8/16` (cushion-recessed). */
  strength?: Strength;
  /** Background colour of the recessed surface. Should match parent canvas. */
  background?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * SoftInset — PRESSED / RECESSED neumorphic surface.
 *
 * Stitch CSS:
 *   .neomorph-recessed    inset 8/8/16 #cbd5e1, inset -8/-8/16 #fff
 *   .neomorph-pill-active inset 4/4/8  #cbd5e1, inset -4/-4/8  #fff
 *
 * React Native does NOT support `box-shadow: inset`, so we paint the rim
 * with four LinearGradient slabs along the inside edges of an
 * `overflow: hidden` container:
 *
 *   ▓▓▓▓▓▓▓▓▓▓ top    — slate→transparent (shadow falls IN from top)
 *   ▓        ▓ left   — slate→transparent (shadow IN from left)
 *   ▓ content ▓
 *   ▓        ▓ right  — transparent→white (highlight IN from right)
 *   ▒▒▒▒▒▒▒▒▒▒ bottom — transparent→white (highlight from bottom)
 *
 * The strength prop controls slab thickness (matches the CSS blur/spread).
 */
export function SoftInset({
  radius = 'xxl',
  strength = 'thick',
  background = colors.canvas,
  style,
  contentStyle,
  children,
  ...rest
}: Props) {
  const r = typeof radius === 'number' ? radius : radii[radius];
  const w = insetRim[strength];

  return (
    <View
      {...rest}
      style={[
        styles.container,
        { borderRadius: r, backgroundColor: background },
        style,
      ]}
    >
      {/* Top slate shadow — extends with soft alpha falloff */}
      <LinearGradient
        colors={[colors.shadowDark, 'rgba(203,213,225,0.3)', 'transparent']}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.edge, styles.edgeTop, { height: w * 1.5 }]}
        pointerEvents="none"
      />
      {/* Left slate shadow */}
      <LinearGradient
        colors={[colors.shadowDark, 'rgba(203,213,225,0.3)', 'transparent']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.edge, styles.edgeLeft, { width: w * 1.5 }]}
        pointerEvents="none"
      />
      {/* Bottom white highlight */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.5)', colors.shadowLight]}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.edge, styles.edgeBottom, { height: w * 1.5 }]}
        pointerEvents="none"
      />
      {/* Right white highlight */}
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.5)', colors.shadowLight]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.edge, styles.edgeRight, { width: w * 1.5 }]}
        pointerEvents="none"
      />
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    position: 'relative',
    zIndex: 0,
  },
  edge: {
    position: 'absolute',
    zIndex: 1,
  },
  edgeTop: { top: 0, left: 0, right: 0 },
  edgeLeft: { top: 0, left: 0, bottom: 0 },
  edgeBottom: { left: 0, right: 0, bottom: 0 },
  edgeRight: { top: 0, right: 0, bottom: 0 },
});
