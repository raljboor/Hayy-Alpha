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
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--clay)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'block' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
