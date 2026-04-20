import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  size?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
};

/**
 * v3 — small circle with dew-drop shadow spec from Stitch:
 *   inset 2px 2px 4px rgba(255,255,255,0.9)
 *   inset -2px -2px 4px rgba(0,0,0,0.05)
 *   2px 4px 8px rgba(65,103,67,0.1)
 *
 * Used for food-item indicators in the Morning Greeting card.
 *
 * Ref: code.html .dew-drop
 */
export const DewDrop: React.FC<Props> = ({ size = 48, children, style }) => (
  <View
    style={[
      styles.drop,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
      style,
    ]}
  >
    {/* Inset white highlight (top-left) */}
    <View style={[StyleSheet.absoluteFill, styles.innerLight]} pointerEvents="none" />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  drop: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  innerLight: {
    borderRadius: 9999,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.95)',
    borderLeftColor: 'rgba(255,255,255,0.6)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
