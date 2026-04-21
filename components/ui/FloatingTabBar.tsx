import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, shadows, gradients, layout } from '@/constants/tokens';
import { Fridge, ChefHat, User, Sprig } from './Glyphs';
import Svg, { Path } from 'react-native-svg';

/**
 * v3 — "Five Quiet Anchors" pattern from Stitch reference:
 * Glass pill at bottom with 4 flat tab icons + elevated center sage Scan button.
 * The center button is the app's primary action — taps open the camera.
 *
 * Ref: code.html §6 Five Quiet Anchors
 */

// Home icon (house outline) as an inline SVG — Material-style hairline
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

// Plus / scan icon for the center anchor
const PlusCircle: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = colors.white,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 8v8M8 12h8"
      stroke={color}
      strokeWidth={2.25}
      strokeLinecap="round"
    />
  </Svg>
);

export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // We have 4 tab routes in expo-router. We'll interleave a center "scan" button
  // that navigates to /scan/camera (not a tab, not a route here — separate stack).
  // Tabs order in app/(tabs)/_layout: index / fridge / recipes / profile
  // Display: Home · Fridge · [SCAN] · Recipes · Profile

  const routeFor = (name: string) => state.routes.find((r) => r.name === name);
  const indexRoute = routeFor('index');
  const fridgeRoute = routeFor('fridge');
  const recipesRoute = routeFor('recipes');
  const profileRoute = routeFor('profile');

  const activeName = state.routes[state.index].name;

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

  const iconColor = (name: string) =>
    activeName === name ? colors.primary : colors.outline;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + layout.tabBarBottomGap,
        },
        shadows.panel,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <>
          <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.fillIOS]} />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fillAndroid]} />
      )}

      <View pointerEvents="none" style={styles.innerTopHighlight} />

      <View style={styles.row}>
        <TabButton onPress={() => navTo(indexRoute)} label="home" active={activeName === 'index'}>
          <HomeIcon size={24} color={iconColor('index')} />
        </TabButton>
        <TabButton onPress={() => navTo(fridgeRoute)} label="fridge" active={activeName === 'fridge'}>
          <Fridge size={24} color={iconColor('fridge')} strokeWidth={1.5} />
        </TabButton>

        {/* Elevated center anchor — Scan button */}
        <View style={styles.anchorWrap}>
          <Pressable
            onPress={openScan}
            accessibilityRole="button"
            accessibilityLabel="Scan a food"
            style={({ pressed }) => [
              styles.anchorPressable,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
          >
            <View style={styles.anchorGlowOuter} />
            <View style={styles.anchor}>
              <LinearGradient
                colors={gradients.shutter}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <PlusCircle size={28} color={colors.white} />
            </View>
          </Pressable>
        </View>

        <TabButton onPress={() => navTo(recipesRoute)} label="recipes" active={activeName === 'recipes'}>
          <ChefHat size={24} color={iconColor('recipes')} strokeWidth={1.5} />
        </TabButton>
        <TabButton onPress={() => navTo(profileRoute)} label="profile" active={activeName === 'profile'}>
          <User size={24} color={iconColor('profile')} strokeWidth={1.5} />
        </TabButton>
      </View>
    </View>
  );
};

const TabButton: React.FC<{
  onPress: () => void;
  label: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onPress, label, active, children }) => (
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: layout.tabBarMargin + 4,
    right: layout.tabBarMargin + 4,
    height: layout.tabBarHeight,
    borderRadius: radii.full,
    overflow: 'visible',
  },
  fillIOS: {
    backgroundColor: 'rgba(255,255,255,0.70)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  fillAndroid: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  innerTopHighlight: {
    position: 'absolute',
    top: 0,
    left: 28,
    right: 28,
    height: 1,
    backgroundColor: colors.glassInnerHighlight,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    minWidth: 48,
  },
  anchorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 76,
    height: 76,
    marginTop: -40, // elevate above tab bar
  },
  anchorPressable: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anchorGlowOuter: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    opacity: 0.16,
  },
  anchor: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#416743',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
});
