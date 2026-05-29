import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/src/lib/supabase';
import { clearRecipes } from '@/src/state/recipeStore';
import { setLastScan } from '@/src/state/lastScan';

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
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setSession(data.session);
        setLoading(false);
        return;
      }
      // No session — auto sign in anonymously so scan/fridge/recipes work
      // without forcing registration. Apple Guideline 5.1.1(iv) discourages
      // mandatory account creation for features that don't strictly need it.
      // Email sign-up remains available in Profile → "Save your data".
      const { data: anonData } = await supabase.auth.signInAnonymously();
      if (!mounted) return;
      setSession(anonData?.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      // When the email user signs out we'd otherwise leave the app in a
      // sessionless state — capture/fridge/recipes all gate on `user`, so
      // the user would land on Profile with everything broken until a
      // restart. Mirror the initial-launch behaviour by spinning up a
      // fresh anon session so the rest of the app keeps working.
      if (event === 'SIGNED_OUT' && mounted) {
        const { data: anonData } = await supabase.auth.signInAnonymously();
        if (mounted && anonData?.session) setSession(anonData.session);
      }
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
      // If we're currently signed-in as an anonymous user, convert that user
      // to an email identity so their existing scans / fridge / recipes
      // are preserved instead of being orphaned under the anon uid.
      const current = (await supabase.auth.getUser()).data.user;
      if (current?.is_anonymous) {
        const { error: updErr } = await supabase.auth.updateUser({
          email,
          password,
          data: name ? { name } : undefined,
        });
        return {
          error: updErr?.message ?? null,
          needsEmailConfirmation: false,
        };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: name ? { name } : undefined },
      });
      return {
        error: error?.message ?? null,
        needsEmailConfirmation: !error && !data.session,
      };
    },
    async signOut() {
      if (!supabase) return;
      // Wipe all in-memory caches so the next user (immediate anon re-signin
      // or a returning email user) doesn't see the previous account's scan
      // result + recipes. Without clearing lastScan, account-switching
      // leaked the previous user's scan/photo into the new session.
      clearRecipes();
      setLastScan(null);
      await supabase.auth.signOut();
    },
  };
}
