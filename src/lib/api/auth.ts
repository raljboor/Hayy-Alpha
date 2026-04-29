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
import { friendlyError } from "@/lib/api/errors";
import type { UserProfile } from "@/types/models";
import type { Session } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
  /** SQL role_type value — passed to Supabase auth metadata so the DB trigger can store it */
  roleType?: string;
}

interface AuthResult {
  data: { user: { id?: string; email?: string } | null; session?: Session | null };
  error: { message: string } | null;
}

// ---------------------------------------------------------------------------
// Sign up
// ---------------------------------------------------------------------------

/** Normalises a UI role label into a valid SQL role_type value. */
function normaliseRoleType(raw: string | undefined): string {
  if (!raw) return "job_seeker";
  const map: Record<string, string> = {
    job_seeker: "job_seeker",
    referral_host: "referral_host",
    recruiter: "recruiter",
    admin: "admin",
    // Legacy / UI aliases
    "job-seeker": "job_seeker",
    "referral-host": "referral_host",
    host: "referral_host",
    candidate: "job_seeker",
    community_partner: "job_seeker",
    partner: "job_seeker",
  };
  return map[raw.toLowerCase()] ?? "job_seeker";
}

export async function signUpUser({
  email,
  password,
  fullName,
  roleType,
}: AuthCredentials): Promise<AuthResult> {
  const normalisedRole = normaliseRoleType(roleType);

  if (isSupabaseConfigured && supabase) {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        // Both full_name and role_type are read by the handle_new_auth_user trigger
        data: { full_name: fullName ?? "", role_type: normalisedRole },
      },
    });
    if (result.error) {
      return { ...result, error: { message: friendlyError(result.error) } };
    }

    // If the user row was created immediately (e.g. email confirmation disabled),
    // also upsert the profile to ensure role_type is correct even if the trigger
    // fired before we could set it.
    if (result.data.user?.id) {
      await supabase
        .from("user_profiles")
        .upsert(
          {
            id: result.data.user.id,
            full_name: fullName ?? "",
            role_type: normalisedRole,
          },
          { onConflict: "id" },
        )
        .then(() => {})
        .catch(() => {}); // best-effort; profile will be corrected on next load
    }

    return result;
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
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      return { ...result, error: { message: friendlyError(result.error) } };
    }
    return result;
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
