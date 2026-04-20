import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, typeScale, shadows, Tone, toneColor, gradients } from '@/constants/tokens';
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

const haloGradient = (tone: Tone) => {
  switch (tone) {
    case 'past':
      return gradients.rowHaloPast;
    case 'soon':
      return gradients.rowHaloSoon;
    case 'fresh':
      return gradients.rowHaloFresh;
    default:
      return null;
  }
};

const thumbGradient = (tone: Tone) => {
  switch (tone) {
    case 'past':
      return gradients.monogramPast;
    case 'soon':
      return gradients.monogramSoon;
    default:
      return gradients.monogramSafe;
  }
};

/**
 * Product row — used in Fridge list, Recent activity, Recipe ingredients-from-fridge.
 * v2 — subtle tone-halo gradient backdrop behind each row + gradient monogram thumbnail.
 *
 * Composition:
 *   [halo gradient ................................................]
 *     [AccentBar | gradient Thumb + Letter | body | TokenDot|trailing]
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
  const halo = haloGradient(tone);

  return (
    <ShadowContainer
      {...containerProps}
      style={[styles.row, rowShadow, style]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${expiryText}`}
    >
      {halo && (
        <LinearGradient
          colors={halo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

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
          <>
            <LinearGradient
              colors={thumbGradient(tone)}
              start={{ x: 0.2, y: 0.2 }}
              end={{ x: 0.9, y: 0.9 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={[typeScale.titleL, { color: toneColor[tone].text }]}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </>
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
    overflow: 'hidden',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
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
