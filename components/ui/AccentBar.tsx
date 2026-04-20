import React from 'react';
import { View } from 'react-native';
import { toneColor, Tone, radii } from '@/constants/tokens';

type Props = {
  tone: Tone;
  height?: number;
  width?: number;
};

/**
 * Thin vertical accent strip — the colored left-edge of a product row.
 * Signals urgency by color: coral (past) / amber (soon) / sage (fresh).
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.10 (ProductRow)
 */
export const AccentBar: React.FC<Props> = ({ tone, height = 52, width = 4 }) => (
  <View
    style={{
      width,
      height,
      borderRadius: radii.xs,
      backgroundColor: toneColor[tone].accent,
    }}
  />
);
