import type { Recipe } from '@/src/hooks/useRecipes';

/**
 * Module-level cache: list screen sets the latest batch, detail screen
 * reads by id. Survives navigation, lost on app restart (recipes are
 * regenerated per session anyway).
 */
let cache: Map<string, Recipe> = new Map();

export function setRecipes(recipes: Recipe[]) {
  cache = new Map(recipes.map((r) => [r.id, r]));
}

export function getRecipe(id: string): Recipe | undefined {
  return cache.get(id);
}

export function updateRecipeImage(id: string, url: string) {
  const r = cache.get(id);
  if (r) cache.set(id, { ...r, hero_image_url: url });
}
