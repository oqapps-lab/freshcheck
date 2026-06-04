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
//                `com.gazetastreet.freshcheck.monthly`
//                `com.gazetastreet.freshcheck.annual`

import { Platform } from 'react-native';
import { showAlert } from '@/src/state/alertStore';
import { env, isAdaptyConfigured } from './env';

type Plan = 'weekly' | 'monthly' | 'annual';

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
// Holds the customerUserId set during the brief window before activation
// completes — fired automatically once activation lands so the first
// post-cold-launch sign-in is never silently dropped from Adapty's
// per-user analytics + entitlement reconciliation.
let pendingIdentify: string | null = null;

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
    if (pendingIdentify) {
      const queued = pendingIdentify;
      pendingIdentify = null;
      try {
        await sdk.adapty.identify(queued);
      } catch (e) {
        if (__DEV__) console.warn('[adapty] queued identify failed:', e);
      }
    }
  } catch (e) {
    if (__DEV__) console.warn('[adapty] activate failed:', e);
  }
}

export async function identifyAdaptyUser(customerUserId: string): Promise<void> {
  const sdk = getSdk();
  if (!sdk) return;
  if (!activated) {
    // Activation still in flight — queue and let activateAdaptyIfNeeded
    // flush this once the SDK is ready. Without this, the very first
    // sign-in after a cold launch was silently dropped because the
    // activate → identify ordering wasn't enforced anywhere.
    pendingIdentify = customerUserId;
    return;
  }
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

// Exported so paywall.tsx logs the same product_id that startTrial buys —
// duplicating the literals in two files was a maintenance footgun (rename
// one, forget the other, and the Firebase/AppsFlyer purchase events refer
// to a SKU that doesn't match what StoreKit actually charged for).
export const PRODUCT_BY_PLAN: Record<Plan, string> = {
  weekly: 'com.gazetastreet.freshcheck.weekly',
  monthly: 'com.gazetastreet.freshcheck.monthly',
  annual: 'com.gazetastreet.freshcheck.annual',
};

export type TierInfo = { localizedPrice: string; amount: number; currencyCode?: string };

/**
 * Live, store-localized prices for all three plans, so the paywall shows the
 * user's real currency (and the exact price Apple will charge) instead of a
 * hardcoded USD literal. Returns null when Adapty is unconfigured or the
 * products can't be fetched yet (no Paid-Apps agreement / products not yet
 * approved) — the paywall then falls back to its hardcoded USD prices.
 */
export async function getTiers(): Promise<Partial<Record<Plan, TierInfo>> | null> {
  if (!isAdaptyConfigured()) return null;
  const sdk = getSdk();
  if (!sdk) return null;
  try {
    const paywall = await sdk.adapty.getPaywall(PLACEMENT_ID);
    const products = await sdk.adapty.getPaywallProducts(paywall);
    const out: Partial<Record<Plan, TierInfo>> = {};
    (Object.keys(PRODUCT_BY_PLAN) as Plan[]).forEach((plan) => {
      const p = products.find((x) => x.vendorProductId === PRODUCT_BY_PLAN[plan]);
      if (!p) return;
      const price = (p as { price?: { localizedString?: string; amount?: number; currencyCode?: string } }).price;
      out[plan] = {
        localizedPrice: price?.localizedString ?? '',
        amount: price?.amount ?? 0,
        currencyCode: price?.currencyCode,
      };
    });
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
}

export async function startTrial(params: {
  plan: Plan;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isAdaptyConfigured()) {
    showAlert(
      'Stub purchase',
      `Adapty key is not set. Add EXPO_PUBLIC_ADAPTY_PUBLIC_KEY to .env then build a dev-client.`,
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  const sdk = getSdk();
  if (!sdk) {
    showAlert(
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
    showAlert('No Adapty key', 'Set EXPO_PUBLIC_ADAPTY_PUBLIC_KEY then rebuild.');
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
