/**
 * Post-auth routing helper.
 *
 * Single source of truth for "where should this user land after auth?".
 * Used by Login.tsx, Signup.tsx, and AuthConfirm.tsx so all three
 * converge on the same rule, and so AuthConfirm doesn't carry its own
 * role-routing logic.
 *
 * Rule:
 *   - profile is missing OR onboarding_completed === false
 *       → /onboarding?role=<role_type>
 *   - profile.onboarding_completed is undefined (mock mode — column
 *     doesn't exist on the fixture) → treated as already onboarded
 *       → /app/dashboard
 *   - profile.onboarding_completed === true
 *       → /app/dashboard (or `preferredFrom` if it's a /app/* path)
 */

import type { UserProfile } from "@/types/models";

export interface DecideLandingRouteArgs {
  profile: Pick<UserProfile, "onboarding_completed" | "role_type"> | null;
  /**
   * Optional path the user was trying to reach before being bounced
   * to /login. Honoured only when onboarding is complete and the
   * path lives under /app/.
   */
  preferredFrom?: string | null;
}

const DEFAULT_LANDING = "/app/dashboard";

export function decideLandingRoute({
  profile,
  preferredFrom,
}: DecideLandingRouteArgs): string {
  // Brand-new user (no profile row yet) OR explicit "not onboarded"
  // boolean from Supabase → send to onboarding with their role.
  if (!profile || profile.onboarding_completed === false) {
    const role = profile?.role_type ?? "job_seeker";
    return `/onboarding?role=${encodeURIComponent(role)}`;
  }

  // Onboarded (or mock-mode profile that pre-dates the column).
  if (preferredFrom && preferredFrom.startsWith("/app")) {
    return preferredFrom;
  }
  return DEFAULT_LANDING;
}
