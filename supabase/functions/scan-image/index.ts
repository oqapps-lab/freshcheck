// Supabase Edge Function: scan-image
//
// Takes `{ image_path }` pointing at an object in the `scans` bucket,
// asks OpenAI gpt-5.5 (vision) for a structured freshness verdict,
// persists it to public.scans, and returns the row.
//
// Deploy:  supabase functions deploy scan-image
// Secret:  supabase secrets set OPENAI_API_KEY=sk-...
//
// Auth: invoked with caller's access token via supabase.functions.invoke;
// we forward it into a per-request supabase client so RLS applies on the
// scans-table insert.
//
// Model choice: gpt-5.5 verified latest GA on developers.openai.com/api/docs/models
// (April 28, 2026). Vision-capable, $5 / $30 per 1M tokens.

// @ts-expect-error Deno runtime — TS server in the app workspace has no Deno types.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error Deno import map resolves at runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODEL = 'gpt-5.5';

type VerdictPayload = {
  product: string;
  verdict: 'fresh' | 'safe' | 'soon' | 'past';
  tone: 'fresh' | 'safe' | 'soon' | 'past' | 'neutral';
  confidence: number;
  reasoning?: string;
  storage_note?: string;
  days_left?: number;
  total_days?: number;
  analysis?: { label: string; value: number }[];
};

const SYSTEM_PROMPT = `You are a food-safety assistant. A user photographed a single food item.
Respond with VALID JSON that matches this exact schema (no markdown fence, no commentary):
{
  "product": string (short human name, lowercase),
  "verdict": "fresh" | "safe" | "soon" | "past",
  "tone": same as verdict,
  "confidence": integer 0-100 (your certainty),
  "reasoning": string (ONE short sentence, lowercase, explaining WHY you gave this verdict and day estimate — what you SEE in the photo and the item's typical shelf life. e.g. "skin looks taut with no spots, and whole eggs keep ~3 weeks refrigerated"),
  "storage_note": string (1-2 sentences, how to store, lowercase),
  "days_left": integer (estimated days before it spoils; 0 if past),
  "total_days": integer (typical total shelf-life for this item when fresh),
  "analysis": [
    { "label": "Color", "value": 0-100 },
    { "label": "Texture", "value": 0-100 },
    { "label": "Smell", "value": 0-100 }
  ]
}
Important: base days_left on what you can SEE plus typical shelf life ASSUMING the item is fresh/just-bought, since you don't know when it was purchased. The app lets the user refine this afterwards.
Scoring guide:
- "fresh" = looks great, long life ahead.
- "safe" = eat it within a day or two.
- "soon" = use within 24h, noticeable decline.
- "past" = don't eat.
If unclear, lower confidence. Never invent a product; if you cannot tell,
return { "product": "unknown", "verdict": "safe", "confidence": 30, "analysis": [] }.`;

// Multi-item mode (K9): the photo may contain SEVERAL distinct food items
// (e.g. groceries on a table). Detect each and return an array.
const MULTI_SYSTEM_PROMPT = `You are a food-safety assistant. A user photographed SEVERAL food items at once (e.g. groceries on a table).
Identify each DISTINCT food item you can see (up to 8; ignore packaging clutter, hands, background). For EACH, assess freshness.
Respond with VALID JSON (no markdown fence, no commentary) of this exact shape:
{
  "items": [
    {
      "product": string (short human name, lowercase),
      "verdict": "fresh" | "safe" | "soon" | "past",
      "tone": same as verdict,
      "confidence": integer 0-100,
      "reasoning": string (ONE short lowercase sentence — what you see + typical shelf life),
      "storage_note": string (1-2 sentences, lowercase),
      "days_left": integer (0 if past),
      "total_days": integer (typical shelf-life when fresh),
      "analysis": [ { "label": "Color", "value": 0-100 }, { "label": "Texture", "value": 0-100 }, { "label": "Smell", "value": 0-100 } ]
    }
  ]
}
Base days_left on what you SEE + typical shelf life ASSUMING just-bought (you don't know purchase date).
Scoring: fresh = great/long life; safe = eat within a day or two; soon = use within 24h; past = don't eat.
If you genuinely see no food, return { "items": [] }.`;

// @ts-expect-error Deno.serve is available at runtime.
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const { image_path, multi } = await req.json().catch(() => ({}));
  if (!image_path || typeof image_path !== 'string') {
    return json({ error: 'image_path required' }, 400);
  }
  const isMulti = multi === true;

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'unauthenticated' }, 401);

  // @ts-expect-error Deno.env
  const url = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error Deno.env
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  // @ts-expect-error Deno.env
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!url || !anonKey) return json({ error: 'supabase env missing' }, 500);
  if (!openaiKey) return json({ error: 'OPENAI_API_KEY missing — run supabase secrets set' }, 500);

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);
  if (!image_path.startsWith(`${user.id}/`)) {
    return json({ error: 'forbidden: image_path must start with your user id' }, 403);
  }

  // Short-lived signed URL so OpenAI's fetcher can read the upload.
  const { data: signed, error: signErr } = await supabase.storage
    .from('scans')
    .createSignedUrl(image_path, 120);
  if (signErr || !signed?.signedUrl) {
    return json({ error: `signed url failed: ${signErr?.message ?? 'no url'}` }, 500);
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
        { role: 'system', content: isMulti ? MULTI_SYSTEM_PROMPT : SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: isMulti ? 'Detect every food item and return the JSON.' : 'Assess this food and return the JSON.' },
            { type: 'image_url', image_url: { url: signed.signedUrl } },
          ],
        },
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

  // Multi-item mode (K9): normalize + return the array. We do NOT persist each
  // to the scans table here — the client lets the user pick which to keep
  // (they get saved when added to the fridge).
  if (isMulti) {
    let mp: { items?: VerdictPayload[] };
    try {
      mp = JSON.parse(raw);
    } catch {
      return json({ error: 'openai returned non-JSON', raw }, 502);
    }
    const items = (Array.isArray(mp.items) ? mp.items : []).map((it) => ({
      product: it.product || 'unknown',
      verdict: it.verdict ?? 'safe',
      tone: (it.tone ?? it.verdict ?? 'safe') as VerdictPayload['tone'],
      confidence: Math.max(0, Math.min(100, Number(it.confidence) || 0)),
      reasoning: it.reasoning ?? null,
      storage_note: it.storage_note ?? null,
      days_left: it.days_left != null ? Math.max(0, Math.floor(it.days_left)) : null,
      total_days: it.total_days != null ? Math.max(1, Math.floor(it.total_days)) : null,
      analysis: Array.isArray(it.analysis) ? it.analysis : [],
    }));
    return json({ items, image_path });
  }

  let parsed: VerdictPayload;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ error: 'openai returned non-JSON', raw }, 502);
  }

  parsed.tone = (parsed.tone ?? parsed.verdict) as VerdictPayload['tone'];
  parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 0));
  if (parsed.days_left != null) parsed.days_left = Math.max(0, Math.floor(parsed.days_left));
  if (parsed.total_days != null) parsed.total_days = Math.max(1, Math.floor(parsed.total_days));

  // Persist the verdict so the user has a scan history (and so /scan can
  // re-read by id if it's revisited later).
  const { data: scanRow, error: insErr } = await supabase
    .from('scans')
    .insert({
      user_id: user.id,
      product: parsed.product || 'unknown',
      verdict: parsed.verdict,
      tone: parsed.tone,
      confidence: parsed.confidence,
      analysis: parsed.analysis ?? [],
      storage_note: parsed.storage_note ?? null,
      days_left: parsed.days_left ?? null,
      total_days: parsed.total_days ?? null,
      image_path,
    })
    .select('id')
    .single();

  if (insErr) {
    // Non-fatal: still return the verdict so UX survives a DB hiccup.
    return json({ ...parsed, scan_id: null, persist_error: insErr.message });
  }

  return json({ ...parsed, scan_id: scanRow.id });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}
