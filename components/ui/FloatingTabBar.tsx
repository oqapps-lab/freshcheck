import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, shadows, spacing, typeScale, toneColor, layout } from '@/constants/tokens';
import { Fridge, ChefHat, User, Scan } from './Glyphs';

/**
 * Floating glass pill tab bar with 4 tabs: Home · Fridge · Recipes · Profile.
 * Passed to <Tabs tabBar={(props) => <FloatingTabBar {...props} />}>
 *
 * Active tab: pill pressed-back sageMist 85% fill.
 * Inactive: inkDim icon.
 *
 * Content clearance needed on each screen: paddingBottom: insets.bottom + 112
 *
 * Ref: docs/06-design/DESIGN-GUIDE.md §5.11
 */
export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const iconFor = (name: string, color: string) => {
    switch (name) {
      case 'index':
        return <Scan size={22} color={color} />;
      case 'fridge':
        return <Fridge size={22} color={color} />;
      case 'recipes':
        return <ChefHat size={22} color={color} />;
      case 'profile':
        return <User size={22} color={color} />;
      default:
        return null;
    }
  };

  const labelFor = (name: string) => {
    switch (name) {
      case 'index':
        return 'Home';
      case 'fridge':
        return 'Fridge';
      case 'recipes':
        return 'Recipes';
      case 'profile':
        return 'Profile';
      default:
        return name;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + layout.tabBarBottomGap,
          height: layout.tabBarHeight,
        },
        shadows.floating,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <>
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.fillIOS]} />
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fillAndroid]} />
      )}

      {/* Inner top-edge highlight */}
      <View pointerEvents="none" style={styles.topLight} />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconColor = focused ? colors.sageInk : colors.inkDim;

          const onPress = () => {
            Haptics.selectionAsync().catch(() => {});
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={labelFor(route.name)}
              accessibilityState={focused ? { selected: true } : {}}
              style={styles.tab}
            >
              <View style={[styles.tabInner, focused && styles.tabActive]}>
                {iconFor(route.name, iconColor)}
                <Text
                  style={[
                    typeScale.caption,
                    { color: iconColor, marginTop: 2, opacity: focused ? 1 : 0.9 },
                  ]}
                >
                  {labelFor(route.name)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: layout.tabBarMargin,
    right: layout.tabBarMargin,
    borderRadius: radii.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  fillIOS: {
    backgroundColor: 'rgba(255,251,242,0.82)',
  },
  fillAndroid: {
    backgroundColor: 'rgba(255,251,242,0.96)',
  },
  topLight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: colors.glassTopLight,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radii.full,
    minWidth: 64,
  },
  tabActive: {
    backgroundColor: toneColor.fresh.fill,
  },
});
