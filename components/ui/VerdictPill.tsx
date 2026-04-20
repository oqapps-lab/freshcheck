import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  colors,
  gradients,
  radii,
  spacing,
  typeScale,
  toneColor,
  Tone,
} from '@/constants/tokens';

type Props = {
  verdict?: Tone;
  label?: string;
  small?: boolean;
  style?: ViewStyle;
};

// Lowercase copy — "fresh" not "Fresh" per Stitch reference
const labelMap: Record<Tone, string> = {
  fresh: 'fresh',
  safe: 'safe',
  soon: 'eat soon',
  past: 'past',
  neutral: '—',
};

const gradientFor = (v: Tone) => {
  switch (v) {
    case 'fresh':
    case 'safe':
      return gradients.verdictFresh;
    case 'soon':
      return gradients.verdictSoon;
    case 'past':
      return gradients.verdictPast;
    default:
      return null;
  }
};

/**
 * v3 — simple lowercase verdict chip with gentle sage gradient (or muted
 * amber/coral for urgency states). No serif mode, no glow. Calm.
 *
 * Ref: code.html "milk" + "fresh" pill
 */
export const VerdictPill: React.FC<Props> = ({ verdict = 'fresh', label, small, style }) => {
  const t = toneColor[verdict];
  const text = label ?? labelMap[verdict];
  const grad = gradientFor(verdict);

  return (
    <View
      style={[
        styles.pill,
        {
          paddingHorizontal: small ? spacing.sm : spacing.md,
          paddingVertical: small ? 4 : 6,
          backgroundColor: grad ? 'transparent' : t.fill,
        },
        style,
      ]}
    >
      {grad && (
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <Text style={[small ? typeScale.labelSmall : typeScale.label, { color: t.text }]}>
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
});
