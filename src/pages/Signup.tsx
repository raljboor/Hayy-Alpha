import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Users, Mic, Handshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { signUpUser } from "@/lib/api/auth";

// Maps URL ?type= query params to the correct SQL role_type values
const typeToRole: Record<string, string> = {
  seeker: "job_seeker",
  host: "referral_host",
  recruiter: "recruiter",
  partner: "job_seeker", // community_partner not in schema yet
};

const highlights = [
  { icon: Mic, title: "First live rooms", desc: "Be in the first cohort dropping into honest career conversations." },
  { icon: Handshake, title: "Warm referrals", desc: "Earn intros from real people inside your target companies." },
  { icon: Users, title: "Shape the community", desc: "Founding members help us decide what Hayy becomes next." },
];

const Signup = () => {
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const t = params.get("type");
    if (t && typeToRole[t]) setRole(typeToRole[t]);
  }, [params]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!role) {
      setErrorMsg("Please select your role to continue.");
      return;
    }
    setErrorMsg(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const { error } = await signUpUser({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      fullName: String(form.get("name") ?? ""),
      roleType: role, // passed into Supabase auth metadata → DB trigger
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      toast.error("Couldn't create your account", { description: error.message });
      return;
    }
    toast.success("Welcome to Hayy", { description: "Let's set up your founding profile." });
    // Route to the correct role-based onboarding
    navigate(`/onboarding?role=${encodeURIComponent(role)}`);
  };

  return (
    <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-8 items-stretch">
      {/* Side panel */}
      <aside className="hidden lg:flex relative rounded-3xl bg-primary text-primary-foreground p-10 overflow-hidden shadow-warm">
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-clay/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-olive/20 blur-3xl" />

        <div className="relative flex flex-col justify-between w-full">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/15 backdrop-blur px-3 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Founding access
            </span>
            <h2 className="font-display text-4xl xl:text-5xl font-medium leading-[1.1] mt-6">
              Join the first <br />
              <span className="italic text-clay-foreground/95">Hayy rooms.</span>
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-sm">
              Real people. Real referrals. Real growth — starting with a community of just a few hundred.
            </p>
          </div>

          <ul className="mt-10 space-y-5">
            {highlights.map((f) => (
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

          <p className="mt-10 text-xs text-primary-foreground/60">
            We're hand-picking the founding cohort. No spam, ever.
          </p>
        </div>
      </aside>

      {/* Auth card */}
      <div className="bg-card rounded-3xl border border-border shadow-warm p-7 sm:p-9">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
            Create your Hayy account.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the founding Hayy community and get access to the first live career rooms.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required placeholder="Amira Mansour" className="h-11 rounded-xl bg-cream border-border" disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" className="h-11 rounded-xl bg-cream border-border" disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="At least 8 characters" className="h-11 rounded-xl bg-cream border-border" disabled={submitting} />
            </div>

            <div className="space-y-2">
              <Label>I am a</Label>
              <Select value={role} onValueChange={setRole} required disabled={submitting}>
                <SelectTrigger className="h-11 rounded-xl bg-cream border-border">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_seeker">Job seeker</SelectItem>
                  <SelectItem value="referral_host">Referral host</SelectItem>
                  <SelectItem value="recruiter">Recruiter / employer</SelectItem>
                  <SelectItem value="community_partner">Community partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target role or industry</Label>
                <Input id="target" placeholder="e.g. Operations, PM, Tech" className="h-11 rounded-xl bg-cream border-border" disabled={submitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, country" className="h-11 rounded-xl bg-cream border-border" disabled={submitting} />
              </div>
            </div>

            {errorMsg && (
              <p className="text-sm text-destructive rounded-xl bg-destructive/10 px-4 py-2.5">
                {errorMsg}
              </p>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full mt-2" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
              By creating an account you agree to Hayy's community guidelines and privacy commitments.
            </p>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
