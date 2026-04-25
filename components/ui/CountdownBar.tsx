import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, toneColor, Tone } from '@/constants/tokens';

type Props = {
  daysLeft: number;
  totalDays: number;
  tone?: Tone;
  style?: ViewStyle;
};

const TRACK_HEIGHT = 6;

const deriveTone = (daysLeft: number): Tone => {
  if (daysLeft <= 2) return 'past';
  if (daysLeft <= 5) return 'soon';
  return 'fresh';
};

/**
 * v4 — free-standing horizontal countdown bar.
 *
 * 6pt track at outlineVariant, fill width = daysLeft / totalDays clamped,
 * fill color = toneColor[tone].accent. Tone auto-derives from daysLeft
 * if not provided.
 *
 * The new ProductRow renders its own bottom-edge stripe; this primitive
 * is for use elsewhere (e.g. scan result storage card).
 *
 * Ref: docs/06-design/DESIGN-V4.md
 */
export const CountdownBar: React.FC<Props> = ({ daysLeft, totalDays, tone, style }) => {
  const ratio =
    totalDays > 0 ? Math.max(0, Math.min(1, daysLeft / totalDays)) : 0;
  const resolvedTone: Tone = tone ?? deriveTone(daysLeft);
  const fillColor = toneColor[resolvedTone].accent;
  const fillPct = `${Math.round(ratio * 100)}%` as const;

  return (
    <View
      style={[styles.track, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`${daysLeft} days left of ${totalDays}`}
    >
      <View
        style={[
          styles.fill,
          {
            width: fillPct,
            backgroundColor: fillColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: radii.full,
    backgroundColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    borderRadius: radii.full,
  },
});
