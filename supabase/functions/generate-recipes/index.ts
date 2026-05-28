// Supabase Edge Function: generate-recipes
//
// Given a user's fridge contents, asks OpenAI gpt-5.5 for 3 creative recipes
// that prioritize items expiring soonest. Returns structured JSON the app can
// render directly.
//
// Auth: caller's bearer token, RLS-scoped per user.
// Hero image generation is a SEPARATE function (recipe-image) to keep this
// one fast (text-only ~3s vs +5-10s for image gen).

// @ts-expect-error Deno runtime
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODEL = 'gpt-5.5';

type Step = {
  order: number;
  text: string;
  minutes: number;
  icon: 'prep' | 'cook' | 'wait' | 'mix' | 'serve';
};
type Ingredient = {
  name: string;
  amount: string;
  from_fridge: boolean;
};
type Recipe = {
  id: string;
  name: string;
  blurb: string;
  minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  uses_categories: string[];
  ingredients: Ingredient[];
  steps: Step[];
  hero_image_prompt: string;
};

const SYSTEM_PROMPT = `You are a creative chef. Given a list of items in a user's fridge (with days_left until they spoil), generate exactly 3 recipes.

Rules:
- CRITICAL: Identify the SINGLE fastest-expiring item in the fridge (lowest days_left). Recipe #1 MUST feature this item as its PRIMARY ingredient (name it in the recipe title if possible). Recipe #2 should also use this item. Recipe #3 may use it OR another expiring-soon item.
- All 3 recipes COMBINED must use every item that has days_left <= 3.
- Each recipe must use AT LEAST 1 ingredient from the fridge marked from_fridge:true.
- Difficulty progression: recipe 1 = easy, recipe 2 = easy/medium, recipe 3 = medium/hard.
- Steps must be CONCRETE actions, not vague. "Slice onion thinly" not "prepare onion".
- Each step.minutes is realistic time for THAT step.
- step.icon must be: 'prep' (chop/slice/wash), 'cook' (heat/fry/bake), 'wait' (rest/marinate), 'mix' (stir/blend), 'serve' (plate/garnish).
- hero_image_prompt: describe the FINISHED dish as a professional food photograph in a NEUMORPHIC style: light gray (#ECEFF4) background, soft directional lighting, minimalist composition, no text, no garnish overload, photo-realistic, top-down or 3/4 angle.

If the fridge is empty (0 items), generate 3 simple starter recipes for ingredients the user can buy.

Output VALID JSON only (no markdown fence) matching this exact schema. Top-level key MUST be "recipes" containing an array of exactly 3 recipe objects:
{
  "recipes": [
    {
    "name": "Title Case Name",
    "blurb": "1-sentence enticing description (lowercase, max 14 words)",
    "minutes": 7,
    "difficulty": "easy",
    "uses_categories": ["produce", "dairy"],
    "ingredients": [
      { "name": "avocado", "amount": "1 ripe", "from_fridge": true },
      { "name": "lime juice", "amount": "1 tsp", "from_fridge": false }
    ],
    "steps": [
      { "order": 1, "text": "Mash avocado with lime juice and salt.", "minutes": 3, "icon": "prep" },
      { "order": 2, "text": "Toast bread until golden.", "minutes": 4, "icon": "cook" }
    ],
    "hero_image_prompt": "professional food photograph of avocado toast on a small ceramic plate, perfectly sliced ripe avocado fanned out, ruby-red chili flakes, micro greens, sea salt crystals, drizzle of olive oil glistening, rustic sourdough bread with crusty edges, served on a light gray surface with soft natural window light from the left, shallow depth of field, ultra detailed textures, magazine-quality photography"
    }
  ]
}`;

// @ts-expect-error Deno.serve
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthenticated' }, 401);

  // @ts-expect-error Deno.env
  const url = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error Deno.env
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  // @ts-expect-error Deno.env
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  // @ts-expect-error Deno.env
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!url || !anonKey || !serviceKey) return json({ error: 'supabase env missing' }, 500);
  if (!openaiKey) return json({ error: 'OPENAI_API_KEY missing' }, 500);

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  // Rate limit: free users get 1 generation per 24h. Premium (Adapty) is
  // unlimited — premium status is signalled by the client via an `entitled`
  // bool in the request body (cheap; Adapty's own SDK already vouches for it
  // and a free user spoofing it gains 1 free generation, low abuse risk).
  const { entitled } = await req.json().catch(() => ({ entitled: false }));
  if (!entitled) {
    // Use service role to read recipe_generations bypassing RLS
    const sb = createClient(url, serviceKey);
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await sb
      .from('recipe_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', since);
    if (countErr) return json({ error: `rate check: ${countErr.message}` }, 500);
    if ((count ?? 0) >= 1) {
      return json(
        {
          error: 'daily_limit_reached',
          message: 'Free plan: 1 recipe generation per day. Upgrade to FreshCheck Pro for unlimited.',
        },
        429,
      );
    }
    // Defer the insert until the OpenAI call succeeds — see line ~ after
    // the response check. Logging here would burn the free user's daily
    // quota on a 502 / timeout they never saw recipes for.
  }

  // Fetch user's fridge items (RLS-scoped)
  const { data: items, error: fridgeErr } = await supabase
    .from('fridge_items')
    .select('name, category, days_left')
    .order('days_left', { ascending: true })
    .limit(50);
  if (fridgeErr) return json({ error: `fridge fetch: ${fridgeErr.message}` }, 500);

  const fridgeItems = items ?? [];
  let userPrompt: string;
  if (fridgeItems.length === 0) {
    userPrompt = 'Fridge is empty. Suggest 3 simple starter recipes the user can buy ingredients for.';
  } else {
    const sorted = [...fridgeItems].sort(
      (a: { days_left: number | null }, b: { days_left: number | null }) =>
        (a.days_left ?? 99) - (b.days_left ?? 99),
    );
    const mandatory = sorted[0];
    const expiringSoon = sorted.filter(
      (i: { days_left: number | null }) => (i.days_left ?? 99) <= 3,
    );
    const others = sorted.filter(
      (i: { days_left: number | null }) => (i.days_left ?? 99) > 3,
    );

    const fmt = (i: { name: string; category: string; days_left: number | null }) =>
      `- ${i.name} (${i.category}, ${i.days_left ?? '?'} days left)`;

    userPrompt = [
      `MANDATORY ingredient (use in Recipe #1 — name it in the title): ${mandatory.name} (${mandatory.days_left ?? '?'} days left)`,
      '',
      'Other items expiring within 3 days (use ALL of these across the 3 recipes):',
      expiringSoon.length === 1 ? '(none besides the mandatory item)' : expiringSoon.slice(1).map(fmt).join('\n'),
      '',
      others.length ? 'Optional pool (lots of time left):' : '',
      others.map(fmt).join('\n'),
      '',
      'Generate the 3-recipe JSON object now.',
    ]
      .filter((l) => l !== '')
      .join('\n');
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!openaiRes.ok) {
    const msg = await openaiRes.text();
    return json({ error: `openai ${openaiRes.status}: ${msg.slice(0, 400)}` }, 502);
  }

  const openaiJson = await openaiRes.json();
  const raw = openaiJson?.choices?.[0]?.message?.content;
  if (!raw) return json({ error: 'empty openai response' }, 502);

  let parsed: { recipes?: Recipe[] } | Recipe[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ error: 'openai returned non-JSON', raw }, 502);
  }

  // OpenAI may wrap in {recipes:[...]} or return array directly
  const recipes: Recipe[] = Array.isArray(parsed)
    ? parsed
    : (parsed as { recipes?: Recipe[] }).recipes ?? [];

  if (!Array.isArray(recipes) || recipes.length === 0) {
    return json({ error: 'no recipes in response', raw }, 502);
  }

  // Now that we have a real result, log against the free-tier daily quota.
  // Inserting earlier would burn the user's only daily attempt on an OpenAI
  // 502 / timeout (since the row gets counted in the next 24h-window check
  // even though the user never got recipes).
  if (!entitled) {
    const sb = createClient(url, serviceKey);
    await sb.from('recipe_generations').insert({ user_id: user.id });
  }

  // Post-validation: if there's a mandatory item, ensure Recipe #1 names it
  // (cheap correctness check vs trusting the LLM completely).
  const mandatoryName = fridgeItems.length
    ? [...fridgeItems].sort(
        (a: { days_left: number | null }, b: { days_left: number | null }) =>
          (a.days_left ?? 99) - (b.days_left ?? 99),
      )[0].name.toLowerCase()
    : null;
  if (mandatoryName) {
    const usesMandatory = (r: Recipe) =>
      r.name.toLowerCase().includes(mandatoryName) ||
      r.ingredients.some((ing) => ing.name.toLowerCase().includes(mandatoryName));
    // If recipe #1 doesn't use mandatory but another recipe does, swap into position 1.
    if (!usesMandatory(recipes[0])) {
      const idx = recipes.findIndex(usesMandatory);
      if (idx > 0) {
        const swapped = [...recipes];
        [swapped[0], swapped[idx]] = [swapped[idx], swapped[0]];
        recipes.length = 0;
        recipes.push(...swapped);
      }
    }
  }

  // Assign deterministic IDs (hash of name) so the same recipe across users
  // can share a cached hero image in Storage. Hash the FULL name so two
  // recipes with the same slug (after stripping) don't collide on storage.
  const withIds = recipes.map((r) => {
    const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let id = slug.slice(0, 64);
    if (!id) {
      // Fallback: short hash of the full name
      let h = 0;
      for (let i = 0; i < r.name.length; i++) {
        h = (h * 31 + r.name.charCodeAt(i)) | 0;
      }
      id = `recipe-${Math.abs(h).toString(36)}`;
    }
    return { ...r, id };
  });

  return json({ recipes: withIds });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}
