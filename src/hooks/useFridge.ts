import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/src/lib/supabase';
import { useAuth } from './useAuth';
import type { Database } from '@/src/lib/database.types';
import { fridgeItems as mockFridge, type FridgeItem as MockItem } from '@/mock/fridge';
// Lightweight category guesser — the scan-image edge fn doesn't return a
// category field, so we infer one from the product name. The DB enum has
// distinct meat / fish / poultry buckets — collapsing beef + salmon + pork
// into "poultry" (the previous behaviour) was wrong both semantically and
// for the filter chips.
function categoryFor(name: string): Row['category'] {
  const n = name.toLowerCase();
  if (/(milk|cheese|yogurt|cream|butter|kefir)/.test(n)) return 'dairy';
  if (/(chicken|turkey|duck|hen|quail)/.test(n)) return 'poultry';
  if (/(beef|steak|pork|bacon|ham|lamb|veal|sausage|mince)/.test(n)) return 'meat';
  if (/(fish|salmon|tuna|cod|shrimp|prawn|tilapia|trout|crab|lobster)/.test(n)) return 'fish';
  if (/(bread|baguette|loaf|bun|bagel|croissant|muffin)/.test(n)) return 'bakery';
  if (/(rice|pasta|cereal|oats|flour|sugar|salt|spice)/.test(n)) return 'pantry';
  return 'produce';
}
import { refreshExpiryReminders } from '@/src/lib/notifications';
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

// days_left is stored as a snapshot at insert time. Without subtracting
// the days that have passed since `created_at`, an item scanned with "3
// days left" still reads "3 days left" three days later — Rule 14 stale
// copy despite changed state. Recompute at read time so freshness reflects
// real-world elapsed days, and re-derive the tone (and warn flag) so the
// soon/past colour and expiry-summary counter follow along.
function effectiveExpiryText(daysLeft: number): string {
  if (daysLeft <= 0) return 'Use today';
  if (daysLeft === 1) return '1 day left';
  return `${daysLeft} days left`;
}

function fromRow(r: Row): FridgeItem {
  const daysAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(r.created_at).getTime()) / 86400000),
  );
  const effectiveDaysLeft = Math.max(0, r.days_left - daysAgo);
  const storedTone = r.tone as Tone;
  const effectiveTone: Tone =
    effectiveDaysLeft <= 0
      ? 'past'
      : effectiveDaysLeft <= 1
        ? 'soon'
        : storedTone;
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    location: r.location,
    tone: effectiveTone,
    daysLeft: effectiveDaysLeft,
    totalDays: r.total_days,
    expiryText: effectiveExpiryText(effectiveDaysLeft),
    warn: effectiveTone === 'soon' || effectiveTone === 'past',
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
      // Signed-out / unconfigured: real users see an empty fridge with the
      // sign-in CTA. Mock data was masking actual state and would have shipped
      // 6 phantom items to App Reviewers viewing a guest session.
      setItems(__DEV__ && !supabase ? mockFridge.map(fromMock) : []);
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
      // Surface the real error instead of swapping in mocks — the user needs
      // to know something failed (network, RLS, etc.) so they can recover
      // (sign out / retry) rather than seeing fake fixtures as if they were
      // theirs.
      setError(err.message);
      setItems([]);
    } else {
      setItems((data ?? []).map(fromRow));
    }
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Keep local notifications in sync with the fridge contents.
  useEffect(() => {
    if (items.length === 0) return;
    void refreshExpiryReminders(
      items.map((i) => ({ id: i.id, name: i.name, daysLeft: i.daysLeft })),
    );
  }, [items]);

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
