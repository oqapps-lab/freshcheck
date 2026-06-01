import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';
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
export async function scanImage(
  supabase: SupabaseClient,
  userId: string,
  sourceUri: string,
): Promise<LastScan> {
  const resized = await manipulateAsync(
    sourceUri,
    [{ resize: { width: 1024 } }],
    { compress: 0.7, format: SaveFormat.JPEG },
  );

  const file = new File(resized.uri);
  const bytes = await file.arrayBuffer();
  // Date.now() + a random suffix so two near-simultaneous batch uploads
  // can't collide on the same object key.
  const imagePath = `${userId}/scan_${Date.now()}_${Math.floor(Math.random() * 1e6)}.jpg`;
  const { error: upErr } = await supabase.storage
    .from('scans')
    .upload(imagePath, bytes, { contentType: 'image/jpeg', upsert: false });
  if (upErr) throw new Error(`upload: ${upErr.message}`);

  const { data, error: fnErr } = await supabase.functions.invoke('scan-image', {
    body: { image_path: imagePath },
  });
  if (fnErr) throw new Error(fnErr.message);
  if (!data || data.error) throw new Error(data?.error ?? 'scan failed');

  return {
    scanId: data.scan_id ?? null,
    imagePath,
    imageUri: resized.uri,
    product: data.product ?? 'unknown',
    verdict: data.verdict ?? 'safe',
    tone: data.tone ?? data.verdict ?? 'safe',
    confidence: typeof data.confidence === 'number' ? data.confidence : 0,
    reasoning: data.reasoning ?? null,
    storageNote: data.storage_note ?? null,
    daysLeft: data.days_left ?? null,
    totalDays: data.total_days ?? null,
    analysis: Array.isArray(data.analysis) ? data.analysis : [],
  };
}
