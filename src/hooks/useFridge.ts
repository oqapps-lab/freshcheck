import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '@/src/lib/database.types';
import { fridgeItems as mockFridge, type FridgeItem as MockItem } from '@/mock/fridge';
import { categoryFor } from '@/components/ui/CategoryGlyph';
import type { Tone } from '@/constants/tokens';

type Row = Database['public']['Tables']['fridge_items']['Row'];
type Insert = Database['public']['Tables']['fridge_items']['Insert'];

export type FridgeItem = {
  id: string;
  name: string;
  category: Row['category'];
  location: Row['location'];
  tone: Tone;
  daysLeft: number;
  totalDays: number;
  expiryText: string;
  warn: boolean;
  thumbnailPath: string | null;
};

function fromRow(r: Row): FridgeItem {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    location: r.location,
    tone: r.tone as Tone,
    daysLeft: r.days_left,
    totalDays: r.total_days,
    expiryText: r.expiry_text,
    warn: r.warn,
    thumbnailPath: r.thumbnail_path,
  };
}

function fromMock(m: MockItem): FridgeItem {
  return {
    id: m.id,
    name: m.name,
    category: (m.category === 'dairy' || m.category === 'poultry' || m.category === 'produce' || m.category === 'bakery' || m.category === 'pantry')
      ? m.category
      : 'produce',
    location: m.location,
    tone: m.tone,
    daysLeft: m.daysLeft,
    totalDays: m.totalDays,
    expiryText: m.expiryText,
    warn: m.warn ?? false,
    thumbnailPath: null,
  };
}

export function useFridge() {
  const { user, configured } = useAuth();
  const supabase = getSupabase();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    if (!supabase || !user) {
      // Fallback to mocks while unauthenticated / unconfigured.
      setItems(mockFridge.map(fromMock));
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('fridge_items')
      .select('*')
      .eq('user_id', user.id)
      .order('days_left', { ascending: true });
    if (err) {
      setError(err.message);
      setItems(mockFridge.map(fromMock));
    } else {
      setItems((data ?? []).map(fromRow));
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (draft: Omit<Insert, 'user_id' | 'category'> & { name: string }) => {
      if (!supabase || !user) return { error: 'not signed in' };
      const payload: Insert = {
        user_id: user.id,
        category: categoryFor(draft.name),
        ...draft,
      };
      const { error: err } = await supabase.from('fridge_items').insert(payload as never);
      if (err) return { error: err.message };
      await refresh();
      return { error: null };
    },
    [supabase, user, refresh],
  );

  const removeItem = useCallback(
    async (id: string) => {
      if (!supabase || !user) return;
      await supabase.from('fridge_items').delete().eq('id', id);
      await refresh();
    },
    [supabase, user, refresh],
  );

  const summary = {
    total: items.length,
    expiring: items.filter((i) => i.tone === 'past' || i.tone === 'soon').length,
  };

  return {
    items,
    summary,
    loading,
    error,
    configured,
    signedIn: !!user,
    refresh,
    addItem,
    removeItem,
  };
}
