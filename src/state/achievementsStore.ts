import { useSyncExternalStore } from 'react';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

/**
 * Lightweight local achievement counters for the Home hub (I1). Only `scans`
 * is tracked here (incremented from the scan pipeline) — items-tracked and
 * $-saved are derived on the Home screen from the live fridge count, so we
 * don't double-bookkeep.
 */
type Achievements = { scans: number };

let current: Achievements = { scans: 0 };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  current = { ...current };
  for (const l of listeners) l();
}
function persist() {
  void safeStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(current));
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot(): Achievements {
  return current;
}

export function useAchievements(): Achievements {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Called once per successful scan (single + batch). Hydrates first so we
 *  don't reset a persisted count on a cold-start increment. */
export async function recordScan(): Promise<void> {
  await hydrateAchievements();
  current.scans += 1;
  persist();
  emit();
}

export async function hydrateAchievements(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = await safeStorage.getItem(STORAGE_KEYS.achievements);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Achievements>;
      current = { scans: typeof parsed.scans === 'number' ? parsed.scans : 0 };
      emit();
    }
  } catch {
    /* ignore */
  }
}
