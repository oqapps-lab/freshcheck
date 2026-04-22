import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { radii, spacing, Tone, toneColor } from '@/constants/tokens';
import { Text } from './Text';

export type VerdictKind = 'safe' | 'caution' | 'danger';

export type VerdictBadgeProps = {
  kind: VerdictKind;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
};

/**
 * Verdict indicator: SAFE / CAUTION / DANGER.
 *
 * DESIGN-GUIDE §2: color never the only carrier — we render
 * a glyph + text + tone in parallel, so color-blind users read the shape too.
 */
export function VerdictBadge({
  kind,
  label,
  size = 'md',
  style,
}: VerdictBadgeProps) {
  const tone: Tone = kindToTone[kind];
  const pal = toneColor[tone];
  const sizeVars = SIZE[size];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: pal.fill,
          paddingVertical: sizeVars.padY,
          paddingHorizontal: sizeVars.padX,
        },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`${label ?? defaultLabel[kind]}`}
    >
      <Text variant={sizeVars.glyph} style={{ color: pal.accent }}>
        {GLYPH[kind]}
      </Text>
      <Text variant={sizeVars.text} style={{ color: pal.text }}>
        {label ?? defaultLabel[kind]}
      </Text>
    </View>
  );
}

const kindToTone: Record<VerdictKind, Tone> = {
  safe: 'safe',
  caution: 'soon',
  danger: 'past',
};

const GLYPH: Record<VerdictKind, string> = {
  safe: '✓',
  caution: '⚠',
  danger: '✕',
};

const defaultLabel: Record<VerdictKind, string> = {
  safe: 'Safe',
  caution: 'Caution',
  danger: 'Danger',
};

const SIZE = {
  sm: {
    padY: 4,
    padX: spacing.sm,
    glyph: 'labelSmall' as const,
    text: 'labelSmall' as const,
  },
  md: {
    padY: 6,
    padX: spacing.md,
    glyph: 'label' as const,
    text: 'label' as const,
  },
  lg: {
    padY: spacing.xs,
    padX: spacing.lg,
    glyph: 'titleS' as const,
    text: 'titleS' as const,
  },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    borderRadius: radii.full,
  },
});
