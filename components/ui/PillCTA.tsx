import React from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors, gradients, radii, shadows, typeScale, spacing } from '@/constants/tokens';

type Variant = 'primary' | 'glass' | 'ghost';

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
 * v3 — clean dewy sage-gradient pill. NO shimmer, NO pulse.
 * Gentle press-scale haptic. Reduced motion aware.
 *
 * Ref: code.html primary button + DESIGN.md §5 Buttons
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

  const textColor = variant === 'primary' ? colors.onPrimary : colors.primary;
  const height = compact ? 44 : 52;

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
        { height },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant === 'primary' ? shadows.cta : shadows.soft,
        animatedStyle,
        style,
      ]}
    >
      {variant === 'primary' && (
        <LinearGradient
          colors={gradients.dewyCTA}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {variant === 'glass' && Platform.OS === 'ios' && (
        <>
          <BlurView intensity={24} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.glassFill]} />
        </>
      )}
      {variant === 'glass' && Platform.OS === 'android' && (
        <View style={[StyleSheet.absoluteFill, styles.glassFillAndroid]} />
      )}

      <View style={styles.content}>
        {icon ? <View style={styles.iconLeft}>{icon}</View> : null}
        <Text style={[typeScale.titleS, { color: textColor }]}>{label}</Text>
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
  glassFill: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(65,103,67,0.18)',
    borderRadius: radii.full,
  },
  glassFillAndroid: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(65,103,67,0.18)',
    borderRadius: radii.full,
  },
});
