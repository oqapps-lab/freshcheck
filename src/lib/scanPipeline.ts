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
  const { error: upErr } = await supabase.storage
    .from('scans')
    .upload(imagePath, bytes, { contentType: 'image/jpeg', upsert: false });
  if (upErr) throw new Error(`upload: ${upErr.message}`);
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
): Promise<LastScan> {
  const { imagePath, imageUri } = await compressAndUpload(supabase, userId, sourceUri);
  const { data, error: fnErr } = await supabase.functions.invoke('scan-image', {
    body: { image_path: imagePath },
  });
  if (fnErr) throw new Error(fnErr.message);
  if (!data || data.error) throw new Error(data?.error ?? 'scan failed');
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
): Promise<LastScan[]> {
  const { imagePath, imageUri } = await compressAndUpload(supabase, userId, sourceUri);
  const { data, error: fnErr } = await supabase.functions.invoke('scan-image', {
    body: { image_path: imagePath, multi: true },
  });
  if (fnErr) throw new Error(fnErr.message);
  if (!data || data.error) throw new Error(data?.error ?? 'scan failed');
  const items = Array.isArray(data.items) ? (data.items as Record<string, unknown>[]) : [];
  return items.map((it) => toLastScan(it, imagePath, imageUri));
}
