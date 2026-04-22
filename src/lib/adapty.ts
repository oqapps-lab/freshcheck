import { Alert } from 'react-native';
import { isAdaptyConfigured } from './env';

/**
 * Adapty wrapper — stub form.
 *
 * react-native-adapty requires a dev-client (or bare) build; it crashes
 * in Expo Go at bundle-eval time because its native event-emitter is
 * missing. So this file intentionally does NOT import the real SDK.
 *
 * When you're ready for real subscriptions:
 *   1. `npm install react-native-adapty` (and add it to app.json plugins
 *      or bare-link on iOS/Android).
 *   2. Build a dev-client (`npx expo run:ios` or `eas build --profile dev`).
 *   3. Replace the three methods below with real Adapty calls. Types
 *      are the same as the public SDK so the paywall screen needs no
 *      changes.
 *   4. Set EXPO_PUBLIC_ADAPTY_PUBLIC_KEY.
 */

export async function activateAdaptyIfNeeded(): Promise<void> {
  // no-op in Expo Go / stub build.
}

export async function startTrial(params: {
  plan: 'monthly' | 'annual';
}): Promise<{ ok: boolean; error?: string }> {
  if (!isAdaptyConfigured()) {
    Alert.alert(
      'stub purchase',
      `adapty isn\u2019t wired in this build. selected: ${params.plan}.\nadd react-native-adapty + dev-client to enable real subscriptions.`,
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  Alert.alert(
    'rebuild required',
    'adapty key set, but the SDK isn\u2019t installed. re-add react-native-adapty and build a dev-client.',
  );
  return { ok: false, error: 'adapty-sdk-missing' };
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  if (!isAdaptyConfigured()) {
    Alert.alert(
      'no active subscription',
      'once adapty is wired, this will restore your purchases across devices.',
    );
    return { ok: false, error: 'adapty-not-configured' };
  }
  return { ok: false, error: 'adapty-sdk-missing' };
}
