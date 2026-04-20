import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii } from '@/constants/tokens';

type Props = {
  daysLeft: number;
  totalDays: number;
  height?: number;
  style?: ViewStyle;
};

/**
 * Traffic-light fill bar. Green → amber → coral.
 * Fill % chosen by elapsed portion:
 *   < 50%  → countdownFresh (green)
 *   50-85% → countdownSoon  (green→amber)
 *   > 85%  → countdownPast  (amber→coral)
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.9
 */
export const CountdownBar: React.FC<Props> = ({ daysLeft, totalDays, height = 6, style }) => {
  const elapsed = Math.max(0, Math.min(1, (totalDays - daysLeft) / totalDays));
  const fillGradient =
    elapsed >= 0.85
      ? gradients.countdownPast
      : elapsed >= 0.5
      ? gradients.countdownSoon
      : gradients.countdownFresh;

  const fillPct = `${Math.round(elapsed * 100)}%` as const;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: colors.hairline,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={`${daysLeft} days left of ${totalDays}`}
    >
      <LinearGradient
        colors={fillGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { height, width: fillPct, borderRadius: height / 2 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
