import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { Menu, Settings } from '@/components/ui/Glyphs';
import { colors, typeScale, spacing, layout } from '@/constants/tokens';

/**
 * Home tab — Stitch HTML for "Home / Scan" was not exported in this batch,
 * so we render a minimal placeholder consistent with the v8 design system.
 * Will be filled in when HTML for the home screen is provided.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16 },
        ]}
      >
        <IconButton accessibilityLabel="menu">
          <Menu size={20} color={colors.ink} />
        </IconButton>
        <Text style={[typeScale.wordmark, { color: colors.inkSecondary }]}>FRESHCHECK</Text>
        <IconButton accessibilityLabel="settings">
          <Settings size={20} color={colors.ink} />
        </IconButton>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroBlock}>
          <Text style={[typeScale.displayLarge, styles.title]}>Ready to Scan</Text>
          <Text style={[typeScale.bodyLarge, styles.subtitle]}>
            Point at food. Result in 3 seconds.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
  },
  heroBlock: {
    paddingHorizontal: 8,
    paddingVertical: spacing.huge,
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
});
