import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { isOnboarded } from "@/lib/routing";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import AuthConfirm from "./pages/AuthConfirm.tsx";

import AuthLayout from "./layouts/AuthLayout.tsx";
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

import RequireAuth from "./components/RequireAuth.tsx";
import RequireOnboarded from "./components/RequireOnboarded.tsx";

const queryClient = new QueryClient();

// Redirects authenticated users away from the public landing page.
// - Logged in + onboarded  → /app/dashboard
// - Logged in + not done   → /onboarding (let RequireOnboarded handle it)
// - Not logged in          → show the landing page
const RootRoute = () => {
  const { isAuthenticated, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <span className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Public — redirects to /app/dashboard if already signed in */}
          <Route path="/" element={<RootRoute />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Email confirmation callback — no layout wrapper needed */}
          <Route path="/auth/confirm" element={<AuthConfirm />} />

          {/* Onboarding (full-screen, own layout) — auth required */}
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <Onboarding />
              </RequireAuth>
            }
          />

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
          </Route>

          {/* Live room: full-screen, no sidebar — auth + onboarding required */}
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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
