import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { PillCTA } from '@/components/ui/PillCTA';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ProductRow } from '@/components/ui/ProductRow';
import { Menu, Plus } from '@/components/ui/Glyphs';
import { colors, spacing, typeScale, layout } from '@/constants/tokens';
import { fridgeItems, fridgeSummary } from '@/mock/fridge';

/**
 * Your Fridge — /(tabs)/fridge
 * Ref: docs/06-design/DESIGN-GUIDE.md §7.3
 */
export default function FridgeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <AtmosphericBackground>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable hitSlop={10} accessibilityRole="button" accessibilityLabel="Menu">
          <Menu size={24} color={colors.ink} />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={[typeScale.titleL, { color: colors.ink }]}>Your Fridge</Text>
          <Eyebrow center>{`${fridgeSummary.total} items · ${fridgeSummary.expiring} expiring`}</Eyebrow>
        </View>

        <VerdictPill verdict="past" label={`${fridgeSummary.expiring} expiring`} small />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 88,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 80,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        {fridgeItems.map((item) => (
          <ProductRow
            key={item.id}
            name={item.name}
            expiryText={item.expiryText}
            tone={item.tone}
            thumbnailPlaceholder={item.placeholder}
            daysLeft={item.daysLeft}
            totalDays={item.totalDays}
            warn={item.warn}
          />
        ))}
      </ScrollView>

      <View style={[styles.floatingCta, { bottom: insets.bottom + layout.floatingBottomClearance - 16 }]}>
        <PillCTA
          label="Add product"
          icon={<Plus size={22} color={colors.white} />}
          fullWidth
        />
      </View>
    </AtmosphericBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  floatingCta: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
  },
});
