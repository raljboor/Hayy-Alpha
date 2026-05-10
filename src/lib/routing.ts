/**
 * Post-auth routing helper.
 *
 * Single source of truth for "where should this user land after auth?".
 * Used by Login.tsx, AuthConfirm.tsx, and the RequireOnboarded guard so
 * all three converge on the same rule.
 *
 * Rule (fail-closed — safer default is to nudge users through onboarding):
 *   - profile is missing                          → /onboarding?role=job_seeker
 *   - profile.onboarding_completed === true       → /app/dashboard
 *                                                   (or preferredFrom if it
 *                                                    starts with /app/)
 *   - anything else (false, null, undefined)      → /onboarding?role=<role>
 *
 * Why fail-closed: if migration 007 hasn't been applied yet, or the column
 * is somehow missing from a row, treating that as "needs onboarding" is the
 * safer behaviour than silently letting an unfinished user into the app.
 * Mock mode covers itself by setting onboarding_completed: true on the
 * fixture profile (see src/context/AuthContext.buildMockProfile and
 * src/lib/api/profiles.ts mock branch).
 */

import type { UserProfile } from "@/types/models";

export interface DecideLandingRouteArgs {
  profile: Pick<UserProfile, "onboarding_completed" | "role_type"> | null;
  /**
   * Optional path the user was trying to reach before being bounced to
   * /login. Honoured only when onboarding is complete and the path lives
   * under /app/.
   */
  preferredFrom?: string | null;
}

const DEFAULT_LANDING = "/app/dashboard";

export function decideLandingRoute({
  profile,
  preferredFrom,
}: DecideLandingRouteArgs): string {
  // Fail-closed: anything other than an explicit `true` means we route the
  // user through onboarding. This catches the case where migration 007
  // hasn't been applied yet on a real Supabase project (column missing →
  // field comes back undefined).
  if (!profile || profile.onboarding_completed !== true) {
    const role = profile?.role_type ?? "job_seeker";
    return `/onboarding?role=${encodeURIComponent(role)}`;
  }

  // Onboarded — honour the redirect-after-login path if it's under /app/.
  if (preferredFrom && preferredFrom.startsWith("/app")) {
    return preferredFrom;
  }
  return DEFAULT_LANDING;
}

/**
 * Convenience predicate used by the RequireOnboarded guard.
 * Returns true only when the profile explicitly says onboarding is done.
 */
export function isOnboarded(
  profile: Pick<UserProfile, "onboarding_completed"> | null | undefined,
): boolean {
  return profile?.onboarding_completed === true;
}
