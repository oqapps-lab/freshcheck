import React, { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, Platform, AccessibilityRole } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useReducedMotion,
  Easing,
} from 'react-native-reanimated';
import { colors, gradients, radii, shadows, typeScale, spacing, motion } from '@/constants/tokens';

type Variant = 'primary' | 'glass' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  pulse?: boolean; // v2 — adds a soft breathing pulse to draw attention (e.g. empty-state Scan CTA)
  shimmer?: boolean; // v2 — adds a subtle diagonal shimmer sweep (default true for primary)
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/**
 * The anchor button of the app.
 * v2 — richer: dewy gradient + diagonal shimmer sweep + stronger outer glow + optional pulse.
 *
 * Variants:
 *  primary — dewy sage gradient + inner-top highlight + warm sage outer glow + subtle shimmer
 *  glass   — BlurView + cream fill + hairline sage border
 *  ghost   — transparent, sage text only
 *
 * Haptics + reanimated press-scale. Respects Reduce Motion.
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.4
 */
export const PillCTA: React.FC<Props> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  fullWidth,
  disabled,
  pulse,
  shimmer,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const shimmerX = useSharedValue(-1);
  const reduceMotion = useReducedMotion();

  const doShimmer = shimmer ?? variant === 'primary';

  // Pulse animation — soft breathing scale
  useEffect(() => {
    if (!pulse || reduceMotion) return;
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [pulse, reduceMotion, pulseScale]);

  // Shimmer sweep — diagonal highlight that travels L→R every few seconds
  useEffect(() => {
    if (!doShimmer || reduceMotion) return;
    shimmerX.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 0 }),
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.cubic) }),
        withTiming(1, { duration: 1800 })
      ),
      -1
    );
  }, [doShimmer, reduceMotion, shimmerX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 200 }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) scale.value = withSpring(0.96, { damping: 18, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  const textColor = variant === 'primary' ? colors.white : colors.sageInk;

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
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant === 'primary' ? shadows.ctaGlow : undefined,
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
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.glassFill]} />
        </>
      )}

      {variant === 'glass' && Platform.OS === 'android' && (
        <View style={[StyleSheet.absoluteFill, styles.glassFillAndroid]} />
      )}

      {variant === 'primary' && <View pointerEvents="none" style={styles.innerTopLight} />}

      {/* Shimmer sweep overlay — a diagonal white highlight traveling L→R */}
      {variant === 'primary' && doShimmer && (
        <Animated.View style={[styles.shimmerWrap, shimmerStyle]} pointerEvents="none">
          <LinearGradient
            colors={gradients.ctaShimmer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shimmerBar}
          />
        </Animated.View>
      )}

      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <Text style={[typeScale.titleS, { color: textColor }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: radii.full,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    marginRight: 2,
  },
  innerTopLight: {
    position: 'absolute',
    top: 1,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 1,
  },
  shimmerWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 120,
  },
  shimmerBar: {
    flex: 1,
    opacity: 0.85,
    transform: [{ skewX: '-18deg' }],
  },
  glassFill: {
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: 'rgba(74,101,79,0.14)',
    borderRadius: radii.full,
  },
  glassFillAndroid: {
    backgroundColor: colors.glassFillAndroid,
    borderWidth: 1,
    borderColor: 'rgba(74,101,79,0.14)',
    borderRadius: radii.full,
  },
});
