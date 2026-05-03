import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { getSupabase } from './supabase';
import type { Database, Tone, Verdict } from './database.types';

export type ScanAnalysisResult = {
  id: string;
  product: string;
  verdict: Verdict;
  tone: Tone;
  confidence: number;
  storageNote: string | null;
  daysLeft: number | null;
  totalDays: number | null;
  imagePath: string | null;
  analysis: { label: string; value: number }[];
};

/**
 * Default fallback when Supabase/OpenAI isn't configured. Mirrors the
 * mock scanDetail so the UI keeps its shape.
 */
const MOCK_FALLBACK: ScanAnalysisResult = {
  id: 'mock-scan',
  product: 'Wild Salmon',
  verdict: 'safe',
  tone: 'safe',
  confidence: 92,
  storageNote:
    'Keep refrigerated below 4\u00B0C. Use within 2 days for best quality or freeze to extend shelf life up to 3 months.',
  daysLeft: 4,
  totalDays: 6,
  imagePath: null,
  analysis: [
    { label: 'Color', value: 96 },
    { label: 'Texture', value: 89 },
    { label: 'Smell', value: 91 },
  ],
};

/**
 * Full scan pipeline: resize → upload → edge function → persist.
 * Throws on network error; returns mock fallback when Supabase unset.
 */
export async function analyzeImage(localUri: string): Promise<ScanAnalysisResult> {
  const supabase = getSupabase();

  if (!supabase) {
    // Simulate a bit of think-time for UX parity.
    await new Promise((r) => setTimeout(r, 900));
    return MOCK_FALLBACK;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) {
    throw new Error('not signed in — sign in to use live analysis');
  }

  // 1. Downscale + compress so upload is quick.
  const manipulated = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 1024 } }],
    { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG },
  );

  // 2. Upload to `scans` bucket at <uid>/<timestamp>.jpg.
  const path = `${session.user.id}/${Date.now()}.jpg`;
  const fileBlob = await (await fetch(manipulated.uri)).blob();
  const { error: upErr } = await supabase.storage
    .from('scans')
    .upload(path, fileBlob, { contentType: 'image/jpeg', upsert: false });
  if (upErr) {
    throw new Error(`upload failed: ${upErr.message}`);
  }

  // 3. Invoke the edge function.
  const { data: fn, error: fnErr } = await supabase.functions.invoke<{
    product: string;
    verdict: Verdict;
    tone: Tone;
    confidence: number;
    storage_note?: string;
    days_left?: number;
    total_days?: number;
    analysis?: { label: string; value: number }[];
  }>('scan-image', { body: { image_path: path } });
  if (fnErr || !fn) {
    throw new Error(fnErr?.message ?? 'vision analysis failed');
  }

  // 4. Persist the scan row.
  const insertPayload = {
    user_id: session.user.id,
    product: fn.product,
    verdict: fn.verdict,
    tone: fn.tone,
    confidence: fn.confidence,
    storage_note: fn.storage_note ?? null,
    days_left: fn.days_left ?? null,
    total_days: fn.total_days ?? null,
    image_path: path,
    analysis: fn.analysis ?? [],
  } satisfies Database['public']['Tables']['scans']['Insert'];

  const { data: insertedRaw, error: insErr } = await supabase
    .from('scans')
    .insert(insertPayload as never)
    .select()
    .single();
  const inserted = insertedRaw as Database['public']['Tables']['scans']['Row'] | null;

  if (insErr || !inserted) {
    // We still have the result — return it even if persisting failed.
    return {
      id: `ephemeral-${Date.now()}`,
      product: fn.product,
      verdict: fn.verdict,
      tone: fn.tone,
      confidence: fn.confidence,
      storageNote: fn.storage_note ?? null,
      daysLeft: fn.days_left ?? null,
      totalDays: fn.total_days ?? null,
      imagePath: path,
      analysis: fn.analysis ?? [],
    };
  }

  return {
    id: inserted.id,
    product: inserted.product,
    verdict: inserted.verdict,
    tone: inserted.tone as Tone,
    confidence: Number(inserted.confidence),
    storageNote: inserted.storage_note,
    daysLeft: inserted.days_left,
    totalDays: inserted.total_days,
    imagePath: inserted.image_path,
    analysis: (inserted.analysis as { label: string; value: number }[]) ?? [],
  };
}
