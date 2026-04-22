import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  Screen,
  Card,
  Text,
  PillCTA,
  IconButton,
  VerdictBadge,
  BottomNav,
  BottomNavTab,
  TopBar,
} from '@/components/primitives';
import { colors, radii, shadows, spacing } from '@/constants/tokens';
import { user } from '@/mock/user';
import { recentScans } from '@/mock/scans';
import { fridgeItems, fridgeSummary } from '@/mock/fridge';

const FREE_DAILY_LIMIT = 5;
const USED_TODAY = 2;

export default function PilotHome() {
  const [tab, setTab] = useState<string>('home');
  const lastScan = recentScans[0];
  const expiringCount = fridgeItems.filter((i) => i.tone === 'past' || i.tone === 'soon').length;

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
          title={`Hi, ${user.name.split(' ')[0]}!`}
          subtitle="Let's check what's in your kitchen"
          trailing={
            <IconButton
              icon={<Text variant="titleM">⚙</Text>}
              variant="ghost"
              accessibilityLabel="Settings"
            />
          }
        />

        {expiringCount > 0 ? (
          <Pressable
            onPress={() => {
              setTab('fridge');
              router.push('/pilot/fridge');
            }}
            accessibilityRole="button"
            accessibilityLabel={`${expiringCount} products expiring soon, view fridge`}
          >
            {({ pressed }) => (
              <Card
                variant="muted"
                style={pressed ? { ...styles.banner, ...styles.pressed } : styles.banner}
              >
                <View style={styles.bannerRow}>
                  <View style={styles.bannerIcon}>
                    <Text variant="titleL">⚠</Text>
                  </View>
                  <View style={styles.bannerText}>
                    <Text variant="bodyStrong" tone="primary">
                      {expiringCount} items expiring soon
                    </Text>
                    <Text variant="caption" tone="secondary">
                      Tap to review your fridge
                    </Text>
                  </View>
                  <Text variant="titleL" tone="primary">
                    ›
                  </Text>
                </View>
              </Card>
            )}
          </Pressable>
        ) : null}

        <View style={styles.section}>
          <Text variant="labelSmall" tone="secondary">LAST SCAN</Text>
          <View style={{ height: spacing.xs }} />
          <Pressable
            onPress={() => router.push('/pilot/scan-result')}
            accessibilityRole="button"
            accessibilityLabel="View last scan"
          >
            {({ pressed }) => (
              <Card style={pressed ? styles.pressed : undefined}>
                <View style={styles.scanRow}>
                  <View style={styles.thumb}>
                    <Text variant="h1">{lastScan.placeholder}</Text>
                  </View>
                  <View style={styles.scanBody}>
                    <Text variant="h3">{lastScan.product}</Text>
                    <View style={{ height: 4 }} />
                    <View style={styles.inline}>
                      <VerdictBadge kind="safe" size="sm" />
                      <Text variant="caption" tone="secondary">
                        {lastScan.scannedAt}
                      </Text>
                    </View>
                  </View>
                  <Text variant="titleL" tone="secondary">›</Text>
                </View>
              </Card>
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <Card variant="flat">
            <View style={styles.counterRow}>
              <Text variant="bodyStrong">Today's scans</Text>
              <Text variant="bodyStrong" tone="primary" tabularNumbers>
                {USED_TODAY}/{FREE_DAILY_LIMIT}
              </Text>
            </View>
            <View style={{ height: spacing.xs }} />
            <FreeQuotaBar used={USED_TODAY} limit={FREE_DAILY_LIMIT} />
            <View style={{ height: spacing.xs }} />
            <Text variant="caption" tone="secondary">
              Resets at midnight · Plus removes the limit
            </Text>
          </Card>
        </View>

        <View style={{ height: spacing.xxl }} />
      </Screen>

      <View style={styles.floatingCta} pointerEvents="box-none">
        <PillCTA
          size="lg"
          label="Scan food"
          leading={<Text variant="titleM" tone="onPrimary">📷</Text>}
          onPress={() => router.push('/pilot/scan-result')}
        />
      </View>

      <BottomNav
        tabs={tabs}
        active={tab}
        onChange={(k) => {
          setTab(k);
          if (k === 'fridge') router.push('/pilot/fridge');
        }}
      />
    </>
  );
}

function FreeQuotaBar({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(1, used / limit);
  return (
    <View style={quotaStyles.track}>
      <View
        style={[
          quotaStyles.fill,
          { width: `${pct * 100}%`, backgroundColor: colors.primary },
        ]}
      />
    </View>
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
  banner: { marginTop: spacing.md },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amberContainer,
  },
  bannerText: { flex: 1, gap: 2 },
  section: { marginTop: spacing.lg },
  scanRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFixed,
  },
  scanBody: { flex: 1 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  floatingCta: {
    position: 'absolute',
    bottom: 120,
    left: spacing.lg,
    right: spacing.lg,
    ...shadows.cta,
  },
});

const quotaStyles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radii.full },
});
