import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { LastScan } from '@/src/state/lastScan';

/**
 * Core scan pipeline, UI-free, so it can be driven from BOTH the single
 * capture flow (app/capture.tsx) and the batch queue (src/state/scanQueue).
 *
 * compress (≤1024px, strips EXIF) → upload to the `scans` bucket under
 * `${userId}/scan_<ts>.jpg` → invoke the `scan-image` Edge Function
 * (OpenAI gpt-5.5) → return the structured verdict.
 *
 * Throws on any step failure; callers decide how to surface it.
 */

// gpt-5.5 is a REASONING vision model — a busy grocery photo can take 10s+ on
// the model leg alone. With NO deadline the iOS socket eventually aborts with a
// raw "Network request timeout" / "Failed to send a request to the edge
// function", which the user has to Rescan ("works через раз"). So bound each
// network leg with an explicit timeout + ONE automatic retry (the dominant
// failure is intermittent latency, so a fresh attempt usually succeeds).
const UPLOAD_TIMEOUT_MS = 25_000;
const INVOKE_TIMEOUT_MS = 45_000;

const TIMEOUT_MSG = 'This is taking longer than usual — please try again.';
const UNREACHABLE_MSG = 'Couldn’t reach the scanner. Check your connection and try again.';

function withTimeout<T>(p: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(TIMEOUT_MSG)), ms);
    Promise.resolve(p).then(
      (v) => { clearTimeout(id); resolve(v); },
      (e) => { clearTimeout(id); reject(e); },
    );
  });
}

// A network-level failure (no HTTP response) is worth one retry; a genuine
// server error (429 daily limit, 502 openai) is NOT — retrying won't help.
function isRetryable(err: unknown): boolean {
  const name = (err as { name?: string })?.name ?? '';
  const msg = String((err as { message?: string })?.message ?? '');
  return name === 'FunctionsFetchError' || /failed to send|timed out|timeout|network|fetch/i.test(msg);
}

// Run a supabase op that resolves to { data, error } with a timeout + one
// retry. Retries on a hard timeout/throw OR a resolved network-level error.
async function withRetry<T extends { error: unknown }>(op: () => Promise<T>, ms: number): Promise<T> {
  let res: T;
  try {
    res = await withTimeout(op(), ms);
  } catch {
    // attempt 1 timed out / threw — one fresh attempt (let a 2nd timeout throw)
    return await withTimeout(op(), ms);
  }
  if (res.error && isRetryable(res.error)) {
    try { return await withTimeout(op(), ms); } catch { return res; }
  }
  return res;
}

// Turn a FunctionsHttpError/FetchError into a user-facing string. Non-2xx
// function responses carry our friendly `message` in the JSON body on
// `.context`; network failures get a generic "couldn't reach" line.
async function fnErrorMessage(err: unknown): Promise<string> {
  try {
    const ctx = (err as { context?: { json?: () => Promise<Record<string, unknown>> } })?.context;
    if (ctx && typeof ctx.json === 'function') {
      const body = await ctx.json();
      if (body?.message) return String(body.message);
      if (body?.error) return String(body.error);
    }
  } catch {
    /* body not JSON / already consumed — fall through */
  }
  const msg = String((err as { message?: string })?.message ?? '');
  if (isRetryable(err) || msg === TIMEOUT_MSG) return msg === TIMEOUT_MSG ? TIMEOUT_MSG : UNREACHABLE_MSG;
  return msg || 'Scan failed';
}

// Compress (≤1024px, strips EXIF) + upload to the `scans` bucket. Returns
// the storage path + the local resized uri (used as the preview).
async function compressAndUpload(
  supabase: SupabaseClient,
  userId: string,
  sourceUri: string,
): Promise<{ imagePath: string; imageUri: string }> {
  const resized = await manipulateAsync(
    sourceUri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: SaveFormat.JPEG },
  );
  // React Native cannot serialize a Blob / File / FormData / fetch-derived
  // ArrayBuffer as a storage upload body — the PUT stalls and surfaces as
  // "Network request timed out". Per supabase-js's own RN guidance, upload an
  // ArrayBuffer decoded from the file's base64 string.
  const base64 = await new File(resized.uri).base64();
  const bytes = decode(base64);
  // Date.now() + a random suffix so two near-simultaneous uploads can't
  // collide on the same object key.
  const imagePath = `${userId}/scan_${Date.now()}_${Math.floor(Math.random() * 1e6)}.jpg`;
  // upsert:true so a timed-out-then-retried upload can't 409 on a key the
  // first (slow) attempt actually landed.
  const { error: upErr } = await withRetry(
    () => supabase.storage
      .from('scans')
      .upload(imagePath, bytes, { contentType: 'image/jpeg', upsert: true }),
    UPLOAD_TIMEOUT_MS,
  );
  if (upErr) {
    throw new Error(isRetryable(upErr) ? UNREACHABLE_MSG : `upload: ${(upErr as { message?: string }).message ?? 'failed'}`);
  }
  return { imagePath, imageUri: resized.uri };
}

function toLastScan(data: Record<string, unknown>, imagePath: string, imageUri: string): LastScan {
  const verdict = (data.verdict as LastScan['verdict']) ?? 'safe';
  return {
    scanId: (data.scan_id as string) ?? null,
    imagePath,
    imageUri,
    product: (data.product as string) ?? 'unknown',
    verdict,
    tone: (data.tone as LastScan['tone']) ?? verdict,
    confidence: typeof data.confidence === 'number' ? data.confidence : 0,
    reasoning: (data.reasoning as string) ?? null,
    storageNote: (data.storage_note as string) ?? null,
    daysLeft: (data.days_left as number) ?? null,
    totalDays: (data.total_days as number) ?? null,
    analysis: Array.isArray(data.analysis) ? (data.analysis as { label: string; value: number }[]) : [],
    // Single-mode hint: the model flags when the photo clearly holds several
    // distinct food items, so the capture flow can offer "scan them all"
    // instead of returning one item / "unknown" for a whole-table photo.
    multipleItems: data.multiple_items === true,
  };
}

/**
 * Single-item scan. UI-free; driven from the capture flow + the batch queue.
 * Throws on any step failure.
 */
export async function scanImage(
  supabase: SupabaseClient,
  userId: string,
  sourceUri: string,
  entitled = false,
): Promise<LastScan> {
  const { imagePath, imageUri } = await compressAndUpload(supabase, userId, sourceUri);
  const { data, error: fnErr } = await withRetry(
    () => supabase.functions.invoke('scan-image', { body: { image_path: imagePath, entitled } }),
    INVOKE_TIMEOUT_MS,
  );
  if (fnErr) throw new Error(await fnErrorMessage(fnErr));
  if (!data || data.error) throw new Error((data?.message as string) ?? (data?.error as string) ?? 'scan failed');
  return toLastScan(data, imagePath, imageUri);
}

/**
 * Multi-item scan (K9): one photo → all distinct food items in it. Returns a
 * LastScan per detected item, all sharing this photo's preview/path.
 */
export async function scanMultiImage(
  supabase: SupabaseClient,
  userId: string,
  sourceUri: string,
  entitled = false,
): Promise<LastScan[]> {
  const { imagePath, imageUri } = await compressAndUpload(supabase, userId, sourceUri);
  const { data, error: fnErr } = await withRetry(
    () => supabase.functions.invoke('scan-image', { body: { image_path: imagePath, multi: true, entitled } }),
    INVOKE_TIMEOUT_MS,
  );
  if (fnErr) throw new Error(await fnErrorMessage(fnErr));
  if (!data || data.error) throw new Error((data?.message as string) ?? (data?.error as string) ?? 'scan failed');
  const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];
  return items.map((it) => toLastScan(it, imagePath, imageUri));
}
