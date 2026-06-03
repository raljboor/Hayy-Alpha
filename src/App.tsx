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
import GreenRoom from "./pages/app/GreenRoom.tsx";
import RoomRecap from "./pages/app/RoomRecap.tsx";
import Referrals from "./pages/app/Referrals.tsx";
import ReferralThread from "./pages/app/ReferralThread.tsx";
import Messages from "./pages/app/Messages.tsx";
import Notifications from "./pages/app/Notifications.tsx";
import Profile from "./pages/app/Profile.tsx";
import Settings from "./pages/app/Settings.tsx";
import Search from "./pages/app/Search.tsx";
import PublicProfile from "./pages/app/PublicProfile.tsx";
import Schedule from "./pages/app/Schedule.tsx";
import HostDashboard from "./pages/app/HostDashboard.tsx";
import RecruiterDashboard from "./pages/app/RecruiterDashboard.tsx";

// Lazy-imported secondary pages (exist or will be created)
import RequireAuth from "./components/RequireAuth.tsx";
import RequireOnboarded from "./components/RequireOnboarded.tsx";

const queryClient = new QueryClient();

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
      ? <Navigate to="/app" replace />
      : <Navigate to="/onboarding" replace />;
  }

  return <Index />;
};

// Lazy load secondary pages to avoid breaking the build if any are missing
const lazyPage = (importFn: () => Promise<{ default: React.ComponentType }>) => {
  const Comp = React.lazy(importFn);
  return (
    <React.Suspense fallback={<div style={{ padding: 40, color: 'var(--ink-mute)' }}>Loading…</div>}>
      <Comp />
    </React.Suspense>
  );
};

import React from "react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<RootRoute />} />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route path="/auth/confirm" element={<AuthConfirm />} />

            {/* Onboarding */}
            <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

            {/* App — all routes share the AppLayout (sidebar desktop / bare mobile) */}
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
              {/* Root tabs */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rooms" element={<RoomsList />} />
              <Route path="search" element={<Search />} />
              <Route path="inbox" element={<Messages />} />
              <Route path="messages" element={<Messages />} />
              <Route path="activity" element={<Notifications />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              {/* Rooms */}
              <Route path="rooms/:id" element={<RoomDetail />} />
              <Route path="rooms/:id/green" element={<GreenRoom />} />
              <Route path="rooms/:id/recap" element={<RoomRecap />} />

              {/* Schedule / host */}
              <Route path="schedule" element={<Schedule />} />
              <Route path="schedule/done" element={lazyPage(() => import('./pages/app/ScheduleDone.tsx'))} />
              <Route path="schedule/mine" element={lazyPage(() => import('./pages/app/YourSchedule.tsx'))} />

              {/* Referrals */}
              <Route path="referrals" element={<Referrals />} />
              <Route path="referrals/:id" element={lazyPage(() => import('./pages/app/ReferralDetail.tsx'))} />
              <Route path="refer" element={lazyPage(() => import('./pages/app/ReferCompose.tsx'))} />
              <Route path="intro" element={lazyPage(() => import('./pages/app/RequestIntro.tsx'))} />

              {/* Messages / threads */}
              <Route path="messages/:id" element={<ReferralThread />} />

              {/* People */}
              <Route path="users/:id" element={<PublicProfile />} />
              <Route path="users/:id/book" element={lazyPage(() => import('./pages/app/BookOneOnOne.tsx'))} />
              <Route path="connections" element={lazyPage(() => import('./pages/app/Connections.tsx'))} />

              {/* Profile sub-pages */}
              <Route path="profile/edit" element={lazyPage(() => import('./pages/app/EditProfile.tsx'))} />
              <Route path="profile/follows" element={lazyPage(() => import('./pages/app/Follows.tsx'))} />

              {/* Wins / outcomes */}
              <Route path="wins" element={lazyPage(() => import('./pages/app/Wins.tsx'))} />

              {/* Settings sub-pages */}
              <Route path="notifications/settings" element={lazyPage(() => import('./pages/app/NotificationsSettings.tsx'))} />
              <Route path="privacy" element={lazyPage(() => import('./pages/app/Privacy.tsx'))} />
              <Route path="invite" element={lazyPage(() => import('./pages/app/InviteFriends.tsx'))} />
              <Route path="saved" element={lazyPage(() => import('./pages/app/SavedRooms.tsx'))} />
              <Route path="help" element={lazyPage(() => import('./pages/app/Help.tsx'))} />

              {/* Search states */}
              <Route path="search/results" element={lazyPage(() => import('./pages/app/SearchResults.tsx'))} />
              <Route path="search/empty" element={lazyPage(() => import('./pages/app/NoResults.tsx'))} />

              {/* Call */}
              <Route path="users/:id/call" element={lazyPage(() => import('./pages/app/CallScreen.tsx'))} />

              {/* Live room — speaking view */}
              <Route path="rooms/:id/speaking" element={lazyPage(() => import('./pages/app/LiveRoomSpeaking.tsx'))} />

              {/* Empty states */}
              <Route path="inbox/empty" element={lazyPage(() => import('./pages/app/EmptyInbox.tsx'))} />
              <Route path="schedule/empty" element={lazyPage(() => import('./pages/app/EmptySchedule.tsx'))} />

              {/* System screens */}
              <Route path="loading" element={lazyPage(() => import('./pages/app/LoadingScreen.tsx'))} />
              <Route path="offline" element={lazyPage(() => import('./pages/app/Offline.tsx'))} />
              <Route path="lock" element={lazyPage(() => import('./pages/app/LockScreen.tsx'))} />

              {/* Auth screens (also accessible standalone for design preview) */}
              <Route path="auth/email" element={lazyPage(() => import('./pages/app/EmailLogin.tsx'))} />
              <Route path="auth/verify" element={lazyPage(() => import('./pages/app/VerifyCode.tsx'))} />

              {/* Legacy dashboards */}
              <Route path="host" element={<HostDashboard />} />
              <Route path="recruiter" element={<RecruiterDashboard />} />
            </Route>

            {/* Live room & host view — full-screen, no sidebar */}
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
            <Route
              path="/app/rooms/:id/host"
              element={
                <RequireAuth>
                  <RequireOnboarded>
                    {lazyPage(() => import('./pages/app/LiveRoomHost.tsx'))}
                  </RequireOnboarded>
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
