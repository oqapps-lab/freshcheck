import React from 'react';
import { View, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { colors, shadows, radii } from '@/constants/tokens';

type Variant = 'cushion' | 'pill';
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
  const drop = variant === 'cushion' ? shadows.cushionDrop : shadows.pillDrop;
  const highlight = variant === 'cushion' ? shadows.cushionHighlight : shadows.pillHighlight;

  // RN shadows on a transparent View don't render at all (the shadow needs a "filled" shape).
  // So both shadow casters must have a backgroundColor === their shadow target colour for
  // the platform to register a shape. We use the real skin colour for both — drop/highlight
  // shadows then propagate from those filled views into the canvas around the surface.
  return (
    <View
      {...rest}
      style={[
        { borderRadius: r, backgroundColor: background },
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
