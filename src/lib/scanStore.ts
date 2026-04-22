import { useSyncExternalStore } from 'react';
import type { ScanAnalysisResult } from './scanAnalysis';

/**
 * Ephemeral scan-result store. Camera writes the latest result here;
 * scan/result reads it. We avoid threading it through route params so
 * the large `analysis` array doesn't get URL-encoded.
 */

type State = ScanAnalysisResult | null;

let current: State = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const scanStore = {
  get() {
    return current;
  },
  set(value: State) {
    current = value;
    emit();
  },
  clear() {
    current = null;
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useCurrentScan(): State {
  return useSyncExternalStore(scanStore.subscribe, scanStore.get, scanStore.get);
}
