// Lightweight deterministic A/B picker. Replaces PostHog's pickVariant for
// cold-start UI experiments (onboarding hero, paywall variant).
//
// For server-controlled flags / kill-switches, use Firebase Remote Config
// (already available via @react-native-firebase/remote-config when needed).

import { capture } from './analytics';

/**
 * Hash-based variant assignment.
 *
 * Same userId+experimentKey always returns the same variant — reproducible
 * across reinstalls. Two different experiments are independent (key is part
 * of the seed). Logs `experiment_started` to Firebase Analytics + AppsFlyer
 * for funnel correlation.
 */
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
  void capture('experiment_started', {
    experiment_key: experimentKey,
    variant,
  });
  return variant;
}
