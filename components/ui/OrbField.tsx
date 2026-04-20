import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { orbs } from '@/constants/tokens';

/**
 * Three blurred radial orbs placed in the corners — the atmospheric backdrop.
 * Rendered as SVG with true radial gradients (LinearGradient can't do radial).
 * pointerEvents="none" so never swallows taps.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.2
 */
export const OrbField: React.FC = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="sageOrb" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[0]} />
            <Stop offset="60%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[1]} />
            <Stop offset="100%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[2]} />
          </RadialGradient>
          <RadialGradient id="creamOrb" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[0]} />
            <Stop offset="70%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[1]} />
            <Stop offset="100%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[2]} />
          </RadialGradient>
        </Defs>

        {/* Top-right sage orb */}
        <Rect
          x={width - 260}
          y={-120}
          width={360}
          height={360}
          fill="url(#sageOrb)"
        />

        {/* Bottom-left sage orb */}
        <Rect
          x={-120}
          y={height - 300}
          width={320}
          height={320}
          fill="url(#sageOrb)"
        />

        {/* Bottom-right cream/amber orb (warm hearth) */}
        <Rect
          x={width - 180}
          y={height - 220}
          width={280}
          height={280}
          fill="url(#creamOrb)"
        />
      </Svg>
    </View>
  );
};
