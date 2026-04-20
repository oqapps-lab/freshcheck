import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  style?: ViewStyle;
  palette?: Array<keyof typeof colors>;
};

/**
 * Decorative scatter of small tinted dots — used inside hero cards / sections
 * to add asymmetric editorial touches (per designMd "Embrace Asymmetry").
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5 (new v2 primitive)
 */
export const DecorDots: React.FC<Props> = ({
  style,
  palette = ['sageDim', 'peach', 'lavender', 'sageMist'],
}) => {
  // Fixed positions — hand-curated for editorial feel, not uniform grid
  const dots = [
    { x: '12%', y: '18%', size: 6, color: palette[0] },
    { x: '78%', y: '22%', size: 10, color: palette[1] },
    { x: '22%', y: '68%', size: 5, color: palette[2] },
    { x: '86%', y: '72%', size: 8, color: palette[0] },
    { x: '64%', y: '86%', size: 4, color: palette[3] },
    { x: '42%', y: '12%', size: 7, color: palette[3] },
  ];

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      {dots.map((d, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            borderRadius: d.size / 2,
            backgroundColor: colors[d.color as keyof typeof colors] as string,
            opacity: 0.55,
          }}
        />
      ))}
    </View>
  );
};
