/**
 * Utilities for surfacing clear, human-readable Supabase error messages.
 *
 * Supabase returns errors as { code, message, details, hint } objects.
 * This module maps the most common codes to actionable user-facing messages.
 */

interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

/**
 * Returns a human-readable message for a Supabase error.
 * Falls back to the raw error message if no specific mapping exists.
 */
export function friendlyError(err: unknown): string {
  if (!err) return "An unexpected error occurred.";

  const e = err as SupabaseError;
  const code = e.code ?? "";
  const msg = e.message ?? String(err);

  // RLS / permission errors
  if (code === "42501" || msg.includes("permission denied") || msg.includes("violates row-level security")) {
    return "Permission denied. Your account may not have access to this resource, or the database policies need to be applied.";
  }

  // Unique violation
  if (code === "23505" || msg.includes("unique violation") || msg.includes("duplicate key")) {
    return "This record already exists.";
  }

  // Foreign key violation (e.g. user_profiles row missing)
  if (code === "23503" || msg.includes("foreign key") || msg.includes("violates foreign key")) {
    return "A required profile or record is missing. Make sure your account setup completed correctly.";
  }

  // Storage errors
  if (msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")) {
    return "File upload failed. The storage bucket may not be configured yet — see supabase/README.md.";
  }

  // Not found (PostgREST PGRST116)
  if (code === "PGRST116" || msg.includes("not found")) {
    return "The requested resource was not found.";
  }

  // Auth errors
  if (msg.includes("Invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Please confirm your email address before logging in.";
  }
  if (msg.includes("User already registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }

  return msg || "An unexpected error occurred. Please try again.";
}

/**
 * Throws a cleaned-up Error with a friendly message if the Supabase
 * response contains an error. Use at the API boundary.
 */
export function throwIfError(error: unknown): void {
  if (!error) return;
  throw new Error(friendlyError(error));
}
