import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { SoftSurface } from "./SoftSurface";
import { useAchievements, clearPendingAchievement } from "@/src/state/achievementsStore";
import { colors, spacing, typeScale } from "@/constants/tokens";

/**
 * Celebratory toast shown when an achievement unlocks. Mounted once at the
 * root so it appears no matter which screen triggered it. Badge springs in
 * with a success haptic, then auto-dismisses.
 */
export function AchievementHost() {
  const insets = useSafeAreaInsets();
  const { pending } = useAchievements();
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!pending) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    v.setValue(0);
    Animated.spring(v, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }).start();
    const t = setTimeout(() => {
      Animated.timing(v, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(
        () => clearPendingAchievement(),
      );
    }, 2600);
    return () => clearTimeout(t);
  }, [pending, v]);

  if (!pending) return null;
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [-28, 0] });
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrap, { top: insets.top + 8, opacity: v, transform: [{ translateY }, { scale }] }]}
    >
      <Pressable onPress={() => clearPendingAchievement()}>
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
          <Text style={styles.emoji}>{pending.emoji}</Text>
          <View style={styles.text}>
            <Text style={[typeScale.labelSmall, styles.eyebrow]}>ACHIEVEMENT UNLOCKED</Text>
            <Text style={[typeScale.titleSmall, styles.title]}>{pending.title}</Text>
          </View>
        </SoftSurface>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 999 },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  emoji: { fontSize: 34 },
  text: { gap: 2 },
  eyebrow: { color: colors.amber, letterSpacing: 1.4 },
  title: { color: colors.ink },
});
