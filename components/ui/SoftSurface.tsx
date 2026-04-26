import React from 'react';
import { View, ViewProps, ViewStyle, StyleProp } from 'react-native';
import { colors, shadows, radii } from '@/constants/tokens';

type Variant = 'cushion' | 'pill';
type RadiusKey = keyof typeof radii;

type Props = ViewProps & {
  /** cushion = larger 10/10/20 shadow, used for cards. pill = 6/6/12, used for buttons + pill rows. */
  variant?: Variant;
  radius?: RadiusKey | number;
  /** Container colour — must equal the parent canvas so shadows blend cleanly. */
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
 * RN can render only one shadow per View, so we stack two sibling Views to
 * deliver both the bottom-right drop AND top-left white highlight.
 */
export function SoftSurface({
  variant = 'cushion',
  radius = 'xxl',
  background = colors.canvas,
  style,
  innerStyle,
  children,
  ...rest
}: Props) {
  const r = typeof radius === 'number' ? radius : radii[radius];
  const drop = variant === 'cushion' ? shadows.cushionDrop : shadows.pillDrop;
  const highlight = variant === 'cushion' ? shadows.cushionHighlight : shadows.pillHighlight;

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
