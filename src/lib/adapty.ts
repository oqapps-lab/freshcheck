import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { env, isAdaptyConfigured } from './env';

/**
 * Thin Adapty wrapper that degrades gracefully in environments where
 * the native module isn't available (Expo Go, web, tests).
 *
 * Production path:
 *   1. Add `react-native-adapty` expo config plugin (after ejecting to
 *      dev-client) and rebuild.
 *   2. Set EXPO_PUBLIC_ADAPTY_PUBLIC_KEY.
 *   3. Calls below proxy to the native SDK.
 *
 * Expo Go path: activates() returns false, startTrial() shows an
 * Alert so the paywall can still be QA-walked.
 */

// react-native-adapty is a native module and crashes to require in Expo Go.
// We lazy-require it only when the runtime signals a dev-client build.
const isExpoGo = Constants.appOwnership === 'expo';

type AdaptyModule = {
  activate: (key: string) => Promise<void>;
  getPaywall: (id: string) => Promise<unknown>;
  getPaywallProducts: (paywall: unknown) => Promise<unknown>;
  makePurchase: (product: unknown) => Promise<unknown>;
  restorePurchases: () => Promise<unknown>;
};

let moduleCache: AdaptyModule | null | undefined;
function loadAdapty(): AdaptyModule | null {
  if (moduleCache !== undefined) return moduleCache;
  if (isExpoGo) {
    moduleCache = null;
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-adapty') as { adapty: AdaptyModule };
    moduleCache = mod.adapty;
    return moduleCache;
  } catch {
    moduleCache = null;
    return null;
  }
}

let activated = false;

export async function activateAdaptyIfNeeded() {
  if (activated) return;
  if (!isAdaptyConfigured()) return;
  const adapty = loadAdapty();
  if (!adapty) return;
  try {
    await adapty.activate(env.adaptyPublicKey);
    activated = true;
  } catch (e) {
    console.warn('[adapty] activation failed', e);
  }
}

export async function startTrial(params: { plan: 'monthly' | 'annual' }): Promise<
  { ok: boolean; error?: string }
> {
  const adapty = loadAdapty();
  if (!adapty || !isAdaptyConfigured()) {
    // Mock mode — surface to the user so QA knows paywall is stubbed.
    Alert.alert(
      'stub purchase',
      `adapty isn't wired in this build. your selected plan: ${params.plan}.\nset EXPO_PUBLIC_ADAPTY_PUBLIC_KEY + dev-client build to enable real subscriptions.`,
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  await activateAdaptyIfNeeded();
  try {
    const paywall = await adapty.getPaywall('freshcheck-main');
    const products = (await adapty.getPaywallProducts(paywall)) as Array<{
      vendorProductId: string;
      subscriptionPeriod?: { unit: 'month' | 'year' };
    }>;
    const target = products.find((p) =>
      params.plan === 'annual'
        ? p.subscriptionPeriod?.unit === 'year'
        : p.subscriptionPeriod?.unit === 'month',
    );
    if (!target) return { ok: false, error: 'product not found' };
    await adapty.makePurchase(target);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  const adapty = loadAdapty();
  if (!adapty || !isAdaptyConfigured()) {
    Alert.alert(
      'no active subscription',
      'once adapty is wired, this will restore your purchases across devices.',
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  await activateAdaptyIfNeeded();
  try {
    await adapty.restorePurchases();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'restore failed' };
  }
}
