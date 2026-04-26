import React from 'react';
import { View, ViewProps, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii } from '@/constants/tokens';

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
 * RN doesn't support `box-shadow: inset`. v8's first attempt used four
 * 16-px-wide LinearGradient slabs (one per edge) — the seams between
 * adjacent slabs were visible as four straight lines along each side
 * (clearly visible in the v8 simulator render).
 *
 * v9 uses TWO full-coverage gradients overlaid on the entire surface:
 *
 *   Vertical:    dark at top edge → transparent middle → white at bottom
 *   Horizontal:  dark at left edge → transparent middle → white at right
 *
 * Composited together: top-left = dark (both axes contribute dark),
 * bottom-right = light (both contribute light), top-right and
 * bottom-left = mid (one dark + one light cancel out roughly to mid-grey).
 *
 * Because each gradient extends across the WHOLE surface with a smooth
 * 4-stop falloff, there are no visible seams — just a continuous wash
 * that "punches into" the surface from top-left and "lifts out" toward
 * bottom-right. Matches what `box-shadow: inset` does in CSS.
 */

// Per-strength tuning. dark/light = peak alpha at the corresponding edge.
// falloff = how far INTO the surface the rim fades, as a fraction of dimension.
//   falloff 0.3 means: dark fades from peak at edge to 0 at 30% from edge.
//   The middle 40% (30→70%) stays transparent → no muddiness in the centre.
const STRENGTH = {
  thin: { dark: 0.30, light: 0.55, falloff: 0.30 },
  medium: { dark: 0.42, light: 0.72, falloff: 0.34 },
  thick: { dark: 0.55, light: 0.88, falloff: 0.40 },
} as const;

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
  const s = STRENGTH[strength];

  // slate-400 #94a3b8 — slightly darker than CSS slate-300 to keep readable
  // contrast against the off-white #ECEFF4 canvas.
  const dark = (a: number) => `rgba(148, 163, 184, ${a})`;
  const light = (a: number) => `rgba(255, 255, 255, ${a})`;

  const stops = [0, s.falloff, 1 - s.falloff, 1] as const;
  const gradColors = [dark(s.dark), dark(0), light(0), light(s.light)] as const;

  return (
    <View
      {...rest}
      style={[
        styles.container,
        { borderRadius: r, backgroundColor: background },
        style,
      ]}
    >
      {/* VERTICAL — dark top edge → transparent → white bottom edge */}
      <LinearGradient
        colors={gradColors as unknown as readonly [string, string, ...string[]]}
        locations={stops as unknown as readonly [number, number, ...number[]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* HORIZONTAL — dark left edge → transparent → white right edge */}
      <LinearGradient
        colors={gradColors as unknown as readonly [string, string, ...string[]]}
        locations={stops as unknown as readonly [number, number, ...number[]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
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
    zIndex: 1,
  },
});
