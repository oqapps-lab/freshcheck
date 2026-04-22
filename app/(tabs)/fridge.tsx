import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ProductRow } from '@/components/ui/ProductRow';
import { VerdictPill } from '@/components/ui/VerdictPill';
import { colors, spacing, typeScale, layout, motion } from '@/constants/tokens';
import { fridgeItems, fridgeSummary } from '@/mock/fridge';

export default function FridgeScreen() {
  const insets = useSafeAreaInsets();

  // Sort by days left ascending — most-urgent first
  const sorted = [...fridgeItems].sort((a, b) => a.daysLeft - b.daysLeft);
  const expiring = sorted.filter((i) => i.tone === 'past' || i.tone === 'soon');
  const steady = sorted.filter((i) => i.tone !== 'past' && i.tone !== 'soon');

  return (
    <AtmosphericBackground>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + layout.floatingBottomClearance + 24,
          paddingHorizontal: layout.screenPadding,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(motion.moderate)} style={styles.heading}>
          <Text style={[typeScale.displayM, { color: colors.onSurface }]}>your fridge</Text>
          <Text style={[typeScale.body, { color: colors.secondary, marginTop: 4 }]}>
            {fridgeSummary.total} items · {fridgeSummary.expiring} want attention
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
});
