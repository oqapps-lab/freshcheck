import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SoftSurface } from './SoftSurface';
import { colors } from '@/constants/tokens';

type Props = {
  onPress?: () => void;
  /** Total tappable size (default 48 — matches `.neomorph-pill p-3` ≈ 48px) */
  size?: number;
  background?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * IconButton — round neomorph-pill icon button.
 * Used for header (menu, settings), back chevron, close X.
 */
export function IconButton({
  onPress,
  size = 48,
  background = colors.canvas,
  accessibilityLabel,
  style,
  children,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        { width: size, height: size, opacity: pressed ? 0.9 : 1 },
        style,
      ]}
    >
      <SoftSurface
        variant="pill"
        radius="full"
        background={background}
        style={{ width: size, height: size }}
        innerStyle={{ width: size, height: size }}
      >
        <View style={[styles.center, { width: size, height: size }]}>
          {children}
        </View>
      </SoftSurface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
