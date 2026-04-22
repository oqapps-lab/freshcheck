import React from 'react';
import { View, ViewStyle } from 'react-native';
import { toneColor, Tone } from '@/constants/tokens';

type Props = {
  tone?: Tone;
  size?: 6 | 8 | 10 | 12;
  style?: ViewStyle;
};

/**
 * v3 — tiny status dot. 8pt default (was 10 in v2).
 */
export const TokenDot: React.FC<Props> = ({ tone = 'fresh', size = 8, style }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: toneColor[tone].dot,
        opacity: 0.6,
      },
      style,
    ]}
  />
);
