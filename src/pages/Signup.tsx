import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Users, Mic, Handshake, Loader2, Briefcase, ArrowRight, Check, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signUpUser } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

type RoleType = "job-seeker" | "referral-host" | "recruiter";

const roleCards: Array<{
  id: RoleType;
  icon: typeof Users;
  title: string;
  description: string;
  highlights: string[];
  gradient: string;
}> = [
  {
    id: "job-seeker",
    icon: Users,
    title: "Job seeker",
    description: "Find warm intros and referrals into your target companies",
    highlights: ["Join live career rooms", "Request referrals", "Build real connections"],
    gradient: "from-primary to-clay",
  },
  {
    id: "referral-host",
    icon: UserCheck,
    title: "Referral host",
    description: "Help talented people get seen by companies you know",
    highlights: ["Set your capacity", "Choose who to help", "Make real impact"],
    gradient: "from-clay to-olive",
  },
  {
    id: "recruiter",
    icon: Briefcase,
    title: "Recruiter / employer",
    description: "Host hiring rooms and find warm, pre-vetted candidates",
    highlights: ["Create hiring rooms", "Meet referred talent", "Quality over volume"],
    gradient: "from-olive to-primary",
  },
];

const highlights = [
  { icon: Mic, title: "First live rooms", desc: "Be in the first cohort dropping into honest career conversations." },
  { icon: Handshake, title: "Warm referrals", desc: "Earn intros from real people inside your target companies." },
  { icon: Users, title: "Shape the community", desc: "Founding members help us decide what Hayy becomes next." },
];

const Signup = () => {
  const [role, setRole] = useState<RoleType | "">("");
  const [step, setStep] = useState<"role" | "details">("role");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const t = params.get("type");
    if (t === "host") setRole("referral-host");
    if (t === "recruiter") setRole("recruiter");
    if (t === "seeker") setRole("job-seeker");
  }, [params]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const { error } = await signUpUser({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      fullName: String(form.get("name") ?? ""),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      toast.error("Couldn't create your account", { description: error.message });
      return;
    }
    toast.success("Welcome to Hayy", { description: "Let's set up your founding profile." });
    navigate("/onboarding");
  };

  return (
    <div className="w-full max-w-5xl">
      {step === "role" ? (
        /* Step 1: Role selection */
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
              <Sparkles className="h-3 w-3" />
              Founding access
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight">
              How will you use Hayy?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose your primary role. You can always change this later.
            </p>
          </div>

          {/* Role selection cards */}
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {roleCards.map((r) => {
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "relative rounded-[1.75rem] p-6 text-left transition-all duration-300",
                    "border-2 bg-card shadow-soft hover:shadow-warm hover:-translate-y-1",
                    isSelected
                      ? "border-primary ring-4 ring-primary/15 shadow-warm"
                      : "border-border/60 hover:border-primary/40"
                  )}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    "h-14 w-14 rounded-2xl bg-gradient-to-br text-primary-foreground flex items-center justify-center mb-5 shadow-soft transition-transform",
                    r.gradient,
                    isSelected && "scale-110"
                  )}>
                    <r.icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{r.description}</p>
                  
                  {/* Highlights */}
                  <ul className="space-y-2">
                    {r.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-foreground/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          {/* Continue button */}
          <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full group"
              disabled={!role}
              onClick={() => setStep("details")}
            >
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      ) : (
        /* Step 2: Account details */
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-8 items-stretch">
          {/* Side panel */}
          <aside className="hidden lg:flex relative rounded-[2rem] bg-gradient-to-br from-primary via-primary to-clay text-primary-foreground p-10 overflow-hidden shadow-warm">
            <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-clay/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-olive/20 blur-3xl" />

            <div className="relative flex flex-col justify-between w-full">
              <div>
                <button 
                  onClick={() => setStep("role")}
                  className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-6"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Change role
                </button>
                
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
                We&apos;re hand-picking the founding cohort. No spam, ever.
              </p>
            </div>
          </aside>

          {/* Auth card */}
          <div className="bg-card/95 backdrop-blur rounded-[2rem] border border-border/60 shadow-elevated p-7 sm:p-9">
            <div className="max-w-md mx-auto">
              {/* Mobile: show change role button */}
              <button 
                onClick={() => setStep("role")}
                className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Change role
              </button>
              
              <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
                Create your Hayy account.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Joining as a <span className="font-medium text-foreground">{roleCards.find(r => r.id === role)?.title.toLowerCase()}</span>
              </p>

              <form onSubmit={onSubmit} className="mt-7 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Amira Mansour" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60" 
                    disabled={submitting} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60" 
                    disabled={submitting} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="At least 8 characters" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60" 
                    disabled={submitting} 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target role or industry</Label>
                    <Input 
                      id="target" 
                      placeholder="e.g. Operations, PM, Tech" 
                      className="h-12 rounded-xl bg-cream/80 border-border/60" 
                      disabled={submitting} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="City, country" 
                      className="h-12 rounded-xl bg-cream/80 border-border/60" 
                      disabled={submitting} 
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-sm text-destructive rounded-xl bg-destructive/10 px-4 py-2.5">
                    {errorMsg}
                  </p>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full mt-2 group" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                  By creating an account you agree to Hayy&apos;s community guidelines and privacy commitments.
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
      )}
    </div>
  );
};

export default Signup;
