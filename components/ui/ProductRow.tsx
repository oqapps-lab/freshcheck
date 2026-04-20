import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii, spacing, typeScale, shadows, Tone } from '@/constants/tokens';
import { AccentBar } from './AccentBar';
import { TokenDot } from './TokenDot';
import { WarningSoft } from './Glyphs';
import { CountdownBar } from './CountdownBar';

type Props = {
  name: string;
  expiryText: string;
  tone: Tone;
  thumbnail?: string;
  thumbnailPlaceholder?: string;
  daysLeft?: number;
  totalDays?: number;
  warn?: boolean;
  trailing?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

/**
 * Product row — used in Fridge list, Recent activity, Recipe ingredients-from-fridge.
 * Composition: [AccentBar | Thumbnail | name + expiry + optional countdown | TokenDot or trailing]
 *
 * Shadow is tone-aware: coralWarm for past, amberWarm for soon, default card for fresh.
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.10
 */
export const ProductRow: React.FC<Props> = ({
  name,
  expiryText,
  tone,
  thumbnail,
  thumbnailPlaceholder,
  daysLeft,
  totalDays,
  warn,
  trailing,
  onPress,
  style,
}) => {
  const rowShadow =
    tone === 'past' ? shadows.coralWarm : tone === 'soon' ? shadows.amberWarm : shadows.card;

  const ShadowContainer = onPress ? Pressable : View;
  const containerProps = onPress ? { onPress } : {};

  return (
    <ShadowContainer
      {...containerProps}
      style={[styles.row, rowShadow, style]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${expiryText}`}
    >
      <AccentBar tone={tone} height={56} />

      <View style={styles.thumb}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={160}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.cardMuted, alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={[typeScale.titleM, { color: colors.inkDim }]}>
              {thumbnailPlaceholder ?? name.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={[typeScale.titleS, { color: colors.ink }]} numberOfLines={1}>
          {name}
        </Text>

        <View style={styles.expiryRow}>
          {warn && <WarningSoft size={14} color={colors.coral} />}
          <Text
            style={[
              typeScale.bodySmall,
              { color: warn ? colors.coralInk : colors.inkMuted, marginLeft: warn ? 4 : 0 },
            ]}
          >
            {expiryText}
          </Text>
        </View>

        {typeof daysLeft === 'number' && typeof totalDays === 'number' && (
          <CountdownBar daysLeft={daysLeft} totalDays={totalDays} style={styles.countdown} />
        )}
      </View>

      {trailing ?? <TokenDot tone={tone} />}
    </ShadowContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.cardMuted,
  },
  body: {
    flex: 1,
    gap: 3,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdown: {
    marginTop: 6,
  },
});
