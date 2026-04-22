import React from 'react';
import Svg, { Path, Circle, Rect, Line, Ellipse, G } from 'react-native-svg';
import { colors } from '@/constants/tokens';

type Category = 'dairy' | 'poultry' | 'produce' | 'bakery' | 'pantry' | 'fish' | 'meat';

type Props = {
  category: Category;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * Line-art glyphs for fridge item categories.
 * Renders reliably on iOS sim + physical device (unlike emoji, which iOS 26
 * sim fails to render from the color-emoji font fallback chain).
 *
 * Ref: 2026-04-22 QA — iOS 26 simulator font-fallback bug for emoji in Text.
 */
export const CategoryGlyph: React.FC<Props> = ({
  category,
  size = 28,
  color = colors.primary,
  strokeWidth = 1.5,
}) => {
  const common = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  switch (category) {
    case 'dairy':
      // milk carton
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 8v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" {...common} />
          <Path d="M7 8V5l2-2h6l2 2v3Z" {...common} />
          <Line x1="10" y1="13" x2="14" y2="13" {...common} />
        </Svg>
      );
    case 'poultry':
      // drumstick
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M15.5 4.5a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-1.5-.3l-7 7-2.5.5.5-2.5 7-7A4 4 0 0 1 11.5 8.5a4 4 0 0 1 4-4Z" {...common} />
          <Circle cx="15.5" cy="8.5" r="1" fill={color} />
        </Svg>
      );
    case 'meat':
      // steak
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M6 9a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" {...common} />
          <Path d="M10 10a2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2Z" {...common} />
        </Svg>
      );
    case 'fish':
      // fish
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 12c2-4 6-6 10-6s6 2 8 6c-2 4-4 6-8 6s-8-2-10-6Z" {...common} />
          <Path d="M20 8l2 4-2 4" {...common} />
          <Circle cx="15" cy="11" r="0.8" fill={color} />
        </Svg>
      );
    case 'produce':
      // leaf
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 20C4 11 12 4 20 4c0 8-7 16-16 16Z" {...common} />
          <Path d="M4 20L14 10" {...common} />
        </Svg>
      );
    case 'bakery':
      // bread loaf
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 10c0-3 3-4 8-4s8 1 8 4v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" {...common} />
          <Line x1="8" y1="12" x2="8" y2="17" {...common} />
          <Line x1="12" y1="12" x2="12" y2="17" {...common} />
          <Line x1="16" y1="12" x2="16" y2="17" {...common} />
        </Svg>
      );
    case 'pantry':
      // jar
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" {...common} />
          <Rect x="6" y="7" width="12" height="14" rx="2" {...common} />
          <Line x1="6" y1="11" x2="18" y2="11" {...common} />
        </Svg>
      );
  }
};

// Map fridge-item categories + recipe placeholders to CategoryGlyph keys.
export function categoryFor(name: string): Category {
  const n = name.toLowerCase();
  if (/chicken|turkey|poultry|duck|drumstick/.test(n)) return 'poultry';
  if (/beef|pork|lamb|steak|meat|bacon|ham|sausage/.test(n)) return 'meat';
  if (/fish|salmon|tuna|cod|shrimp|seafood|trout|mackerel/.test(n)) return 'fish';
  if (/milk|cheese|cheddar|mozzarella|parmesan|yogurt|butter|cream|dairy|brie|feta/.test(n)) return 'dairy';
  if (/bread|bun|bagel|loaf|bakery|toast|croissant|pastry/.test(n)) return 'bakery';
  if (/oil|jar|sauce|pantry|spice|salt|sugar|flour|pasta|rice|cereal|olive|vinegar/.test(n)) return 'pantry';
  return 'produce';
}
