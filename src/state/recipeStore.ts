import { useSyncExternalStore } from 'react';
import type { Recipe } from '@/src/hooks/useRecipes';
import { safeStorage, STORAGE_KEYS } from '@/src/lib/safeStorage';

/**
 * Module-level cache for the latest generated recipe batch.
 *
 * - The list screen sets the batch; the detail screen reads by id.
 * - Persisted to safeStorage so the Recipes tab shows the user's recipes
 *   after navigating away or restarting the app, instead of resetting to
 *   the empty "Generate" state (user-flagged "где история моих рецептов").
 * - Subscribers (the Recipes tab) are notified on every change so a
 *   hero-image arriving after generation, or a fresh batch, re-renders.
 */
let list: Recipe[] = [];
let byId: Map<string, Recipe> = new Map();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function reindex() {
  byId = new Map(list.map((r) => [r.id, r]));
}

function persist() {
  // Fire-and-forget; the in-memory copy is the source of truth this session.
  void safeStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(list));
}

export function setRecipes(recipes: Recipe[]) {
  list = recipes;
  reindex();
  persist();
  emit();
}

export function getRecipe(id: string): Recipe | undefined {
  return byId.get(id);
}

export function getRecipeList(): Recipe[] {
  return list;
}

export function updateRecipeImage(id: string, url: string) {
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return;
  list = [...list];
  list[idx] = { ...list[idx], hero_image_url: url };
  reindex();
  persist();
  emit();
}

export function clearRecipes() {
  list = [];
  reindex();
  void safeStorage.removeItem(STORAGE_KEYS.recipes);
  emit();
}

/** Remove a single recipe from the current batch (L3 — per-recipe delete). */
export function removeRecipe(id: string) {
  list = list.filter((r) => r.id !== id);
  reindex();
  persist();
  emit();
}

/**
 * React hook over the recipe list. Subscribes so consumers re-render when
 * recipes hydrate / change — Home's "recipe of the day" was stale (showed the
 * empty "generate" CTA even with recipes present) because it read the list
 * once at mount and never re-rendered after async hydrateRecipes() resolved.
 */
export function useRecipeList(): Recipe[] {
  return useSyncExternalStore(subscribeRecipes, getRecipeList, getRecipeList);
}

export function subscribeRecipes(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/**
 * Rehydrate the cache from disk. Safe to call repeatedly; only populates
 * when the in-memory list is still empty (i.e. a cold start), so it never
 * clobbers a fresher in-session batch.
 */
export async function hydrateRecipes(): Promise<void> {
  if (list.length > 0) return;
  try {
    const raw = await safeStorage.getItem(STORAGE_KEYS.recipes);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Recipe[];
    if (Array.isArray(parsed) && parsed.length > 0 && list.length === 0) {
      list = parsed;
      reindex();
      emit();
    }
  } catch {
    /* corrupt cache — ignore, user can regenerate */
  }
}
