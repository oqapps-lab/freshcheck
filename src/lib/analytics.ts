// First-party product-analytics hub.
//
// track(event, props) fans out to:
//   (a) an in-memory buffer → batch-flushed to the `ingest-events` edge fn →
//       public.app_events (owned, queryable; the source of product truth), and
//   (b) AppsFlyer for the attribution/monetization subset only.
//
// The Firebase/GA4 sink is intentionally a NO-OP until @react-native-firebase is
// installed for Google UAC — we're not running paid Google ads yet (see
// GROWTH-STRATEGY); wiring RNFB is a deliberate later step, not a silent fake.
//
// Props rule: ids / counts / enums / durations ONLY — never PII / free-text.
// sanitize() is the safety net (drops non-primitives, caps strings).

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { getSupabase } from './supabase';
import { logSignUp, logScan, logTrialStart } from './appsflyer';

const PROJECT = 'freshcheck';
const FLUSH_INTERVAL_MS = 15_000;
const SESSION_GAP_MS = 30 * 60 * 1000;
const MAX_BUFFER = 100;

// Allowlist — mirrors supabase/functions/ingest-events. Unknown names are
// dropped here AND server-side so events can't drift / pollute the table.
const ALLOWED = new Set<string>([
  'app_open', 'app_background', 'screen_view',
  'onboarding_step_view', 'tutorial_complete', 'quiz_start', 'quiz_complete', 'sign_up', 'att_prompt',
  'scan_completed', 'whole_table_scanned', 'barcode_scanned', 'fridge_item_added', 'recipe_generated', 'recipe_viewed', 'achievement_unlocked',
  'paywall_view', 'paywall_continue', 'paywall_dismiss', 'trial_start', 'purchase', 'rate_limit_hit',
  'scan_failed', 'ai_fallback', 'push_enabled', 'push_opened', 'error_recorded',
]);

export type EventProps = Record<string, string | number | boolean | null | undefined>;
type QueuedEvent = { event: string; props: EventProps; session_id: string; client_ts: string };

let buffer: QueuedEvent[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let sessionId = newSessionId();
let lastActivity = Date.now();

function newSessionId(): string {
  return `s_${Date.now()}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}

// New session id after >30 min idle (standard sessionization).
function currentSession(): string {
  const now = Date.now();
  if (now - lastActivity > SESSION_GAP_MS) sessionId = newSessionId();
  lastActivity = now;
  return sessionId;
}

// Keep only primitive values; cap string length; bound prop count. Props are
// ids/counts/enums by convention — this is the defence against an accidental
// free-text / PII value reaching the store or AppsFlyer.
function sanitize(props?: EventProps): EventProps {
  const out: EventProps = {};
  if (!props) return out;
  let n = 0;
  for (const [k, v] of Object.entries(props)) {
    if (n >= 12 || v == null) continue;
    if (typeof v === 'number' || typeof v === 'boolean') { out[k] = v; n++; }
    else if (typeof v === 'string') { out[k] = v.slice(0, 64); n++; }
  }
  return out;
}

function ensureTimer(): void {
  if (timer) return;
  timer = setInterval(() => { void flush(); }, FLUSH_INTERVAL_MS);
}

// AppsFlyer attribution/monetization subset only. purchase is logged
// SERVER-SIDE (adapty-webhook) to avoid double-counting revenue.
function toAppsFlyer(event: string, p: EventProps): void {
  try {
    if (event === 'sign_up') logSignUp(p.method === 'guest' ? 'guest' : 'email');
    else if (event === 'scan_completed') logScan(typeof p.verdict === 'string' ? p.verdict : undefined);
    else if (event === 'trial_start') logTrialStart(String(p.plan ?? 'trial'), Number(p.revenue ?? 0));
  } catch {
    /* AppsFlyer SDK is a no-op until the dev key is configured */
  }
}

export function track(event: string, props?: EventProps): void {
  if (!ALLOWED.has(event)) {
    if (__DEV__) console.warn('[analytics] dropped unknown event:', event);
    return;
  }
  const clean = sanitize(props);
  toAppsFlyer(event, clean);
  buffer.push({ event, props: clean, session_id: currentSession(), client_ts: new Date().toISOString() });
  if (buffer.length > MAX_BUFFER) buffer = buffer.slice(-MAX_BUFFER);
  ensureTimer();
}

// Flush the buffer to the first-party sink. Call on a timer + on app background.
export async function flush(): Promise<void> {
  if (buffer.length === 0) return;
  const supabase = getSupabase();
  if (!supabase) return;
  const batch = buffer;
  buffer = [];
  try {
    const { error } = await supabase.functions.invoke('ingest-events', {
      body: {
        project: PROJECT,
        platform: Platform.OS,
        app_version: Constants.expoConfig?.version ?? null,
        events: batch,
      },
    });
    // Re-queue (capped) on failure so a dropped flush retries next tick.
    if (error) buffer = [...batch, ...buffer].slice(-MAX_BUFFER);
  } catch {
    buffer = [...batch, ...buffer].slice(-MAX_BUFFER);
  }
}

/** @deprecated use track(). Kept so any legacy caller still compiles. */
export async function capture(event: string, props?: EventProps): Promise<void> {
  track(event, props);
}
