import React from "react";
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

import RequireAuth from "./components/RequireAuth.tsx";

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
      ? <Navigate to="/dashboard" replace />
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
