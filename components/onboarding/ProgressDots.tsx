import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  total?: number;
  filled: number;
  style?: ViewStyle;
};

/**
 * v3 — 7 small dots at the top of onboarding screens. Filled dots use
 * primary sage; empty dots use a gentle hairline tint. Never uppercase,
 * never a progress bar — this is a quiet count, not a loading indicator.
 *
 * Ref: DESIGN-GUIDE §Onboarding step-dots.
 */
export const ProgressDots: React.FC<Props> = ({ total = 7, filled, style }) => {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: total }, (_, i) => {
        const isOn = i < filled;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              isOn ? styles.dotOn : styles.dotOff,
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOn: {
    backgroundColor: colors.primary,
  },
  dotOff: {
    backgroundColor: 'rgba(65,103,67,0.14)',
  },
});
