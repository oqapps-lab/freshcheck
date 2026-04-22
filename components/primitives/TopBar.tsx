import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { layout, spacing } from '@/constants/tokens';
import { Text } from './Text';

export type TopBarProps = {
  title?: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  align?: 'left' | 'center';
  style?: ViewStyle;
};

/**
 * Header row for a screen. No bottom border — separation via scroll shadow
 * or following Card elevation.
 */
export function TopBar({
  title,
  subtitle,
  leading,
  trailing,
  align = 'left',
  style,
}: TopBarProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.slot}>{leading}</View>
      <View
        style={[
          styles.center,
          align === 'center' ? styles.textCenter : styles.textLeft,
        ]}
      >
        {title ? (
          <Text variant="titleL" tone="primary" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.slot}>{trailing}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slot: {
    minWidth: layout.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, justifyContent: 'center' },
  textLeft: { alignItems: 'flex-start' },
  textCenter: { alignItems: 'center' },
});
