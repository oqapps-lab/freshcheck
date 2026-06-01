import { useSyncExternalStore } from 'react';
import type { Recipe } from '@/src/hooks/useRecipes';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

/**
 * Favorited recipes. Stored locally (safeStorage) as FULL Recipe objects so
 * they survive regeneration of the "Cook with what you have" batch and work
 * for anonymous guests. The detail screen falls back to this store when a
 * recipe isn't in the current generated batch.
 */
let favorites: Recipe[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  favorites = [...favorites];
  for (const l of listeners) l();
}
function persist() {
  void safeStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot(): Recipe[] {
  return favorites;
}

export function useFavorites(): Recipe[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function isFavorite(id: string): boolean {
  return favorites.some((r) => r.id === id);
}

export function getFavorite(id: string): Recipe | undefined {
  return favorites.find((r) => r.id === id);
}

/** Toggle a recipe in/out of favorites. Returns the new favorited state. */
export function toggleFavorite(recipe: Recipe): boolean {
  if (favorites.some((r) => r.id === recipe.id)) {
    favorites = favorites.filter((r) => r.id !== recipe.id);
    persist();
    emit();
    return false;
  }
  favorites = [recipe, ...favorites];
  persist();
  emit();
  return true;
}

export async function hydrateFavorites(): Promise<void> {
  if (hydrated) return;
  hydrated = true;
  try {
    const raw = await safeStorage.getItem(STORAGE_KEYS.favorites);
    if (raw) {
      const parsed = JSON.parse(raw) as Recipe[];
      if (Array.isArray(parsed)) {
        favorites = parsed;
        emit();
      }
    }
  } catch {
    /* corrupt — ignore */
  }
}
