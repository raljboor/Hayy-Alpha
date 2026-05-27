/**
 * Vercel serverless function: POST /api/delete-account
 *
 * Permanently deletes the authenticated user. Cleans up storage objects
 * in the user's folders best-effort, then calls auth.admin.deleteUser()
 * to drop the row from auth.users. The ON DELETE CASCADE in
 * supabase/migrations/001_initial_schema.sql then cleans up:
 *   - user_profiles                (FK references auth.users)
 *   - room_participants            (cascade from user_profiles)
 *   - referral_requests            (cascade from user_profiles, both sides)
 *   - referral_messages            (cascade from sender + parent request)
 *   - notifications                (cascade from user_profiles)
 *   - host_settings                (cascade from user_profiles)
 *   - recruiter_candidates         (cascade from user_profiles, both sides)
 *
 * Rooms hosted by the deleted user keep their rows but get host_id set to
 * NULL (ON DELETE SET NULL), so other participants don't lose history.
 *
 * Server-only env vars required (no VITE_ prefix — never exposed to browser):
 *   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * Security:
 *   - Verifies the caller's Supabase JWT via the anon client. The verified
 *     user.id is the only id that gets deleted — callers cannot delete
 *     someone else's account by tampering with the request body.
 *   - The service role key never leaves this function and never reaches the
 *     browser bundle (no VITE_ prefix).
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Env — resolved once at cold-start; Vercel injects these at deploy time.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const STORAGE_BUCKETS = ["resumes", "video-intros", "avatars"] as const;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[delete-account] Missing required environment variables");
    res.status(500).json({ error: "Server is not configured for account deletion" });
    return;
  }

  // -------------------------------------------------------------------------
  // 1. Extract + validate the caller's Authorization header
  // -------------------------------------------------------------------------

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }
  const accessToken = authHeader.slice(7);

  // -------------------------------------------------------------------------
  // 2. Verify the JWT with the anon client. The user.id we get back is the
  //    only id we'll delete — never trust a body-supplied user id.
  // -------------------------------------------------------------------------

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser(accessToken);

  if (authError || !user) {
    res.status(401).json({ error: "Invalid or expired session token" });
    return;
  }

  // -------------------------------------------------------------------------
  // 3. Build a service-role admin client (bypasses RLS, can call admin APIs).
  //    autoRefreshToken / persistSession are off because this client lives
  //    only for the duration of this request.
  // -------------------------------------------------------------------------

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // -------------------------------------------------------------------------
  // 4. Best-effort: empty the user's storage folders. Failures here don't
  //    block account deletion — orphan files can be swept later.
  //    File layout (set by uploadResume / uploadVideoIntro / uploadAvatar):
  //      <bucket>/<user_id>/<filename>
  // -------------------------------------------------------------------------

  for (const bucket of STORAGE_BUCKETS) {
    try {
      const { data: files, error: listError } = await adminClient.storage
        .from(bucket)
        .list(user.id);
      if (listError || !files?.length) continue;
      const paths = files.map((f) => `${user.id}/${f.name}`);
      await adminClient.storage.from(bucket).remove(paths);
    } catch (err) {
      console.warn(`[delete-account] Could not clear ${bucket} for ${user.id}:`, err);
    }
  }

  // -------------------------------------------------------------------------
  // 5. Delete the auth user. The FK cascades in migration 001 do the rest.
  // -------------------------------------------------------------------------

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("[delete-account] auth.admin.deleteUser failed:", deleteError);
    res.status(500).json({
      error: deleteError.message || "Failed to delete account. Please try again.",
    });
    return;
  }

  res.status(200).json({ ok: true });
}
