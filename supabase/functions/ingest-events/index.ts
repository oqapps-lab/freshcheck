// Supabase Edge Function: ingest-events
//
// First-party product-analytics sink. The app buffers events client-side and
// flushes a BATCH here every ~15s / on background; we insert them into
// public.app_events (RLS-locked; only this service-role fn writes). user_id is
// derived best-effort from the caller's JWT (anon or email) so events attribute
// without the client ever sending it. Unknown event names are dropped.
//
// Deploy: supabase functions deploy ingest-events
// Auth: verify_jwt is OFF (pre-auth events must land); we still read the token.

// @ts-expect-error Deno import map resolves at runtime.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Server-side allowlist — mirrors src/lib/analytics.ts. Anything else is dropped
// so a client bug / bad actor can't pollute the table with arbitrary events.
const ALLOWED = new Set<string>([
  'app_open', 'app_background', 'screen_view',
  'onboarding_step_view', 'tutorial_complete', 'quiz_start', 'quiz_complete', 'sign_up', 'att_prompt',
  'scan_completed', 'whole_table_scanned', 'barcode_scanned', 'fridge_item_added', 'recipe_generated', 'recipe_viewed', 'achievement_unlocked',
  'paywall_view', 'paywall_continue', 'paywall_dismiss', 'trial_start', 'purchase', 'rate_limit_hit',
  'scan_failed', 'ai_fallback', 'push_enabled', 'push_opened', 'error_recorded',
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'content-type': 'application/json' } });
}

// @ts-expect-error Deno.serve is available at runtime.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.events)) return json({ ok: false, error: 'events[] required' }, 400);

  // @ts-expect-error Deno.env
  const url = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error Deno.env
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  // @ts-expect-error Deno.env
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return json({ ok: false, error: 'env missing' }, 500);

  // Best-effort user attribution from the caller's token (anon or email).
  let userId: string | null = null;
  const authHeader = req.headers.get('authorization') ?? '';
  if (authHeader && anonKey) {
    try {
      const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
      const { data } = await userClient.auth.getUser();
      userId = data?.user?.id ?? null;
    } catch {
      /* no/invalid token — leave userId null */
    }
  }

  const project = String(body.project ?? 'freshcheck').slice(0, 40);
  const platform = body.platform ? String(body.platform).slice(0, 16) : null;
  const appVersion = body.app_version ? String(body.app_version).slice(0, 32) : null;

  const rows = (body.events as unknown[])
    .slice(0, 200)
    .filter((e): e is Record<string, unknown> => !!e && typeof e === 'object' && ALLOWED.has(String((e as Record<string, unknown>).event)))
    .map((e) => ({
      project,
      event: String(e.event).slice(0, 64),
      session_id: String(e.session_id ?? '').slice(0, 64),
      user_id: userId,
      props: e.props && typeof e.props === 'object' ? e.props : {},
      platform,
      app_version: appVersion,
      client_ts: typeof e.client_ts === 'string' ? e.client_ts : null,
    }));

  if (rows.length === 0) return json({ ok: true, inserted: 0 });

  const svc = createClient(url, serviceKey);
  const { error } = await svc.from('app_events').insert(rows);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true, inserted: rows.length });
});
