import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { TabBarPill } from '@/components/ui/TabBarPill';
import { Eco, BarcodeScanner, History, User } from '@/components/ui/Glyphs';
import { colors } from '@/constants/tokens';

const TABS = [
  {
    key: 'index',
    label: 'home',
    icon: (active: boolean) => (
      <Eco size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
    ),
  },
  {
    key: 'scan',
    label: 'scan',
    icon: (active: boolean) => (
      <BarcodeScanner size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
    ),
  },
  {
    key: 'fridge',
    label: 'fridge',
    icon: (active: boolean) => (
      <History size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
    ),
  },
  {
    key: 'profile',
    label: 'profile',
    icon: (active: boolean) => (
      <User size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
    ),
  },
];

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  // Detect which tab segment is active. expo-router gives us
  // ['(tabs)', '<tab>'] when inside the tab stack.
  const active = (segments[1] ?? 'index') as string;

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBarPill
        tabs={TABS}
        activeKey={active === 'fridge' ? 'fridge' : active === 'profile' ? 'profile' : active === 'scan' ? 'scan' : 'index'}
        onChange={(key) => {
          const path = key === 'index' ? '/(tabs)' : `/(tabs)/${key}`;
          router.replace(path as never);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
  },
});
