import React from 'react';
import { View, ViewProps, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { colors, shadows, radii } from '@/constants/tokens';

type Variant = 'cushion' | 'pill' | 'plate' | 'plateInner';
type RadiusKey = keyof typeof radii;

type Props = ViewProps & {
  /** cushion = larger 12/14/18 shadow stack, used for cards. pill = 6/8/12, used for buttons + pill rows. */
  variant?: Variant;
  radius?: RadiusKey | number;
  /** Surface colour (the visible top "skin"). Defaults to pure white so the cushion reads as a raised, brighter disc on the off-white canvas. */
  background?: string;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
};

/**
 * SoftSurface — RAISED neumorphic surface (cushion or pill).
 *
 * Stitch CSS:
 *   .neomorph-cushion  box-shadow: 10/10/20 #cbd5e1, -10/-10/20 #fff
 *   .neomorph-pill     box-shadow: 6/6/12  #cbd5e1, -6/-6/12   #fff
 *
 * RN limit: only ONE shadow per View. We stack two views so both the
 * dark drop AND the white highlight are visible at once. The white
 * highlight is only meaningful when the parent canvas is darker than
 * the highlight — that's why v9 moves the global canvas to off-white
 * #ECEFF4. On pure-white the highlight is invisible (nothing to
 * contrast against), so leaving canvas white silently kills half the
 * neumorphic effect.
 *
 * Layer order (bottom-to-top):
 *   View A — backgroundColor=transparent, casts SLATE drop shadow toward bottom-right
 *   View B — backgroundColor=transparent, casts WHITE highlight toward top-left
 *   View C — actual coloured skin (background prop), holds the children
 *
 * View A and B must be transparent so their shadows don't render on top of each other's edge.
 *
 * v13 — round-shadow fix: when the caller passes circular dimensions
 * via `innerStyle` (e.g. `{ width: 220, height: 220 }` paired with
 * `radius="full"`), the outer wrapper view's bounds are flex-derived
 * — iOS sometimes computes the shadow path before layout settles and
 * draws a rectangular shadow under the otherwise-circular skin (the
 * user-visible "квадратная тень под кружком" bug). Mirror width /
 * height / aspectRatio from innerStyle onto the outer view so iOS
 * has explicit bounds and a stable shadow path matching borderRadius.
 */
export function SoftSurface({
  variant = 'cushion',
  radius = 'xxl',
  background = colors.surfaceWhite,
  style,
  innerStyle,
  children,
  ...rest
}: Props) {
  const r = typeof radius === 'number' ? radius : radii[radius];
  const drop =
    variant === 'plate' ? shadows.plateDrop :
    variant === 'plateInner' ? shadows.innerDrop :
    variant === 'cushion' ? shadows.cushionDrop :
    shadows.pillDrop;
  const highlight =
    variant === 'plate' ? shadows.plateHighlight :
    variant === 'plateInner' ? shadows.innerHighlight :
    variant === 'cushion' ? shadows.cushionHighlight :
    shadows.pillHighlight;

  const flatInner = StyleSheet.flatten(innerStyle) as ViewStyle | undefined;
  const dimensionForward: ViewStyle = {};
  if (flatInner?.width != null) dimensionForward.width = flatInner.width;
  if (flatInner?.height != null) dimensionForward.height = flatInner.height;
  if (flatInner?.aspectRatio != null) dimensionForward.aspectRatio = flatInner.aspectRatio;

  return (
    <View
      {...rest}
      style={[
        { borderRadius: r, backgroundColor: background },
        dimensionForward,
        drop,
        style,
      ]}
    >
      <View
        style={[
          { borderRadius: r, backgroundColor: background },
          highlight,
          innerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
