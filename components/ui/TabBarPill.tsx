import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoftSurface } from './SoftSurface';
import { SoftInset } from './SoftInset';
import { colors, layout, spacing } from '@/constants/tokens';

type Tab = {
  key: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

type Props = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
};

/**
 * TabBarPill — fixed bottom-10 floating pill, mirrors Stitch HTML.
 *   <nav class="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
 *     <div class="neomorph-pill flex justify-around items-center px-6 py-4">
 *       <button class="w-12 h-12">…inactive…</button>
 *       <button class="neomorph-pill-active w-14 h-14">…active…</button>
 *     </div>
 *   </nav>
 */
export function TabBarPill({ tabs, activeKey, onChange }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[styles.wrap, { bottom: Math.max(insets.bottom + 12, layout.tabBarBottomGap) }]}
      pointerEvents="box-none"
    >
      <SoftSurface
        variant="pill"
        radius="full"
        style={styles.surface}
        innerStyle={styles.bar}
      >
        <View style={styles.row}>
          {tabs.map((tab) => {
            const active = tab.key === activeKey;
            return (
              <Pressable
                key={tab.key}
                onPress={() => {
                  if (active) return;
                  Haptics.selectionAsync().catch(() => {});
                  onChange(tab.key);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${tab.label} tab`}
                accessibilityState={{ selected: active }}
                style={active ? styles.tabActive : styles.tabInactive}
              >
                {active ? (
                  <SoftInset
                    radius="full"
                    strength="thin"
                    style={styles.cup}
                    contentStyle={styles.cupInner}
                  >
                    {tab.icon(true)}
                  </SoftInset>
                ) : (
                  <View style={styles.flatIcon}>{tab.icon(false)}</View>
                )}
              </Pressable>
            );
          })}
        </View>
      </SoftSurface>
    </View>
  );
}

const ICON_INACTIVE = 38;
const ICON_ACTIVE = 44;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    // v11 tightened to 14%/14% (72% wide) — user read that as "thick and
    // narrow, horror". v12 = wider AND shorter: 5%/5% (90% wide) lets the
    // pill stretch like the cards above; padding/icon shrink kills the
    // chunky feel. Net height ~56 px (was ~80).
    left: '5%',
    right: '5%',
    alignItems: 'center',
  },
  // v12.1: width/maxWidth MUST live on the outer SoftSurface View. RN's
  // shadow-casting wrappers don't propagate child intrinsic-vs-explicit
  // width, so passing width:100% on innerStyle alone makes the inner
  // View match the parent's content-fit width — and the pill collapses
  // to ~206 px (4 icons + padding) regardless of the wrap-margin tweak.
  surface: {
    width: '100%',
    maxWidth: 460,
  },
  bar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabInactive: {
    width: ICON_INACTIVE,
    height: ICON_INACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    width: ICON_ACTIVE,
    height: ICON_ACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cup: {
    width: ICON_ACTIVE,
    height: ICON_ACTIVE,
  },
  cupInner: {
    width: ICON_ACTIVE,
    height: ICON_ACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatIcon: {
    width: ICON_INACTIVE,
    height: ICON_INACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
