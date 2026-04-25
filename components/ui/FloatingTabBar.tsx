import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, shadows, layout, spacing } from '@/constants/tokens';
import { Fridge, ChefHat, User } from './Glyphs';
import Svg, { Path } from 'react-native-svg';

/**
 * v4 — Stitch "Paper & Pith" tab bar.
 *
 * Single neumorphic pill, full-width gutter 24px, 4 outline icons,
 * one elevated sage scan-orb in the centre. Active tab → sage tint;
 * inactive → outline grey.
 */

const HomeIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = colors.outline,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-3v-6h-6v6H6a2 2 0 0 1-2-2v-8Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </Svg>
);

const HistoryIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = colors.outline,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1 0 3-6.7L3 8"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 4v4h4" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 8v4l3 2" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ScanIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = colors.white,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 8V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M20 8V6a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M4 16v2a2 2 0 0 0 2 2h2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M20 16v2a2 2 0 0 1-2 2h-2" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    <Path d="M4 12h16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index].name;

  const routeFor = (name: string) => state.routes.find((r) => r.name === name);
  const indexRoute = routeFor('index');
  const fridgeRoute = routeFor('fridge');
  const recipesRoute = routeFor('recipes');
  const profileRoute = routeFor('profile');

  const navTo = (route: { name: string; key: string } | undefined) => {
    if (!route) return;
    Haptics.selectionAsync().catch(() => {});
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (activeName !== route.name && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const openScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.getParent()?.navigate('scan/camera' as never);
  };

  const tint = (name: string) =>
    activeName === name ? colors.primary : colors.outline;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + layout.tabBarBottomGap }]}
    >
      {/* Pill background — neumorphic raised */}
      <View style={[styles.pill, shadows.panel]}>
        {/* Tab row — left + right pairs */}
        <View style={styles.row}>
          <TabBtn label="home" active={activeName === 'index'} onPress={() => navTo(indexRoute)}>
            <HomeIcon size={22} color={tint('index')} />
          </TabBtn>
          <TabBtn label="fridge" active={activeName === 'fridge'} onPress={() => navTo(fridgeRoute)}>
            <Fridge size={22} color={tint('fridge')} strokeWidth={1.5} />
          </TabBtn>
          {/* Spacer for the centre scan orb */}
          <View style={styles.scanSlot} />
          <TabBtn label="recipes" active={activeName === 'recipes'} onPress={() => navTo(recipesRoute)}>
            <ChefHat size={22} color={tint('recipes')} strokeWidth={1.5} />
          </TabBtn>
          <TabBtn label="profile" active={activeName === 'profile'} onPress={() => navTo(profileRoute)}>
            <User size={22} color={tint('profile')} strokeWidth={1.5} />
          </TabBtn>
        </View>
      </View>

      {/* Scan orb — elevated, sage primary fill */}
      <Pressable
        onPress={openScan}
        accessibilityRole="button"
        accessibilityLabel="scan food"
        style={({ pressed }) => [
          styles.scanOrb,
          shadows.shutter,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        <ScanIcon size={26} color={colors.white} />
      </Pressable>

      {/* Hidden text for accessibility cohesion (so screen readers don't think the orb is alone) */}
      <Text style={styles.srOnly}>{activeName} tab</Text>
    </View>
  );
};

const TabBtn: React.FC<{
  label: string;
  active?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}> = ({ label, active, onPress, children }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${label} tab`}
    accessibilityState={{ selected: !!active }}
    style={({ pressed }) => [styles.tab, pressed && { opacity: 0.55 }]}
  >
    {children}
  </Pressable>
);

const ORB_SIZE = 56;
const PILL_HEIGHT = 64;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    height: PILL_HEIGHT,
    width: '100%',
    maxWidth: 360,
    marginHorizontal: 24,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    height: PILL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanSlot: {
    width: ORB_SIZE + 8,
  },
  scanOrb: {
    position: 'absolute',
    bottom: PILL_HEIGHT / 2 - ORB_SIZE / 2,
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
