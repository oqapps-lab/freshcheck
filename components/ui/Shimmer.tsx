import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/tokens';

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shimmer skeleton placeholder — a soft grey block with a sweeping highlight.
 * Used instead of swapping placeholder text (which "jumped" words on the
 * Recipes tab). Pure Animated + expo-linear-gradient, no deps.
 */
export function Shimmer({ width = '100%', height = 16, radius = 8, style }: Props) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [x]);

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-220, 220] });

  return (
    <View style={[{ width, height, borderRadius: radius, backgroundColor: colors.surfaceTint, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={[`${colors.surfaceTint}00`, 'rgba(255,255,255,0.85)', `${colors.surfaceTint}00`]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
