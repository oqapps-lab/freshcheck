// Supabase Edge Function: recipe-image
//
// Given a recipe slug + image prompt, returns a public URL to a hero image.
// Caches in Supabase Storage by slug — multiple users requesting the same
// recipe share the same image (huge cost saving vs re-generating).
//
// Auth: caller bearer token (any authenticated user, incl anonymous).

// @ts-expect-error Deno runtime
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const BUCKET = 'recipe-images';

// @ts-expect-error Deno.serve
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const { slug, prompt } = await req.json().catch(() => ({}));
  if (!slug || typeof slug !== 'string') return json({ error: 'slug required' }, 400);
  if (!prompt || typeof prompt !== 'string') return json({ error: 'prompt required' }, 400);
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) return json({ error: 'slug must be a-z0-9- only' }, 400);

  const authHeader = req.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'unauthenticated' }, 401);

  // @ts-expect-error Deno.env
  const url = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error Deno.env
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  // @ts-expect-error Deno.env
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!url || !serviceKey) return json({ error: 'supabase env missing' }, 500);
  if (!openaiKey) return json({ error: 'OPENAI_API_KEY missing' }, 500);

  // Service role client to bypass RLS (anyone can READ the cached image).
  const supabase = createClient(url, serviceKey);

  const objectPath = `${slug}.webp`;

  // Check cache first — if image exists, return public URL immediately.
  const { data: head } = await supabase.storage.from(BUCKET).list('', {
    search: objectPath,
    limit: 1,
  });
  const cached = head?.find((o: { name: string }) => o.name === objectPath);
  if (cached) {
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    return json({ url: pub.publicUrl, cached: true });
  }

  // Not cached — generate via OpenAI gpt-image-1
  const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      quality: 'medium',
      // ~150KB WebP instead of a ~1.5MB PNG — the PNGs were too large to load
      // over storage egress (hero images never appeared). WebP keeps quality
      // at a 10x smaller payload, and iOS RN <Image> renders it natively.
      output_format: 'webp',
      output_compression: 75,
      n: 1,
    }),
  });
  if (!imgRes.ok) {
    const msg = await imgRes.text();
    return json({ error: `openai image ${imgRes.status}: ${msg.slice(0, 300)}` }, 502);
  }
  const imgJson = await imgRes.json();
  const b64 = imgJson?.data?.[0]?.b64_json;
  if (!b64) return json({ error: 'empty image response' }, 502);

  // Decode base64 → upload to storage
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, bytes, {
      contentType: 'image/webp',
      cacheControl: '31536000', // 1 year — recipe images are immutable
      upsert: false,
    });
  if (upErr) {
    // Race condition: another concurrent invocation created it. Re-check cache.
    if (upErr.message.includes('already exists')) {
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
      return json({ url: pub.publicUrl, cached: true });
    }
    return json({ error: `storage upload: ${upErr.message}` }, 500);
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return json({ url: pub.publicUrl, cached: false });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
  });
}
