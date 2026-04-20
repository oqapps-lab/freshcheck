import React from 'react';
import Svg, { Path, Circle, Rect, Line, G } from 'react-native-svg';
import { colors } from '@/constants/tokens';

type GlyphProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

const defaultColor = colors.ink;
const defaultStroke = 1.75;

export const Sprig: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C12 21 4 17 4 9C4 7 5 4 6 4C7 4 8 6 10 7C12 8 13 10 13 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 21C12 21 20 17 20 9C20 7 19 4 18 4C17 4 16 6 14 7C12 8 11 10 11 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M12 12V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Scan: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 8V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M20 8V6a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M20 16v2a2 2 0 0 1-2 2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="1.2" fill={color} />
  </Svg>
);

export const Fridge: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="3" width="14" height="18" rx="3" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="5" y1="10" x2="19" y2="10" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="8" y1="6.5" x2="8" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="8" y1="13" x2="8" y2="15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const ChefHat: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 14c-1.7 0-3-1.3-3-3a3 3 0 0 1 2.4-2.94A4 4 0 0 1 12 5.5a4 4 0 0 1 6.6 2.56A3 3 0 0 1 21 11c0 1.7-1.3 3-3 3"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Line x1="9" y1="14" x2="9" y2="20" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="15" y1="14" x2="15" y2="20" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const User: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M4 20.5C5 16.9 8.2 14.5 12 14.5S19 16.9 20 20.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

export const Back: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 5l-7 7 7 7"
      stroke={color}
      strokeWidth={strokeWidth + 0.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const Heart: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 20S3.5 14.2 3.5 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.3C20.5 14.2 12 20 12 20Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const Menu: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="4" y1="17" x2="14" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const Plus: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={strokeWidth + 0.25} strokeLinecap="round" />
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth + 0.25} strokeLinecap="round" />
  </Svg>
);

export const Check: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12.5l4.5 4.5L19 7"
      stroke={color}
      strokeWidth={strokeWidth + 0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WarningSoft: React.FC<GlyphProps> = ({ size = 16, color = colors.coral, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 4.2 21 19.2a1.6 1.6 0 0 1-1.4 2.4H4.4A1.6 1.6 0 0 1 3 19.2L12 4.2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Line x1="12" y1="10" x2="12" y2="14" stroke={color} strokeWidth={strokeWidth + 0.25} strokeLinecap="round" />
    <Circle cx="12" cy="17.5" r="0.9" fill={color} />
  </Svg>
);

export const Droplet: React.FC<GlyphProps> = ({ size = 16, color = colors.sageInk, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3C12 3 5 11 5 15.5A7 7 0 0 0 19 15.5C19 11 12 3 12 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const Clock: React.FC<GlyphProps> = ({ size = 16, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 7.5V12l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Chevron: React.FC<GlyphProps & { direction?: 'right' | 'left' | 'up' | 'down' }> = ({
  size = 16,
  color = colors.inkDim,
  strokeWidth = defaultStroke,
  direction = 'right',
}) => {
  const rotation = { right: 0, left: 180, up: -90, down: 90 }[direction];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: `${rotation}deg` }] }}>
      <Path
        d="M9 6l6 6-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const Flash: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 3L5 14h5l-1 7 8-11h-5l1-7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const Close: React.FC<GlyphProps> = ({ size = 24, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth + 0.25} strokeLinecap="round" />
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth + 0.25} strokeLinecap="round" />
  </Svg>
);

export const Share: React.FC<GlyphProps> = ({ size = 20, color = defaultColor, strokeWidth = defaultStroke }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="6" cy="12" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18" cy="6" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18" cy="18" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="8.2" y1="11" x2="15.8" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="8.2" y1="13" x2="15.8" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);
