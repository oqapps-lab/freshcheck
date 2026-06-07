import React, { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { recordRecipeAch } from '@/src/state/achievementsStore';
import {
  setRecipes as setRecipesCache,
  updateRecipeImage,
  getRecipeList,
  subscribeRecipes,
  hydrateRecipes,
} from '@/src/state/recipeStore';
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
  // Recipes live in the module-level store (persisted + shared) so the tab
  // shows the last batch after navigating away or restarting. We mirror the
  // store into local state via a subscription; the store is the single
  // source of truth for the recipe LIST (status/error stay local per-hook).
  const [recipes, setLocalRecipes] = useState<Recipe[]>(getRecipeList());
  // True once the persisted batch has been read from disk. The screen waits
  // for this before showing any empty/idle state, so a cold open doesn't
  // flash "no recipes / fridge empty" for a frame before the saved batch
  // streams in.
  const [hydrated, setHydrated] = useState<boolean>(getRecipeList().length > 0);
  const { premium } = usePremium();

  useEffect(() => {
    let active = true;
    setLocalRecipes(getRecipeList());
    void hydrateRecipes().finally(() => {
      if (active) {
        setLocalRecipes(getRecipeList());
        setHydrated(true);
      }
    });
    const unsub = subscribeRecipes(() => {
      if (active) setLocalRecipes(getRecipeList());
    });
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const requestRef = React.useRef(0);
  // opts.itemIds (K7): the fridge items the user ticked to cook with. Empty
  // = use the whole fridge. Passed to the edge function as `item_ids`.
  const generate = useCallback(async (opts?: { itemIds?: string[]; custom?: { ingredients: string[]; method?: string; maxMinutes?: number | null; onlyThese?: boolean } }) => {
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
      }>('generate-recipes', { body: { entitled: premium, item_ids: opts?.itemIds ?? [], custom: opts?.custom ?? null } });
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
      // Write to the store — our subscription mirrors it into local state
      // and persists it so the batch survives navigation / restart.
      setRecipesCache(data.recipes);
      recordRecipeAch(data.recipes.length);
      setStatus('ready');

      // Kick off image fetch per recipe (don't block UI). updateRecipeImage
      // emits a store change → subscription re-renders the card with the photo.
      // Fetch hero images SEQUENTIALLY with retry. The old parallel
      // fire-and-forget left a recipe permanently imageless (infinite card
      // spinner) whenever a single gpt-image-1 call timed out — and 3-way
      // concurrency pushed each call's latency from ~15s to ~26s, making
      // timeouts likely. One-at-a-time + 3x backoff is far more reliable;
      // updateRecipeImage re-renders each card the moment its photo lands.
      const batch = data.recipes;
      void (async () => {
        for (const r of batch) {
          if (myReq !== requestRef.current) return; // superseded
          let url: string | undefined;
          for (let attempt = 1; attempt <= 3 && !url; attempt++) {
            try {
              const { data: imgData, error: imgErr } = await supabase.functions.invoke<{
                url?: string;
                error?: string;
              }>('recipe-image', { body: { slug: r.id, prompt: r.hero_image_prompt } });
              if (imgErr) throw imgErr;
              url = imgData?.url;
            } catch (imgErr) {
              if (attempt === 3) recordError(imgErr, 'recipe-image');
              else await new Promise((res) => setTimeout(res, attempt * 2500));
            }
          }
          if (myReq !== requestRef.current) return; // superseded
          if (url) updateRecipeImage(r.id, url);
        }
      })();
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

  return { status, error, recipes, hydrated, refresh: generate };
}
