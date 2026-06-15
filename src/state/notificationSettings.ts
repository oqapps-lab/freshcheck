import { useSyncExternalStore } from 'react';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

/**
 * Global notification preferences — deliberately NOT per-product. One master
 * toggle for the expiry digest + one global lead-time. Per-item config was
 * rejected (it fights the batched ≤4/week digest model; see GROWTH-STRATEGY).
 *
 * Module-level store so both the UI (Profile) and the scheduler
 * (src/lib/notifications.ts, non-React) read one source of truth.
 */
export type NotificationSettings = {
  expiryEnabled: boolean;
  leadDays: number; // warn this many days before an item expires (1-3)
};

const DEFAULTS: NotificationSettings = { expiryEnabled: true, leadDays: 2 };
const KEY = STORAGE_KEYS.notifSettings;

let current: NotificationSettings = DEFAULTS;
let snap: NotificationSettings = current; // stable reference between emits
let hydrated = false;
let hydrating: Promise<NotificationSettings> | null = null;
const listeners = new Set<() => void>();

function clampLead(d: number): number {
  return Math.min(3, Math.max(1, Math.round(d)));
}

function emit() {
  snap = { ...current };
  listeners.forEach((l) => l());
}

function hydrate(): Promise<NotificationSettings> {
  if (hydrated) return Promise.resolve(current);
  if (!hydrating) {
    hydrating = (async () => {
      try {
        const raw = await safeStorage.getItem(KEY);
        if (raw) {
          const p = JSON.parse(raw) as Partial<NotificationSettings>;
          current = {
            expiryEnabled: typeof p.expiryEnabled === 'boolean' ? p.expiryEnabled : DEFAULTS.expiryEnabled,
            leadDays: typeof p.leadDays === 'number' ? clampLead(p.leadDays) : DEFAULTS.leadDays,
          };
        }
      } catch {
        /* corrupt/missing — keep defaults */
      }
      hydrated = true;
      emit();
      return current;
    })();
  }
  return hydrating;
}

/** Async — non-React callers (the scheduler) ensure settings are loaded. */
export async function loadNotificationSettings(): Promise<NotificationSettings> {
  return hydrate();
}

export function getNotificationSettings(): NotificationSettings {
  return current;
}

function persist() {
  void safeStorage.setItem(KEY, JSON.stringify(current));
}

export function setExpiryEnabled(v: boolean) {
  current = { ...current, expiryEnabled: v };
  persist();
  emit();
}

export function setLeadDays(d: number) {
  current = { ...current, leadDays: clampLead(d) };
  persist();
  emit();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  void hydrate();
  return () => {
    listeners.delete(fn);
  };
}

function getSnapshot(): NotificationSettings {
  return snap;
}

export function useNotificationSettings(): NotificationSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
