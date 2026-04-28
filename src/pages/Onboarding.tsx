import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, Video, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/hayy/Logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updateProfile, uploadResume, uploadVideoIntro } from "@/lib/api/profiles";
import type { RoleType } from "@/types/models";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OnboardingData {
  // Step 1 – Career target
  targetRole: string;
  targetIndustry: string;
  targetCompanies: string;
  location: string;
  experienceLevel: string;
  // Step 2 – Story
  bio: string;
  skills: string;
  linkedinUrl: string;
  resumeFile: File | null;
  videoFile: File | null;
  // Step 3 – Help type maps to role_type
  helpSelected: string[];
}

const EMPTY: OnboardingData = {
  targetRole: "",
  targetIndustry: "",
  targetCompanies: "",
  location: "",
  experienceLevel: "",
  bio: "",
  skills: "",
  linkedinUrl: "",
  resumeFile: null,
  videoFile: null,
  helpSelected: [],
};

const helpOptions = [
  "Coffee chats",
  "Referrals",
  "Resume feedback",
  "Interview prep",
  "Company insight",
  "Networking practice",
];

const steps = [
  { n: 1, label: "Career target", hint: "Tell us what you're aiming for." },
  { n: 2, label: "Your story", hint: "Share who you are beyond bullet points." },
  { n: 3, label: "What help do you want?", hint: "We'll match you to the right rooms and hosts." },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function deriveRoleType(helpSelected: string[]): RoleType {
  if (helpSelected.length === 0) return "candidate";
  // If user picked mostly hosting-style options, suggest candidate as default.
  return "candidate";
}

function buildProfileUpdates(data: OnboardingData) {
  const targetRoles = [data.targetRole, data.targetIndustry]
    .map((s) => s.trim())
    .filter(Boolean);
  const skills = data.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    location: data.location.trim() || undefined,
    bio: data.bio.trim() || undefined,
    target_roles: targetRoles.length > 0 ? targetRoles : undefined,
    skills: skills.length > 0 ? skills : undefined,
    linkedin_url: data.linkedinUrl.trim() || undefined,
    role_type: deriveRoleType(data.helpSelected),
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Onboarding = () => {
  const { userId, refreshProfile } = useCurrentUser();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const update = (patch: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const toggleHelp = (h: string) =>
    update({
      helpSelected: data.helpSelected.includes(h)
        ? data.helpSelected.filter((x) => x !== h)
        : [...data.helpSelected, h],
    });

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    // Final step — persist profile
    setSaving(true);
    try {
      const uid = userId ?? "u1"; // safe fallback in mock mode
      const updates = buildProfileUpdates(data);
      await updateProfile(uid, updates);

      // Upload files if provided (non-blocking — failures are toasted, not thrown)
      if (data.resumeFile) {
        try {
          await uploadResume(uid, data.resumeFile);
        } catch {
          toast.error("Resume upload failed — you can try again from your profile.");
        }
      }
      if (data.videoFile) {
        try {
          await uploadVideoIntro(uid, data.videoFile);
        } catch {
          toast.error("Video intro upload failed — you can try again from your profile.");
        }
      }

      await refreshProfile();
      toast.success("You're in. Welcome to Hayy.", {
        description: "We'll line up your first warm intro soon.",
      });
      navigate("/app/dashboard");
    } catch {
      toast.error("Couldn't save your profile — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const back = () => setStep(Math.max(0, step - 1));
  const current = steps[step];

  return (
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
                <div key={s.n} className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                    i < step && "bg-primary text-primary-foreground",
                    i === step && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                    i > step && "bg-card border border-border text-muted-foreground",
                  )}>
                    {i < step ? <Check className="h-4 w-4" /> : s.n}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "h-0.5 flex-1 rounded-full transition-colors",
                      i < step ? "bg-primary" : "bg-border",
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-clay">
                Step {step + 1} of {steps.length}
              </p>
              <p className="text-xs text-muted-foreground">{Math.round(((step + 1) / steps.length) * 100)}% there</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-card rounded-3xl border border-border shadow-warm p-7 sm:p-10">
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">
              {current.label}
            </h1>
            <p className="mt-2 text-muted-foreground">{current.hint}</p>

            <div className="mt-7">
              {step === 0 && <StepCareerTarget data={data} update={update} />}
              {step === 1 && <StepStory data={data} update={update} />}
              {step === 2 && <StepHelp selected={data.helpSelected} onToggle={toggleHelp} />}
            </div>

            <div className="mt-9 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0 || saving}
                className={step === 0 ? "invisible" : ""}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button variant="hero" size="lg" onClick={next} disabled={saving}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
                ) : step === steps.length - 1 ? (
                  <>Finish onboarding<Sparkles className="h-4 w-4" /></>
                ) : (
                  <>Continue<ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Hayy is built on warm, real connections — not algorithms.
          </p>
        </div>
      </main>
    </div>
  );
};

/* ---------- Step components ---------- */

const fieldClass = "h-11 rounded-xl bg-cream border-border";

interface StepProps {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}

const StepCareerTarget = ({ data, update }: StepProps) => (
  <div className="space-y-5">
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="role">Target role</Label>
        <Input
          id="role"
          placeholder="e.g. Senior Product Manager"
          className={fieldClass}
          value={data.targetRole}
          onChange={(e) => update({ targetRole: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Target industry</Label>
        <Input
          id="industry"
          placeholder="e.g. Fintech, Health, B2B SaaS"
          className={fieldClass}
          value={data.targetIndustry}
          onChange={(e) => update({ targetIndustry: e.target.value })}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="companies">Target companies</Label>
      <Input
        id="companies"
        placeholder="Shopify, Amazon, Notion…"
        className={fieldClass}
        value={data.targetCompanies}
        onChange={(e) => update({ targetCompanies: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">Separate with commas. We'll match you to rooms hosted by people inside.</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, country"
          className={fieldClass}
          value={data.location}
          onChange={(e) => update({ location: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Experience level</Label>
        <Select
          value={data.experienceLevel}
          onValueChange={(v) => update({ experienceLevel: v })}
        >
          <SelectTrigger className={fieldClass}><SelectValue placeholder="Choose one" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="new-grad">New grad</SelectItem>
            <SelectItem value="early">Early career</SelectItem>
            <SelectItem value="mid">Mid career</SelectItem>
            <SelectItem value="switcher">Career switcher</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
);

const StepStory = ({ data, update }: StepProps) => (
  <div className="space-y-5">
    <div className="space-y-2">
      <Label htmlFor="bio">Short bio</Label>
      <Textarea
        id="bio"
        rows={4}
        placeholder="A few warm sentences about who you are, what you've built, and what you're chasing next."
        className="rounded-xl bg-cream border-border resize-none"
        value={data.bio}
        onChange={(e) => update({ bio: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">This is what hosts read before saying yes to a chat.</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="skills">Key skills</Label>
      <Input
        id="skills"
        placeholder="e.g. Strategy, SQL, brand storytelling"
        className={fieldClass}
        value={data.skills}
        onChange={(e) => update({ skills: e.target.value })}
      />
      <p className="text-xs text-muted-foreground">Separate with commas.</p>
    </div>

    <div className="space-y-2">
      <Label htmlFor="linkedin">LinkedIn URL</Label>
      <Input
        id="linkedin"
        type="url"
        placeholder="https://linkedin.com/in/yourname"
        className={fieldClass}
        value={data.linkedinUrl}
        onChange={(e) => update({ linkedinUrl: e.target.value })}
      />
    </div>

    <div className="grid sm:grid-cols-2 gap-4 pt-2">
      <UploadTile
        icon={Upload}
        title="Resume"
        hint="PDF or DOCX, up to 5MB"
        accept=".pdf,.doc,.docx"
        file={data.resumeFile}
        onFile={(f) => update({ resumeFile: f })}
      />
      <UploadTile
        icon={Video}
        title="Video intro"
        hint="Optional · 60 seconds"
        accept="video/*"
        file={data.videoFile}
        onFile={(f) => update({ videoFile: f })}
      />
    </div>
  </div>
);

interface UploadTileProps {
  icon: typeof Upload;
  title: string;
  hint: string;
  accept: string;
  file: File | null;
  onFile: (f: File) => void;
}

const UploadTile = ({ icon: Icon, title, hint, accept, file, onFile }: UploadTileProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl border border-dashed border-border bg-cream/60 p-5 text-left hover:border-primary/40 hover:bg-cream transition-colors group"
      >
        <span className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shadow-soft mb-3 transition-colors",
          file
            ? "bg-olive text-olive-foreground"
            : "bg-card text-clay group-hover:bg-primary group-hover:text-primary-foreground",
        )}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="font-medium text-foreground">{title}</p>
        {file ? (
          <p className="text-xs text-olive mt-0.5 truncate">{file.name}</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        )}
      </button>
    </>
  );
};

const StepHelp = ({ selected, onToggle }: { selected: string[]; onToggle: (h: string) => void }) => (
  <div>
    <div className="flex flex-wrap gap-2.5">
      {helpOptions.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-cream text-foreground/80 border-border hover:bg-sand hover:border-primary/30",
            )}
          >
            {active && <Check className="h-3.5 w-3.5 inline -mt-0.5 mr-1.5" />}
            {opt}
          </button>
        );
      })}
    </div>

    <div className="mt-7 rounded-2xl bg-cream border border-border p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-clay">Heads up</p>
      <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
        Hayy is built on real conversations. We'll only suggest hosts who can actually help with what you picked.
      </p>
    </div>
  </div>
);

export default Onboarding;
