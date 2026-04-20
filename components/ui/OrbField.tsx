import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { orbs, gradients } from '@/constants/tokens';

/**
 * Atmospheric orb field — the backdrop for every screen.
 * v2:
 *  - 4 orbs instead of 3 (sage top-right, peach bottom-right, lavender mid-left, sage bottom-left)
 *  - higher opacity stops
 *  - subtle breathing animation on orbs (respects Reduce Motion)
 *  - ambient linear gradient layer UNDERNEATH the orbs for base tone depth
 *
 * pointerEvents="none" so never swallows taps.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.2
 */
export const OrbField: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const breath = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;
    breath.value = withRepeat(
      withTiming(1.06, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [breath, reduceMotion]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value }],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Ambient base gradient */}
      <LinearGradient
        colors={gradients.kitchenLight}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Orbs layer, subtly breathing */}
      <Animated.View style={[StyleSheet.absoluteFill, breathStyle]}>
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="sageOrb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[0]} />
              <Stop offset="55%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[1]} />
              <Stop offset="100%" stopColor={orbs.sage.color} stopOpacity={orbs.sage.opacities[2]} />
            </RadialGradient>
            <RadialGradient id="creamOrb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[0]} />
              <Stop offset="65%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[1]} />
              <Stop offset="100%" stopColor={orbs.cream.color} stopOpacity={orbs.cream.opacities[2]} />
            </RadialGradient>
            <RadialGradient id="peachOrb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={orbs.peach.color} stopOpacity={orbs.peach.opacities[0]} />
              <Stop offset="60%" stopColor={orbs.peach.color} stopOpacity={orbs.peach.opacities[1]} />
              <Stop offset="100%" stopColor={orbs.peach.color} stopOpacity={orbs.peach.opacities[2]} />
            </RadialGradient>
            <RadialGradient id="lavenderOrb" cx="50%" cy="50%" r="50%">
              <Stop
                offset="0%"
                stopColor={orbs.lavender.color}
                stopOpacity={orbs.lavender.opacities[0]}
              />
              <Stop
                offset="60%"
                stopColor={orbs.lavender.color}
                stopOpacity={orbs.lavender.opacities[1]}
              />
              <Stop
                offset="100%"
                stopColor={orbs.lavender.color}
                stopOpacity={orbs.lavender.opacities[2]}
              />
            </RadialGradient>
          </Defs>

          {/* Top-right — sage (dominant cool highlight) */}
          <Rect
            x={width - 240}
            y={-160}
            width={420}
            height={420}
            fill="url(#sageOrb)"
          />

          {/* Mid-left — lavender (subtle cool accent) */}
          <Rect
            x={-140}
            y={height * 0.32}
            width={320}
            height={320}
            fill="url(#lavenderOrb)"
          />

          {/* Bottom-left — sage again (grounds the composition) */}
          <Rect
            x={-100}
            y={height - 360}
            width={360}
            height={360}
            fill="url(#sageOrb)"
          />

          {/* Bottom-right — peach+cream (warm hearth, strongest) */}
          <Rect
            x={width - 220}
            y={height - 320}
            width={360}
            height={360}
            fill="url(#peachOrb)"
          />

          {/* Bottom-right inner — cream highlight */}
          <Rect
            x={width - 140}
            y={height - 240}
            width={260}
            height={260}
            fill="url(#creamOrb)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
