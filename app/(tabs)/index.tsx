import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { Menu, Settings, BarcodeScanner } from '@/components/ui/Glyphs';
import { colors, typeScale, spacing, layout } from '@/constants/tokens';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onScan = () => {
    Haptics.selectionAsync().catch(() => {});
    router.push('/capture');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <IconButton accessibilityLabel="menu" onPress={() => router.replace('/(tabs)/profile')}>
          <Menu size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>FRESHCHECK</Text>
        <IconButton accessibilityLabel="settings" onPress={() => router.replace('/(tabs)/profile')}>
          <Settings size={20} color={colors.ink} />
        </IconButton>
      </View>
      <View style={styles.scrollWrap}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBlock}>
          <Text style={[typeScale.displayLarge, styles.title]}>Ready to Scan</Text>
          <Text style={[typeScale.bodyLarge, styles.subtitle]}>
            Point at food. Result in 3 seconds.
          </Text>
        </View>

        <View style={styles.orbWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tap to scan"
            onPress={onScan}
          >
            {/* Outer plate — double-contour-plate: extruded + inset rim */}
            <View style={[styles.orbPlate, plateWebShadow]}>
              {/* Inner raised disc — double-contour-inner */}
              <View style={[styles.orbButton, innerWebShadow]}>
                <BarcodeScanner size={60} color={colors.primary} strokeWidth={1.5} />
                <Text style={[typeScale.label, styles.tapHint]}>TAP TO SCAN</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
        <LinearGradient
          colors={[colors.canvas, 'rgba(232,234,237,0)']}
          style={styles.headerFade}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const ORB_OUTER = 256;
const ORB_INNER = 192;

// Web gets the exact CSS multi-shadow; native gets the closest RN approximation
const plateWebShadow = Platform.select({
  web: {
    boxShadow: '20px 20px 40px #c5c6c7, -20px -20px 40px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #c5c6c7',
  } as object,
  default: {
    shadowColor: '#c5c6c7',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 16,
  },
});

const innerWebShadow = Platform.select({
  web: {
    background: 'radial-gradient(circle at center, #f8f8f9 0%, #f0f1f2 100%)',
    boxShadow: '10px 10px 20px #d1d2d3, -10px -10px 20px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.85), inset -2px -2px 4px rgba(200,201,202,0.85), inset 16px 16px 35px rgba(200,201,202,0.38), inset -16px -16px 35px rgba(255,255,255,0.38)',
  } as object,
  default: {
    shadowColor: '#d1d2d3',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.70,
    shadowRadius: 10,
    elevation: 8,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.canvas,
    zIndex: 11,
  },
  scrollWrap: {
    flex: 1,
  },
  headerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xxl,
    paddingBottom: layout.floatingBottomClearance,
    alignItems: 'center',
  },
  heroBlock: {
    paddingHorizontal: 8,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.inkSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  orbWrap: {
    marginTop: spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbPlate: {
    width: ORB_OUTER,
    height: ORB_OUTER,
    borderRadius: ORB_OUTER / 2,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbButton: {
    width: ORB_INNER,
    height: ORB_INNER,
    borderRadius: ORB_INNER / 2,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tapHint: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
