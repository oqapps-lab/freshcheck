// AppsFlyer wrapper.
//
// Lazy-required like Adapty so Expo Go doesn't crash on bundle eval.
// initAppsFlyerWithATT() should be called from app/_layout.tsx after
// the user has had a chance to see the first screen — Apple requires
// the ATT prompt to be triggered by a user-facing action, not at cold
// launch. We delay it via a short timeout to give the app one frame
// to render before the prompt appears.
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

export async function initAppsFlyerWithATT(): Promise<void> {
  if (initialized) return;
  if (!isAppsFlyerConfigured()) {
    if (__DEV__) console.warn('[appsflyer] Dev Key missing — skip init');
    return;
  }

  const sdk = getSdk();
  if (!sdk) return;

  // 1) Init SDK with ATT timeout — gives iOS up to 10s for ATT prompt before
  //    we treat advertising-id as denied.
  sdk.initSdk(
    {
      devKey: env.appsflyerDevKey,
      isDebug: __DEV__,
      appId: Platform.OS === 'ios' ? env.appleAppId || undefined : undefined,
      onInstallConversionDataListener: true,
      onDeepLinkListener: true,
      timeToWaitForATTUserAuthorization: 10,
    },
    (result) => {
      if (__DEV__) console.log('[appsflyer] init success', result);
    },
    (error) => {
      if (__DEV__) console.warn('[appsflyer] init error', error);
    },
  );
  initialized = true;

  // 2) On iOS, prompt ATT shortly after init. Apple wants the prompt
  //    triggered by a user-visible context — first screen render is fine.
  if (Platform.OS === 'ios') {
    const att = getATT();
    if (att) {
      try {
        const { status } = await att.requestTrackingPermissionsAsync();
        if (__DEV__) console.log('[ATT] status:', status);
      } catch (e) {
        if (__DEV__) console.warn('[ATT] prompt failed', e);
      }
    }
  }
}

export function setAppsFlyerCustomerId(uid: string): void {
  const sdk = getSdk();
  if (!sdk || !initialized) return;
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
