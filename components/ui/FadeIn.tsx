import React, { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle, type StyleProp } from 'react-native';

/**
 * Fade + gentle rise on mount, so content (recipe cards, blocks) eases in
 * instead of popping abruptly (user-flagged "резкое появление"). Optional
 * `delay` staggers a list for a cascade.
 */
export function FadeIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.timing(v, {
      toValue: 1,
      duration: 340,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [v, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: v,
          transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
