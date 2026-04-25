import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii, spacing, typeScale, Tone, toneColor } from '@/constants/tokens';
import { CategoryGlyph, categoryFor } from './CategoryGlyph';
import { NeumorphicCard } from './NeumorphicCard';

type Props = {
  name: string;
  expiryText?: string;
  category?: string;
  tone: Tone;
  thumbnail?: string;
  daysLeft?: number;
  totalDays?: number;
  trailing?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

/**
 * v4 — Stitch fridge card. Pillowy neumorphic surface, thumb in a small
 * tinted square on the left, name + category eyebrow stacked, big days
 * number on the right, tone-tinted countdown stripe along the bottom.
 *
 * Ref: docs/06-design/DESIGN-V4.md §ProductRow
 */
export const ProductRow: React.FC<Props> = ({
  name,
  expiryText,
  category,
  tone,
  thumbnail,
  daysLeft,
  totalDays,
  trailing,
  onPress,
  style,
}) => {
  const t = toneColor[tone];
  const cat = category ?? categoryFor(name).toUpperCase();
  const Wrapper: any = onPress ? Pressable : View;

  return (
    <NeumorphicCard radius="md" padding={0} style={StyleSheet.flatten([styles.outer, style])}>
      <Wrapper
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${name}, ${cat}, ${typeof daysLeft === 'number' ? `${daysLeft} days left` : expiryText ?? ''}`}
        style={styles.row}
      >
        <View style={[styles.thumb, { backgroundColor: t.fill }]}>
          {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={160}
            />
          ) : (
            <CategoryGlyph
              category={categoryFor(name)}
              size={26}
              color={t.accent}
              strokeWidth={1.6}
            />
          )}
        </View>

        <View style={styles.body}>
          <Text style={[typeScale.titleM, styles.name]} numberOfLines={2}>
            {name}
          </Text>
          <Text style={[typeScale.labelSmall, styles.category]} numberOfLines={1}>
            {cat}
          </Text>
        </View>

        {trailing ??
          (typeof daysLeft === 'number' ? (
            <View style={styles.daysCol}>
              <Text style={[typeScale.displayM, styles.daysNumber]}>{daysLeft}</Text>
              <Text style={[typeScale.labelSmall, styles.daysLabel]}>
                {daysLeft === 1 ? 'DAY' : 'DAYS'}
              </Text>
            </View>
          ) : null)}
      </Wrapper>

      {/* Tone-tinted countdown stripe along the bottom edge */}
      {typeof daysLeft === 'number' && typeof totalDays === 'number' && (
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                backgroundColor: t.accent,
                width: `${Math.max(8, Math.min(100, (daysLeft / Math.max(1, totalDays)) * 100))}%`,
              },
            ]}
          />
        </View>
      )}
    </NeumorphicCard>
  );
};

const styles = StyleSheet.create({
  outer: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  body: {
    flex: 1,
  },
  name: {
    color: colors.onSurface,
  },
  category: {
    color: colors.outline,
    marginTop: 4,
  },
  daysCol: {
    alignItems: 'flex-end',
    minWidth: 56,
  },
  daysNumber: {
    color: colors.onSurface,
    lineHeight: 30,
  },
  daysLabel: {
    color: colors.outline,
    marginTop: 2,
  },
  barTrack: {
    height: 3,
    backgroundColor: colors.outlineVariant,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
});
