import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typeScale, spacing } from '@/constants/tokens';

type Props = {
  label: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/**
 * GhostText — plain tracked-uppercase ghost button (e.g. "SCAN ANOTHER").
 * Stitch:
 *   <button class="w-full py-3 text-sm font-bold tracking-widest uppercase
 *                  text-center text-[var(--text-secondary)]">Scan Another</button>
 */
export function GhostText({ label, onPress, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.btn}
    >
      <Text style={[typeScale.label, styles.label]}>{label.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: colors.inkSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
