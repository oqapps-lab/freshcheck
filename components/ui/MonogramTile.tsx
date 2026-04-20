import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, shadows, typeScale, toneColor, Tone } from '@/constants/tokens';
import { PulseGlow } from './PulseGlow';
import { DecorDots } from './DecorDots';

type Props = {
  letter: string;
  tone?: Tone;
  size?: number;
  showGlow?: boolean;
  showDots?: boolean;
  style?: ViewStyle;
};

const monogramGradient = (tone: Tone) => {
  switch (tone) {
    case 'fresh':
    case 'safe':
      return gradients.monogramSafe;
    case 'past':
      return gradients.monogramPast;
    case 'soon':
      return gradients.monogramSoon;
    default:
      return gradients.monogramSafe;
  }
};

const pulseTone = (tone: Tone): 'sage' | 'coral' | 'peach' | 'cream' => {
  if (tone === 'past') return 'coral';
  if (tone === 'soon') return 'peach';
  return 'sage';
};

/**
 * Hero monogram tile — gradient-filled rounded square with a big initial letter.
 * Replaces emoji product photos. Optional pulse glow behind it + decorative dots inside.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5 (new v2 primitive)
 */
export const MonogramTile: React.FC<Props> = ({
  letter,
  tone = 'fresh',
  size = 200,
  showGlow,
  showDots,
  style,
}) => {
  const t = toneColor[tone];
  const letterFontSize = Math.round(size * 0.55);

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      {showGlow && <PulseGlow size={size * 1.4} tone={pulseTone(tone)} style={styles.glow} />}
      <View style={[styles.tile, { width: size, height: size }, shadows.heroDeep]}>
        <LinearGradient
          colors={monogramGradient(tone)}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.95 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Top-edge light */}
        <View pointerEvents="none" style={styles.topLight} />
        {showDots && <DecorDots />}
        <Text
          style={[
            typeScale.displayXL,
            {
              color: t.text,
              fontSize: letterFontSize,
              lineHeight: letterFontSize * 1.08,
            },
          ]}
        >
          {letter}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  tile: {
    borderRadius: radii.xxl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  topLight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: colors.glassTopLight,
  },
});
