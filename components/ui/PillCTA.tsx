import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors, radii, shadows, typeScale, spacing } from '@/constants/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'glass';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * v4 PillCTA — Stitch Paper-&-Pith.
 *
 * Variants:
 *   primary    — amber #feb06e fill, deep-brown #784105 label. Hero CTAs
 *                like "Add to Fridge".
 *   secondary  — neumorphic white pillow, sage label. Used as the
 *                non-primary action paired with primary ("see the fridge").
 *   ghost      — transparent, sage/outline label. Subtle text-link CTAs
 *                like "SCAN ANOTHER".
 *   glass      — alias for secondary; preserved so legacy call-sites
 *                that still pass variant="glass" don't crash before
 *                being migrated.
 */
export const PillCTA: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  fullWidth,
  disabled,
  compact,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) scale.value = withSpring(0.97, { damping: 18, stiffness: 260 });
  };
  const handlePressOut = () => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 18, stiffness: 260 });
  };
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.();
  };

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary' || variant === 'glass';
  const height = compact ? 44 : 52;

  const labelColor = isPrimary
    ? colors.onAccent
    : isGhost
      ? colors.outline
      : colors.primary;

  const bg = isPrimary
    ? colors.accent
    : isSecondary
      ? colors.surface
      : 'transparent';

  const shadow = isGhost ? shadows.none : isPrimary ? shadows.cta : shadows.soft;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={[
        styles.base,
        { height, backgroundColor: bg },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        shadow,
        animatedStyle,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <View style={styles.iconLeft}>{icon}</View> : null}
        <Text
          style={[
            isGhost ? typeScale.label : typeScale.titleM,
            { color: labelColor },
            isGhost && styles.ghostLabel,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
        {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  ghostLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
});
