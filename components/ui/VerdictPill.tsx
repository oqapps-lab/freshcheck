import React from 'react';
import { Text, View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typeScale, toneColor, Tone, fonts, shadows } from '@/constants/tokens';

type Props = {
  verdict?: Tone;
  label?: string;
  serif?: boolean;
  small?: boolean;
  glow?: boolean;
  style?: ViewStyle;
};

const labelMap: Record<Tone, string> = {
  fresh: 'Fresh',
  safe: 'Safe',
  soon: 'Use soon',
  past: 'Past prime',
  neutral: '—',
};

const gradientForVerdict = (v: Tone) => {
  switch (v) {
    case 'fresh':
      return gradients.verdictFresh;
    case 'safe':
      return gradients.verdictSafe;
    case 'soon':
      return gradients.verdictSoon;
    case 'past':
      return gradients.verdictPast;
    default:
      return null;
  }
};

const glowShadow = (v: Tone) => {
  switch (v) {
    case 'fresh':
    case 'safe':
      return shadows.card;
    case 'soon':
      return shadows.amberWarm;
    case 'past':
      return shadows.coralWarm;
    default:
      return undefined;
  }
};

/**
 * Tonal verdict chip.
 * v2 — gradient fills (not flat colors), optional outer glow, serif hero mode.
 *
 * serif=true → Fraunces Italic for rare hero moments ("Safe" on Scan Result).
 * glow=true → subtle warm-tinted outer shadow for emphasis.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.6
 */
export const VerdictPill: React.FC<Props> = ({
  verdict = 'fresh',
  label,
  serif,
  small,
  glow,
  style,
}) => {
  const t = toneColor[verdict];
  const text = label ?? labelMap[verdict];
  const grad = gradientForVerdict(verdict);
  const shadow = glow ? glowShadow(verdict) : undefined;

  // serif mode uses bigger padding + slightly bigger text
  const textStyle = serif
    ? { ...typeScale.heroSerif, fontSize: small ? 22 : 30, lineHeight: small ? 28 : 36 }
    : small
    ? typeScale.label
    : typeScale.titleS;

  // For serif mode we use a soft tonal fill (not hard gradient) for editorial feel
  // For non-serif we use the rich gradient
  const useGradient = !serif && grad !== null;

  return (
    <View
      style={[
        styles.pill,
        {
          paddingHorizontal: small ? spacing.sm : serif ? 22 : spacing.md,
          paddingVertical: small ? 4 : serif ? 10 : spacing.xs,
          backgroundColor: serif ? t.fill : useGradient ? 'transparent' : t.fill,
        },
        shadow,
        style,
      ]}
    >
      {useGradient && grad && (
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {useGradient && (
        <View pointerEvents="none" style={styles.innerTopLight} />
      )}
      <Text
        style={[
          textStyle,
          {
            color: t.text,
            fontFamily: serif ? fonts.serifHero : textStyle.fontFamily,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  innerTopLight: {
    position: 'absolute',
    top: 1,
    left: 12,
    right: 12,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
