import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing, typeScale, toneColor, Tone, fonts } from '@/constants/tokens';

type Props = {
  verdict?: Tone;
  label?: string;
  serif?: boolean;
  small?: boolean;
  style?: ViewStyle;
};

const labelMap: Record<Tone, string> = {
  fresh: 'Fresh',
  safe: 'Safe',
  soon: 'Use soon',
  past: 'Past prime',
  neutral: '—',
};

/**
 * Tonal verdict chip. Default Fresh / Safe / Use soon / Past prime.
 * serif=true → Fraunces Italic (rare hero moment).
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.6
 */
export const VerdictPill: React.FC<Props> = ({
  verdict = 'fresh',
  label,
  serif,
  small,
  style,
}) => {
  const t = toneColor[verdict];
  const text = label ?? labelMap[verdict];

  const textStyle = serif
    ? { ...typeScale.heroSerif, fontSize: small ? 20 : 28, lineHeight: small ? 26 : 34 }
    : small
    ? typeScale.label
    : typeScale.titleS;

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: t.fill,
          paddingHorizontal: small ? spacing.sm : spacing.md,
          paddingVertical: small ? 4 : spacing.xs,
        },
        style,
      ]}
    >
      <Text style={[textStyle, { color: t.text, fontFamily: serif ? fonts.serifHero : textStyle.fontFamily }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
  },
});
