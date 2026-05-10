import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/src/lib/supabase';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
};

type SignUpResult = {
  error: string | null;
  // True when Supabase returned no session (email-confirmation required).
  // Caller should show a "check your email" prompt instead of routing into
  // the app — otherwise the user lands as a silent guest.
  needsEmailConfirmation: boolean;
};

export function useAuth(): AuthState & {
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<SignUpResult>;
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
      if (!supabase) return { error: 'Supabase not configured', needsEmailConfirmation: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: name ? { name } : undefined },
      });
      return {
        error: error?.message ?? null,
        // When email-confirmation is enabled in Supabase Auth settings,
        // signUp returns user without a session. UI must show a prompt
        // and NOT silently drop the user into the tabs.
        needsEmailConfirmation: !error && !data.session,
      };
    },
    async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
    },
  };
}
