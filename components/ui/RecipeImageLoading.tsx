import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Bowl } from "./Glyphs";
import { colors, spacing, typeScale } from "@/constants/tokens";

// Stable keys for the cycling copy; strings live in i18n (loaders.image.*).
const MESSAGE_KEYS = [
  "loaders.image.plating",
  "loaders.image.generating",
  "loaders.image.simmering",
  "loaders.image.pickingIngredients",
] as const;

/**
 * Card-sized recipe-image loading state. A gently bobbing bowl + cycling
 * chef-y copy so the wait reads as cooking up the photo, not a broken load.
 */
export function RecipeImageLoading() {
  const { t } = useTranslation();
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
    const int = setInterval(() => setMsg((m) => (m + 1) % MESSAGE_KEYS.length), 1900);
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
      <Text style={[typeScale.labelSmall, styles.msg]}>{t(MESSAGE_KEYS[msg])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", gap: spacing.sm },
  msg: { color: colors.inkSecondary, letterSpacing: 1, textTransform: "uppercase" },
});
