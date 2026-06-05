import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { isOnboarded } from "@/lib/routing";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AuthConfirm from "./pages/AuthConfirm.tsx";

import AppLayout from "./layouts/AppLayout.tsx";

import Dashboard from "./pages/app/Dashboard.tsx";
import RoomsList from "./pages/app/RoomsList.tsx";
import RoomDetail from "./pages/app/RoomDetail.tsx";
import LiveRoom from "./pages/app/LiveRoom.tsx";
import Referrals from "./pages/app/Referrals.tsx";
import ReferralThread from "./pages/app/ReferralThread.tsx";
import Messages from "./pages/app/Messages.tsx";
import Notifications from "./pages/app/Notifications.tsx";
import Profile from "./pages/app/Profile.tsx";
import HostDashboard from "./pages/app/HostDashboard.tsx";
import RecruiterDashboard from "./pages/app/RecruiterDashboard.tsx";
import Settings from "./pages/app/Settings.tsx";
import RolesBoard from "./pages/app/RolesBoard.tsx";

import RequireAuth from "./components/RequireAuth.tsx";
import RequireOnboarded from "./components/RequireOnboarded.tsx";

const queryClient = new QueryClient();

const RootRoute = () => {
  const { isAuthenticated, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--clay)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'block' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (isAuthenticated) {
    return isOnboarded(profile)
      ? <Navigate to="/app/dashboard" replace />
      : <Navigate to="/onboarding" replace />;
  }

  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<RootRoute />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Email confirmation callback */}
          <Route path="/auth/confirm" element={<AuthConfirm />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

          {/* App (authed + onboarded) */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <RequireOnboarded>
                  <AppLayout />
                </RequireOnboarded>
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<RoomsList />} />
            <Route path="rooms/:id" element={<RoomDetail />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="referrals/:id" element={<ReferralThread />} />
            <Route path="messages" element={<Messages />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="host" element={<HostDashboard />} />
            <Route path="recruiter" element={<RecruiterDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="roles" element={<RolesBoard />} />
            <Route path="search" element={<RoomsList />} />
          </Route>

          {/* Live room: full-screen (always dusk, no sidebar) */}
          <Route
            path="/app/rooms/:id/live"
            element={
              <RequireAuth>
                <RequireOnboarded>
                  <LiveRoom />
                </RequireOnboarded>
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
