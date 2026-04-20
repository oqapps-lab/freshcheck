import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, Platform, AccessibilityRole } from 'react-native';
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
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * The anchor button of the app.
 * Primary: dewy sage gradient + inner-top highlight + warm sage outer glow
 * Glass: BlurView + cream fill + hairline sage border
 * Ghost: transparent, sage text only
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
    if (!reduceMotion) scale.value = withSpring(0.97, { damping: 18, stiffness: 280 });
  };

  const handlePressOut = () => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 18, stiffness: 280 });
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
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
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
