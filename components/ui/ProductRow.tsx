import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { SoftInset } from './SoftInset';
import { CategoryGlyph } from './Glyphs';
import { RipeningProgress } from './RipeningProgress';
import { colors, spacing, typeScale } from '@/constants/tokens';

type Props = {
  name: string;
  category: string;
  daysLeft: number;
  /** total shelf-life days (defaults 14) */
  shelfDays?: number;
  onPress?: () => void;
};

/**
 * ProductRow — neomorph-cushion fridge card.
 * Mirrors Stitch HTML in /tmp/stitch_v2/fridge.html.
 *
 *   ┌───── neomorph-cushion (40px radius, p-8) ─────┐
 *   │ [recessed 64px glyph]  Title       N         │
 *   │                        CATEGORY    DAYS      │
 *   │ ▔▔▔▔▔ recessed 8px progress track ▔▔▔▔▔▔     │
 *   └───────────────────────────────────────────────┘
 */
export function ProductRow({
  name,
  category,
  daysLeft,
  shelfDays = 14,
  onPress,
}: Props) {
  const progress = Math.max(0.04, Math.min(1, daysLeft / shelfDays));

  // Match Stitch screens: solid colour for definitive states, gradient for transition
  let fillColor: string | undefined;
  let countColor: string = colors.primary;
  let glyphColor: string = colors.primary;

  if (daysLeft <= 1) {
    fillColor = colors.amber;
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else if (daysLeft <= 3) {
    // gradient slice — leave fillColor undefined
    countColor = colors.amber;
    glyphColor = colors.amber;
  } else {
    fillColor = colors.primary;
    countColor = colors.primary;
    glyphColor = colors.inkSecondary;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
    >
      <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.card}>
        <View style={styles.row}>
          {/* Recessed glyph tile */}
          <SoftInset
            radius="xl"
            strength="medium"
            background={colors.canvas}
            style={styles.glyphWrap}
            contentStyle={styles.glyphInner}
          >
            <CategoryGlyph category={category} size={28} color={glyphColor} />
          </SoftInset>

          {/* Body */}
          <View style={styles.body}>
            <Text style={[typeScale.titleLarge, { color: colors.ink }]} numberOfLines={2}>
              {name}
            </Text>
            <Text style={[typeScale.labelSmall, styles.category]}>
              {category.toUpperCase()}
            </Text>
          </View>

          {/* Days */}
          <View style={styles.daysWrap}>
            <Text style={[typeScale.numberHuge, { color: countColor }]}>{daysLeft}</Text>
            <Text style={[typeScale.labelTiny, styles.daysLabel]}>
              {daysLeft === 1 ? 'DAY' : 'DAYS'}
            </Text>
          </View>
        </View>

        <RipeningProgress progress={progress} fillColor={fillColor} style={styles.progress} />
      </SoftSurface>
    </Pressable>
  );
}

// Smaller glyph + tighter gaps to leave room for full product names like
// "Organic Whole Milk" / "Vine Cherry Tomatoes" without mid-word truncation.
const GLYPH = 56;

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  glyphWrap: {
    width: GLYPH,
    height: GLYPH,
  },
  glyphInner: {
    width: GLYPH,
    height: GLYPH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 4,
  },
  category: {
    color: colors.inkSecondary,
    marginTop: 4,
  },
  daysWrap: {
    alignItems: 'center',
    minWidth: 56,
    gap: 2,
  },
  daysLabel: {
    color: colors.inkSecondary,
    marginTop: 4,
  },
  progress: {
    marginTop: 0,
  },
});
