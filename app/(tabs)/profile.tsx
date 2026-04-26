import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

/** Profile placeholder — awaiting Stitch HTML for this screen. */
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 32 }]}>
      <Text style={[typeScale.displayLarge, styles.title]}>Profile</Text>
      <Text style={[typeScale.body, styles.note]}>HTML for this screen not yet provided.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: layout.screenPadding,
  },
  title: { color: colors.ink, marginBottom: spacing.md },
  note: { color: colors.inkSecondary },
});
