import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Animated, BackHandler, type LayoutChangeEvent } from 'react-native';
import { showAlert } from '@/src/state/alertStore';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  ShoppingBasket,
} from '@/components/ui/Glyphs';
import { startTrial, restorePurchases, PRODUCT_BY_PLAN, getTiers, type TierInfo } from '@/src/lib/adapty';
import { usePremium } from '@/src/hooks/usePremium';
import { useOnboardingAnswers } from '@/src/state/onboardingStore';
import { logTrialStartEvent, logBeginCheckout, recordError } from '@/src/lib/firebase';
import { track } from '@/src/lib/analytics';
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

// Feature copy must match what Pro actually unlocks. Free is capped on BOTH
// scans (FREE_SCANS_PER_DAY/day — see src/lib/freeLimits.ts) and AI recipe
// generation; Pro lifts both caps and adds one-tap barcode add-to-fridge,
// ripeness analysis, cloud sync and reminders. Keep this list in sync with
// the gates in capture.tsx (canScan / barcode Pro-gate) and useRecipes —
// mismatched copy risks Apple Review 3.1.2(c) "genuine value" pushback.
// title/body hold i18n leaf keys (under paywall.features.*) resolved with t()
// at the render site — keeping a hook out of this module-level array.
const FEATURES: { icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; titleKey: string; bodyKey: string }[] = [
  { icon: BarcodeScanner, titleKey: 'features.unlimitedScans.title',     bodyKey: 'features.unlimitedScans.body' },
  { icon: Bowl,           titleKey: 'features.unlimitedRecipes.title',   bodyKey: 'features.unlimitedRecipes.body' },
  { icon: ShoppingBasket, titleKey: 'features.barcodeAdd.title',         bodyKey: 'features.barcodeAdd.body' },
  { icon: Nutrition,      titleKey: 'features.wholeTable.title',         bodyKey: 'features.wholeTable.body' },
  { icon: Zap,            titleKey: 'features.batchScanning.title',      bodyKey: 'features.batchScanning.body' },
];

// Contextual hero copy — the limit-hit moment is the highest-intent paywall
// impression; a generic "Unlock Pro" there reads like a bug, not an offer.
// Values are i18n leaf keys (under paywall.hero.<variant>.*) resolved with
// t() at the render site.
const SRC_COPY: Record<string, { titleKey: string; subtitleKey: string }> = {
  'scan-limit': {
    titleKey: 'hero.scanLimit.title',
    subtitleKey: 'hero.scanLimit.subtitle',
  },
  barcode: {
    titleKey: 'hero.barcode.title',
    subtitleKey: 'hero.barcode.subtitle',
  },
  'recipe-limit': {
    titleKey: 'hero.recipeLimit.title',
    subtitleKey: 'hero.recipeLimit.subtitle',
  },
  default: {
    titleKey: 'hero.default.title',
    subtitleKey: 'hero.default.subtitle',
  },
};

export default function PaywallScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { src } = useLocalSearchParams<{ src?: string }>();
  const srcCopy = SRC_COPY[typeof src === 'string' ? src : 'default'] ?? SRC_COPY.default;
  const { premium: isPremium } = usePremium();
  const family = useOnboardingAnswers().household === 'family';
  const [plan, setPlan] = useState<Plan>('annual');
  // Live store-localized prices; falls back to the hardcoded USD literals
  // until Adapty is fully configured (Paid-Apps agreement + approved IAPs).
  const [tiers, setTiers] = useState<Partial<Record<Plan, TierInfo>> | null>(null);
  const [busy, setBusy] = useState(false);

  // Delay the close (✕) ~3s so users engage with the offer instead of
  // immediately dismissing — they tend to wait for and tap the ✕. The
  // button still appears (App-Store safe), just not instantly.
  const [closeVisible, setCloseVisible] = useState(false);
  const closeFade = useRef(new Animated.Value(0)).current;

  // Pull live prices once on mount; ignore failures (keeps the USD fallback).
  useEffect(() => {
    void getTiers().then((t) => {
      if (t) setTiers(t);
    });
  }, []);

  // ATT is requested earlier, on the onboarding priming screen
  // (app/att-priming.tsx) — not here. AppsFlyer is already initialised at cold
  // launch (VendorBoot). The paywall only logs trial/purchase events.
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
  const origin = typeof src === 'string' ? src : 'default';

  const dismiss = () => {
    track('paywall_dismiss', { origin });
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  // Android hardware back must DISMISS the paywall, not quit the app. When the
  // paywall is the post-onboarding root (empty stack), the default back press
  // would exit the app (tester B: "Back на paywall выбрасывает из приложения").
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      dismiss();
      return true;
    });
    return () => sub.remove();
  }, [dismiss]);

  // The limit-hit impression is the highest-intent paywall view — log it by
  // origin so view→trial conversion can be computed per trigger.
  useEffect(() => {
    track('paywall_view', { origin });
  }, [origin]);

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
    // Begin-checkout fires whether or not the user completes — the funnel step
    // ad networks optimise on. paywall_continue is its first-party twin.
    void logBeginCheckout(PRODUCT_BY_PLAN[plan], PRICE_USD[plan]);
    track('paywall_continue', { plan, origin });
    try {
      const r = await startTrial({ plan });
      if (r.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        // GA4 (no-op until RNFB) + first-party + AppsFlyer (via track →
        // af_start_trial). purchase/conversion is logged server-side from the
        // adapty webhook, so we don't double-count revenue here.
        void logTrialStartEvent(PRODUCT_BY_PLAN[plan]);
        track('trial_start', { plan, revenue: PRICE_USD[plan] });
        showAlert(t('paywall.alerts.welcomeTitle'), t('paywall.alerts.welcomeBody'));
        dismiss();
      } else if (r.error === 'cancelled') {
        // user-cancelled → no toast
      } else if (r.error === 'pending') {
        showAlert(t('paywall.alerts.pendingTitle'), t('paywall.alerts.pendingBody'));
      } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
        // SDK already shows its own alert
      } else {
        recordError(new Error(`startTrial: ${r.error ?? 'unknown'}`), 'paywall-start-trial');
        showAlert(t('paywall.alerts.purchaseFailedTitle'), r.error ?? t('paywall.alerts.unknownError'));
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
        showAlert(t('paywall.alerts.restoredTitle'), t('paywall.alerts.restoredBody'));
        dismiss();
      } else if (r.error === 'no-active-subscription') {
        showAlert(t('paywall.alerts.nothingToRestoreTitle'), t('paywall.alerts.nothingToRestoreBody'));
      } else if (r.error === 'adapty-not-configured' || r.error === 'adapty-sdk-missing') {
        // SDK already shows its own alert
      } else {
        showAlert(t('paywall.alerts.restoreFailedTitle'), r.error ?? t('paywall.alerts.unknownError'));
      }
    } finally {
      setBusy(false);
    }
  };

  const openUrl = (url: string) => {
    Haptics.selectionAsync().catch(() => {});
    Linking.openURL(url).catch((e) => showAlert(t('paywall.alerts.couldNotOpenLinkTitle'), String(e)));
  };

  const priceStr = (p: Plan): string => tiers?.[p]?.localizedPrice || `$${PRICE_USD[p].toFixed(2)}`;
  const ctaLabel = busy ? t('paywall.cta.processing') : t('paywall.cta.startTrial');
  const fineprint = (() => {
    if (plan === 'annual') return t('paywall.fineprint.annual', { price: priceStr('annual') });
    if (plan === 'monthly') return t('paywall.fineprint.monthly', { price: priceStr('monthly') });
    return t('paywall.fineprint.weekly', { price: priceStr('weekly') });
  })();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerSpacer} />
        <Text style={[typeScale.wordmark, styles.eyebrow]}>{t('paywall.eyebrow')}</Text>
        {closeVisible ? (
          <Animated.View style={{ opacity: closeFade }}>
            <IconButton accessibilityLabel={t('paywall.a11y.close')} onPress={dismiss}>
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
            {t(`paywall.${srcCopy.titleKey}`)}
          </Text>
          <Text style={[typeScale.body, styles.subtitle]}>
            {t(`paywall.${srcCopy.subtitleKey}`)}
          </Text>
          {/* Trust signal — families save ~$2,913/yr (the product thesis). */}
          <View style={styles.trustPill}>
            <Sparkle size={14} color={colors.primary} strokeWidth={2} />
            <Text style={[typeScale.labelSmall, styles.trustPillText]}>
              {family ? t('paywall.trust.family') : t('paywall.trust.household')}
            </Text>
          </View>
        </View>

        {/* Features — one clean card with a checklist (premium feel, vs. five
            heavy stacked cards). */}
        <SoftSurface variant="cushion" radius="xxl" innerStyle={styles.featuresCard}>
          <Text style={[typeScale.label, styles.featuresHeader]}>{t('paywall.features.header')}</Text>
          {FEATURES.map(({ titleKey, bodyKey }, i) => (
            <View
              key={titleKey}
              style={[styles.checkRow, i === FEATURES.length - 1 && styles.checkRowLast]}
            >
              <View style={styles.checkBadge}>
                <Check size={14} color={colors.surfaceWhite} strokeWidth={3} />
              </View>
              <View style={styles.featureText}>
                <Text style={[typeScale.titleSmall, styles.featureTitle]}>{t(`paywall.${titleKey}`)}</Text>
                <Text style={[typeScale.bodySmall, styles.featureBody]}>{t(`paywall.${bodyKey}`)}</Text>
              </View>
            </View>
          ))}
        </SoftSurface>

        {/* Plans — annual default, monthly decoy, weekly impulse */}
        <Text style={[typeScale.label, styles.plansEyebrow]}>{t('paywall.plans.eyebrow')}</Text>
        <View style={styles.plansBlock}>
          <PlanCard
            value="annual"
            label={t('paywall.plans.annual.label')}
            price={priceStr('annual')}
            unit={t('paywall.plans.annual.unit')}
            badge={t('paywall.plans.annual.badge')}
            sublabel={t('paywall.plans.annual.sublabel')}
            active={plan === 'annual'}
            onPress={() => setPlan('annual')}
          />
          <PlanCard
            value="monthly"
            label={t('paywall.plans.monthly.label')}
            price={priceStr('monthly')}
            unit={t('paywall.plans.monthly.unit')}
            sublabel={t('paywall.plans.monthly.sublabel')}
            active={plan === 'monthly'}
            onPress={() => setPlan('monthly')}
          />
          <PlanCard
            value="weekly"
            label={t('paywall.plans.weekly.label')}
            price={priceStr('weekly')}
            unit={t('paywall.plans.weekly.unit')}
            sublabel={t('paywall.plans.weekly.sublabel')}
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
            <Text style={[typeScale.bodySmall, styles.legalLink]}>{t('paywall.legal.restore')}</Text>
          </Pressable>
          <Text style={[typeScale.bodySmall, styles.legalDot]}>·</Text>
          <Pressable onPress={() => openUrl(LEGAL.termsOfUse)} accessibilityRole="link">
            <Text style={[typeScale.bodySmall, styles.legalLink]}>{t('paywall.legal.terms')}</Text>
          </Pressable>
          <Text style={[typeScale.bodySmall, styles.legalDot]}>·</Text>
          <Pressable onPress={() => openUrl(LEGAL.privacyPolicy)} accessibilityRole="link">
            <Text style={[typeScale.bodySmall, styles.legalLink]}>{t('paywall.legal.privacy')}</Text>
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
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('paywall.a11y.planOption', { label, price, unit })}
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
    gap: spacing.lg,
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
