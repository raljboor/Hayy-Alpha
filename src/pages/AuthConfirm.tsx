/**
 * /auth/confirm — Supabase email confirmation callback handler.
 *
 * Handles all three URL formats Supabase can use depending on the
 * project's auth flow setting and email template:
 *   - PKCE flow:        /auth/confirm?code=<code>
 *   - Token-hash flow:  /auth/confirm?token_hash=<hash>&type=signup
 *   - Implicit/hash:    /auth/confirm#access_token=<jwt>&refresh_token=<jwt>&type=signup
 *
 * supabase-js v2 has `detectSessionInUrl: true` by default, which means the
 * client tries to auto-consume the URL on instantiation. We check
 * getSession() FIRST so that if the auto-detect already succeeded (race
 * with our useEffect), we don't try to exchange the code a second time
 * and crash with "code already used".
 *
 * Mock mode: nothing to confirm — route based on current mock auth state.
 *
 * NOTE: Heavy console logging is intentional while we debug the
 * signup → email-confirm → onboarding flow. Search the browser console
 * for "[AuthConfirm]" to see the full trace. Strip these once the flow
 * is verified end-to-end.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { isAuthed } from "@/lib/auth";
import { getProfile } from "@/lib/api/profiles";
import { decideLandingRoute } from "@/lib/routing";
import type { Session } from "@supabase/supabase-js";

type Status = "loading" | "success" | "error";

const LOG = "[AuthConfirm]";

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log(LOG, "mount");
    console.log(LOG, "href      =", window.location.href);
    console.log(LOG, "pathname  =", window.location.pathname);
    console.log(LOG, "search    =", window.location.search);
    console.log(LOG, "hash      =", window.location.hash);
    console.log(LOG, "isSupabaseConfigured =", isSupabaseConfigured);

    const confirm = async () => {
      // -----------------------------------------------------------------
      // Mock mode short-circuit
      // -----------------------------------------------------------------
      if (!isSupabaseConfigured || !supabase) {
        const dest = isAuthed() ? "/app/dashboard" : "/login";
        console.log(LOG, "mock mode → navigating to", dest);
        navigate(dest, { replace: true });
        return;
      }

      // -----------------------------------------------------------------
      // Inspect URL parameters (both query AND hash) so we can detect
      // which Supabase flow the email link is using.
      // -----------------------------------------------------------------
      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        // strip leading "#"
        window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash,
      );

      const queryEntries = Object.fromEntries(queryParams.entries());
      const hashEntries = Object.fromEntries(hashParams.entries());
      console.log(LOG, "query params =", queryEntries);
      console.log(LOG, "hash  params =", hashEntries);

      const code = queryParams.get("code");
      const tokenHash = queryParams.get("token_hash") ?? hashParams.get("token_hash");
      const otpType =
        (queryParams.get("type") ?? hashParams.get("type")) as
          | "signup"
          | "magiclink"
          | "recovery"
          | "invite"
          | "email"
          | null;
      const hashAccessToken = hashParams.get("access_token");
      const errorDescription =
        queryParams.get("error_description") ?? hashParams.get("error_description");

      console.log(LOG, "detected     code         =", code ? "<present>" : "<missing>");
      console.log(LOG, "detected     token_hash   =", tokenHash ? "<present>" : "<missing>");
      console.log(LOG, "detected     type         =", otpType ?? "<missing>");
      console.log(
        LOG,
        "detected     #access_token=",
        hashAccessToken ? "<present>" : "<missing>",
      );
      if (errorDescription) {
        console.warn(LOG, "URL carries error_description =", errorDescription);
      }

      // -----------------------------------------------------------------
      // Supabase-side error in the URL itself (e.g. expired link)
      // -----------------------------------------------------------------
      if (errorDescription) {
        setErrorMsg(errorDescription);
        setStatus("error");
        return;
      }

      // -----------------------------------------------------------------
      // STEP 1 — Check if a session is ALREADY present.
      //
      // supabase-js v2 has detectSessionInUrl: true by default — the
      // client instance auto-handles the URL on init. If that already
      // succeeded by the time this effect runs, getSession() returns the
      // new session and we skip the exchange entirely (which would fail
      // with "code already used" otherwise).
      // -----------------------------------------------------------------
      let session: Session | null = null;
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log(LOG, "step1 getSession() error   =", error);
        console.log(
          LOG,
          "step1 getSession() session =",
          data.session
            ? {
                user_id: data.session.user.id,
                email: data.session.user.email,
                expires_at: data.session.expires_at,
              }
            : null,
        );
        session = data.session ?? null;
      } catch (err) {
        console.warn(LOG, "step1 getSession() threw:", err);
      }

      // -----------------------------------------------------------------
      // STEP 2 — If no session, manually exchange whichever format
      // the URL is using.
      // -----------------------------------------------------------------
      if (!session) {
        try {
          if (code) {
            console.log(LOG, "step2 calling exchangeCodeForSession()…");
            const { data, error } = await supabase.auth.exchangeCodeForSession(
              window.location.href,
            );
            console.log(LOG, "step2 exchangeCodeForSession error   =", error);
            console.log(LOG, "step2 exchangeCodeForSession session =", data.session ?? null);
            if (error) {
              setErrorMsg(error.message);
              setStatus("error");
              return;
            }
            session = data.session ?? null;
          } else if (tokenHash && otpType) {
            console.log(LOG, "step2 calling verifyOtp({ token_hash, type })…");
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: otpType,
            });
            console.log(LOG, "step2 verifyOtp error   =", error);
            console.log(LOG, "step2 verifyOtp session =", data.session ?? null);
            if (error) {
              setErrorMsg(error.message);
              setStatus("error");
              return;
            }
            session = data.session ?? null;
          } else if (hashAccessToken) {
            // detectSessionInUrl should have handled this already —
            // re-check getSession() just to be sure.
            console.log(LOG, "step2 hash-flow detected; re-checking getSession()…");
            const { data, error } = await supabase.auth.getSession();
            console.log(LOG, "step2 retry getSession() error   =", error);
            console.log(LOG, "step2 retry getSession() session =", data.session ?? null);
            session = data.session ?? null;
          } else {
            console.warn(
              LOG,
              "step2 no recognised auth params in URL (no code, token_hash, or #access_token)",
            );
          }
        } catch (err) {
          console.error(LOG, "step2 exchange threw:", err);
          setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
          setStatus("error");
          return;
        }
      }

      // -----------------------------------------------------------------
      // STEP 3 — Hand off to the shared post-login routing helper. We
      // don't compute the destination here ourselves anymore — the same
      // rule (profile.onboarding_completed → /onboarding vs /app/dashboard)
      // is owned by src/lib/routing.ts and shared with Login.tsx.
      // -----------------------------------------------------------------
      if (!session) {
        console.error(
          LOG,
          "step3 no session after all attempts — showing error UI",
        );
        setErrorMsg(
          "We couldn't activate your session from this link. It may have expired or been opened in a different browser than the one you signed up in.",
        );
        setStatus("error");
        return;
      }

      console.log(LOG, "step3 session.user =", {
        id: session.user.id,
        email: session.user.email,
      });

      let profile = null;
      try {
        profile = await getProfile(session.user.id);
        console.log(LOG, "step3 profile =", {
          role_type: profile?.role_type,
          onboarding_completed: profile?.onboarding_completed,
        });
      } catch (err) {
        console.warn(LOG, "step3 getProfile failed; defaulting to /onboarding:", err);
      }

      const dest = decideLandingRoute({ profile });
      console.log(LOG, "step3 decideLandingRoute →", dest);

      setStatus("success");
      // Short pause so the user sees the success state before being redirected.
      setTimeout(() => {
        console.log(LOG, "step3 firing navigate(", dest, ")");
        navigate(dest, { replace: true });
      }, 800);
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
        <p className="text-muted-foreground text-sm">Setting up your founding profile…</p>
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
        <p className="text-[11px] text-muted-foreground/80">
          Open the browser console for a detailed trace (look for "[AuthConfirm]").
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
