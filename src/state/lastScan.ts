import { useSyncExternalStore } from 'react';
import type { Tone } from '@/constants/tokens';

/**
 * Module-level singleton holding the most recent scan result so /capture
 * can hand it to /(tabs)/scan without round-tripping through router params
 * (which serialize as strings and choke on the analysis array).
 *
 * Deliberately not Zustand: a single value with subscribe semantics is
 * the entire surface, so a 30-line useSyncExternalStore beats pulling
 * a dependency.
 */
export type LastScan = {
  scanId: string | null;
  imagePath: string | null; // storage path — `${user.id}/<uuid>.jpg`
  imageUri: string | null;  // local file:// URI, used until the upload finishes
  product: string;
  verdict: 'fresh' | 'safe' | 'soon' | 'past';
  tone: Tone;
  confidence: number;
  storageNote: string | null;
  daysLeft: number | null;
  totalDays: number | null;
  analysis: { label: string; value: number }[];
};

let current: LastScan | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function setLastScan(value: LastScan | null) {
  current = value;
  emit();
}

export function getLastScan(): LastScan | null {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLastScan(): LastScan | null {
  return useSyncExternalStore(subscribe, getLastScan, getLastScan);
}
