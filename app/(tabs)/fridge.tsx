import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, ActivityIndicator, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { ProductRow } from '@/components/ui/ProductRow';
import { FilterPillRow } from '@/components/ui/FilterPill';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { Menu, Settings, BarcodeScanner, ShoppingBasket, Nutrition, Chevron } from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';
import { useFridge } from '@/src/hooks/useFridge';

const cardShadow = Platform.select({
  web: {
    boxShadow: '8px 8px 16px #cbd5e1, -8px -8px 16px #ffffff, inset 2px 2px 5px #ffffff, inset -2px -2px 5px #cbd5e1',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
});

const iconShadow = Platform.select({
  web: {
    boxShadow: '6px 6px 12px #cbd5e1, -6px -6px 12px #ffffff',
  } as object,
  default: {
    shadowColor: '#94a3b8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 6,
    elevation: 6,
  },
});

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
      <View style={styles.scrollWrap}>
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
          <Text style={[typeScale.titleLarge, { color: colors.ink }]}>My Fridge</Text>
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>INVENTORY STATUS</Text>
        </View>

        {/* Recipes shortcut — visible only when there's something to cook with */}
        {items.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View recipe suggestions"
            onPress={() => router.push('/recipes')}
            style={[styles.recipesCtaWrap, cardShadow]}
          >
            <View style={styles.recipesCta}>
              <View style={[styles.recipesIconWrap, iconShadow]}>
                <Nutrition size={20} color={colors.primary} />
              </View>
              <Text style={[typeScale.titleSmall, styles.recipesText]}>
                Recipes from your fridge
              </Text>
              <Chevron size={18} color={colors.inkMuted} />
            </View>
          </Pressable>
        )}

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
              colors={['#E8EAED', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterFadeLeft}
              pointerEvents="none"
            />
            <LinearGradient
              colors={['transparent', '#E8EAED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.filterFadeRight}
              pointerEvents="none"
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
          <View style={[styles.empty, cardShadow]}>
            <View style={[styles.emptyIcon, iconShadow]}>
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
          </View>
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
        <LinearGradient
          colors={[colors.canvas, 'rgba(232,234,237,0)']}
          style={styles.headerFade}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.canvas,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingHeader,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.canvas,
    zIndex: 11,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: layout.floatingBottomClearance,
  },
  hero: {
    paddingHorizontal: 8,
    marginBottom: spacing.lg,
  },
  eyebrow: {
    color: colors.inkSecondary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  recipesCtaWrap: {
    marginHorizontal: 8,
    marginBottom: spacing.xxl,
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
  },
  recipesCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 16,
    gap: spacing.md,
  },
  recipesIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ECEDEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipesText: {
    flex: 1,
    color: colors.ink,
  },
  filterRow: {
    position: 'relative',
    marginBottom: spacing.huge,
    marginTop: -spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: 8,
    paddingVertical: 20,
  },
  filterFadeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 40,
    zIndex: 1,
  },
  filterFadeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 48,
    zIndex: 1,
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
    borderRadius: 40,
    backgroundColor: '#ECEDEF',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ECEDEF',
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
