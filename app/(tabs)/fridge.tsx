import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ProductRow } from '@/components/ui/ProductRow';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Fridge as FridgeGlyph } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout, motion, radii } from '@/constants/tokens';
import { useFridge } from '@/src/hooks/useFridge';

export default function FridgeScreen() {
  const insets = useSafeAreaInsets();
  const { items, summary, loading, refresh } = useFridge();

  const sorted = [...items].sort((a, b) => a.daysLeft - b.daysLeft);
  const expiring = sorted.filter((i) => i.tone === 'past' || i.tone === 'soon');
  const steady = sorted.filter((i) => i.tone !== 'past' && i.tone !== 'soon');

  if (loading && items.length === 0) {
    return (
      <AtmosphericBackground>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </AtmosphericBackground>
    );
  }

  if (items.length === 0) {
    return (
      <AtmosphericBackground>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
            paddingHorizontal: layout.screenPadding,
            flexGrow: 1,
          }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        >
          <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heading}>
            <Text style={[typeScale.displayM, { color: colors.onSurface }]}>your fridge</Text>
          </Animated.View>
          <View style={styles.emptyWrap}>
            <View style={styles.emptyOrb}>
              <FridgeGlyph size={40} color={colors.primary} strokeWidth={1.3} />
            </View>
            <Text style={[typeScale.titleS, styles.emptyTitle]}>the shelves are empty</Text>
            <Text style={[typeScale.body, styles.emptyBody]}>
              scan your first item and we'll start watching it for you.
            </Text>
          </View>
        </ScrollView>
      </AtmosphericBackground>
    );
  }

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heading}>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>your fridge</Text>
          <Text style={[typeScale.body, { color: colors.secondary, marginTop: 4 }]}>
            {summary.total} items · {summary.expiring} want attention
          </Text>
        </Animated.View>

        {expiring.length > 0 && (
          <Animated.View entering={FadeIn.duration(motion.moderate).delay(80)} style={styles.section}>
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              wants attention
            </Eyebrow>
            {expiring.map((item) => (
              <ProductRow
                key={item.id}
                name={item.name}
                expiryText={item.expiryText}
                tone={item.tone}
                daysLeft={item.daysLeft}
                totalDays={item.totalDays}
                trailing={<VerdictPill verdict={item.tone} small />}
              />
            ))}
          </Animated.View>
        )}

        {steady.length > 0 && (
          <Animated.View entering={FadeIn.duration(motion.moderate).delay(160)} style={styles.section}>
            <Eyebrow uppercase style={{ marginBottom: 12 }}>
              plenty of time
            </Eyebrow>
            {steady.map((item) => (
              <ProductRow
                key={item.id}
                name={item.name}
                expiryText={item.expiryText}
                tone={item.tone}
                daysLeft={item.daysLeft}
                totalDays={item.totalDays}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyOrb: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    backgroundColor: 'rgba(125,166,125,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.onSurface,
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: spacing.xl,
  },
});
