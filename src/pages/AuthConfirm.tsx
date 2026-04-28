/**
 * /auth/confirm — Supabase email confirmation callback handler.
 *
 * When a user clicks the confirmation link in their inbox, Supabase redirects
 * them to this route with a one-time code in the URL. This page exchanges that
 * code for a real session via supabase.auth.exchangeCodeForSession().
 *
 * Mock mode: if Supabase is not configured, treat mock-authed users as already
 * confirmed and send them to the dashboard; unauthenticated mock users go to /login.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { isAuthed } from "@/lib/auth";

type Status = "loading" | "success" | "error";

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const confirm = async () => {
      if (!isSupabaseConfigured || !supabase) {
        // Mock mode: nothing to confirm — route based on current mock auth state.
        navigate(isAuthed() ? "/app/dashboard" : "/login", { replace: true });
        return;
      }

      try {
        // exchangeCodeForSession accepts the full URL containing the ?code= param.
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href,
        );

        if (error) {
          setErrorMsg(error.message);
          setStatus("error");
          return;
        }

        setStatus("success");
        // Short pause so the user sees the success state before being redirected.
        setTimeout(() => navigate("/app/dashboard", { replace: true }), 800);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      }
    };

    void confirm();
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <span className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Confirming your account…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background px-4">
        <span className="h-10 w-10 rounded-full bg-olive/15 flex items-center justify-center text-olive text-2xl">
          ✓
        </span>
        <p className="font-display text-xl text-foreground">Email confirmed!</p>
        <p className="text-muted-foreground text-sm">Taking you to your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-background px-4">
      <div className="rounded-3xl bg-card border border-border p-8 max-w-sm w-full text-center space-y-4">
        <p className="font-display text-xl text-foreground">Confirmation failed</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {errorMsg ?? "The confirmation link may have expired or already been used."}
        </p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default AuthConfirm;
