import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { TabBarPill } from '@/components/ui/TabBarPill';
import { Home, Bowl, History, User } from '@/components/ui/Glyphs';
import { colors } from '@/constants/tokens';

// Home (scan orb) / Fridge / Recipes / Profile. The old "scan" tab
// duplicated the home orb's scan action and has been removed — scanning
// starts from Home, results show on a pushed /scan-result screen, and the
// freed slot now hosts Recipes (previously a pushed screen with no way
// back to it).
const TAB_KEYS = ['index', 'fridge', 'recipes', 'profile'] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TABS = [
  {
    key: 'index',
    label: 'home',
    icon: (active: boolean) => (
      <Home size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
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
    key: 'recipes',
    label: 'recipes',
    icon: (active: boolean) => (
      <Bowl size={26} color={active ? colors.ink : colors.inkSecondary} strokeWidth={2} />
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
  // ['(tabs)', '<tab>'] when inside the tab stack ('index' has no 2nd seg).
  const seg = (segments as readonly string[])[1];
  const activeKey: TabKey = (TAB_KEYS as readonly string[]).includes(seg)
    ? (seg as TabKey)
    : 'index';

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBarPill
        tabs={TABS}
        activeKey={activeKey}
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
