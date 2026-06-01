import { useSyncExternalStore } from 'react';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

/**
 * Local profile store — display name + avatar uri. Local-first (safeStorage)
 * so it works for anonymous guests and offline, no DB round-trip or storage
 * bucket needed. The avatar uri is a local file copy from the image picker
 * (persists in the app sandbox across launches).
 */
export type LocalProfile = {
  displayName: string | null;
  avatarUri: string | null;
};

let current: LocalProfile = { displayName: null, avatarUri: null };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  current = { ...current };
  for (const l of listeners) l();
}

function persist() {
  void safeStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(current));
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot(): LocalProfile {
  return current;
}

export function useLocalProfile(): LocalProfile {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function setDisplayName(name: string | null) {
  current.displayName = name && name.trim() ? name.trim() : null;
  persist();
  emit();
}

export function setAvatarUri(uri: string | null) {
  current.avatarUri = uri;
  persist();
  emit();
}

export async function hydrateProfile(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = await safeStorage.getItem(STORAGE_KEYS.profile);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalProfile>;
      current = {
        displayName: typeof parsed.displayName === 'string' ? parsed.displayName : null,
        avatarUri: typeof parsed.avatarUri === 'string' ? parsed.avatarUri : null,
      };
      emit();
    }
  } catch {
    /* corrupt — ignore */
  }
}
