import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { orbs, motion } from '@/constants/tokens';

type Props = {
  size?: number;
  tone?: 'sage' | 'coral' | 'peach' | 'cream';
  style?: ViewStyle;
};

/**
 * Animated radial glow that softly pulses — for placing behind anchor CTAs,
 * monogram tiles, or verdict pills to create depth without being loud.
 *
 * pointerEvents='none'.
 * Ref: docs/06-design/DESIGN-GUIDE.md §5 (new v2 primitive)
 */
export const PulseGlow: React.FC<Props> = ({ size = 240, tone = 'sage', style }) => {
  const pulse = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1.18, { duration: motion.pulse, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [pulse, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const orbDef = tone === 'coral' ? orbs.coralPulse : orbs[tone];
  const gradId = `pulseGlow_${tone}`;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
        style,
      ]}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={orbDef.color} stopOpacity={orbDef.opacities[0]} />
            <Stop offset="55%" stopColor={orbDef.color} stopOpacity={orbDef.opacities[1]} />
            <Stop offset="100%" stopColor={orbDef.color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={size} height={size} fill={`url(#${gradId})`} />
      </Svg>
    </Animated.View>
  );
};
