import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SoftInset } from './SoftInset';
import { colors, gradients } from '@/constants/tokens';

type Props = {
  /** 0..1 */
  progress: number;
  /** Total height (default 8 — matches Stitch h-2). */
  height?: number;
  /** Solid colour fill. If absent, uses the ripening gradient. */
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * RipeningProgress — recessed track with gradient or solid fill.
 *
 * Stitch CSS:
 *   <div class="w-full h-2 neomorph-recessed overflow-hidden">
 *     <div class="h-full ripening-gradient w-[20%] rounded-full"></div>
 *   </div>
 *
 * Track is RECESSED (inset). Fill is either solid `var(--accent-green)` /
 * `var(--accent-orange)` or a slice of the ripening gradient
 * (#16a34a → #f59e0b → #ef4444).
 */
export function RipeningProgress({
  progress,
  height = 8,
  fillColor,
  style,
}: Props) {
  const clamped = Math.max(0.04, Math.min(1, progress));
  return (
    <SoftInset
      radius={height / 2}
      strength="thin"
      background={colors.canvas}
      style={[{ height, width: '100%' }, style]}
      contentStyle={styles.track}
    >
      <View style={[styles.fillWrap, { width: `${clamped * 100}%`, height }]}>
        {fillColor ? (
          <View style={[styles.fill, { backgroundColor: fillColor, borderRadius: height / 2 }]} />
        ) : (
          <LinearGradient
            colors={gradients.ripening}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.fill, { borderRadius: height / 2 }]}
          />
        )}
      </View>
    </SoftInset>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
  },
  fillWrap: {
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
});
