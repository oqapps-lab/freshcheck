import React, { ReactNode } from 'react';
import {
  AccessibilityRole,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  colors,
  gradients,
  layout,
  radii,
  shadows,
  spacing,
} from '@/constants/tokens';
import { Text } from './Text';

export type PillCTASize = 'sm' | 'md' | 'lg';

export type PillCTAProps = {
  label: string;
  onPress?: () => void;
  size?: PillCTASize;
  loading?: boolean;
  disabled?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  style?: ViewStyle;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export function PillCTA({
  label,
  onPress,
  size = 'md',
  loading = false,
  disabled = false,
  leading,
  trailing,
  accessibilityLabel,
  accessibilityRole = 'button',
  style,
  hapticStyle = Haptics.ImpactFeedbackStyle.Medium,
}: PillCTAProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(hapticStyle).catch(() => {});
    onPress?.();
  };

  const sizeVars = SIZE[size];

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrap,
        sizeVars.wrap,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={gradients.dewyCTA as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, { borderRadius: radii.full }]}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <>
            {leading ? <View style={styles.slot}>{leading}</View> : null}
            <Text variant={sizeVars.textVariant} tone="onPrimary">
              {label}
            </Text>
            {trailing ? <View style={styles.slot}>{trailing}</View> : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

const SIZE: Record<
  PillCTASize,
  { wrap: ViewStyle; textVariant: 'label' | 'bodyStrong' | 'titleM' }
> = {
  sm: {
    wrap: {
      minHeight: layout.touchTargetMin,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    textVariant: 'label',
  },
  md: {
    wrap: {
      minHeight: 52,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    textVariant: 'bodyStrong',
  },
  lg: {
    wrap: {
      minHeight: 60,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
    textVariant: 'titleM',
  },
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    borderRadius: radii.full,
    overflow: 'hidden',
    ...shadows.cta,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  slot: { alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
});
