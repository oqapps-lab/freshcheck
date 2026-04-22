import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors, layout, radii, shadows, spacing } from '@/constants/tokens';
import { Text } from './Text';

export type BottomNavTabKey = string;

export type BottomNavTab = {
  key: BottomNavTabKey;
  label: string;
  icon: (active: boolean) => ReactNode;
  accessibilityLabel?: string;
};

export type BottomNavProps = {
  tabs: BottomNavTab[];
  active: BottomNavTabKey;
  onChange: (key: BottomNavTabKey) => void;
  style?: ViewStyle;
};

/**
 * Floating pill-shaped bottom navigation.
 * DESIGN-GUIDE §5, primitive #8. 5 tabs baseline.
 */
export function BottomNav({ tabs, active, onChange, style }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { paddingBottom: insets.bottom + layout.tabBarBottomGap },
        style,
      ]}
    >
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityLabel={tab.accessibilityLabel ?? tab.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => {
                if (!isActive) {
                  Haptics.selectionAsync().catch(() => {});
                  onChange(tab.key);
                }
              }}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.tabActive,
                pressed && styles.tabPressed,
              ]}
            >
              {tab.icon(isActive)}
              <Text
                variant="labelSmall"
                tone={isActive ? 'primary' : 'secondary'}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.tabBarMargin,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    height: layout.tabBarHeight,
    borderRadius: radii.xxl,
    paddingHorizontal: spacing.sm,
    ...shadows.tabBar,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    minHeight: layout.touchTargetMin,
  },
  tabActive: {
    backgroundColor: colors.primaryFixed,
  },
  tabPressed: { opacity: 0.7 },
});
