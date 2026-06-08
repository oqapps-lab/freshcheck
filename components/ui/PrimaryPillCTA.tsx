import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { colors, typeScale, spacing } from '@/constants/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  /** Slot left of the label — typically an amber icon */
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Override label colour (defaults to ink) */
  labelColor?: string;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * PrimaryPillCTA — RAISED neomorph-pill primary action.
 * Mirrors Stitch:
 *   <button class="neomorph-pill w-full py-5 text-lg font-bold">
 *     <icon class="text-amber"/> Add to Fridge
 *   </button>
 */
export function PrimaryPillCTA({
  label,
  onPress,
  iconLeft,
  iconRight,
  labelColor = colors.ink,
  fullWidth = true,
  accessibilityLabel,
  style,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[fullWidth && { width: '100%' }, style]}
    >
      <SoftSurface variant="pill" radius="full" innerStyle={styles.content}>
        <View style={styles.row}>
          {iconLeft}
          <Text style={[typeScale.titleMedium, { color: labelColor }]}>{label}</Text>
          {iconRight}
        </View>
      </SoftSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 20,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
