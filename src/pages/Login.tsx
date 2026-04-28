import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mic, Handshake, Coffee, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginUser } from "@/lib/api/auth";

const features = [
  { icon: Mic, title: "Live career rooms", desc: "Drop into honest conversations with people inside your target companies." },
  { icon: Handshake, title: "Referral tracking", desc: "See every warm intro, request, and follow-up in one warm place." },
  { icon: Coffee, title: "Warm introductions", desc: "Build real relationships before the application stage." },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const { error } = await loginUser({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      toast.error("Couldn't log you in", { description: error.message });
      return;
    }
    toast.success("Welcome back to Hayy");
    const from = (location.state as { from?: string } | null)?.from;
    navigate(from && from.startsWith("/app") ? from : "/app/dashboard");
  };

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-8 items-stretch">
      {/* Side panel — desktop only */}
      <aside className="hidden lg:flex relative rounded-3xl bg-primary text-primary-foreground p-10 overflow-hidden shadow-warm">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-clay/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-olive/20 blur-3xl" />

        <div className="relative flex flex-col justify-between w-full">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/15 backdrop-blur px-3 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Founding community
            </span>
            <h2 className="font-display text-4xl xl:text-5xl font-medium leading-[1.1] mt-6">
              Where careers <br />
              <span className="italic text-clay-foreground/95">come alive.</span>
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-sm">
              Real people. Real referrals. Real growth — every time you log in.
            </p>
          </div>

          <ul className="mt-10 space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-4">
                <span className="h-10 w-10 rounded-2xl bg-card/15 backdrop-blur flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold leading-tight">{f.title}</p>
                  <p className="text-sm text-primary-foreground/75 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <figure className="mt-10 rounded-2xl bg-card/10 backdrop-blur border border-card/15 p-5">
            <p className="font-display italic text-base leading-snug">
              "I finally understood how referrals actually work."
            </p>
            <figcaption className="mt-3 text-xs text-primary-foreground/70">— Amira, founding member</figcaption>
          </figure>
        </div>
      </aside>

      {/* Auth card */}
      <div className="bg-card rounded-3xl border border-border shadow-warm p-7 sm:p-9">
        <div className="max-w-sm mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to manage rooms, referrals, and follow-ups.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@hayy.community"
                className="h-12 rounded-xl bg-cream border-border"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => toast("Password reset coming soon", { description: "We'll email you a secure link." })}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="h-12 rounded-xl bg-cream border-border"
                disabled={submitting}
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive rounded-xl bg-destructive/10 px-4 py-2.5">
                {errorMsg}
              </p>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Logging in…</>
              ) : (
                "Log in"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Need an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Join Hayy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
