import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { ProductRow } from '@/components/ui/ProductRow';
import { FilterPillRow } from '@/components/ui/FilterPill';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { LinearGradient } from 'expo-linear-gradient';
import { Menu, Settings, BarcodeScanner, ShoppingBasket } from '@/components/ui/Glyphs';
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
  const { items, loading, refresh } = useFridge();
  const [filter, setFilter] = useState<FilterValue>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

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

  // If the active filter's category no longer has any items (e.g. user
  // removed the last poultry item while standing on the Poultry chip),
  // the chip disappears from the row but the selected state lingers —
  // user sees zero cards with no visible chip highlighted. Reset to All.
  useEffect(() => {
    if (filter === 'all') return;
    if (!filterOptions.some((o) => o.value === filter)) {
      setFilter('all');
    }
  }, [filter, filterOptions]);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[typeScale.displayLarge, { color: colors.ink }]}>My Fridge</Text>
          <Text style={[typeScale.label, styles.eyebrow]}>INVENTORY STATUS</Text>
        </View>

        {/* Filter chips — horizontal scrolling row. Hide when there are
            no items at all so the empty state isn't preceded by a lone
            "All" chip with nothing to filter.

            The right-edge fade gradient is preventive affordance: with
            ≤4 categories the row fits the 402-pt viewport (verified),
            but as soon as Bakery/Pantry items show up, chips need to
            scroll. Without the fade, off-screen chips look like they
            don't exist (Rule 16). */}
        {items.length > 0 && (
          <View style={styles.filterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              <FilterPillRow options={filterOptions} value={filter} onChange={setFilter} />
            </ScrollView>
            <LinearGradient
              pointerEvents="none"
              colors={[`${colors.canvas}00`, colors.canvas]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.filterFade}
            />
          </View>
        )}

        {loading && items.length === 0 ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : items.length === 0 ? (
          // Empty state — first-run signed-in user with nothing tracked
          // yet. Without this they'd see a blank slab + "0 OF 0 PRODUCTS
          // TRACKED" footer that reads as broken.
          <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.empty}>
            <View style={styles.emptyIcon}>
              <ShoppingBasket size={40} color={colors.primary} strokeWidth={1.6} />
            </View>
            <Text style={[typeScale.titleLarge, styles.emptyTitle]}>
              Fridge is empty
            </Text>
            <Text style={[typeScale.body, styles.emptyBody]}>
              Scan an item to start tracking what's in your fridge and when it'll go off.
            </Text>
            <PrimaryPillCTA
              label="Scan first item"
              onPress={() => router.replace('/(tabs)')}
              iconLeft={
                <BarcodeScanner size={22} color={colors.amber} strokeWidth={2.2} />
              }
            />
          </SoftSurface>
        ) : (
          <>
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
          </>
        )}
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
  filterRow: {
    position: 'relative',
    marginBottom: spacing.huge,
  },
  filterScroll: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  filterFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 32,
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
  loadingState: {
    paddingVertical: spacing.huge * 2,
    alignItems: 'center',
  },
  empty: {
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.inkSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
});
