import React, { useCallback, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { setRecipes as setRecipesCache, updateRecipeImage } from '@/src/state/recipeStore';
import { usePremium } from '@/src/hooks/usePremium';
import { recordError } from '@/src/lib/firebase';

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
  const premium = usePremium();

  const requestRef = React.useRef(0);
  const generate = useCallback(async () => {
    if (!supabase) {
      setError('Backend not configured');
      setStatus('error');
      return;
    }
    const myReq = ++requestRef.current;
    setStatus('loading');
    setError(null);
    try {
      // Premium signal so the Edge Function skips the 24h rate limit.
      const { data, error: fnErr } = await supabase.functions.invoke<{
        recipes?: Recipe[];
        error?: string;
        message?: string;
      }>('generate-recipes', { body: { entitled: premium } });
      if (myReq !== requestRef.current) return; // superseded by newer request
      if (fnErr) {
        // supabase-js does NOT parse the response body into `data` on a
        // non-2xx — it throws a FunctionsHttpError whose `.message` is the
        // useless generic "Edge Function returned a non-2xx status code".
        // The real structured payload (e.g. our 429 daily-limit message) is
        // on the raw Response at `fnErr.context`. Read it so the user sees
        // "Free plan: 1 recipe generation per day…" instead of the generic
        // error, and so the screen's `error.includes('Free plan')` branch
        // can surface the upgrade CTA.
        let body: { error?: string; message?: string } | null = data ?? null;
        const ctx = (fnErr as unknown as { context?: Response }).context;
        if (!body?.message && !body?.error && ctx && typeof ctx.json === 'function') {
          try {
            body = await ctx.json();
          } catch {
            /* body wasn't JSON — fall through to generic message */
          }
        }
        const errMsg = body?.message ?? body?.error ?? fnErr.message;
        throw new Error(errMsg);
      }
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
            if (myReq !== requestRef.current) return; // stale, bail
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
      if (myReq !== requestRef.current) return;
      // Skip Crashlytics noise for the daily-limit 429 — that's expected
      // behaviour for free users, not a runtime error worth alerting on.
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes('Free plan') && !msg.includes('daily_limit')) {
        recordError(e, 'recipe-generate');
      }
      setError(msg);
      setStatus('error');
    }
  }, [supabase, premium]);

  // Note: deliberately NOT auto-generating on mount. Each generation costs
  // ~$0.13 (gpt-5.5 + 3x gpt-image-1) — opening the tab shouldn't burn money.
  // The recipes screen now shows a "Generate Recipes" CTA that the user taps
  // explicitly.

  return { status, error, recipes, refresh: generate };
}
