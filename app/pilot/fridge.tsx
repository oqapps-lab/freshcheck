import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Card,
  Text,
  PillCTA,
  IconButton,
  Chip,
  VerdictBadge,
  BottomNav,
  BottomNavTab,
  TopBar,
} from '@/components/primitives';
import { colors, radii, shadows, spacing } from '@/constants/tokens';
import { fridgeItems, FridgeItem } from '@/mock/fridge';
import type { VerdictKind } from '@/components/primitives';

type LocationFilter = 'all' | 'fridge' | 'freezer' | 'pantry';

const FILTERS: { key: LocationFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fridge', label: 'Fridge' },
  { key: 'freezer', label: 'Freezer' },
  { key: 'pantry', label: 'Pantry' },
];

const FREE_FRIDGE_LIMIT = 10;

export default function PilotFridge() {
  const [filter, setFilter] = useState<LocationFilter>('all');
  const [tab, setTab] = useState<string>('fridge');

  const filtered = useMemo(
    () =>
      fridgeItems.filter((i) =>
        filter === 'all' ? true : i.location === filter,
      ),
    [filter],
  );

  const { expiring, good } = useMemo(() => {
    const e: FridgeItem[] = [];
    const g: FridgeItem[] = [];
    for (const i of filtered) {
      (i.tone === 'past' || i.tone === 'soon' ? e : g).push(i);
    }
    e.sort((a, b) => a.daysLeft - b.daysLeft);
    g.sort((a, b) => a.daysLeft - b.daysLeft);
    return { expiring: e, good: g };
  }, [filtered]);

  const total = fridgeItems.length;

  const tabs: BottomNavTab[] = [
    { key: 'home', label: 'Home', icon: (a) => <TabDot on={a} /> },
    { key: 'fridge', label: 'Fridge', icon: (a) => <TabDot on={a} /> },
    { key: 'guide', label: 'Guide', icon: (a) => <TabDot on={a} /> },
    { key: 'recipes', label: 'Recipes', icon: (a) => <TabDot on={a} /> },
    { key: 'profile', label: 'Profile', icon: (a) => <TabDot on={a} /> },
  ];

  return (
    <>
      <Screen scroll bottomClearance>
        <TopBar
          title="My Fridge"
          subtitle={`${total}/${FREE_FRIDGE_LIMIT} on Free`}
          leading={
            <IconButton
              icon={<Text variant="titleL">←</Text>}
              accessibilityLabel="Back"
              onPress={() => router.back()}
            />
          }
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={f.label}
              active={filter === f.key}
              onPress={() => setFilter(f.key)}
            />
          ))}
        </ScrollView>

        {expiring.length > 0 ? (
          <Section label="Expiring soon" count={expiring.length} accent="warn">
            {expiring.map((item) => (
              <ProductTile
                key={item.id}
                item={item}
                onPress={() => router.push('/pilot/scan-result')}
              />
            ))}
          </Section>
        ) : null}

        {good.length > 0 ? (
          <Section label="Fresh" count={good.length}>
            {good.map((item) => (
              <ProductTile
                key={item.id}
                item={item}
                onPress={() => router.push('/pilot/scan-result')}
              />
            ))}
          </Section>
        ) : null}

        {total >= FREE_FRIDGE_LIMIT - 2 ? (
          <Card variant="muted" style={styles.upsell}>
            <Text variant="bodyStrong">Running out of space</Text>
            <View style={{ height: 4 }} />
            <Text variant="caption" tone="secondary">
              {total}/{FREE_FRIDGE_LIMIT} items on Free. Plus removes the limit.
            </Text>
            <View style={{ height: spacing.sm }} />
            <PillCTA size="sm" label="See Plus" />
          </Card>
        ) : null}

        <View style={{ height: spacing.xxl }} />
      </Screen>

      <View style={styles.fab} pointerEvents="box-none">
        <PillCTA
          size="md"
          label="Add product"
          leading={<Text variant="titleM" tone="onPrimary">+</Text>}
        />
      </View>

      <BottomNav
        tabs={tabs}
        active={tab}
        onChange={(k) => {
          setTab(k);
          if (k === 'home') router.push('/pilot/home');
        }}
      />
    </>
  );
}

function Section({
  label,
  count,
  accent,
  children,
}: {
  label: string;
  count: number;
  accent?: 'warn';
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text
          variant="labelSmall"
          tone={accent === 'warn' ? 'warn' : 'secondary'}
        >
          {label.toUpperCase()} · {count}
        </Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function ProductTile({
  item,
  onPress,
}: {
  item: FridgeItem;
  onPress: () => void;
}) {
  const kind: VerdictKind =
    item.tone === 'past' ? 'danger' : item.tone === 'soon' ? 'caution' : 'safe';
  const pct = Math.min(1, Math.max(0, item.daysLeft / item.totalDays));
  const barColor =
    item.tone === 'past'
      ? colors.coral
      : item.tone === 'soon'
        ? colors.amber
        : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.expiryText}`}
    >
      {({ pressed }) => (
        <Card style={pressed ? styles.pressed : undefined}>
          <View style={styles.tileRow}>
            <View style={styles.thumb}>
              <Text variant="h2">{item.placeholder}</Text>
            </View>
            <View style={styles.tileBody}>
              <Text variant="h3" numberOfLines={1}>{item.name}</Text>
              <View style={{ height: 2 }} />
              <Text variant="bodyStrong" tone="secondary">
                {item.expiryText}
              </Text>
              <View style={{ height: spacing.xs }} />
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${pct * 100}%`, backgroundColor: barColor },
                  ]}
                />
              </View>
            </View>
            <VerdictBadge kind={kind} size="sm" />
          </View>
        </Card>
      )}
    </Pressable>
  );
}

function TabDot({ on }: { on: boolean }) {
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: radii.full,
        backgroundColor: on ? colors.primary : colors.outline,
      }}
    />
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  section: { marginTop: spacing.md },
  sectionHead: { marginBottom: spacing.xs },
  sectionBody: { gap: spacing.xs },
  tileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
  },
  tileBody: { flex: 1 },
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radii.full },
  upsell: { marginTop: spacing.md },
  pressed: { opacity: 0.95, transform: [{ scale: 0.995 }] },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: spacing.lg,
    left: spacing.lg,
    ...shadows.cta,
  },
});
