// Supabase Edge Function: adapty-webhook
//
// Receives Adapty subscription lifecycle events and maintains public.subscriptions
// (one row per user, tier = free|trial|paid). generate-recipes reads this table
// to enforce per-tier generation caps server-side WITHOUT trusting any client flag.
//
// Auth: Adapty sends the 'Authorization' header EXACTLY equal to the value set in
// the Adapty dashboard (Integrations -> Webhook -> Authorization header value).
// We compare it to ADAPTY_WEBHOOK_SECRET (Deno secret). Deploy with --no-verify-jwt.

// @ts-expect-error Deno runtime
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const EXPIRY_EVENTS = new Set([
  'subscription_expired',
  'trial_expired',
  'subscription_refunded',
  'non_subscription_purchase_refunded',
]);

// @ts-expect-error Deno.serve
serve(async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  // @ts-expect-error Deno.env
  const secret = Deno.env.get('ADAPTY_WEBHOOK_SECRET') ?? '';
  const auth = req.headers.get('authorization') ?? '';
  if (!secret || auth !== secret) return new Response('unauthorized', { status: 401 });

  // @ts-expect-error Deno.env
  const url = Deno.env.get('SUPABASE_URL');
  // @ts-expect-error Deno.env
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return new Response('env missing', { status: 500 });

  let ev: Record<string, unknown>;
  try {
    ev = await req.json();
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const uid = typeof ev.customer_user_id === 'string' ? ev.customer_user_id : null;
  if (!uid) return json({ ok: true, skipped: 'no customer_user_id' });

  const type = typeof ev.event_type === 'string' ? ev.event_type : '';
  // Real Adapty payloads carry the subscription data inside event_properties
  // (verified against stored raw_event rows) — top-level fields exist only on
  // some event types. Read both.
  const props = (ev.event_properties && typeof ev.event_properties === 'object'
    ? ev.event_properties
    : {}) as Record<string, unknown>;
  const expiresAt =
    (typeof ev.subscription_expires_at === 'string' ? ev.subscription_expires_at : null) ??
    (typeof props.subscription_expires_at === 'string' ? props.subscription_expires_at : null) ??
    (typeof props.expires_at === 'string' ? props.expires_at : null);
  const introType =
    (typeof ev.active_introductory_offer_type === 'string' ? ev.active_introductory_offer_type : null) ??
    (typeof props.active_introductory_offer_type === 'string' ? props.active_introductory_offer_type : null);

  const svc = createClient(url, serviceKey);
  const { data: prev } = await svc
    .from('subscriptions')
    .select('tier, tier_since')
    .eq('user_id', uid)
    .maybeSingle();

  let tier: 'free' | 'trial' | 'paid';
  if (EXPIRY_EVENTS.has(type) || props.is_active === false || props.is_refund === true) {
    tier = 'free';
  } else if ((type.startsWith('trial_') && type !== 'trial_converted') || introType === 'free_trial') {
    // trial_converted means the trial BECAME a paid subscription — paid.
    tier = 'trial';
  } else if (type === 'access_level_updated') {
    // access_level_updated fires for both trial and paid periods and carries
    // no trial marker — preserve the tier set by the explicit trial_*/
    // subscription_* events instead of clobbering trial → paid.
    tier = prev && (prev.tier === 'trial' || prev.tier === 'paid') ? (prev.tier as 'trial' | 'paid') : 'paid';
  } else {
    tier = 'paid';
  }
  const tierSince =
    prev && prev.tier === tier && typeof prev.tier_since === 'string'
      ? prev.tier_since
      : new Date().toISOString();

  const { error } = await svc.from('subscriptions').upsert(
    {
      user_id: uid,
      tier,
      expires_at: expiresAt,
      tier_since: tierSince,
      updated_at: new Date().toISOString(),
      profile_id: typeof ev.profile_id === 'string' ? ev.profile_id : null,
      raw_event: ev,
    },
    { onConflict: 'user_id' },
  );
  if (error) {
    if ((error as { code?: string }).code === '23503') return json({ ok: true, skipped: 'unknown user' });
    return new Response('db error: ' + error.message, { status: 500 });
  }
  return json({ ok: true, tier });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
