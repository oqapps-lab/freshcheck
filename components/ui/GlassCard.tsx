import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadows, gradients } from '@/constants/tokens';

type Variant = 'default' | 'elevated' | 'leafHighlight' | 'muted';

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  showTopLight?: boolean;
  style?: ViewStyle;
  radius?: keyof typeof radii;
  padding?: number;
};

/**
 * Glass / editorial cream surface. Default is soft elevated white card.
 * Variant "leafHighlight" adds a 2px sageMist top-edge glow — "light on a leaf".
 *
 * Android: BlurView swapped for near-opaque cream fill (blur is noisy on Android).
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §4.1 + §5.3
 */
export const GlassCard: React.FC<Props> = ({
  children,
  variant = 'default',
  showTopLight = false,
  style,
  radius = 'xl',
  padding = 20,
}) => {
  const cardBg =
    variant === 'muted'
      ? colors.cardMuted
      : variant === 'default' || variant === 'elevated' || variant === 'leafHighlight'
      ? colors.card
      : colors.card;

  const shadow = variant === 'elevated' || variant === 'leafHighlight' ? shadows.card : shadows.card;
  const borderRadius = radii[radius];

  // Glass variant uses BlurView on iOS, opaque cream fallback on Android
  const useGlass = variant === 'default' && Platform.OS === 'ios';

  return (
    <View style={[{ borderRadius, overflow: 'hidden', backgroundColor: cardBg }, shadow, style]}>
      {useGlass ? (
        <>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.glassFill }]} />
        </>
      ) : null}

      {(showTopLight || variant === 'leafHighlight') && (
        <LinearGradient
          colors={gradients.topLight}
          style={styles.topLight}
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
});
