import { useSyncExternalStore } from 'react';
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

// ---------------------------------------------------------------------------
// Module-level store. The old per-hook implementation gave every mounted
// useAuth() its own getSession bootstrap + onAuthStateChange subscription +
// anonymous sign-in — so a sign-out deterministically fired 3+ CONCURRENT
// signInAnonymously calls (VendorBoot + profile + useFridge), minting orphan
// anon users and racing sessions (fridge writes landed on abandoned uids).
// One store, one subscription, one in-flight anon sign-in.
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();
let session: Session | null = null;
let loading = true;
let bootstrapped = false;
let anonInFlight: Promise<void> | null = null;
let snap: AuthState | null = null;

function emit() {
  snap = null; // invalidate cached snapshot
  listeners.forEach((l) => l());
}

function getSnap(): AuthState {
  if (!snap) {
    const configured = !!getSupabase();
    snap = {
      session,
      user: session?.user ?? null,
      loading: configured ? loading : false,
      configured,
    };
  }
  return snap;
}

// Single-flight anonymous sign-in: concurrent callers (initial boot, repeated
// SIGNED_OUT events) all await the SAME request instead of minting users.
function ensureAnonSession(supabase: NonNullable<ReturnType<typeof getSupabase>>): Promise<void> {
  if (!anonInFlight) {
    anonInFlight = (async () => {
      try {
        const { data } = await supabase.auth.signInAnonymously();
        session = data?.session ?? null;
      } catch {
        session = null;
      } finally {
        anonInFlight = null;
      }
    })();
  }
  return anonInFlight;
}

function bootstrap() {
  if (bootstrapped) return;
  bootstrapped = true;
  const supabase = getSupabase();
  if (!supabase) {
    loading = false;
    emit();
    return;
  }
  void supabase.auth.getSession().then(async ({ data }) => {
    if (data.session) {
      session = data.session;
      loading = false;
      emit();
      return;
    }
    // No session — auto sign in anonymously so scan/fridge/recipes work
    // without forcing registration. Apple Guideline 5.1.1(iv) discourages
    // mandatory account creation for features that don't strictly need it.
    // Email sign-up remains available in Profile → "Save your data".
    await ensureAnonSession(supabase);
    loading = false;
    emit();
  });
  // App-lifetime subscription — intentionally never unsubscribed.
  supabase.auth.onAuthStateChange(async (event, s) => {
    session = s;
    emit();
    // When the email user signs out we'd otherwise leave the app in a
    // sessionless state — capture/fridge/recipes all gate on `user`. Mirror
    // the initial-launch behaviour by spinning up a fresh anon session.
    if (event === 'SIGNED_OUT') {
      await ensureAnonSession(supabase);
      emit();
    }
  });
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  bootstrap();
  return () => {
    listeners.delete(fn);
  };
}

async function signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  if (!supabase) return { error: 'Supabase not configured' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

async function signUpWithEmail(email: string, password: string, name?: string): Promise<SignUpResult> {
  const supabase = getSupabase();
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
}

async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  // Wipe all in-memory caches so the next user (immediate anon re-signin
  // or a returning email user) doesn't see the previous account's scan
  // result + recipes. Without clearing lastScan, account-switching
  // leaked the previous user's scan/photo into the new session.
  clearRecipes();
  setLastScan(null);
  await supabase.auth.signOut();
}

export function useAuth(): AuthState & {
  signInWithEmail: typeof signInWithEmail;
  signUpWithEmail: typeof signUpWithEmail;
  signOut: typeof signOut;
} {
  const state = useSyncExternalStore(subscribe, getSnap, getSnap);
  return { ...state, signInWithEmail, signUpWithEmail, signOut };
}
