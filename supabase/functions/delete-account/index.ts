// Account-deletion Edge Function.
//
// Required by App Store Review Guideline 5.1.1(v) — apps allowing
// account creation must offer in-app deletion. Called from Settings →
// Delete account; runs under the user's auth context, then escalates
// via service_role to delete the auth.users row (which cascades to
// profiles / scans / fridge_items / saved_recipes via FK).
//
// Auth: requires Authorization: Bearer <user_jwt>
// Method: POST (no body)
// Response 200: { ok: true }
// Response 401: { ok: false, error: 'unauthorized' }
// Response 500: { ok: false, error: <reason> }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ ok: false, error: 'method-not-allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  // Resolve the user from their JWT (anon-key client + Authorization header).
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const userId = userData.user.id;

  // Escalate to service-role to delete the auth.users row (cascades).
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Clean up the user's scan images in storage BEFORE deleting the auth
  // row — Supabase FK cascade only handles DB rows, not storage objects.
  // Without this, scans/<uid>/*.jpg files (publicly readable per the
  // storage RLS policy) outlive the user — a GDPR / privacy concern and
  // an App Review 5.1.1(v) gap (account deletion should remove personal
  // content, not just the auth row). recipe-images bucket is intentionally
  // shared across users (slug-keyed) and is NOT cleaned here.
  const { data: scanFiles } = await adminClient.storage
    .from('scans')
    .list(userId, { limit: 1000 });
  if (scanFiles && scanFiles.length > 0) {
    const paths = scanFiles.map((f) => `${userId}/${f.name}`);
    await adminClient.storage.from('scans').remove(paths);
  }

  const { error: deleteErr } = await adminClient.auth.admin.deleteUser(userId);
  if (deleteErr) {
    return json({ ok: false, error: deleteErr.message }, 500);
  }

  return json({ ok: true });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
