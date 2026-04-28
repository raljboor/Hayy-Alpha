import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { authed } = useAuth();
  const location = useLocation();
  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
