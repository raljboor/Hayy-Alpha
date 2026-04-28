/**
 * Auth API placeholder.
 *
 * Today this delegates to the local mock auth in `src/lib/auth.ts`.
 * When Supabase is wired up, swap each function body for the
 * corresponding `supabase.auth.*` call.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { signIn as mockSignIn, signOut as mockSignOut, isAuthed } from "@/lib/auth";
import { users } from "@/data/mockData";
import type { UserProfile } from "@/types/models";

export interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export async function signUpUser({ email, password, fullName }: AuthCredentials) {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName ?? "" },
      },
    });
  }
  mockSignIn();
  return { data: { user: { email } }, error: null };
}

export async function loginUser({ email, password }: AuthCredentials) {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  mockSignIn();
  return { data: { user: { email } }, error: null };
}

export async function logoutUser() {
  if (isSupabaseConfigured && supabase) {
    return supabase.auth.signOut();
  }
  mockSignOut();
  return { error: null };
}

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
  // Default to "Amira" as the seeded current user in mock mode.
  const me = users[0];
  return { id: me.id, full_name: me.name };
}
