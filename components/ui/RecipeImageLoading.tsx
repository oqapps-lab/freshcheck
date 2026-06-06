import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { Bowl } from "./Glyphs";
import { colors, spacing, typeScale } from "@/constants/tokens";

const MESSAGES = [
  "Plating your dish",
  "Generating a unique recipe",
  "Simmering the details",
  "Picking fresh ingredients",
];

/**
 * Card-sized recipe-image loading state. A gently bobbing bowl + cycling
 * chef-y copy so the wait reads as cooking up the photo, not a broken load.
 */
export function RecipeImageLoading() {
  const bob = useRef(new Animated.Value(0)).current;
  const [msg, setMsg] = useState(0);
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const int = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 1900);
    return () => {
      loop.stop();
      clearInterval(int);
    };
  }, [bob]);
  const y = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <Bowl size={34} color={colors.amber} strokeWidth={1.6} />
      </Animated.View>
      <Text style={[typeScale.labelSmall, styles.msg]}>{MESSAGES[msg]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", gap: spacing.sm },
  msg: { color: colors.inkSecondary, letterSpacing: 1, textTransform: "uppercase" },
});
