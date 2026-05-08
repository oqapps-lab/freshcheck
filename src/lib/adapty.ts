// Adapty subscription wrapper.
//
// react-native-adapty is a native module → only available in dev-client / EAS
// builds, NOT in Expo Go. We `require()` it dynamically inside try/catch so
// the module evaluates safely under Expo Go (where the import would crash at
// bundle-eval time) and the stub messages still fire.
//
// Activate flow (called once from app/_layout.tsx on root mount):
//   activateAdaptyIfNeeded()  → adapty.activate(publicKey, opts)
//   identifyAdaptyUser(uid)   → adapty.identify(uid)        (after sign-in)
//   logoutAdaptyUser()        → adapty.logout()             (on sign-out)
//
// Purchase flow (called from app/paywall.tsx):
//   startTrial({plan})        → fetch placement, find product, makePurchase
//   restorePurchases()        → adapty.restorePurchases()
//
// Placement IDs match the App Store Connect product setup:
//   - placement: `freshcheck_main_paywall`
//   - products:  `com.gazetastreet.freshcheck.weekly`
//                `com.gazetastreet.freshcheck.annual`
// Map 'monthly'|'yearly' (legacy paywall API) → 'weekly'|'annual'.

import { Alert, Platform } from 'react-native';
import { env, isAdaptyConfigured } from './env';

type Plan = 'monthly' | 'annual' | 'weekly' | 'yearly';

// Lazy require — avoids Expo Go bundle-eval crash.
function getSdk(): typeof import('react-native-adapty') | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-adapty');
    return mod;
  } catch {
    return null;
  }
}

let activated = false;

export async function activateAdaptyIfNeeded(): Promise<void> {
  if (activated) return;
  if (!isAdaptyConfigured()) return; // no key set → silently skip
  const sdk = getSdk();
  if (!sdk) return; // Expo Go / SDK not installed → silently skip

  try {
    await sdk.adapty.activate(env.adaptyPublicKey, {
      logLevel: __DEV__ ? 'verbose' : 'error',
      __ignoreActivationOnFastRefresh: __DEV__,
    });
    activated = true;
  } catch (e) {
    if (__DEV__) console.warn('[adapty] activate failed:', e);
  }
}

export async function identifyAdaptyUser(customerUserId: string): Promise<void> {
  const sdk = getSdk();
  if (!sdk || !activated) return;
  try {
    await sdk.adapty.identify(customerUserId);
  } catch (e) {
    if (__DEV__) console.warn('[adapty] identify failed:', e);
  }
}

export async function logoutAdaptyUser(): Promise<void> {
  const sdk = getSdk();
  if (!sdk || !activated) return;
  try {
    await sdk.adapty.logout();
  } catch (e) {
    if (__DEV__) console.warn('[adapty] logout failed:', e);
  }
}

const PLACEMENT_ID = 'freshcheck_main_paywall';

const PRODUCT_BY_PLAN: Record<Plan, string> = {
  weekly: 'com.gazetastreet.freshcheck.weekly',
  monthly: 'com.gazetastreet.freshcheck.weekly', // alias for paywall API
  annual: 'com.gazetastreet.freshcheck.annual',
  yearly: 'com.gazetastreet.freshcheck.annual',  // alias for paywall API
};

export async function startTrial(params: {
  plan: Plan;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isAdaptyConfigured()) {
    Alert.alert(
      'Stub purchase',
      `Adapty key is not set. Add EXPO_PUBLIC_ADAPTY_PUBLIC_KEY to .env then build a dev-client.`,
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  const sdk = getSdk();
  if (!sdk) {
    Alert.alert(
      'Dev-client required',
      `Real purchases need a dev-client build (${Platform.OS}). Run \`eas build --profile development --platform ${Platform.OS}\` and reinstall.`,
    );
    return { ok: false, error: 'adapty-sdk-missing' };
  }

  try {
    const paywall = await sdk.adapty.getPaywall(PLACEMENT_ID);
    const products = await sdk.adapty.getPaywallProducts(paywall);
    const targetVendorId = PRODUCT_BY_PLAN[params.plan];
    const product = products.find((p) => p.vendorProductId === targetVendorId);
    if (!product) {
      return { ok: false, error: `product-not-found: ${targetVendorId}` };
    }
    const result = await sdk.adapty.makePurchase(product);
    if (result.type === 'success') {
      return { ok: true };
    }
    if (result.type === 'user_cancelled') {
      return { ok: false, error: 'cancelled' };
    }
    if (result.type === 'pending') {
      return { ok: false, error: 'pending' };
    }
    return { ok: false, error: 'unknown' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown-error';
    return { ok: false, error: msg };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  if (!isAdaptyConfigured()) {
    Alert.alert('No Adapty key', 'Set EXPO_PUBLIC_ADAPTY_PUBLIC_KEY then rebuild.');
    return { ok: false, error: 'adapty-not-configured' };
  }
  const sdk = getSdk();
  if (!sdk) return { ok: false, error: 'adapty-sdk-missing' };
  try {
    const profile = await sdk.adapty.restorePurchases();
    const hasPro = !!profile?.accessLevels?.['premium']?.isActive;
    return { ok: hasPro, error: hasPro ? undefined : 'no-active-subscription' };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown-error';
    return { ok: false, error: msg };
  }
}

export async function isPremium(): Promise<boolean> {
  const sdk = getSdk();
  if (!sdk || !activated) return false;
  try {
    const profile = await sdk.adapty.getProfile();
    return !!profile?.accessLevels?.['premium']?.isActive;
  } catch {
    return false;
  }
}
