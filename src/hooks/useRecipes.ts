import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { setRecipes as setRecipesCache, updateRecipeImage } from '@/src/state/recipeStore';

export type RecipeStepIcon = 'prep' | 'cook' | 'wait' | 'mix' | 'serve';

export type RecipeStep = {
  order: number;
  text: string;
  minutes: number;
  icon: RecipeStepIcon;
};

export type RecipeIngredient = {
  name: string;
  amount: string;
  from_fridge: boolean;
};

export type Recipe = {
  id: string;
  name: string;
  blurb: string;
  minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  uses_categories: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  hero_image_prompt: string;
  hero_image_url?: string | null;
};

type Status = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Hook for AI-generated recipes based on the user's fridge contents.
 *
 * Pipeline:
 * 1. POST /functions/v1/generate-recipes — gpt-5.5 produces 3 recipes
 *    (prioritizes items expiring within 3 days).
 * 2. For each recipe, POST /functions/v1/recipe-image — generates a hero
 *    photo via gpt-image-1 in the app's neumorphic style. Images are
 *    cached in `recipe-images` Storage bucket (public read) by slug, so
 *    common recipes share images across users.
 *
 * Images load progressively — UI can render the card with text first,
 * then swap in `hero_image_url` when ready.
 */
export function useRecipes() {
  const supabase = getSupabase();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const generate = useCallback(async () => {
    if (!supabase) {
      setError('Backend not configured');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke<{
        recipes?: Recipe[];
        error?: string;
      }>('generate-recipes', { body: {} });
      if (fnErr) throw new Error(fnErr.message);
      if (!data?.recipes?.length) throw new Error(data?.error ?? 'no recipes generated');
      // Render text immediately
      setRecipes(data.recipes);
      setRecipesCache(data.recipes);
      setStatus('ready');

      // Kick off image fetch per recipe (don't block UI)
      data.recipes.forEach((r, idx) => {
        void supabase.functions
          .invoke<{ url?: string; error?: string }>('recipe-image', {
            body: { slug: r.id, prompt: r.hero_image_prompt },
          })
          .then(({ data: imgData }) => {
            if (imgData?.url) {
              updateRecipeImage(r.id, imgData.url);
              setRecipes((prev) => {
                const next = [...prev];
                if (next[idx] && next[idx].id === r.id) {
                  next[idx] = { ...next[idx], hero_image_url: imgData.url };
                }
                return next;
              });
            }
          })
          .catch(() => {});
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus('error');
    }
  }, [supabase]);

  // Auto-generate on first mount
  useEffect(() => {
    if (status === 'idle' && supabase) {
      void generate();
    }
  }, [status, supabase, generate]);

  return { status, error, recipes, refresh: generate };
}
