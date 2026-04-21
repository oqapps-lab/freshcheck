import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii, spacing, typeScale, shadows, Tone, toneColor } from '@/constants/tokens';
import { TokenDot } from './TokenDot';
import { CountdownBar } from './CountdownBar';

type Props = {
  name: string;
  expiryText: string;
  tone: Tone;
  thumbnail?: string;
  daysLeft?: number;
  totalDays?: number;
  trailing?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

/**
 * v3 — clean airy row on surfaceLowest. No coral halos, no tinted thumb gradients.
 * Thumbnail is a soft primaryFixed/surfaceContainer tile with initial letter.
 * Ample padding, generous vertical space between rows.
 *
 * Ref: Stitch reference "2. The Last Answer" row composition
 */
export const ProductRow: React.FC<Props> = ({
  name,
  expiryText,
  tone,
  thumbnail,
  daysLeft,
  totalDays,
  trailing,
  onPress,
  style,
}) => {
  const Container = onPress ? Pressable : View;
  const containerProps = onPress ? { onPress } : {};
  const t = toneColor[tone];

  return (
    <Container
      {...containerProps}
      style={[styles.row, shadows.soft, style]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name}, ${expiryText}`}
    >
      <View style={styles.thumb}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={160}
          />
        ) : (
          <Text style={[typeScale.titleL, { color: t.accent }]}>
            {name.charAt(0).toLowerCase()}
          </Text>
        )}
      </View>

      <View style={styles.body}>
        <Text style={[typeScale.titleS, { color: colors.onSurface }]} numberOfLines={2}>
          {name.toLowerCase()}
        </Text>
        <Text style={[typeScale.bodySmall, { color: colors.onSurfaceVariant, marginTop: 2 }]}>
          {expiryText.toLowerCase()}
        </Text>
        {typeof daysLeft === 'number' && typeof totalDays === 'number' && (
          <CountdownBar daysLeft={daysLeft} totalDays={totalDays} style={styles.countdown} />
        )}
      </View>

      {trailing ?? <TokenDot tone={tone} />}
    </Container>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceLowest,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  countdown: {
    marginTop: 8,
  },
});
