import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { NeumorphicCard } from '@/components/ui/NeumorphicCard';
import { ProductRow } from '@/components/ui/ProductRow';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Menu, User, Fridge as FridgeGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { useFridge } from '@/src/hooks/useFridge';

type FilterValue = 'all' | 'produce' | 'dairy';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'produce', label: 'Produce' },
  { value: 'dairy', label: 'Dairy' },
];

export default function FridgeScreen() {
  const insets = useSafeAreaInsets();
  const { items, loading, refresh } = useFridge();
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.daysLeft - b.daysLeft);
    if (filter === 'all') return sorted;
    return sorted.filter((i) => i.category === filter);
  }, [items, filter]);

  const renderHeader = () => (
    <View style={[styles.header, { top: insets.top + 8 }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="menu"
        style={styles.headerBtn}
        hitSlop={8}
      >
        <Menu size={22} color={colors.ink} strokeWidth={1.6} />
      </Pressable>
      <Text style={[typeScale.labelSmall, styles.wordmark]}>FRESHCHECK</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="settings"
        style={styles.headerBtn}
        hitSlop={8}
      >
        <User size={22} color={colors.ink} strokeWidth={1.6} />
      </Pressable>
    </View>
  );

  if (loading && items.length === 0) {
    return (
      <AtmosphericBackground>
        {renderHeader()}
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </AtmosphericBackground>
    );
  }

  if (items.length === 0) {
    return (
      <AtmosphericBackground>
        {renderHeader()}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + 72,
              paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
              flexGrow: 1,
            },
          ]}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
          }
        >
          <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heroBlock}>
            <Text style={[typeScale.labelSmall, styles.eyebrow]}>INVENTORY STATUS</Text>
            <Text style={[typeScale.displayXL, styles.hero]}>My Fridge</Text>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(motion.moderate).delay(80)}
            style={styles.emptyWrap}
          >
            <NeumorphicCard radius="lg" padding={28} style={styles.emptyCard}>
              <View style={styles.emptyOrb}>
                <FridgeGlyph size={40} color={colors.primary} strokeWidth={1.4} />
              </View>
              <Text style={[typeScale.titleL, styles.emptyTitle]}>the shelves are empty</Text>
              <Text style={[typeScale.body, styles.emptyBody]}>
                scan your first item and we&apos;ll start watching it for you.
              </Text>
            </NeumorphicCard>
          </Animated.View>
        </ScrollView>
      </AtmosphericBackground>
    );
  }

  return (
    <AtmosphericBackground>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 72,
            paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
        }
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heroBlock}>
          <Text style={[typeScale.labelSmall, styles.eyebrow]}>INVENTORY STATUS</Text>
          <Text style={[typeScale.displayXL, styles.hero]}>My Fridge</Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(80)}
          style={styles.filterBlock}
        >
          <SegmentedControl<FilterValue>
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(160)}
          style={styles.listBlock}
        >
          {filtered.map((item) => (
            <ProductRow
              key={item.id}
              name={item.name}
              category={(item.category ?? 'produce').toString().toUpperCase()}
              tone={item.tone}
              daysLeft={item.daysLeft}
              totalDays={item.totalDays}
              thumbnail={item.thumbnailPath ?? undefined}
            />
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(motion.moderate).delay(240)}
          style={styles.footerBlock}
        >
          <Text style={[typeScale.labelSmall, styles.footerCount]}>
            {filtered.length} OF {items.length} PRODUCTS TRACKED
          </Text>
        </Animated.View>
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
  },
  header: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    color: colors.outline,
    textTransform: 'uppercase',
  },
  heroBlock: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.outline,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  hero: {
    color: colors.ink,
  },
  filterBlock: {
    marginBottom: spacing.xl,
  },
  listBlock: {
    marginBottom: spacing.lg,
  },
  footerBlock: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerCount: {
    color: colors.outline,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyCard: {
    alignItems: 'center',
  },
  emptyOrb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: 'rgba(75,93,67,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.ink,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});
