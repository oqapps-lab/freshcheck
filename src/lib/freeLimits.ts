import { useSyncExternalStore } from 'react';
import { safeStorage } from '@/src/lib/safeStorage';

/**
 * Free-tier daily SCAN limit. Recipe generation is already capped server-side
 * (generate-recipes returns a 429 'Free plan: 1/day'); this adds the scan cap
 * the founder asked for. Pro = unlimited. Hydrated once at app start; rolls
 * over at local midnight.
 */
export const FREE_SCANS_PER_DAY = 3;

const STORAGE_KEY = 'freshcheck_daily_usage_v1';
type Usage = { date: string; scans: number };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

let usage: Usage = { date: today(), scans: 0 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const persist = () => void safeStorage.setItem(STORAGE_KEY, JSON.stringify(usage));

function rollover() {
  const t = today();
  if (usage.date !== t) {
    usage = { date: t, scans: 0 };
    persist();
  }
}

export async function hydrateUsage(): Promise<void> {
  try {
    const raw = await safeStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Usage;
      if (p && typeof p.scans === 'number' && typeof p.date === 'string') usage = p;
    }
  } catch {
    /* ignore */
  }
  rollover();
  emit();
}

export function scansLeft(isPremium: boolean): number {
  if (isPremium) return Infinity;
  rollover();
  return Math.max(0, FREE_SCANS_PER_DAY - usage.scans);
}

export function canScan(isPremium: boolean): boolean {
  return scansLeft(isPremium) > 0;
}

export function recordScan() {
  rollover();
  usage = { ...usage, scans: usage.scans + 1 };
  persist();
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Reactive scans-left for UI (e.g. a 'N scans left today' chip). */
export function useScansLeft(isPremium: boolean): number {
  return useSyncExternalStore(
    subscribe,
    () => scansLeft(isPremium),
    () => scansLeft(isPremium),
  );
}
