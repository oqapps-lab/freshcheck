import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { Menu, Settings, BarcodeScanner } from '@/components/ui/Glyphs';
import { colors, typeScale, spacing, layout } from '@/constants/tokens';

/**
 * Home tab — placeholder scan orb until the real Stitch HTML lands.
 * Centred neumorphic disc (cushion + inset cup) navigates straight
 * to the scan tab so the home screen isn't a dead-end. Replace this
 * block when the home/scan HTML is provided.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const onScan = () => {
    Haptics.selectionAsync().catch(() => {});
    router.replace('/(tabs)/scan');
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <IconButton accessibilityLabel="menu" onPress={() => router.replace('/(tabs)/profile')}>
          <Menu size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>FRESHCHECK</Text>
        <IconButton accessibilityLabel="settings" onPress={() => router.replace('/(tabs)/profile')}>
          <Settings size={20} color={colors.ink} />
        </IconButton>
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBlock}>
          <Text style={[typeScale.displayLarge, styles.title]}>Ready to Scan</Text>
          <Text style={[typeScale.bodyLarge, styles.subtitle]}>
            Point at food. Result in 3 seconds.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tap to scan"
          onPress={onScan}
          style={styles.orbWrap}
        >
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.orbOuter}>
            <SoftInset
              radius="full"
              strength="thick"
              style={styles.orbCup}
              contentStyle={styles.orbCupInner}
            >
              <BarcodeScanner size={88} color={colors.primary} strokeWidth={1.5} />
            </SoftInset>
          </SoftSurface>
        </Pressable>

        <Text style={[typeScale.label, styles.tapHint]}>TAP TO SCAN</Text>
      </ScrollView>
    </View>
  );
}

const ORB_OUTER = 248;
const ORB_CUP = 196;

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
  orbOuter: {
    width: ORB_OUTER,
    height: ORB_OUTER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbCup: {
    width: ORB_CUP,
    height: ORB_CUP,
  },
  orbCupInner: {
    width: ORB_CUP,
    height: ORB_CUP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.xxl,
    letterSpacing: 2,
  },
});
