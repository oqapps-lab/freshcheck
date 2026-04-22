import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { useAuth } from './useAuth';
import type { Database, Verdict } from '@/src/lib/database.types';
import { recentScans as mockScans } from '@/mock/scans';
import type { Tone } from '@/constants/tokens';

type Row = Database['public']['Tables']['scans']['Row'];

export type ScanRecord = {
  id: string;
  product: string;
  verdict: Verdict;
  tone: Tone;
  confidence: number;
  storageNote: string | null;
  daysLeft: number | null;
  totalDays: number | null;
  imagePath: string | null;
  scannedAt: string;
};

function fromRow(r: Row): ScanRecord {
  return {
    id: r.id,
    product: r.product,
    verdict: r.verdict,
    tone: r.tone as Tone,
    confidence: Number(r.confidence),
    storageNote: r.storage_note,
    daysLeft: r.days_left,
    totalDays: r.total_days,
    imagePath: r.image_path,
    scannedAt: r.scanned_at,
  };
}

export function useScans() {
  const { user } = useAuth();
  const supabase = getSupabase();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setScans(
        mockScans.map((m) => ({
          id: m.id,
          product: m.product,
          verdict: m.verdict,
          tone: m.tone,
          confidence: m.confidence,
          storageNote: null,
          daysLeft: null,
          totalDays: null,
          imagePath: null,
          scannedAt: m.scannedAt,
        })),
      );
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('scanned_at', { ascending: false })
      .limit(50);
    setScans((data ?? []).map(fromRow));
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const todayCount = scans.filter((s) => {
    const d = new Date(s.scannedAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  return { scans, todayCount, loading, refresh };
}
