/**
 * Signup screen — ported using the redesign Auth idiom
 * (frontend-new/hayy/project/components/extra-screens.jsx → Auth).
 *
 * The redesign mock only depicts sign-in; this mirrors the same two-pane
 * layout for signup and adds the full-name + role fields the existing
 * Supabase auth flow needs (the role goes into auth metadata so the
 * handle_new_auth_user trigger can write user_profiles.role_type).
 *
 * Wraps with .hy so redesign tokens resolve. AuthLayout owns the outer
 * gradient + Logo + footer chrome, so the redesign's internal logo is
 * intentionally omitted.
 */
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I } from "@/components/ui/primitives";
import { signUpUser } from "@/lib/api/auth";

// URL ?type=… query param → DB role_type value
const typeToRole: Record<string, string> = {
  seeker: "job_seeker",
  host: "referral_host",
  recruiter: "recruiter",
  partner: "job_seeker", // community_partner is not in the schema yet
};

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "job_seeker", label: "Job seeker" },
  { value: "referral_host", label: "Referral host" },
  { value: "recruiter", label: "Recruiter / employer" },
  { value: "community_partner", label: "Community partner" },
];

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

const Signup = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [role, setRole] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /**
   * When Supabase has email confirmation enabled, signUp() returns
   * `data.session === null` — the user must click the email link to
   * activate a session. In that case we can't navigate to /onboarding
   * (RequireAuth will bounce them to /login), so we show a "check your
   * inbox" panel and let /auth/confirm handle the redirect to onboarding
   * once the email is confirmed.
   */
  const [awaitingConfirm, setAwaitingConfirm] = useState<{
    email: string;
    roleType: string;
  } | null>(null);

  // Pre-select the role from the ?type= query param if present.
  useEffect(() => {
    const t = params.get("type");
    if (t && typeToRole[t]) setRole(typeToRole[t]);
  }, [params]);

  const signupMutation = useMutation({
    mutationFn: (vars: { email: string; password: string; fullName: string; roleType: string }) =>
      signUpUser(vars),
    onSuccess: (result, vars) => {
      if (result.error) {
        setErrorMsg(result.error.message);
        toast.error("Couldn't create your account", { description: result.error.message });
        return;
      }
      // Email confirmation enabled → no session yet → don't navigate to a
      // protected route. Show the "check your inbox" panel; /auth/confirm
      // will route to /onboarding after the user clicks the email link.
      if (!result.data.session) {
        setAwaitingConfirm({ email: vars.email, roleType: vars.roleType });
        toast.success("Account created", {
          description: "Check your inbox to confirm your email and finish setup.",
        });
        return;
      }
      // Email confirmation disabled → session exists → go straight to onboarding.
      toast.success("Welcome to Hayy", { description: "Let's set up your founding profile." });
      navigate(`/onboarding?role=${encodeURIComponent(vars.roleType)}`);
    },
    onError: (error: Error) => {
      const message = error.message || "Something went wrong, please try again.";
      setErrorMsg(message);
      toast.error("Couldn't create your account", { description: message });
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      setErrorMsg("Please select your role to continue.");
      return;
    }
    setErrorMsg(null);
    const form = new FormData(e.currentTarget);
    signupMutation.mutate({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      fullName: String(form.get("name") ?? ""),
      roleType: role,
    });
  };

  const showComingSoon = (label: string) =>
    toast(label, { description: "We'll let you know when this is ready." });

  const submitting = signupMutation.isPending;

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
        minHeight: 720,
      }}
    >
      {/* Form panel — left on desktop */}
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
        <div style={{ maxWidth: 460, width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
          {awaitingConfirm ? (
            <>
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
                  Check your inbox
                </p>
                <h2 style={{ fontSize: 38, marginTop: 8, lineHeight: 1.1 }}>
                  One <span className="display-italic">click</span> away.
                </h2>
                <p
                  style={{
                    marginTop: 14,
                    fontSize: 15,
                    color: "var(--ink-soft)",
                    lineHeight: 1.55,
                    maxWidth: 440,
                  }}
                >
                  We sent a confirmation link to{" "}
                  <strong style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}>
                    {awaitingConfirm.email}
                  </strong>
                  . Click it to activate your account — you'll land back here ready to set
                  up your founding profile.
                </p>
              </div>

              <div
                style={{
                  padding: "16px 18px",
                  borderRadius: 16,
                  background: "var(--cream)",
                  border: "1px solid var(--line-soft)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <p
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--clay)",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Tip
                </p>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: 0, lineHeight: 1.5 }}>
                  Don't see the email? Check spam, or wait a minute and try signing up again
                  with the same address — we'll resend the link.
                </p>
              </div>

              <Btn
                kind="soft"
                size="lg"
                onClick={() => setAwaitingConfirm(null)}
                style={{ justifyContent: "center", width: "100%" }}
              >
                Use a different email
              </Btn>

              <p style={{ fontSize: 13, color: "var(--ink-soft)", textAlign: "center", marginTop: 4 }}>
                Already confirmed?{" "}
                <Link
                  to="/login"
                  style={{ color: "var(--clay)", fontWeight: 500, textDecoration: "none" }}
                >
                  Log in →
                </Link>
              </p>
            </>
          ) : (
            <>
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
              Founding access
            </p>
            <h2 style={{ fontSize: 38, marginTop: 8, lineHeight: 1.1 }}>
              Create your <span className="display-italic">Hayy</span> account.
            </h2>
            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "var(--ink-soft)",
                lineHeight: 1.5,
                maxWidth: 420,
              }}
            >
              Join the founding cohort and get access to the first live career rooms.
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Full name</span>
              <input
                name="name"
                required
                autoComplete="name"
                placeholder="Amira Mansour"
                disabled={submitting}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
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
                autoComplete="new-password"
                minLength={8}
                placeholder="At least 8 characters"
                disabled={submitting}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>I am a</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={submitting}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%23998f86' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1.5l5 5 5-5'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                  color: role ? "var(--ink)" : "var(--ink-mute)",
                }}
              >
                <option value="" disabled>
                  Select your role
                </option>
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

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
              {submitting ? "Creating your account…" : "Create account"}
            </Btn>

            <p
              style={{
                fontSize: 11,
                textAlign: "center",
                color: "var(--ink-mute)",
                lineHeight: 1.5,
                margin: "4px 0 0",
              }}
            >
              By creating an account you agree to Hayy's community guidelines and privacy
              commitments.
            </p>
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

          <Btn
            kind="soft"
            size="lg"
            onClick={() => showComingSoon("Google sign-up coming soon")}
            style={{ justifyContent: "center", width: "100%" }}
          >
            Continue with Google
          </Btn>

          <p style={{ fontSize: 13, color: "var(--ink-soft)", textAlign: "center", marginTop: 4 }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "var(--clay)", fontWeight: 500, textDecoration: "none" }}
            >
              Log in →
            </Link>
          </p>
            </>
          )}
        </div>
      </main>

      {/* Editorial side panel — desktop only */}
      <aside
        className="hidden lg:flex"
        style={{
          width: "44%",
          padding: "48px 56px",
          flexDirection: "column",
          justifyContent: "space-between",
          borderLeft: "1px solid var(--line-soft)",
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
            Be part of the first rooms
          </p>
          <h1 style={{ fontSize: 52, marginTop: 14, lineHeight: 1.0 }}>
            Real <span className="display-italic">people.</span>
            <br />
            Real referrals.
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
            Hayy is a community of newcomers and operators across MENA &amp; North America.
            Members refer 8× more often than they apply.
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
            <span style={{ color: "var(--ink)", fontWeight: 500 }}>Hand-picked cohort.</span>{" "}
            No spam, ever.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default Signup;
