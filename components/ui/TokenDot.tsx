import React from 'react';
import { View, ViewStyle } from 'react-native';
import { toneColor, Tone } from '@/constants/tokens';

type Props = {
  tone?: Tone;
  size?: 8 | 10 | 12;
  style?: ViewStyle;
};

/**
 * Tiny status dot. Rendered as a filled circle, no border.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.8
 */
export const TokenDot: React.FC<Props> = ({ tone = 'fresh', size = 10, style }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: toneColor[tone].dot,
      },
      style,
    ]}
  />
);
