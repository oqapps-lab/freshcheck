import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radii, spacing, typeScale, shadows } from '@/constants/tokens';

type Props = {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
  accent?: 'sage' | 'amber' | 'coral'; // default sage; urgency escalation only
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * v3 — tappable glass-panel row with soft press-scale haptic. Matches
 * GlassCard spec exactly (white 65% + blur + white edge highlight) but is
 * pressable and supports a `selected` tonal lift.
 *
 * Selected state: deepens the fill toward primaryFixed + widens the edge
 * highlight. No hard borders.
 *
 * Accent: default is sage (monochrome). Amber/coral reserved for urgency
 * in Waste Assessment "almost every day" style rows.
 */
export const OptionCard: React.FC<Props> = ({
  label,
  sublabel,
  icon,
  selected = false,
  onPress,
  style,
  testID,
  accent = 'sage',
}) => {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reduceMotion) scale.value = withSpring(0.98, { damping: 18, stiffness: 260 });
  };
  const handlePressOut = () => {
    if (!reduceMotion) scale.value = withSpring(1, { damping: 18, stiffness: 260 });
  };
  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress?.();
  };

  const useBlur = Platform.OS === 'ios';

  const selectedFill =
    accent === 'amber'
      ? 'rgba(251,236,199,0.88)'
      : accent === 'coral'
      ? 'rgba(253,227,224,0.88)'
      : 'rgba(194,238,192,0.78)';

  const selectedTextColor =
    accent === 'amber'
      ? colors.onAmberContainer
      : accent === 'coral'
      ? colors.onCoralContainer
      : colors.onPrimaryFixed;

  const labelColor = selected ? selectedTextColor : colors.onSurface;
  const sublabelColor = selected ? selectedTextColor : colors.secondary;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      testID={testID}
      style={[
        styles.base,
        shadows.soft,
        animatedStyle,
        style,
      ]}
    >
      {/* Base glass layer */}
      {!selected && useBlur && (
        <>
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
        </>
      )}
      {!selected && !useBlur && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.92)' }]} />
      )}
      {selected && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: selectedFill }]} />
      )}

      {/* Inset highlight */}
      <View pointerEvents="none" style={styles.innerTopHighlight} />

      <View style={styles.content}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <View style={{ flex: 1 }}>
          <Text style={[typeScale.titleS, { color: labelColor }]}>{label}</Text>
          {sublabel ? (
            <Text style={[typeScale.bodySmall, { color: sublabelColor, marginTop: 2 }]}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 64,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  innerTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassInnerHighlight,
  },
});
