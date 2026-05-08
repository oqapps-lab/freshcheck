// PostHog wrapper — feature flags + A/B testing + funnel events.
//
// Free tier: 1M events/month, unlimited users. Project key is public/client-safe
// (it can only WRITE events, not read user data). Set in .env as:
//   EXPO_PUBLIC_POSTHOG_KEY=phc_xxxxxxxx
//   EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com  (or eu.i.posthog.com)
//
// Init flow:
//   bootPostHog()         — call once on app mount
//   identifyPostHogUser() — call on sign-in (after Supabase auth)
//   resetPostHogUser()    — call on sign-out
//   capture(event, props) — log custom events
//   pickVariant(...)      — local deterministic A/B helper (no PostHog round-trip)
//   useFlag(key, default) — React hook reading PostHog server flag (waits for fetch)
//
// A/B-testing guidance:
//   - For UI experiments where the variant must be visible BEFORE PostHog has
//     loaded (cold-start onboarding), use `pickVariant(userId, key, ['a','b'])`.
//     Hash-based, fast, no round-trip, reproducible across reinstalls.
//   - For experiments where you want server-side targeting / kill-switch /
//     allocation control, use PostHog feature flags via `useFlag`.

import { useEffect, useState } from 'react';
import { env, isPostHogConfigured } from './env';

type PostHogClient = {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (id: string, properties?: Record<string, unknown>) => void;
  reset: () => void;
  reloadFeatureFlagsAsync: () => Promise<unknown>;
  getFeatureFlag: (key: string) => string | boolean | undefined;
  isFeatureEnabled: (key: string) => boolean | undefined;
};

let client: PostHogClient | null = null;
let booted = false;

export async function bootPostHog(): Promise<void> {
  if (booted || !isPostHogConfigured()) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { default: PostHog } = require('posthog-react-native');
    client = new PostHog(env.posthogKey, {
      host: env.posthogHost || 'https://us.i.posthog.com',
      // Wait briefly for feature flags before evaluating any. Flags are
      // small (~few KB) and fetched on cold-start; 2s is safe budget.
      flushInterval: 30_000,
      captureNativeAppLifecycleEvents: true,
    });
    booted = true;
  } catch (e) {
    if (__DEV__) console.warn('[posthog] boot failed', e);
  }
}

export function identifyPostHogUser(uid: string, traits?: Record<string, unknown>): void {
  if (!client) return;
  try {
    client.identify(uid, traits);
  } catch (e) {
    if (__DEV__) console.warn('[posthog] identify failed', e);
  }
}

export function resetPostHogUser(): void {
  if (!client) return;
  try {
    client.reset();
  } catch (e) {
    if (__DEV__) console.warn('[posthog] reset failed', e);
  }
}

export function capture(event: string, properties?: Record<string, unknown>): void {
  if (!client) return;
  try {
    client.capture(event, properties);
  } catch (e) {
    if (__DEV__) console.warn('[posthog] capture failed', e);
  }
}

// Deterministic A/B picker — no PostHog round-trip.
//
// Use when the variant must be available synchronously at render time
// (e.g. onboarding step 1 needs to know "show fridge or shopping basket
// hero"). Hashes (userId + key) modulo length-of-variants, so the same
// user always gets the same variant for that experiment, but two
// different experiments are independent.
//
// Logs an `$experiment_started` event so PostHog can correlate with
// downstream conversion events.

export function pickVariant<T extends string>(
  userId: string,
  experimentKey: string,
  variants: readonly T[],
): T {
  const seed = userId + ':' + experimentKey;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % variants.length;
  const variant = variants[idx]!;
  capture('$experiment_started', {
    experiment_key: experimentKey,
    variant,
    method: 'local-hash',
  });
  return variant;
}

// React hook for PostHog server-managed feature flags.
//
// Returns the `defaultValue` while flags are loading; updates when fetch
// completes. Use this for kill-switches, gradual rollouts, or experiments
// where PostHog allocates the variant.

export function useFlag<T extends string | boolean>(
  key: string,
  defaultValue: T,
): T {
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    (async () => {
      try {
        await client!.reloadFeatureFlagsAsync();
        if (cancelled) return;
        const v = client!.getFeatureFlag(key);
        if (v === undefined) return;
        setValue(v as T);
      } catch (e) {
        if (__DEV__) console.warn('[posthog] flag fetch failed', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);
  return value;
}
