import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import { GhostText } from '@/components/ui/GhostText';
import {
  Close,
  Sparkle,
  Zap,
  BarcodeScanner,
  Cloud,
  Nutrition,
  History,
  Check,
} from '@/components/ui/Glyphs';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

type Plan = 'monthly' | 'yearly';

const FEATURES: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; title: string; body: string }[] = [
  { icon: BarcodeScanner, title: 'Unlimited scans', body: 'Scan as many items as you want, no daily cap.' },
  { icon: Nutrition,      title: 'AI ripeness analysis', body: 'Per-item softness, ripeness and best-by guidance.' },
  { icon: Cloud,          title: 'Cloud sync',       body: 'Your fridge follows you across iPhone and iPad.' },
  { icon: History,        title: 'Smart reminders',  body: 'Custom alerts before items go off — never waste again.' },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>('yearly');

  const onStart = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert(
      'Start free trial',
      `7 days free, then ${plan === 'yearly' ? '$39.99 / year' : '$4.99 / month'}.\n\nReal billing is not wired up in this build.`,
    );
  };

  const onRestore = () => {
    Haptics.selectionAsync().catch(() => {});
    Alert.alert('Restore purchases', 'Coming soon.');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerSpacer} />
        <Text style={[typeScale.wordmark, styles.eyebrow]}>FRESHCHECK PRO</Text>
        <IconButton accessibilityLabel="close" onPress={() => router.back()}>
          <Close size={20} color={colors.ink} />
        </IconButton>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.huge },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <SoftSurface variant="cushion" radius="full" innerStyle={styles.heroIcon}>
            <Sparkle size={44} color={colors.amber} strokeWidth={1.6} />
          </SoftSurface>
          <Text style={[typeScale.displayMedium, styles.title]}>
            Unlock FreshCheck Pro
          </Text>
          <Text style={[typeScale.body, styles.subtitle]}>
            Stop guessing. Track every item, every recipe, every reminder — for less than a coffee a month.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresList}>
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <SoftSurface
              key={title}
              variant="cushion"
              radius="xxl"
              innerStyle={styles.featureCard}
            >
              <View style={styles.featureRow}>
                <SoftInset
                  radius="lg"
                  strength="medium"
                  style={styles.featureIcon}
                  contentStyle={styles.featureIconInner}
                >
                  <Icon size={22} color={colors.primary} />
                </SoftInset>
                <View style={styles.featureText}>
                  <Text style={[typeScale.titleMedium, styles.featureTitle]}>{title}</Text>
                  <Text style={[typeScale.bodySmall, styles.featureBody]}>{body}</Text>
                </View>
              </View>
            </SoftSurface>
          ))}
        </View>

        {/* Plans */}
        <View style={styles.plansBlock}>
          <PlanCard
            value="yearly"
            label="Yearly"
            price="$39.99"
            unit="/ year"
            badge="BEST VALUE"
            sublabel="Just $3.33 / month, billed yearly"
            active={plan === 'yearly'}
            onPress={() => setPlan('yearly')}
          />
          <PlanCard
            value="monthly"
            label="Monthly"
            price="$4.99"
            unit="/ month"
            sublabel="Cancel anytime"
            active={plan === 'monthly'}
            onPress={() => setPlan('monthly')}
          />
        </View>

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <PrimaryPillCTA
            label="Start 7-day free trial"
            onPress={onStart}
            iconLeft={<Zap size={22} color={colors.amber} strokeWidth={2.2} />}
          />
          <GhostText label="Restore purchase" onPress={onRestore} />
        </View>

        <Text style={[typeScale.bodySmall, styles.fineprint]}>
          7 days free, then your selected plan auto-renews. Cancel anytime in your App Store settings.
        </Text>
      </ScrollView>
    </View>
  );
}

function PlanCard({
  label,
  price,
  unit,
  sublabel,
  badge,
  active,
  onPress,
}: {
  value: Plan;
  label: string;
  price: string;
  unit: string;
  sublabel: string;
  badge?: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} plan, ${price} ${unit}`}
      accessibilityState={{ selected: active }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
    >
      {active ? (
        <SoftInset radius="xxl" strength="medium" contentStyle={styles.planInner}>
          <PlanContent label={label} price={price} unit={unit} sublabel={sublabel} badge={badge} active />
        </SoftInset>
      ) : (
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.planInner}>
          <PlanContent label={label} price={price} unit={unit} sublabel={sublabel} badge={badge} active={false} />
        </SoftSurface>
      )}
    </Pressable>
  );
}

function PlanContent({
  label,
  price,
  unit,
  sublabel,
  badge,
  active,
}: {
  label: string;
  price: string;
  unit: string;
  sublabel: string;
  badge?: string;
  active: boolean;
}) {
  return (
    <View style={styles.planRow}>
      <View style={styles.planRadioWrap}>
        {active ? (
          <View style={styles.planRadioFilled}>
            <Check size={14} color={colors.surfaceWhite} strokeWidth={3} />
          </View>
        ) : (
          <View style={styles.planRadioEmpty} />
        )}
      </View>
      <View style={styles.planText}>
        <View style={styles.planHeader}>
          <Text style={[typeScale.titleLarge, { color: colors.ink }]}>{label}</Text>
          {badge && (
            <View style={styles.planBadge}>
              <Text style={[typeScale.labelTiny, styles.planBadgeText]}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[typeScale.bodySmall, styles.planSublabel]}>{sublabel}</Text>
      </View>
      <View style={styles.planPriceWrap}>
        <Text style={[typeScale.titleMedium, { color: colors.ink }]}>{price}</Text>
        <Text style={[typeScale.bodySmall, styles.planUnit]}>{unit}</Text>
      </View>
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
  headerSpacer: { width: 48, height: 48 },
  eyebrow: { color: colors.inkSecondary },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  heroIcon: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.inkSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
  },
  featureIconInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    color: colors.ink,
  },
  featureBody: {
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  plansBlock: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  planInner: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  planRadioWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.inkMuted,
  },
  planRadioFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planText: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  planBadge: {
    backgroundColor: colors.amber,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  planBadgeText: {
    color: colors.surfaceWhite,
    letterSpacing: 1.4,
  },
  planSublabel: {
    color: colors.inkSecondary,
    marginTop: 2,
  },
  planPriceWrap: {
    alignItems: 'flex-end',
  },
  planUnit: {
    color: colors.inkSecondary,
  },
  ctaBlock: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  fineprint: {
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
    marginTop: spacing.lg,
  },
});
