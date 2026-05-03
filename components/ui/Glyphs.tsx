import React from 'react';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const stroke = (props: Props) => ({
  size: props.size ?? 24,
  color: props.color ?? '#1A1A1A',
  strokeWidth: props.strokeWidth ?? 2,
});

export function Menu(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="7" x2="21" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="3" y1="17" x2="21" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function Settings(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0 .47-.04.92-.12 1.36l2.04 1.59-2 3.46-2.4-.96a7.4 7.4 0 0 1-2.36 1.37L14.2 21h-4.4l-.36-2.18a7.4 7.4 0 0 1-2.36-1.37l-2.4.96-2-3.46 2.04-1.59A7.4 7.4 0 0 1 4.6 12c0-.47.04-.92.12-1.36L2.68 9.05l2-3.46 2.4.96A7.4 7.4 0 0 1 9.44 5.18L9.8 3h4.4l.36 2.18a7.4 7.4 0 0 1 2.36 1.37l2.4-.96 2 3.46-2.04 1.59c.08.44.12.89.12 1.36z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

export function Back(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Chevron(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Close(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function Check(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12l5 5L20 7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function User(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

/** Eco / leaf — Stitch tab "leaf" icon */
export function Eco(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 3C7 3 4 6 4 11c0 5 4 9 9 9 4 0 7-3 7-7 0-1-.3-2-.7-2.8M11 3c1.5.5 4 2 5.5 4.5M11 3v17"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

/** Barcode scanner — used in tab bar + scan orb */
export function BarcodeScanner(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="6.5" y1="8" x2="6.5" y2="16" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
      <Line x1="9.5" y1="8" x2="9.5" y2="16" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
      <Line x1="12.5" y1="8" x2="12.5" y2="16" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
      <Line x1="15.5" y1="8" x2="15.5" y2="16" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
      <Line x1="17.5" y1="8" x2="17.5" y2="16" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round" />
    </Svg>
  );
}

/** History — clock-rewind */
export function History(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function Cloud(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11-2 5 5 0 0 0 0 10h11z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

/** Shopping basket — Add to Fridge button */
export function ShoppingBasket(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9h18l-2 11a2 2 0 0 1-2 1.7H7a2 2 0 0 1-2-1.7L3 9z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill="none" />
      <Path d="M8 9V6a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function WaterDrop(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.5c-3 4.2-6 7.6-6 11.5a6 6 0 0 0 12 0c0-3.9-3-7.3-6-11.5z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.92} />
    </Svg>
  );
}

/** Material-Symbols-Outlined "nutrition" (apple) — Stitch fridge produce icon */
export function Nutrition(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6c-2 0-3-2-3-3 1 .5 2 1.5 3 3 1-1.5 2-2.5 3-3 0 1-1 3-3 3z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.15}
      />
      <Path
        d="M7 10c-2 1-3 4-3 6 0 3 3 5 5 5s2.5-1 3-1 1 1 3 1 5-2 5-5c0-2-1-5-3-6-1.5-.7-3 0-5 0s-3.5-.7-5 0z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.92} strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Material "local_drink" — milk/dairy */
export function LocalDrink(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 4h10l-1 16a2 2 0 0 1-2 1.7H10a2 2 0 0 1-2-1.7L7 4z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.92} strokeLinejoin="round" />
      <Path d="M8 9c1 .5 3 .5 4 0s3-.5 4 0" stroke="#fff" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Material "egg_alt" — avocado-ish */
export function EggAlt(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c-4 0-7 5-7 10a7 7 0 0 0 14 0c0-5-3-10-7-10z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity={0.92} strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="3" fill="#fff" />
    </Svg>
  );
}

export function Sparkle(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l1.6 4.6L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.4L12 3z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M19 15l.7 1.8L21 17.5l-1.4.7L19 20l-.6-1.8L17 17.5l1.4-.7L19 15z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

export function Zap(p: Props) {
  const { size, color, strokeWidth } = stroke(p);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CategoryGlyph({
  category,
  size = 28,
  color = '#16a34a',
  strokeWidth = 1.8,
}: { category: string } & Props) {
  const props = { size, color, strokeWidth };
  const c = category.toLowerCase();
  if (c === 'produce' || c === 'fruit' || c === 'vegetable') return <Nutrition {...props} />;
  if (c === 'dairy' || c === 'dairy alt' || c === 'milk') return <LocalDrink {...props} />;
  if (c === 'poultry' || c === 'meat' || c === 'fish') return <EggAlt {...props} />;
  return <Nutrition {...props} />;
}
