/**
 * Login screen — ported from the redesign Auth mock
 * (frontend-new/hayy/project/components/extra-screens.jsx → Auth).
 *
 * Wraps with .hy so the redesign CSS vars resolve. AuthLayout owns the
 * outer chrome (gradient bg + Hayy logo header + back-to-home footer),
 * so the redesign's internal logo is intentionally omitted here.
 */
import { useState, type CSSProperties, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I } from "@/components/ui/primitives";
import { loginUser } from "@/lib/api/auth";
import { getProfile } from "@/lib/api/profiles";
import { decideLandingRoute } from "@/lib/routing";

interface LocationState {
  from?: string;
}

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--paper)",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  outline: "none",
  fontFamily: "var(--sans)",
};

const fieldLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (vars: { email: string; password: string }) => loginUser(vars),
    onSuccess: async (result) => {
      if (result.error) {
        setErrorMsg(result.error.message);
        toast.error("Couldn't log you in", { description: result.error.message });
        return;
      }
      toast.success("Welcome back to Hayy");
      const from = (location.state as LocationState | null)?.from ?? null;

      // Pull the freshest profile so we can decide between /onboarding
      // and /app/dashboard. Falls back to /onboarding if anything fails
      // — that's the safer default than dropping a not-yet-set-up user
      // straight into the app.
      let profile = null;
      const userId = result.data.user?.id;
      if (userId) {
        try {
          profile = await getProfile(userId);
        } catch (err) {
          console.warn("[Login] getProfile failed, defaulting to /onboarding:", err);
        }
      }
      navigate(decideLandingRoute({ profile, preferredFrom: from }), { replace: true });
    },
    onError: (error: Error) => {
      const message = error.message || "Something went wrong, please try again.";
      setErrorMsg(message);
      toast.error("Couldn't log you in", { description: message });
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);
    loginMutation.mutate({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
  };

  const showComingSoon = (label: string) =>
    toast(label, { description: "We'll let you know when this is ready." });

  const submitting = loginMutation.isPending;

  return (
    <div
      className="hy hy-bg-hero"
      style={{
        width: "100%",
        display: "flex",
        overflow: "hidden",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--line-soft)",
        boxShadow: "var(--shadow-warm)",
        minHeight: 640,
      }}
    >
      {/* Editorial side panel — desktop only */}
      <aside
        className="hidden lg:flex"
        style={{
          width: "44%",
          padding: "48px 56px",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid var(--line-soft)",
          gap: 32,
        }}
      >
        <div>
          <p
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--clay)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            An invite-only network
          </p>
          <h1 style={{ fontSize: 56, marginTop: 14, lineHeight: 1.0 }}>
            Where the next <span className="display-italic">conversation</span>
            <br />
            becomes the next chapter.
          </h1>
          <p
            style={{
              marginTop: 18,
              fontSize: 16,
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Hayy connects newcomers and operators in MENA &amp; North America through small,
            honest rooms. Members refer 8× more often than they apply.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {(
              [
                { name: "Maya N", tone: "clay" as const },
                { name: "Rashid K", tone: "olive" as const },
                { name: "Layla P", tone: "sand" as const },
                { name: "Sara M", tone: "dark" as const },
              ]
            ).map((p, i) => (
              <span
                key={p.name}
                style={{
                  marginLeft: i === 0 ? 0 : -10,
                  border: "2px solid var(--paper)",
                  borderRadius: 999,
                  display: "inline-flex",
                }}
              >
                <Avatar name={p.name} size={36} tone={p.tone} />
              </span>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0 }}>
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>A founding cohort</span> of
            newcomers, hosts &amp; operators.
          </p>
        </div>
      </aside>

      {/* Form panel */}
      <main
        style={{
          flex: 1,
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div style={{ maxWidth: 420, width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <p
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--clay)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Welcome back
            </p>
            <h2 style={{ fontSize: 38, marginTop: 8, lineHeight: 1.1 }}>
              Sign in to <span className="display-italic">Hayy.</span>
            </h2>
          </div>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@hayy.community"
                disabled={submitting}
                style={{ ...inputStyle, fontFamily: "var(--mono)" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={submitting}
                style={inputStyle}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => showComingSoon("Password reset coming soon")}
                style={{
                  fontSize: 13,
                  color: "var(--clay)",
                  fontWeight: 500,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                }}
              >
                Forgot?
              </button>
            </div>

            {errorMsg && (
              <p
                style={{
                  fontSize: 13,
                  color: "white",
                  background: "var(--live)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  margin: 0,
                }}
              >
                {errorMsg}
              </p>
            )}

            <Btn
              kind="primary"
              size="lg"
              type="submit"
              iconRight={I.arrow}
              disabled={submitting}
              style={{ justifyContent: "center", width: "100%" }}
            >
              {submitting ? "Signing you in…" : "Continue"}
            </Btn>
          </form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "var(--ink-mute)",
              fontSize: 11,
            }}
          >
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span
              className="mono"
              style={{ letterSpacing: ".12em", textTransform: "uppercase" }}
            >
              or
            </span>
            <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn
              kind="soft"
              size="lg"
              onClick={() => showComingSoon("Google sign-in coming soon")}
              style={{ justifyContent: "center", width: "100%" }}
            >
              Continue with Google
            </Btn>
            <Btn
              kind="soft"
              size="lg"
              onClick={() => showComingSoon("Magic-link sign-in coming soon")}
              style={{ justifyContent: "center", width: "100%" }}
            >
              Use a magic link
            </Btn>
          </div>

          <p style={{ fontSize: 13, color: "var(--ink-soft)", textAlign: "center", marginTop: 4 }}>
            New here?{" "}
            <Link
              to="/signup"
              style={{ color: "var(--clay)", fontWeight: 500, textDecoration: "none" }}
            >
              Request an invite →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
