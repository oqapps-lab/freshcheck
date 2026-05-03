import React, { useState } from 'react';
import {
  View,
  ViewProps,
  ViewStyle,
  StyleProp,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
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
 * RN doesn't support `box-shadow: inset`. v8 attempted four 16-px slabs
 * (visible seams). v9 used two full-cover gradients with a fractional
 * falloff (0.40 of the dimension) — that broke on wide containers like
 * the verdict card (354×200), where 40% = 142px wide rim, leaving the
 * card looking like a soft diagonal wash instead of a punched-in cup.
 *
 * v10 measures the actual on-screen size with onLayout and computes the
 * gradient stops in PIXELS (matching the CSS blur semantics: a fixed
 * ~20-22px rim regardless of container dimensions). Result: every
 * recessed surface — tiny pill cup, mid-size glyph cup, large verdict
 * card — shows the same crisp ~22px dark rim at top-left and ~22px
 * white rim at bottom-right, with a clean canvas-coloured interior.
 *
 *   Vertical:    dark at top edge → transparent middle → white at bottom
 *   Horizontal:  dark at left edge → transparent middle → white at right
 */

// Per-strength tuning. dark/light = peak alpha at the corresponding edge.
// rimPx = absolute width of the rim (in screen px). Matches CSS blur radius.
//
// v10 → v11 corner-softening pass: two overlay gradients add their alpha
// at corners (top-left gets both vertical-dark and horizontal-dark), so
// corners run ~1.5–1.7× heavier than edges, producing the L-shape
// "angular" feel the user flagged. We can't fully prevent this without
// a real radial-blur primitive (SVG filter), so we counter-balance:
//   - lower peak alphas (corners stay readable, not blob-y)
//   - wider rim (smoother fall-off transition)
//   - add intermediate 0.5×peak stop so the gradient curve is sigmoid-ish
//     instead of sharp linear.
const STRENGTH = {
  thin: { dark: 0.32, light: 0.50, rimPx: 14 }, // pill-active inset 4/4/8
  medium: { dark: 0.38, light: 0.60, rimPx: 22 },
  thick: { dark: 0.45, light: 0.72, rimPx: 30 }, // recessed inset 8/8/16
} as const;

// Fallback rim fraction used before onLayout fires (first paint). Small
// enough that there's no muddy diagonal wash; the real pixel-based stops
// kick in on the next frame.
const FALLBACK_RIM = 0.08;

// Cap rim fraction so very small elements (e.g. the 6×128 home indicator)
// still show a visible rim instead of nothing.
const MAX_RIM_FRACTION = 0.45;

export function SoftInset({
  radius = 'xxl',
  strength = 'thick',
  background = colors.canvas,
  style,
  contentStyle,
  children,
  ...rest
}: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const r = typeof radius === 'number' ? radius : radii[radius];
  const s = STRENGTH[strength];

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) {
      setSize({ w: width, h: height });
    }
  };

  // Pixel-based rim → fraction of dimension. Capped + fallback so first
  // paint (size = 0) shows a sensible-but-tight rim.
  const vRim =
    size.h > 0 ? Math.min(MAX_RIM_FRACTION, s.rimPx / size.h) : FALLBACK_RIM;
  const hRim =
    size.w > 0 ? Math.min(MAX_RIM_FRACTION, s.rimPx / size.w) : FALLBACK_RIM;

  // slate-400 #94a3b8 — slightly darker than CSS slate-300 to keep readable
  // contrast against the off-white #ECEFF4 canvas.
  const dark = (a: number) => `rgba(148, 163, 184, ${a})`;
  const light = (a: number) => `rgba(255, 255, 255, ${a})`;

  // 6-stop sigmoid-ish falloff: peak → 0.5×peak → 0 → 0 → 0.5×peak → peak.
  // The mid-alpha stop softens the corner where two gradients overlap,
  // smoothing the L-shape into a curve.
  const vColors = [
    dark(s.dark),
    dark(s.dark * 0.5),
    dark(0),
    light(0),
    light(s.light * 0.5),
    light(s.light),
  ] as const;
  const hColors = vColors;
  const vStops = [0, vRim * 0.5, vRim, 1 - vRim, 1 - vRim * 0.5, 1] as const;
  const hStops = [0, hRim * 0.5, hRim, 1 - hRim, 1 - hRim * 0.5, 1] as const;

  return (
    <View
      {...rest}
      onLayout={onLayout}
      style={[
        styles.container,
        { borderRadius: r, backgroundColor: background },
        style,
      ]}
    >
      {/* VERTICAL — dark top edge → transparent middle → white bottom edge */}
      <LinearGradient
        colors={vColors as unknown as readonly [string, string, ...string[]]}
        locations={vStops as unknown as readonly [number, number, ...number[]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {/* HORIZONTAL — dark left edge → transparent middle → white right edge */}
      <LinearGradient
        colors={hColors as unknown as readonly [string, string, ...string[]]}
        locations={hStops as unknown as readonly [number, number, ...number[]]}
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
