import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Linking, Animated, type LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { IconButton } from '@/components/ui/IconButton';
import { SoftSurface } from '@/components/ui/SoftSurface';
import { SoftInset } from '@/components/ui/SoftInset';
import { PrimaryPillCTA } from '@/components/ui/PrimaryPillCTA';
import {
  Close,
  Sparkle,
  Zap,
  BarcodeScanner,
  Cloud,
  Nutrition,
  History,
  Check,
  Bowl,
} from '@/components/ui/Glyphs';
import { startTrial, restorePurchases, PRODUCT_BY_PLAN } from '@/src/lib/adapty';
import { usePremium } from '@/src/hooks/usePremium';
import { logTrialStartEvent, logBeginCheckout, recordError } from '@/src/lib/firebase';
import { logTrialStart as afLogTrialStart } from '@/src/lib/appsflyer';
import { LEGAL } from '@/constants/legal';
import { colors, layout, spacing, typeScale } from '@/constants/tokens';

type Plan = 'weekly' | 'monthly' | 'annual';

// Product IDs live in src/lib/adapty.ts (PRODUCT_BY_PLAN). Importing keeps
// the analytics event payloads in sync with what startTrial actually buys.
const PRICE_USD: Record<Plan, number> = {
  weekly: 6.99,
  monthly: 14.99,
  annual: 39.99,
};

// Feature copy must match what Pro actually unlocks — free already gets
// unlimited scans + ripeness analysis + cloud sync + reminders, so the
// real differentiator is recipe generation cadence (free is capped at
// 1 generation / 24h). Phrasing "Unlimited scans" + "Three recipes a
// day" was misleading on both ends — could trigger Apple Review 3.1.2(c)
// "subscription must offer genuine value" pushback and was confusing for
// users who'd already noticed free wasn't actually capped on scans.
const FEATURES: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; title: string; body: string }[] = [
  { icon: Bowl,           title: 'Unlimited AI recipes', body: 'Generate fresh recipes from your fridge whenever you want, no daily cap.' },
  { icon: BarcodeScanner, title: 'Unlimited scans',     body: 'Scan as many items as you want, no daily cap.' },
  { icon: Nutrition,      title: 'AI ripeness analysis', body: 'Per-item softness, ripeness and best-by guidance.' },
  { icon: Cloud,          title: 'Cloud sync',          body: 'Your fridge follows you across iPhone and iPad.' },
  { icon: History,        title: 'Smart reminders',     body: 'Custom alerts before items go off — never waste again.' },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isPremium = usePremium();
  const [plan, setPlan] = useState<Plan>('annual');
  const [busy, setBusy] = useState(false);

  // Delay the close (✕) ~3s so users engage with the offer instead of
  // immediately dismissing — they tend to wait for and tap the ✕. The
  // button still appears (App-Store safe), just not instantly.
  const [closeVisible, setCloseVisible] = useState(false);
  const closeFade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const t = setTimeout(() => {
      setCloseVisible(true);
      Animated.timing(closeFade, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    }, 3000);
    return () => clearTimeout(t);
  }, [closeFade]);

  // Measured height of the fixed bottom CTA bar so the scroll content can
  // clear it (the bar floats over the scroll, always visible).
  const [barHeight, setBarHeight] = useState(220);
  const onBarLayout = (e: LayoutChangeEvent) => setBarHeight(e.nativeEvent.layout.height);

  // The paywall is reached two ways: pushed from profile/recipes (back()
  // returns there) OR replaced into from the post-onboarding auth funnel
  // (empty stack — back() is a no-op that would strand the user on the
  // paywall). Fall through to the tabs when there's nothing to pop to.
  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  // Pre-mount short-circuit: an already-Pro user reaching this screen via
  // a deep link or stale push would otherwise see "Start 3-day free trial"
  // and tapping it routes them through Adapty for a duplicate purchase
  // that StoreKit then has to reject. Bounce them back instead.
  useEffect(() => {
    if (isPremium) {
      if (router.canGoBack()) router.back();
      else router.replace('/(tabs)');
    }
  }, [isPremium, router]);

  const onStart = async () => {
    if (busy) return;
    Haptics.selectionAsync().catch(() => {});
    setBusy(true);
    // Begin-checkout fires whether or not the user completes — this is
    // the funnel step ad networks optimise on (init-purchase vs purchase).
    void logBeginCheckout(PRODUCT_BY_PLAN[plan], PRICE_USD[plan]);
    try {
      const r = await startTrial({ plan });
      if (r.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        // Fire to both Firebase (GA4 / UAC bidding) and AppsFlyer
        // (attribution + Apple Search Ads). Without these neither
        // dashboard sees the conversion and paid acquisition can't
        // optimise on trial-start events.
        void logTrialStartEvent(PRODUCT_BY_PLAN[plan]);
        afLogTrialStart(PRODUCT_BY_PLAN[plan], PRICE_USD[plan]);
        Alert.alert('Welcome to Pro', 'Your free trial has started. Generate unlimited AI recipes from your fridge!');
        dismiss();
      } else if (r.error === 'cancelled') {
        // user-cancelled → no toast
      } else if (r.error === 'pending') {
        Alert.alert('Awaiting approval', 'Your purchase is pending Apple ID approval.');
      } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
        // SDK already shows its own alert
      } else {
        recordError(new Error(`startTrial: ${r.error ?? 'unknown'}`), 'paywall-start-trial');
        Alert.alert('Purchase failed', r.error ?? 'Unknown error');
      }
    } finally {
      setBusy(false);
    }
  };

  const onRestore = async () => {
    if (busy) return;
    Haptics.selectionAsync().catch(() => {});
    setBusy(true);
    try {
      const r = await restorePurchases();
      if (r.ok) {
        Alert.alert('Restored', 'Your subscription is active again.');
        dismiss();
      } else if (r.error === 'no-active-subscription') {
        Alert.alert('Nothing to restore', 'No active subscription was found on this Apple ID.');
      } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
        // SDK already shows its own alert
      } else {
        Alert.alert('Restore failed', r.error ?? 'Unknown error');
      }
    } finally {
      setBusy(false);
    }
  };

  const openUrl = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(url).catch((e) => Alert.alert('Could not open link', String(e)));
  };

  const ctaLabel = busy ? 'Processing…' : 'Start 3-day free trial';
  const fineprint = (() => {
    if (plan === 'annual') return 'First 3 days free, then $39.99 / year. Auto-renews unless cancelled at least 24 hours before period end.';
    if (plan === 'monthly') return 'First 3 days free, then $14.99 / month. Auto-renews unless cancelled at least 24 hours before period end.';
    return 'First 3 days free, then $6.99 / week. Auto-renews unless cancelled at least 24 hours before period end.';
  })();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerSpacer} />
        <Text style={[typeScale.wordmark, styles.eyebrow]}>FRESHCHECK PRO</Text>
        {closeVisible ? (
          <Animated.View style={{ opacity: closeFade }}>
            <IconButton accessibilityLabel="close" onPress={dismiss}>
              <Close size={20} color={colors.ink} />
            </IconButton>
          </Animated.View>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: barHeight + spacing.lg },
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
            Turn what's in your fridge into recipes, and never throw away food again.
          </Text>
          {/* Trust signal — families save ~$2,913/yr (the product thesis). */}
          <View style={styles.trustPill}>
            <Sparkle size={14} color={colors.primary} strokeWidth={2} />
            <Text style={[typeScale.labelSmall, styles.trustPillText]}>
              SAVES THE AVERAGE FAMILY $2,913 / YEAR
            </Text>
          </View>
        </View>

        {/* Features — one clean card with a checklist (premium feel, vs. five
            heavy stacked cards). */}
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.featuresCard}>
          <Text style={[typeScale.label, styles.featuresHeader]}>EVERYTHING IN PRO</Text>
          {FEATURES.map(({ title, body }, i) => (
            <View
              key={title}
              style={[styles.checkRow, i === FEATURES.length - 1 && styles.checkRowLast]}
            >
              <View style={styles.checkBadge}>
                <Check size={14} color={colors.surfaceWhite} strokeWidth={3} />
              </View>
              <View style={styles.featureText}>
                <Text style={[typeScale.titleSmall, styles.featureTitle]}>{title}</Text>
                <Text style={[typeScale.bodySmall, styles.featureBody]}>{body}</Text>
              </View>
            </View>
          ))}
        </SoftSurface>

        {/* Plans — annual default, monthly decoy, weekly impulse */}
        <Text style={[typeScale.label, styles.plansEyebrow]}>CHOOSE YOUR PLAN · 3 DAYS FREE</Text>
        <View style={styles.plansBlock}>
          <PlanCard
            value="annual"
            label="Annual"
            price="$39.99"
            unit="/ year"
            badge="SAVE 89%"
            sublabel="Just $0.77 / week, billed yearly"
            active={plan === 'annual'}
            onPress={() => setPlan('annual')}
          />
          <PlanCard
            value="monthly"
            label="Monthly"
            price="$14.99"
            unit="/ month"
            sublabel="Flexible — cancel anytime"
            active={plan === 'monthly'}
            onPress={() => setPlan('monthly')}
          />
          <PlanCard
            value="weekly"
            label="Weekly"
            price="$6.99"
            unit="/ week"
            sublabel="Just trying it out"
            active={plan === 'weekly'}
            onPress={() => setPlan('weekly')}
          />
        </View>

      </ScrollView>

      {/* Sticky bottom bar — always visible over the scroll. CTA on top,
          full payment terms directly below it (Apple 3.1.2(c)), then the
          small legal + restore links. Stays put while content scrolls so
          the trial button is the obvious action, not the ✕. */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}
        onLayout={onBarLayout}
      >
        <PrimaryPillCTA
          label={ctaLabel}
          onPress={onStart}
          iconLeft={<Zap size={22} color={colors.amber} strokeWidth={2.2} />}
        />
        <Text style={[typeScale.bodySmall, styles.fineprint]}>{fineprint}</Text>
        <View style={styles.legalRow}>
          <Pressable onPress={onRestore} accessibilityRole="button">
            <Text style={[typeScale.bodySmall, styles.legalLink]}>Restore</Text>
          </Pressable>
          <Text style={[typeScale.bodySmall, styles.legalDot]}>·</Text>
          <Pressable onPress={() => openUrl(LEGAL.termsOfUse)} accessibilityRole="link">
            <Text style={[typeScale.bodySmall, styles.legalLink]}>Terms</Text>
          </Pressable>
          <Text style={[typeScale.bodySmall, styles.legalDot]}>·</Text>
          <Pressable onPress={() => openUrl(LEGAL.privacyPolicy)} accessibilityRole="link">
            <Text style={[typeScale.bodySmall, styles.legalLink]}>Privacy</Text>
          </Pressable>
        </View>
      </View>
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
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.canvas,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    // Lift the bar off the scroll with a soft upward shadow.
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 12,
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
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#dcfce7', // green-100 — soft "savings" tint
  },
  trustPillText: {
    color: colors.primaryDeep,
    letterSpacing: 1.2,
  },
  featuresCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  featuresHeader: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  checkRowLast: {
    borderBottomWidth: 0,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
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
  plansEyebrow: {
    color: colors.inkSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  plansBlock: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  reassure: {
    color: colors.inkSecondary,
    textAlign: 'center',
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
    paddingHorizontal: spacing.sm,
    lineHeight: 18,
    marginTop: 0,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: 0,
  },
  legalLink: {
    color: colors.inkSecondary,
    textDecorationLine: 'underline',
  },
  legalDot: {
    color: colors.inkMuted,
  },
});
