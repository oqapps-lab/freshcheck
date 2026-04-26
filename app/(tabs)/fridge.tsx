import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { ProductRow } from '@/components/ui/ProductRow';
import { FilterPillRow } from '@/components/ui/FilterPill';
import { Menu, Settings } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useFridge } from '@/src/hooks/useFridge';

type FilterValue = 'all' | 'produce' | 'dairy' | 'poultry' | 'bakery' | 'pantry';

const CATEGORY_LABEL: Record<Exclude<FilterValue, 'all'>, string> = {
  produce: 'Produce',
  dairy: 'Dairy',
  poultry: 'Poultry',
  bakery: 'Bakery',
  pantry: 'Pantry',
};
const CATEGORY_ORDER: Exclude<FilterValue, 'all'>[] = [
  'produce',
  'dairy',
  'poultry',
  'bakery',
  'pantry',
];

/**
 * My Fridge — re-implementation of /tmp/stitch_v2/fridge.html.
 *
 *   <header neomorph-pill[] / FRESHCHECK / neomorph-pill[]>
 *   <h1 text-5xl bold>My Fridge</h1>
 *   <p text-xs tracked uppercase>Inventory Status</p>
 *   <FilterPillRow All / Produce / Dairy>
 *   <ProductRow ...> × N (cushion 40px radius, p-8, gap-10)
 *   <p text-xs tracked uppercase center>4 OF 10 PRODUCTS TRACKED</p>
 */
export default function FridgeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items } = useFridge();
  const [filter, setFilter] = useState<FilterValue>('all');

  const filterOptions = useMemo<{ value: FilterValue; label: string }[]>(() => {
    const present = new Set(items.map((i) => i.category as FilterValue));
    const cats = CATEGORY_ORDER.filter((c) => present.has(c));
    return [
      { value: 'all', label: 'All' },
      ...cats.map((c) => ({ value: c, label: CATEGORY_LABEL[c] })),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.daysLeft - b.daysLeft);
    if (filter === 'all') return sorted;
    return sorted.filter((i) => i.category === filter);
  }, [items, filter]);

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[typeScale.displayLarge, { color: colors.ink }]}>My Fridge</Text>
          <Text style={[typeScale.label, styles.eyebrow]}>INVENTORY STATUS</Text>
        </View>

        {/* Filter chips — horizontal scrolling row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <FilterPillRow options={filterOptions} value={filter} onChange={setFilter} />
        </ScrollView>

        {/* Cards */}
        <View style={styles.list}>
          {filtered.map((item) => (
            <ProductRow
              key={item.id}
              name={item.name}
              category={item.category}
              daysLeft={item.daysLeft}
              shelfDays={item.totalDays || 14}
            />
          ))}
        </View>

        {/* Footer counter */}
        <Text style={[typeScale.label, styles.footer]}>
          {`${filtered.length} OF ${items.length} PRODUCTS TRACKED`}
        </Text>
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
  hero: {
    paddingHorizontal: 8,
    marginBottom: spacing.huge,
  },
  eyebrow: {
    color: colors.inkSecondary,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  filterScroll: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    marginBottom: spacing.huge,
  },
  list: {
    gap: spacing.huge,
    paddingHorizontal: 8,
  },
  footer: {
    color: colors.inkSecondary,
    textAlign: 'center',
    marginTop: spacing.enormous,
    textTransform: 'uppercase',
  },
});
