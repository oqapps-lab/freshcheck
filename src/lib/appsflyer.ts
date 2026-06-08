// AppsFlyer wrapper.
//
// Lazy-required like Adapty so Expo Go doesn't crash on bundle eval.
// initAppsFlyer() inits the SDK at cold launch (app/_layout.tsx VendorBoot)
// for EVERY install. promptATT() shows Apple's ATT dialog separately, on the
// onboarding priming screen (app/att-priming.tsx) after the user has seen the
// app's value. The two are decoupled so AppsFlyer attributes every install
// even if the user later declines tracking.
//
// Pre-requisite: register FreshCheck in the AppsFlyer dashboard
// (Add app → "My app is not available on the store yet" →
// com.gazetastreet.freshcheck), then paste Dev Key into
// `EXPO_PUBLIC_APPSFLYER_DEV_KEY` in .env. SDK is a no-op until
// dev key is configured.
//
// Apple App ID (numeric) goes into EXPO_PUBLIC_APPLE_APP_ID after
// the app is published in App Store Connect; until then iOS init
// uses bundle-id only path.

import { Platform } from 'react-native';
import { env, isAppsFlyerConfigured } from './env';

type AppsFlyerSdk = {
  initSdk: (
    options: Record<string, unknown>,
    onSuccess?: (result: unknown) => void,
    onError?: (error: unknown) => void,
  ) => void;
  logEvent: (
    eventName: string,
    eventValues?: Record<string, unknown>,
    onSuccess?: (result: unknown) => void,
    onError?: (error: unknown) => void,
  ) => void;
  setCustomerUserId: (id: string, onSuccess?: (result: unknown) => void) => void;
};

function getSdk(): AppsFlyerSdk | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-appsflyer');
    return (mod.default ?? mod) as AppsFlyerSdk;
  } catch {
    return null;
  }
}

function getATT(): typeof import('expo-tracking-transparency') | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-tracking-transparency');
  } catch {
    return null;
  }
}

let initialized = false;
// initAppsFlyer() runs at cold launch, but the Supabase anon-signin may
// settle slightly before init completes, so setAppsFlyerCustomerId(uid) can
// fire BEFORE init — without queueing, the very first install→user mapping is
// silently dropped and AppsFlyer attribution shows the install as anonymous
// forever.
let pendingCustomerId: string | null = null;

// Inits the AppsFlyer SDK only (NO ATT prompt). Called once at cold launch
// from app/_layout.tsx VendorBoot so EVERY install is attributed, regardless
// of the user's later ATT choice. Idempotent.
export function initAppsFlyer(): void {
  if (initialized) return;
  if (!isAppsFlyerConfigured()) {
    if (__DEV__) console.warn('[appsflyer] Dev Key missing — skip init');
    return;
  }

  const sdk = getSdk();
  if (!sdk) return;

  // Init SDK with an ATT wait window. ATT is resolved later, on the onboarding
  // priming screen (app/att-priming.tsx), which can be 10-40s into the first
  // session — so hold the install payload up to 60s for the IDFA. On timeout
  // AppsFlyer sends the install without IDFA (attribution still works via SKAN).
  sdk.initSdk(
    {
      devKey: env.appsflyerDevKey,
      isDebug: __DEV__,
      appId: Platform.OS === 'ios' ? env.appleAppId || undefined : undefined,
      onInstallConversionDataListener: true,
      onDeepLinkListener: true,
      timeToWaitForATTUserAuthorization: 60,
    },
    (result) => {
      if (__DEV__) console.log('[appsflyer] init success', result);
    },
    (error) => {
      if (__DEV__) console.warn('[appsflyer] init error', error);
    },
  );
  initialized = true;
  if (pendingCustomerId) {
    const queued = pendingCustomerId;
    pendingCustomerId = null;
    try {
      sdk.setCustomerUserId(queued);
    } catch (e) {
      if (__DEV__) console.warn('[appsflyer] queued setCustomerUserId failed', e);
    }
  }
}

let attRequested = false;

// Shows Apple's native ATT dialog. Call from the onboarding priming screen
// (app/att-priming.tsx) AFTER the user taps Continue — a contextual,
// Apple-sanctioned moment. iOS-only + fires at most once. Ensures the SDK is
// initialised first so the granted IDFA attaches to the held install payload.
export async function promptATT(): Promise<void> {
  if (Platform.OS !== 'ios') return;
  if (attRequested) return;
  attRequested = true;

  initAppsFlyer();

  const att = getATT();
  if (!att) return;
  try {
    const { status } = await att.requestTrackingPermissionsAsync();
    if (__DEV__) console.log('[ATT] status:', status);
  } catch (e) {
    if (__DEV__) console.warn('[ATT] prompt failed', e);
  }
}

export function setAppsFlyerCustomerId(uid: string): void {
  const sdk = getSdk();
  if (!sdk) return;
  if (!initialized) {
    // Init still pending (runs at cold launch). Queue and let initAppsFlyer
    // flush this once the SDK is ready, otherwise the very first install→user
    // mapping is lost.
    pendingCustomerId = uid;
    return;
  }
  try {
    sdk.setCustomerUserId(uid);
  } catch (e) {
    if (__DEV__) console.warn('[appsflyer] setCustomerUserId failed', e);
  }
}

// Standard event helpers — keep names matching AppsFlyer's `af_*` schema
// so the dashboard surfaces them in the right reports.

export function logSignUp(method: 'email' | 'guest' = 'email'): void {
  const sdk = getSdk();
  if (!sdk || !initialized) return;
  sdk.logEvent('af_complete_registration', { af_registration_method: method });
}

export function logScan(productLabel?: string): void {
  const sdk = getSdk();
  if (!sdk || !initialized) return;
  sdk.logEvent('af_content_view', {
    af_content_type: 'scan',
    af_content_id: productLabel ?? 'unknown',
  });
}

export function logTrialStart(productId: string, revenueUSD: number): void {
  const sdk = getSdk();
  if (!sdk || !initialized) return;
  sdk.logEvent('af_start_trial', {
    af_revenue: revenueUSD,
    af_currency: 'USD',
    af_content_id: productId,
  });
}

export function logSubscribe(productId: string, revenueUSD: number): void {
  const sdk = getSdk();
  if (!sdk || !initialized) return;
  sdk.logEvent('af_purchase', {
    af_revenue: revenueUSD,
    af_currency: 'USD',
    af_content_id: productId,
  });
}
