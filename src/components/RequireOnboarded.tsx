import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { isOnboarded } from "@/lib/routing";

/**
 * Protects routes that require completed onboarding (i.e. everything under
 * /app/*). Sits BELOW <RequireAuth /> in the route tree, so by the time
 * this component runs we already know the user is signed in.
 *
 * Behaviour:
 *   - profile still loading (loading flag from AuthContext) → spinner
 *   - profile loaded AND onboarding_completed === true       → render children
 *   - everything else (false, null, undefined, missing row)  → redirect
 *     to /onboarding?role=<role>, preserving the attempted path in state
 *
 * Pairs with src/lib/routing.ts:isOnboarded so the rule is identical to
 * the post-login redirect path. Fail-closed: if migration 007 hasn't been
 * applied yet, or the field comes back missing for any other reason, the
 * user gets the (safer) onboarding redirect rather than slipping past.
 */
const RequireOnboarded = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <span className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isOnboarded(profile)) {
    const role = profile?.role_type ?? "job_seeker";
    return (
      <Navigate
        to={`/onboarding?role=${encodeURIComponent(role)}`}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireOnboarded;
