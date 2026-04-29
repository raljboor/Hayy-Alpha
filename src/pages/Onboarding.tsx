/**
 * Role-based onboarding intake.
 *
 * Reads role_type from:
 *   1. ?role= query param (set by Signup.tsx on redirect)
 *   2. profile.role_type from AuthContext (for returning users)
 *   3. Defaults to job_seeker if neither is available
 *
 * Renders a distinct intake form for each role:
 *   - job_seeker → 3-step career / story / help form
 *   - referral_host → 2-step host profile + availability form
 *   - recruiter → 2-step company / hiring focus form
 */

import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, Upload, Video, Sparkles, Loader2, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/hayy/Logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updateProfile, uploadResume, uploadVideoIntro } from "@/lib/api/profiles";
import { upsertHostSettings } from "@/lib/api/hostSettings";
import type { RoleType } from "@/types/models";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fieldClass = "h-11 rounded-xl bg-cream border-border";

/** Shared progress header used by all role flows */
const OnboardingShell = ({
  children,
  steps,
  currentStep,
  hint,
}: {
  children: React.ReactNode;
  steps: { label: string }[];
  currentStep: number;
  hint: string;
}) => (
  <div className="min-h-screen bg-gradient-hero flex flex-col">
    <header className="container h-16 flex items-center justify-between">
      <Logo />
      <span className="text-xs text-muted-foreground hidden sm:block">
        You can edit anything later from your profile.
      </span>
    </header>
    <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                  i < currentStep && "bg-primary text-primary-foreground",
                  i === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                  i > currentStep && "bg-card border border-border text-muted-foreground",
                )}>
                  {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-0.5 flex-1 rounded-full", i < currentStep ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-clay">
              Step {currentStep + 1} of {steps.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% there
            </p>
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border shadow-warm p-7 sm:p-10">
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
            {steps[currentStep].label}
          </h1>
          <p className="mt-2 text-muted-foreground">{hint}</p>
          <div className="mt-7">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Hayy is built on warm, real connections — not algorithms.
        </p>
      </div>
    </main>
  </div>
);

// ---------------------------------------------------------------------------
// File upload tile
// ---------------------------------------------------------------------------

interface UploadTileProps {
  icon: typeof Upload;
  title: string;
  hint: string;
  accept: string;
  file: File | null;
  onFile: (f: File) => void;
}

const UploadTile = ({ icon: Icon, title, hint, accept, file, onFile }: UploadTileProps) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={ref} type="file" accept={accept} className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <button type="button" onClick={() => ref.current?.click()}
        className="rounded-2xl border border-dashed border-border bg-cream/60 p-5 text-left hover:border-primary/40 hover:bg-cream transition-colors group">
        <span className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shadow-soft mb-3 transition-colors",
          file ? "bg-olive text-olive-foreground" : "bg-card text-clay group-hover:bg-primary group-hover:text-primary-foreground",
        )}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="font-medium text-foreground">{title}</p>
        {file
          ? <p className="text-xs text-olive mt-0.5 truncate">{file.name}</p>
          : <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </button>
    </>
  );
};

// ---------------------------------------------------------------------------
// Job Seeker flow (3 steps)
// ---------------------------------------------------------------------------

interface JobSeekerData {
  targetRole: string; targetIndustry: string; targetCompanies: string;
  location: string; experienceLevel: string;
  bio: string; skills: string; linkedinUrl: string; referralGoals: string;
  resumeFile: File | null; videoFile: File | null;
  helpSelected: string[];
}
const JS_EMPTY: JobSeekerData = {
  targetRole: "", targetIndustry: "", targetCompanies: "", location: "", experienceLevel: "",
  bio: "", skills: "", linkedinUrl: "", referralGoals: "",
  resumeFile: null, videoFile: null, helpSelected: [],
};
const helpOptions = ["Coffee chats", "Referrals", "Resume feedback", "Interview prep", "Company insight", "Networking practice"];

const JS_STEPS = [
  { label: "Career target", hint: "Tell us what you're aiming for." },
  { label: "Your story", hint: "Share who you are beyond bullet points." },
  { label: "What help do you want?", hint: "We'll match you to the right rooms and hosts." },
];

const JobSeekerOnboarding = ({ userId, refreshProfile, onDone }: { userId: string; refreshProfile: () => Promise<void>; onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JobSeekerData>(JS_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<JobSeekerData>) => setData(prev => ({ ...prev, ...p }));
  const toggle = (h: string) => update({ helpSelected: data.helpSelected.includes(h) ? data.helpSelected.filter(x => x !== h) : [...data.helpSelected, h] });

  const next = async () => {
    if (step < JS_STEPS.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    try {
      await updateProfile(userId, {
        location: data.location.trim() || undefined,
        bio: data.bio.trim() || undefined,
        referral_goals: data.referralGoals.trim() || null,
        target_roles: [data.targetRole, data.targetIndustry].map(s => s.trim()).filter(Boolean),
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
        linkedin_url: data.linkedinUrl.trim() || undefined,
      });
      if (data.resumeFile) { try { await uploadResume(userId, data.resumeFile); } catch { toast.error("Resume upload failed — try again from your profile."); } }
      if (data.videoFile) { try { await uploadVideoIntro(userId, data.videoFile); } catch { toast.error("Video upload failed — try again from your profile."); } }
      await refreshProfile();
      toast.success("You're in. Welcome to Hayy.", { description: "We'll line up your first warm intro soon." });
      onDone();
    } catch { toast.error("Couldn't save your profile — please try again."); }
    finally { setSaving(false); }
  };

  return (
    <OnboardingShell steps={JS_STEPS} currentStep={step} hint={JS_STEPS[step].hint}>
      {step === 0 && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Target role</Label>
              <Input className={fieldClass} placeholder="e.g. Senior Product Manager" value={data.targetRole} onChange={e => update({ targetRole: e.target.value })} /></div>
            <div className="space-y-2"><Label>Target industry</Label>
              <Input className={fieldClass} placeholder="e.g. Fintech, Health, B2B SaaS" value={data.targetIndustry} onChange={e => update({ targetIndustry: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Target companies</Label>
            <Input className={fieldClass} placeholder="Shopify, Amazon, Notion…" value={data.targetCompanies} onChange={e => update({ targetCompanies: e.target.value })} />
            <p className="text-xs text-muted-foreground">Separate with commas.</p></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Location</Label>
              <Input className={fieldClass} placeholder="City, country" value={data.location} onChange={e => update({ location: e.target.value })} /></div>
            <div className="space-y-2"><Label>Experience level</Label>
              <Select value={data.experienceLevel} onValueChange={v => update({ experienceLevel: v })}>
                <SelectTrigger className={fieldClass}><SelectValue placeholder="Choose one" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="new-grad">New grad</SelectItem>
                  <SelectItem value="early">Early career</SelectItem>
                  <SelectItem value="mid">Mid career</SelectItem>
                  <SelectItem value="switcher">Career switcher</SelectItem>
                </SelectContent>
              </Select></div>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2"><Label>Short bio</Label>
            <Textarea rows={4} className="rounded-xl bg-cream border-border resize-none" placeholder="A few warm sentences about who you are, what you've built, and what you're chasing next." value={data.bio} onChange={e => update({ bio: e.target.value })} />
            <p className="text-xs text-muted-foreground">This is what hosts read before saying yes to a chat.</p></div>
          <div className="space-y-2"><Label>Key skills</Label>
            <Input className={fieldClass} placeholder="e.g. Strategy, SQL, brand storytelling" value={data.skills} onChange={e => update({ skills: e.target.value })} />
            <p className="text-xs text-muted-foreground">Separate with commas.</p></div>
          <div className="space-y-2"><Label>Referral goals</Label>
            <Textarea rows={2} className="rounded-xl bg-cream border-border resize-none" placeholder="Describe the kinds of warm introductions, companies, or roles you're hoping to access." value={data.referralGoals} onChange={e => update({ referralGoals: e.target.value })} /></div>
          <div className="space-y-2"><Label>LinkedIn URL</Label>
            <Input className={fieldClass} type="url" placeholder="https://linkedin.com/in/yourname" value={data.linkedinUrl} onChange={e => update({ linkedinUrl: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <UploadTile icon={Upload} title="Resume" hint="PDF or DOCX, up to 5MB" accept=".pdf,.doc,.docx" file={data.resumeFile} onFile={f => update({ resumeFile: f })} />
            <UploadTile icon={Video} title="Video intro" hint="Optional · 60 seconds" accept="video/*" file={data.videoFile} onFile={f => update({ videoFile: f })} />
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="flex flex-wrap gap-2.5">
            {helpOptions.map(opt => {
              const active = data.helpSelected.includes(opt);
              return (
                <button key={opt} type="button" onClick={() => toggle(opt)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition-all", active ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-cream text-foreground/80 border-border hover:bg-sand hover:border-primary/30")}>
                  {active && <Check className="h-3.5 w-3.5 inline -mt-0.5 mr-1.5" />}{opt}
                </button>
              );
            })}
          </div>
          <div className="mt-7 rounded-2xl bg-cream border border-border p-5">
            <p className="text-xs font-medium uppercase tracking-widest text-clay">Heads up</p>
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">We'll only suggest hosts who can actually help with what you picked.</p>
          </div>
        </div>
      )}
      <div className="mt-9 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || saving} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft className="h-4 w-4" />Back
        </Button>
        <Button variant="hero" size="lg" onClick={next} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : step === JS_STEPS.length - 1 ? <>Finish onboarding<Sparkles className="h-4 w-4" /></> : <>Continue<ArrowRight className="h-4 w-4" /></>}
        </Button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Referral Host flow (2 steps)
// ---------------------------------------------------------------------------

interface HostData {
  headline: string; location: string; bio: string; skills: string; linkedinUrl: string;
  rolesSupported: string; industriesSupported: string; monthlyCapacity: string;
  coffeeChats: boolean; referrals: boolean; resumeFeedback: boolean;
}
const HOST_EMPTY: HostData = {
  headline: "", location: "", bio: "", skills: "", linkedinUrl: "",
  rolesSupported: "", industriesSupported: "", monthlyCapacity: "3",
  coffeeChats: true, referrals: true, resumeFeedback: false,
};
const HOST_STEPS = [
  { label: "Your host profile", hint: "Tell candidates who you are and where you work." },
  { label: "Availability", hint: "Set what kinds of help you're open to offering." },
];

const HostOnboarding = ({ userId, refreshProfile, onDone }: { userId: string; refreshProfile: () => Promise<void>; onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<HostData>(HOST_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<HostData>) => setData(prev => ({ ...prev, ...p }));

  const next = async () => {
    if (step < HOST_STEPS.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    try {
      await updateProfile(userId, {
        headline: data.headline.trim() || undefined,
        location: data.location.trim() || undefined,
        bio: data.bio.trim() || undefined,
        skills: data.skills.split(",").map(s => s.trim()).filter(Boolean),
        linkedin_url: data.linkedinUrl.trim() || undefined,
        role_type: "referral_host",
      });
      await upsertHostSettings(userId, {
        monthly_capacity: parseInt(data.monthlyCapacity, 10) || 3,
        open_to_coffee_chats: data.coffeeChats,
        open_to_referrals: data.referrals,
        open_to_resume_feedback: data.resumeFeedback,
        roles_supported: data.rolesSupported.split(",").map(s => s.trim()).filter(Boolean),
        industries_supported: data.industriesSupported.split(",").map(s => s.trim()).filter(Boolean),
      });
      await refreshProfile();
      toast.success("Host profile ready!", { description: "Candidates can now discover you in rooms." });
      onDone();
    } catch { toast.error("Couldn't save — please try again."); }
    finally { setSaving(false); }
  };

  return (
    <OnboardingShell steps={HOST_STEPS} currentStep={step} hint={HOST_STEPS[step].hint}>
      {step === 0 && (
        <div className="space-y-5">
          <div className="space-y-2"><Label>Headline</Label>
            <Input className={fieldClass} placeholder="e.g. Senior PM @ Shopify" value={data.headline} onChange={e => update({ headline: e.target.value })} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Location</Label>
              <Input className={fieldClass} placeholder="City, country" value={data.location} onChange={e => update({ location: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>About you</Label>
            <Textarea rows={4} className="rounded-xl bg-cream border-border resize-none" placeholder="Why do you host rooms? What kinds of candidates do you want to help?" value={data.bio} onChange={e => update({ bio: e.target.value })} /></div>
          <div className="space-y-2"><Label>Skills you can speak to</Label>
            <Input className={fieldClass} placeholder="e.g. PM, Operations, Go-to-market" value={data.skills} onChange={e => update({ skills: e.target.value })} />
            <p className="text-xs text-muted-foreground">Separate with commas.</p></div>
          <div className="space-y-2"><Label>LinkedIn URL</Label>
            <Input className={fieldClass} type="url" placeholder="https://linkedin.com/in/yourname" value={data.linkedinUrl} onChange={e => update({ linkedinUrl: e.target.value })} /></div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { key: "coffeeChats", label: "Open to coffee chats", desc: "Short intro conversations with candidates" },
              { key: "referrals", label: "Open to referrals", desc: "Submitting a formal referral to your ATS" },
              { key: "resumeFeedback", label: "Open to resume feedback", desc: "Reviewing and commenting on resumes" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
                <Switch checked={data[key as keyof HostData] as boolean} onCheckedChange={v => update({ [key]: v })} />
              </div>
            ))}
          </div>
          <div className="space-y-2"><Label>Monthly capacity</Label>
            <Select value={data.monthlyCapacity} onValueChange={v => update({ monthlyCapacity: v })}>
              <SelectTrigger className={fieldClass}><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "5", "8", "Unlimited"].map(v => <SelectItem key={v} value={v}>{v}{v !== "Unlimited" ? " per month" : ""}</SelectItem>)}
              </SelectContent>
            </Select></div>
          <div className="space-y-2"><Label>Roles you support</Label>
            <Input className={fieldClass} placeholder="e.g. PM, Operations, Engineering" value={data.rolesSupported} onChange={e => update({ rolesSupported: e.target.value })} /></div>
          <div className="space-y-2"><Label>Industries</Label>
            <Input className={fieldClass} placeholder="e.g. Tech, Finance, Healthcare" value={data.industriesSupported} onChange={e => update({ industriesSupported: e.target.value })} /></div>
        </div>
      )}
      <div className="mt-9 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || saving} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft className="h-4 w-4" />Back
        </Button>
        <Button variant="hero" size="lg" onClick={next} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : step === HOST_STEPS.length - 1 ? <>Launch host profile<Sparkles className="h-4 w-4" /></> : <>Continue<ArrowRight className="h-4 w-4" /></>}
        </Button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Recruiter flow (2 steps)
// ---------------------------------------------------------------------------

interface RecruiterData {
  headline: string; companyName: string; recruiterTitle: string;
  hiringFocus: string; departmentsHiring: string; locationsHiring: string;
  companyDescription: string; linkedinUrl: string;
}
const REC_EMPTY: RecruiterData = {
  headline: "", companyName: "", recruiterTitle: "", hiringFocus: "",
  departmentsHiring: "", locationsHiring: "", companyDescription: "", linkedinUrl: "",
};
const REC_STEPS = [
  { label: "Your company", hint: "Tell candidates who you're hiring for." },
  { label: "Hiring focus", hint: "What roles and locations are you actively sourcing?" },
];

const RecruiterOnboarding = ({ userId, refreshProfile, onDone }: { userId: string; refreshProfile: () => Promise<void>; onDone: () => void }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RecruiterData>(REC_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<RecruiterData>) => setData(prev => ({ ...prev, ...p }));

  const next = async () => {
    if (step < REC_STEPS.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    try {
      await updateProfile(userId, {
        headline: data.recruiterTitle ? `${data.recruiterTitle} @ ${data.companyName}` : data.companyName || undefined,
        bio: data.companyDescription.trim() || undefined,
        linkedin_url: data.linkedinUrl.trim() || undefined,
        role_type: "recruiter",
        // Extended recruiter fields (migration 004)
        company_name: data.companyName.trim() || undefined,
        recruiter_title: data.recruiterTitle.trim() || undefined,
        hiring_focus: data.hiringFocus.split(",").map(s => s.trim()).filter(Boolean),
        departments_hiring: data.departmentsHiring.split(",").map(s => s.trim()).filter(Boolean),
        locations_hiring: data.locationsHiring.split(",").map(s => s.trim()).filter(Boolean),
        company_description: data.companyDescription.trim() || undefined,
      } as Record<string, unknown> as Parameters<typeof updateProfile>[1]);
      await refreshProfile();
      toast.success("Recruiter profile ready!", { description: "Start creating rooms to attract warm candidates." });
      onDone();
    } catch { toast.error("Couldn't save — please try again."); }
    finally { setSaving(false); }
  };

  return (
    <OnboardingShell steps={REC_STEPS} currentStep={step} hint={REC_STEPS[step].hint}>
      {step === 0 && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Company name</Label>
              <Input className={fieldClass} placeholder="e.g. Shopify" value={data.companyName} onChange={e => update({ companyName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Your title</Label>
              <Input className={fieldClass} placeholder="e.g. Talent Partner" value={data.recruiterTitle} onChange={e => update({ recruiterTitle: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Company description</Label>
            <Textarea rows={4} className="rounded-xl bg-cream border-border resize-none" placeholder="What does your company do? Why would a candidate be excited to join?" value={data.companyDescription} onChange={e => update({ companyDescription: e.target.value })} /></div>
          <div className="space-y-2"><Label>LinkedIn / company URL</Label>
            <Input className={fieldClass} type="url" placeholder="https://linkedin.com/company/yourcompany" value={data.linkedinUrl} onChange={e => update({ linkedinUrl: e.target.value })} /></div>
        </div>
      )}
      {step === 1 && (
        <div className="space-y-5">
          <div className="space-y-2"><Label>Hiring focus</Label>
            <Input className={fieldClass} placeholder="e.g. Product, Operations, Engineering" value={data.hiringFocus} onChange={e => update({ hiringFocus: e.target.value })} />
            <p className="text-xs text-muted-foreground">Separate with commas.</p></div>
          <div className="space-y-2"><Label>Departments / teams hiring</Label>
            <Input className={fieldClass} placeholder="e.g. Growth, Platform, Data" value={data.departmentsHiring} onChange={e => update({ departmentsHiring: e.target.value })} /></div>
          <div className="space-y-2"><Label>Locations hiring</Label>
            <Input className={fieldClass} placeholder="e.g. Toronto, Remote, NYC" value={data.locationsHiring} onChange={e => update({ locationsHiring: e.target.value })} /></div>
          <div className="rounded-2xl bg-cream border border-border p-5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-clay" />
              <p className="text-xs font-medium uppercase tracking-widest text-clay">Next step</p>
            </div>
            <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
              After setup, create your first live room from the Recruiter Dashboard to start attracting warm candidates.
            </p>
          </div>
        </div>
      )}
      <div className="mt-9 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || saving} className={step === 0 ? "invisible" : ""}>
          <ArrowLeft className="h-4 w-4" />Back
        </Button>
        <Button variant="hero" size="lg" onClick={next} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : step === REC_STEPS.length - 1 ? <>Launch recruiter profile<Sparkles className="h-4 w-4" /></> : <>Continue<ArrowRight className="h-4 w-4" /></>}
        </Button>
      </div>
    </OnboardingShell>
  );
};

// ---------------------------------------------------------------------------
// Main router component
// ---------------------------------------------------------------------------

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId, profile, refreshProfile } = useCurrentUser();

  // Role comes from URL (set by signup) or from the loaded profile
  const urlRole = searchParams.get("role");
  const effectiveRole: RoleType = (urlRole ?? profile?.role_type ?? "job_seeker") as RoleType;

  const onDone = () => navigate("/app/dashboard");

  if (!userId) {
    // Still loading auth — show a minimal spinner
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (effectiveRole === "referral_host") {
    return <HostOnboarding userId={userId} refreshProfile={refreshProfile} onDone={onDone} />;
  }
  if (effectiveRole === "recruiter") {
    return <RecruiterOnboarding userId={userId} refreshProfile={refreshProfile} onDone={onDone} />;
  }
  // Default: job_seeker (and any unrecognised role)
  return <JobSeekerOnboarding userId={userId} refreshProfile={refreshProfile} onDone={onDone} />;
};

export default Onboarding;
