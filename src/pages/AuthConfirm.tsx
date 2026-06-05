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

import React, { useEffect, useState } from "react";
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

  const centeredStyle: React.CSSProperties = {
    minHeight: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
    background: 'var(--bg)',
  };

  if (status === "loading") {
    return (
      <div className="hy" data-palette="dawn" style={centeredStyle}>
        <span style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--clay)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'block' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Confirming your account…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="hy" data-palette="dawn" style={centeredStyle}>
        <span style={{ width: 48, height: 48, borderRadius: '50%', background: 'color-mix(in oklab, var(--clay) 14%, var(--paper))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--clay)' }}>✓</span>
        <p style={{ fontFamily: 'var(--display)', fontSize: 22 }}>Email confirmed!</p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Setting up your founding profile…</p>
      </div>
    );
  }

  return (
    <div className="hy" data-palette="dawn" style={centeredStyle}>
      <div style={{ padding: 32, borderRadius: 24, background: 'var(--paper)', border: '1px solid var(--line)', maxWidth: 380, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontFamily: 'var(--display)', fontSize: 22 }}>Confirmation failed</p>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
          {errorMsg ?? "The confirmation link may have expired or already been used."}
        </p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="hy-btn hy-btn-primary"
          style={{ justifyContent: 'center' }}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default AuthConfirm;
