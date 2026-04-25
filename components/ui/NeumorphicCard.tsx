import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { colors, radii, shadows } from '@/constants/tokens';

type Variant = 'raised' | 'flat' | 'inset' | 'pill';

type Props = ViewProps & {
  variant?: Variant;
  radius?: keyof typeof radii;
  padding?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/**
 * v4 "Paper & Pith" neumorphic surface.
 *
 * Two-layer structure so iOS shadow renders without being clipped:
 *   outer  → backgroundColor surface, shadow, borderRadius. NO `overflow`.
 *   inner  → padding, top-edge highlight, optional clip via overflow:'hidden'.
 *
 * Variants:
 *   raised — default. White face + soft drop shadow.
 *   flat   — white face, no shadow. For nesting inside another raised card.
 *   inset  — softer inner-shadow look, tinted face.
 *   pill   — alias for raised; pair with radius='full' for round buttons.
 */
export const NeumorphicCard: React.FC<Props> = ({
  variant = 'raised',
  radius = 'md',
  padding = 16,
  style,
  children,
  ...rest
}) => {
  const r = radii[radius];

  if (variant === 'flat') {
    return (
      <View
        {...rest}
        style={[
          styles.fillFace,
          { borderRadius: r, padding, backgroundColor: colors.surface },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  if (variant === 'inset') {
    return (
      <View
        {...rest}
        style={[
          styles.fillFace,
          styles.insetFace,
          { borderRadius: r, padding },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // raised + pill — outer (with shadow + bg, NO overflow) wraps inner
  // (with padding + clip + content). Both share the same borderRadius.
  return (
    <View
      {...rest}
      style={[
        styles.outer,
        shadows.panel,
        { borderRadius: r, backgroundColor: colors.surface },
        style,
      ]}
    >
      <View
        pointerEvents="box-none"
        style={[styles.inner, { borderRadius: r, padding }]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.highlight,
            { borderTopLeftRadius: r, borderTopRightRadius: r },
          ]}
        />
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    // shadow + bg live here so iOS doesn't clip the drop shadow
  },
  inner: {
    flex: 1,
    overflow: 'hidden',
  },
  fillFace: {
    overflow: 'hidden',
  },
  insetFace: {
    backgroundColor: colors.canvasMist,
    shadowColor: '#bcb9b0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 1,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
