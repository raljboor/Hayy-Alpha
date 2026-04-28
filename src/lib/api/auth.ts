/**
 * Auth API.
 *
 * Supabase mode: delegates to supabase.auth.* calls.
 * Mock mode: toggles the hayy.authed localStorage flag and returns
 *   lightweight objects that match the Supabase response shapes so
 *   callers don't need to branch on the mode themselves.
 *
 * Do NOT hardcode credentials anywhere in this file.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { signIn as mockSignIn, signOut as mockSignOut, isAuthed } from "@/lib/auth";
import { users } from "@/data/mockData";
import type { UserProfile } from "@/types/models";
import type { Session } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
}

interface AuthResult {
  data: { user: { id?: string; email?: string } | null; session?: Session | null };
  error: { message: string } | null;
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------

export async function signUpUser({
  email,
  password,
  fullName,
}: AuthCredentials): Promise<AuthResult> {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: { full_name: fullName ?? "" },
      },
    });
  }
  mockSignIn();
  return { data: { user: { email } }, error: null };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function loginUser({
  email,
  password,
}: AuthCredentials): Promise<AuthResult> {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  mockSignIn();
  return { data: { user: { email } }, error: null };
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logoutUser(): Promise<{ error: { message: string } | null }> {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signOut();
  }
  mockSignOut();
  return { error: null };
}

// ---------------------------------------------------------------------------
// Get current user (lightweight — for legacy callers)
// ---------------------------------------------------------------------------

export async function getCurrentUser(): Promise<Partial<UserProfile> | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return {
      id: data.user.id,
      full_name: (data.user.user_metadata?.full_name as string) ?? "",
    };
  }
  if (!isAuthed()) return null;
  const me = users[0];
  return { id: me.id, full_name: me.name };
}

// ---------------------------------------------------------------------------
// Get session
// ---------------------------------------------------------------------------

export async function getSession(): Promise<Session | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return data.session ?? null;
  }
  // Mock mode has no real session object.
  return null;
}
