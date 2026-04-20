import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, shadows } from '@/constants/tokens';

type Variant = 'glass' | 'solid' | 'muted';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  style?: ViewStyle;
  radius?: keyof typeof radii;
  padding?: number;
};

/**
 * v3 — the Stitch `.glass-panel` spec exactly:
 *   background: rgba(255,255,255,0.65)
 *   backdrop-filter: blur(16px)
 *   border: 1px rgba(255,255,255,0.8)
 *   shadow: 0 8px 32px rgba(65,103,67,0.08)
 *   inset 0 1px 1px rgba(255,255,255,0.9)  ← edge highlight
 *
 * No internal gradient tint. No innerGlow. No showTopLight.
 * Clean, quiet, premium.
 *
 * Ref: code.html .glass-panel
 */
export const GlassCard: React.FC<Props> = ({
  children,
  variant = 'glass',
  style,
  radius = 'xxl',
  padding = 24,
}) => {
  const borderRadius = radii[radius];
  const useBlur = variant === 'glass' && Platform.OS === 'ios';

  const bgColor =
    variant === 'solid'
      ? colors.surfaceLowest
      : variant === 'muted'
      ? colors.surfaceLow
      : 'transparent';

  return (
    <View
      style={[
        {
          borderRadius,
          overflow: 'hidden',
          backgroundColor: bgColor,
          borderWidth: variant === 'glass' ? 1 : 0,
          borderColor: colors.glassBorder,
        },
        variant === 'glass' ? shadows.panel : shadows.soft,
        style,
      ]}
    >
      {variant === 'glass' && useBlur && (
        <>
          <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
        </>
      )}
      {variant === 'glass' && !useBlur && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(255,255,255,0.92)' },
          ]}
        />
      )}

      {/* Inset edge highlight — inset 0 1px 1px rgba(255,255,255,0.9) */}
      {variant === 'glass' && (
        <View pointerEvents="none" style={styles.innerTopHighlight} />
      )}

      <View style={{ padding }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.glassInnerHighlight,
  },
});
