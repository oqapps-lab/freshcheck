import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadows, gradients } from '@/constants/tokens';

type Variant = 'default' | 'elevated' | 'leafHighlight' | 'muted' | 'tinted';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  showTopLight?: boolean;
  showInnerGlow?: boolean;
  style?: ViewStyle;
  radius?: keyof typeof radii;
  padding?: number;
  tintGradient?: readonly [string, string, ...string[]]; // optional custom internal tint
};

/**
 * Glass / editorial cream surface.
 * v2 — richer with internal gradient overlay, shimmer top-light, premium soft border.
 *
 * Variants:
 *  default       — glass (BlurView iOS, opaque fallback Android) + subtle sage→peach tint inside
 *  elevated      — white-card with sage inner-glow
 *  leafHighlight — white-card + mint top-edge glow (hero cards)
 *  muted         — cardMuted fill, no gradient
 *  tinted        — accepts custom tintGradient for per-card color identity (stats row)
 *
 * Android: BlurView swapped for near-opaque cream fallback.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §4.1 + §5.3
 */
export const GlassCard: React.FC<Props> = ({
  children,
  variant = 'default',
  showTopLight = false,
  showInnerGlow = false,
  style,
  radius = 'xl',
  padding = 20,
  tintGradient,
}) => {
  const borderRadius = radii[radius];
  const useGlass = (variant === 'default' || variant === 'tinted') && Platform.OS === 'ios';

  const cardBg =
    variant === 'muted'
      ? colors.cardMuted
      : variant === 'elevated' || variant === 'leafHighlight'
      ? colors.card
      : 'transparent';

  const shadow =
    variant === 'leafHighlight' || variant === 'elevated' ? shadows.glass : shadows.card;

  const internalTint = tintGradient ?? gradients.glassTint;

  return (
    <View
      style={[
        {
          borderRadius,
          overflow: 'hidden',
          backgroundColor: cardBg,
          borderWidth:
            variant === 'default' || variant === 'tinted' ? StyleSheet.hairlineWidth * 2 : 0,
          borderColor: colors.glassBorder,
        },
        shadow,
        style,
      ]}
    >
      {useGlass ? (
        <>
          <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
        </>
      ) : variant === 'default' || variant === 'tinted' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFillAndroid }]} />
      ) : null}

      {/* Internal tint gradient overlay — adds color depth without being loud */}
      {(variant === 'default' || variant === 'tinted') && (
        <LinearGradient
          colors={internalTint}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      {/* Top-edge light — mimics light catching on a fresh leaf */}
      {(showTopLight || variant === 'leafHighlight') && (
        <LinearGradient
          colors={gradients.topLight}
          style={styles.topLight}
          pointerEvents="none"
        />
      )}

      {/* Inner glow — soft white sheen at top 30%, for leafHighlight cards */}
      {(showInnerGlow || variant === 'leafHighlight') && (
        <LinearGradient
          colors={gradients.topLightWhite}
          style={styles.innerGlow}
          pointerEvents="none"
        />
      )}

      <View style={{ padding }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  topLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    opacity: 0.30,
  },
});
