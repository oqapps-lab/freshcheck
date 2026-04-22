import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/src/lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
};

export function useAuth(): AuthState & {
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
} {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return {
    session,
    user: session?.user ?? null,
    loading,
    configured: !!supabase,
    async signInWithEmail(email, password) {
      if (!supabase) return { error: 'Supabase not configured' };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    async signUpWithEmail(email, password, name) {
      if (!supabase) return { error: 'Supabase not configured' };
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: name ? { name } : undefined },
      });
      return { error: error?.message ?? null };
    },
    async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
    },
  };
}
