/**
 * Account API — destructive operations that require server-side privileges.
 *
 * Supabase mode: calls /api/delete-account (Vercel serverless function) which
 *   uses the service role key to delete the auth user and let the FK CASCADE
 *   chain in migration 001 clean up profile + child rows.
 *
 * Mock mode: short-circuits with a local sign-out — there's no server to call
 *   and nothing to delete in the in-memory fixtures.
 *
 * This file must NEVER reference SUPABASE_SERVICE_ROLE_KEY — that env var is
 * server-only and never reaches the browser bundle.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

/**
 * Permanently deletes the currently signed-in user. Throws with a
 * human-readable message on any failure so the caller can surface it
 * directly in a toast.
 *
 * On success, the user's session is invalidated server-side. Callers
 * should still call signOut() locally to clear AuthContext state.
 */
export async function deleteAccount(): Promise<void> {
  // Mock mode: nothing to delete server-side.
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  // Need a valid session to authorise the call.
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    throw new Error("Not signed in — please sign in again before deleting your account.");
  }

  let res: Response;
  try {
    res = await fetch("/api/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });
  } catch {
    throw new Error("Could not reach the account service — check your connection and try again.");
  }

  if (res.status === 401) {
    throw new Error("Your session has expired — please sign in again.");
  }
  if (res.status === 500) {
    let serverMessage = "Server is not configured for account deletion.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) serverMessage = body.error;
    } catch {
      // ignore
    }
    throw new Error(serverMessage);
  }
  if (!res.ok) {
    let serverMessage = `Account deletion failed (HTTP ${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) serverMessage = body.error;
    } catch {
      // ignore
    }
    throw new Error(serverMessage);
  }
}
