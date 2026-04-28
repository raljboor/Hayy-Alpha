import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Protects routes that require authentication.
 *
 * - While the initial auth check is in flight (loading === true), renders a
 *   minimal full-screen spinner so the app never flashes the login redirect.
 * - If not authenticated after the check, redirects to /login and preserves
 *   the attempted path in router state so Login can send the user back.
 * - If authenticated, renders children normally.
 */
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <span className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
