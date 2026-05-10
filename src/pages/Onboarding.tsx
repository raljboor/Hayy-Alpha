/**
 * Onboarding — ported from the redesign Onboarding mock
 * (frontend-new/hayy/project/components/more-screens.jsx → Onboarding).
 *
 * Preserves the existing three role-based flows verbatim:
 *   - job_seeker → 3-step career / story / help form (with resume + video upload)
 *   - referral_host → 2-step host profile + availability form
 *   - recruiter → 2-step company / hiring focus form
 *
 * Re-skinned with the redesign idiom:
 *   - .hy/.hy-bg-hero wrapper, redesign CSS vars, Fraunces display headings
 *   - top header: inline Hayy logo · STEP X / Y · progress bar · Skip
 *   - two-pane main area (form left / contextual preview right) on desktop;
 *     single-column on mobile
 *   - native <input>/<textarea>/<select> styled with redesign tokens
 *   - primitives.tsx Btn / Avatar / LiveTag / I (no Lovable shadcn imports)
 *
 * src/lib/api/profiles + hostSettings calls are preserved exactly.
 */

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, LiveTag } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { updateProfile, uploadResume, uploadVideoIntro } from "@/lib/api/profiles";
import { upsertHostSettings } from "@/lib/api/hostSettings";
import { getRooms } from "@/lib/api/rooms";
import type { RoleType } from "@/types/models";

// ---------------------------------------------------------------------------
// Shared styling primitives (redesign-idiomatic native form fields)
// ---------------------------------------------------------------------------

const inputBase: CSSProperties = {
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

const fieldHintStyle: CSSProperties = {
  fontSize: 11,
  color: "var(--ink-mute)",
  margin: 0,
};

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  color: "var(--clay)",
  letterSpacing: ".12em",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-warm)",
  padding: 24,
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span style={fieldLabelStyle}>{label}</span>
    {children}
    {hint && <span style={fieldHintStyle}>{hint}</span>}
  </label>
);

const TextInput = ({
  value,
  onChange,
  placeholder,
  type,
  disabled,
  mono,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  mono?: boolean;
}) => (
  <input
    type={type ?? "text"}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    style={{ ...inputBase, fontFamily: mono ? "var(--mono)" : "var(--sans)" }}
  />
);

const TextArea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    disabled={disabled}
    style={{ ...inputBase, resize: "none", lineHeight: 1.45 }}
  />
);

const SelectInput = ({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    style={{
      ...inputBase,
      appearance: "none",
      WebkitAppearance: "none",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%23998f86' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1.5l5 5 5-5'/></svg>\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 14px center",
      paddingRight: 40,
      color: value ? "var(--ink)" : "var(--ink-mute)",
    }}
  >
    {placeholder && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

const Toggle = ({
  on,
  onChange,
  disabled,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => !disabled && onChange(!on)}
    disabled={disabled}
    style={{
      width: 36,
      height: 22,
      borderRadius: 99,
      padding: 2,
      flex: "none",
      background: on ? "var(--clay)" : "var(--line)",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: on ? "flex-end" : "flex-start",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background .2s",
    }}
  >
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 99,
        background: "var(--paper)",
        boxShadow: "0 1px 3px rgba(0,0,0,.15)",
        transition: "all .2s",
      }}
    />
  </button>
);

const UploadTile = ({
  title,
  hint,
  accept,
  file,
  onFile,
  iconKind,
}: {
  title: string;
  hint: string;
  accept: string;
  file: File | null;
  onFile: (f: File) => void;
  iconKind: "doc" | "video";
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };
  return (
    <>
      <input ref={ref} type="file" accept={accept} onChange={handleChange} style={{ display: "none" }} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        style={{
          textAlign: "left",
          padding: 18,
          borderRadius: 16,
          border: `1.5px dashed ${file ? "var(--olive)" : "var(--line)"}`,
          background: "var(--cream)",
          cursor: "pointer",
          fontFamily: "var(--sans)",
          color: "var(--ink)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 12,
            background: file ? "var(--olive)" : "var(--paper)",
            color: file ? "var(--paper)" : "var(--clay)",
            boxShadow: "var(--shadow-soft)",
            marginBottom: 10,
          }}
        >
          {iconKind === "doc" ? I.reactN : I.spark}
        </span>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{title}</p>
        {file ? (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--olive)", overflow: "hidden", textOverflow: "ellipsis" }}>
            {file.name}
          </p>
        ) : (
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--ink-mute)" }}>{hint}</p>
        )}
      </button>
    </>
  );
};

// ---------------------------------------------------------------------------
// Onboarding shell — header + two-pane layout + footer nav
// ---------------------------------------------------------------------------

interface OnboardingShellProps {
  steps: { label: string; hint: string }[];
  currentStep: number;
  saving: boolean;
  canBack: boolean;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  isFinal: boolean;
  finalLabel: string;
  sectionLabel: string;
  headline: ReactNode;
  description?: ReactNode;
  formContent: ReactNode;
  preview: ReactNode;
}

const OnboardingShell = ({
  steps,
  currentStep,
  saving,
  canBack,
  onBack,
  onNext,
  onSkip,
  isFinal,
  finalLabel,
  sectionLabel,
  headline,
  description,
  formContent,
  preview,
}: OnboardingShellProps) => {
  const progressPct = ((currentStep + 1) / steps.length) * 100;
  const stepNumber = String(currentStep + 1).padStart(2, "0");
  const totalNumber = String(steps.length).padStart(2, "0");

  return (
    <div
      className="hy hy-bg-hero"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px clamp(18px, 4vw, 56px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "var(--clay)",
              color: "var(--paper)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            h
          </span>
          <span style={{ fontFamily: "var(--display)", fontSize: 18 }}>Hayy</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: ".08em",
            }}
          >
            STEP {stepNumber} / {totalNumber}
          </span>
          <div
            style={{
              width: 160,
              height: 4,
              borderRadius: 99,
              background: "var(--line)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                borderRadius: 99,
                background: "var(--clay)",
                transition: "width .3s ease",
              }}
            />
          </div>
          <button
            type="button"
            onClick={onSkip}
            disabled={saving}
            style={{
              fontSize: 12,
              color: "var(--ink-soft)",
              background: "transparent",
              border: "none",
              cursor: saving ? "not-allowed" : "pointer",
              padding: 0,
              fontFamily: "var(--sans)",
            }}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Two-pane main area */}
      <div
        style={{
          flex: 1,
          padding: "0 clamp(18px, 4vw, 56px) 40px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "start",
        }}
        className="onboarding-grid"
      >
        <div>
          <p style={sectionLabelStyle}>{sectionLabel}</p>
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 56px)",
              marginTop: 12,
              lineHeight: 1.0,
            }}
          >
            {headline}
          </h1>
          {description && (
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "var(--ink-soft)",
                maxWidth: 560,
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          )}

          <p style={{ marginTop: 22, fontSize: 13, color: "var(--ink-mute)" }}>
            {steps[currentStep].hint}
          </p>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
            {formContent}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 10, alignItems: "center" }}>
            {canBack && (
              <Btn kind="ghost" size="lg" onClick={onBack} disabled={saving}>
                Back
              </Btn>
            )}
            <Btn
              kind="primary"
              size="lg"
              onClick={onNext}
              disabled={saving}
              iconRight={I.arrow}
              style={{ minWidth: 180, justifyContent: "center" }}
            >
              {saving ? "Saving…" : isFinal ? finalLabel : "Continue"}
            </Btn>
          </div>
        </div>

        {/* Preview pane — desktop only */}
        <aside className="onboarding-preview" style={{ position: "sticky", top: 24 }}>
          {preview}
        </aside>
      </div>

      {/*
        Tailwind doesn't have a native CSS-in-JS responsive escape hatch
        for ad-hoc grid layouts; the redesign collapses the right preview
        on mobile, so we inject a tiny scoped style block here.
      */}
      <style>{`
        @media (max-width: 880px) {
          .onboarding-grid { grid-template-columns: 1fr !important; }
          .onboarding-preview { display: none; }
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Profile preview card — used inside the right pane to mirror what the user
// will look like after onboarding. No fixture data; everything is driven
// by what the user has typed into the form so far.
// ---------------------------------------------------------------------------

const ProfilePreviewCard = ({
  name,
  headline,
  location,
  bio,
  skills,
  toneIdx = 0,
}: {
  name: string;
  headline?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  toneIdx?: number;
}) => {
  const tones = ["clay", "olive", "sand", "dark"] as const;
  const tone = tones[toneIdx % tones.length];
  return (
    <div style={cardStyle}>
      <p
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--clay)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
        }}
      >
        Profile preview
      </p>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 14 }}>
        <Avatar name={name || "You"} size={56} tone={tone} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3
            style={{
              fontFamily: "var(--display)",
              fontSize: 22,
              lineHeight: 1.15,
              fontWeight: 500,
            }}
          >
            {name || "Your name"}
          </h3>
          {(headline || location) && (
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-soft)" }}>
              {[headline, location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
      {bio && (
        <p
          style={{
            marginTop: 16,
            fontSize: 14,
            color: "var(--ink)",
            lineHeight: 1.5,
            maxHeight: 110,
            overflow: "hidden",
          }}
        >
          {bio}
        </p>
      )}
      {skills && skills.length > 0 && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {skills.slice(0, 8).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--cream)",
                border: "1px solid var(--line-soft)",
                color: "var(--ink-soft)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
      <p
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "var(--ink-mute)",
          fontStyle: "italic",
        }}
      >
        This is what hosts and recruiters see before saying yes.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Matched-rooms preview card — used at the end of the job-seeker flow.
// Pulls the next 3 upcoming rooms via the existing getRooms() API.
// ---------------------------------------------------------------------------

const MatchedRoomsPreview = () => {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["onboarding-suggested-rooms"],
    queryFn: getRooms,
    staleTime: 60_000,
  });

  const top = rooms.slice(0, 3);
  const tones = ["clay", "olive", "sand"] as const;

  return (
    <div style={cardStyle}>
      <p
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--clay)",
          letterSpacing: ".12em",
          textTransform: "uppercase",
        }}
      >
        Based on your answers
      </p>
      <h3
        style={{
          fontFamily: "var(--display)",
          fontSize: 22,
          marginTop: 8,
          lineHeight: 1.15,
          fontWeight: 500,
        }}
      >
        {top.length > 0
          ? `You'd fit beautifully in ${top.length} room${top.length === 1 ? "" : "s"} this week.`
          : "We're still pulling rooms. Check back in a moment."}
      </h3>

      {isLoading && (
        <p style={{ marginTop: 12, fontSize: 13, color: "var(--ink-mute)" }}>Loading matches…</p>
      )}

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {top.map((r, i) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 12,
              borderRadius: 14,
              border: "1px solid var(--line-soft)",
              background: "var(--cream)",
            }}
          >
            <Avatar name={r.company || r.title} size={32} tone={tones[i % tones.length]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.title}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--ink-mute)",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.company} · {new Date(r.startsAt).toLocaleDateString()}
              </p>
            </div>
            {r.status === "live" && <LiveTag>Live</LiveTag>}
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "var(--ink-mute)",
          fontStyle: "italic",
        }}
      >
        You can change these any time. We don't share your goals with anyone.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Job Seeker flow (3 steps)
// ---------------------------------------------------------------------------

interface JobSeekerData {
  targetRole: string;
  targetIndustry: string;
  targetCompanies: string;
  location: string;
  experienceLevel: string;
  bio: string;
  skills: string;
  linkedinUrl: string;
  referralGoals: string;
  resumeFile: File | null;
  videoFile: File | null;
  helpSelected: string[];
}

const JS_EMPTY: JobSeekerData = {
  targetRole: "",
  targetIndustry: "",
  targetCompanies: "",
  location: "",
  experienceLevel: "",
  bio: "",
  skills: "",
  linkedinUrl: "",
  referralGoals: "",
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

const JS_STEPS = [
  {
    label: "Career target",
    hint: "Tell us what you're aiming for. (Step 1 of 3)",
  },
  {
    label: "Your story",
    hint: "Share who you are beyond bullet points. (Step 2 of 3)",
  },
  {
    label: "What help do you want?",
    hint: "We'll match you to the right rooms and hosts. (Step 3 of 3)",
  },
];

const experienceOptions = [
  { value: "student", label: "Student" },
  { value: "new-grad", label: "New grad" },
  { value: "early", label: "Early career" },
  { value: "mid", label: "Mid career" },
  { value: "switcher", label: "Career switcher" },
];

const JobSeekerOnboarding = ({
  userId,
  fullName,
  refreshProfile,
  onDone,
  onSkip,
}: {
  userId: string;
  fullName: string;
  refreshProfile: () => Promise<void>;
  onDone: () => void;
  onSkip: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<JobSeekerData>(JS_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<JobSeekerData>) => setData((prev) => ({ ...prev, ...p }));
  const toggle = (h: string) =>
    update({
      helpSelected: data.helpSelected.includes(h)
        ? data.helpSelected.filter((x) => x !== h)
        : [...data.helpSelected, h],
    });

  const next = async () => {
    if (step < JS_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    try {
      await updateProfile(userId, {
        location: data.location.trim() || undefined,
        bio: data.bio.trim() || undefined,
        referral_goals: data.referralGoals.trim() || null,
        target_roles: [data.targetRole, data.targetIndustry]
          .map((s) => s.trim())
          .filter(Boolean),
        skills: data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin_url: data.linkedinUrl.trim() || undefined,
      });
      if (data.resumeFile) {
        try {
          await uploadResume(userId, data.resumeFile);
        } catch {
          toast.error("Resume upload failed — try again from your profile.");
        }
      }
      if (data.videoFile) {
        try {
          await uploadVideoIntro(userId, data.videoFile);
        } catch {
          toast.error("Video upload failed — try again from your profile.");
        }
      }
      await refreshProfile();
      toast.success("You're in. Welcome to Hayy.", {
        description: "We'll line up your first warm intro soon.",
      });
      onDone();
    } catch {
      toast.error("Couldn't save your profile — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const skillsList = useMemo(
    () =>
      data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [data.skills],
  );

  const sectionLabel =
    step === 0 ? "Why you're here" : step === 1 ? "Your story" : "What help do you want";
  const headline =
    step === 0 ? (
      <>
        What kind of <span className="display-italic">conversation</span>
        <br />
        would change things for you?
      </>
    ) : step === 1 ? (
      <>
        A few warm <span className="display-italic">sentences</span>
        <br />
        about who you are.
      </>
    ) : (
      <>
        Pick the help <span className="display-italic">you want</span>.
      </>
    );
  const description =
    step === 0
      ? "Tell us where you're aiming so we can match you to the rooms and hosts inside those companies."
      : step === 1
        ? "Hosts read this before saying yes. Be honest, specific, and show your shape."
        : "We'll only suggest hosts who can actually help with what you pick.";

  const preview =
    step === 2 ? (
      <MatchedRoomsPreview />
    ) : (
      <ProfilePreviewCard
        name={fullName}
        headline={data.targetRole || data.targetIndustry || "Job seeker"}
        location={data.location}
        bio={data.bio}
        skills={skillsList}
      />
    );

  let formContent: ReactNode;
  if (step === 0) {
    formContent = (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Field label="Target role">
            <TextInput
              value={data.targetRole}
              onChange={(v) => update({ targetRole: v })}
              placeholder="e.g. Senior Product Manager"
              disabled={saving}
            />
          </Field>
          <Field label="Target industry">
            <TextInput
              value={data.targetIndustry}
              onChange={(v) => update({ targetIndustry: v })}
              placeholder="e.g. Fintech, Health, B2B SaaS"
              disabled={saving}
            />
          </Field>
        </div>
        <Field label="Target companies" hint="Separate with commas.">
          <TextInput
            value={data.targetCompanies}
            onChange={(v) => update({ targetCompanies: v })}
            placeholder="Shopify, Amazon, Notion…"
            disabled={saving}
          />
        </Field>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Field label="Location">
            <TextInput
              value={data.location}
              onChange={(v) => update({ location: v })}
              placeholder="City, country"
              disabled={saving}
            />
          </Field>
          <Field label="Experience level">
            <SelectInput
              value={data.experienceLevel}
              onChange={(v) => update({ experienceLevel: v })}
              options={experienceOptions}
              placeholder="Choose one"
              disabled={saving}
            />
          </Field>
        </div>
      </>
    );
  } else if (step === 1) {
    formContent = (
      <>
        <Field
          label="Short bio"
          hint="This is what hosts read before saying yes to a chat."
        >
          <TextArea
            value={data.bio}
            onChange={(v) => update({ bio: v })}
            placeholder="A few warm sentences about who you are, what you've built, and what you're chasing next."
            rows={4}
            disabled={saving}
          />
        </Field>
        <Field label="Key skills" hint="Separate with commas.">
          <TextInput
            value={data.skills}
            onChange={(v) => update({ skills: v })}
            placeholder="e.g. Strategy, SQL, brand storytelling"
            disabled={saving}
          />
        </Field>
        <Field label="Referral goals">
          <TextArea
            value={data.referralGoals}
            onChange={(v) => update({ referralGoals: v })}
            placeholder="The kinds of warm intros, companies, or roles you'd love to access."
            rows={2}
            disabled={saving}
          />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput
            value={data.linkedinUrl}
            onChange={(v) => update({ linkedinUrl: v })}
            placeholder="https://linkedin.com/in/yourname"
            type="url"
            disabled={saving}
          />
        </Field>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 4,
          }}
        >
          <UploadTile
            title="Resume"
            hint="PDF or DOCX, up to 5MB"
            accept=".pdf,.doc,.docx"
            file={data.resumeFile}
            onFile={(f) => update({ resumeFile: f })}
            iconKind="doc"
          />
          <UploadTile
            title="Video intro"
            hint="Optional · 60 seconds"
            accept="video/*"
            file={data.videoFile}
            onFile={(f) => update({ videoFile: f })}
            iconKind="video"
          />
        </div>
      </>
    );
  } else {
    formContent = (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {helpOptions.map((opt) => {
            const active = data.helpSelected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                disabled={saving}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 14,
                  fontWeight: 500,
                  background: active ? "var(--clay)" : "var(--paper)",
                  color: active ? "var(--paper)" : "var(--ink)",
                  border: `1.5px solid ${active ? "var(--clay)" : "var(--line)"}`,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "var(--sans)",
                  transition: "all .15s",
                  boxShadow: active ? "var(--shadow-soft)" : "none",
                }}
              >
                {active && I.check}
                {opt}
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: 16,
            background: "var(--cream)",
            border: "1px solid var(--line-soft)",
          }}
        >
          <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Heads up</p>
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            We'll only suggest hosts who can actually help with what you picked.
          </p>
        </div>
      </>
    );
  }

  return (
    <OnboardingShell
      steps={JS_STEPS}
      currentStep={step}
      saving={saving}
      canBack={step > 0}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={next}
      onSkip={onSkip}
      isFinal={step === JS_STEPS.length - 1}
      finalLabel="Finish onboarding"
      sectionLabel={sectionLabel}
      headline={headline}
      description={description}
      formContent={formContent}
      preview={preview}
    />
  );
};

// ---------------------------------------------------------------------------
// Referral Host flow (2 steps)
// ---------------------------------------------------------------------------

interface HostData {
  headline: string;
  location: string;
  bio: string;
  skills: string;
  linkedinUrl: string;
  rolesSupported: string;
  industriesSupported: string;
  monthlyCapacity: string;
  coffeeChats: boolean;
  referrals: boolean;
  resumeFeedback: boolean;
}

const HOST_EMPTY: HostData = {
  headline: "",
  location: "",
  bio: "",
  skills: "",
  linkedinUrl: "",
  rolesSupported: "",
  industriesSupported: "",
  monthlyCapacity: "3",
  coffeeChats: true,
  referrals: true,
  resumeFeedback: false,
};

const HOST_STEPS = [
  {
    label: "Your host profile",
    hint: "Tell candidates who you are and where you work.",
  },
  {
    label: "Availability",
    hint: "Set what kinds of help you're open to offering.",
  },
];

const monthlyCapacityOptions = ["1", "2", "3", "5", "8", "Unlimited"].map((v) => ({
  value: v,
  label: v === "Unlimited" ? "Unlimited" : `${v} per month`,
}));

const HostOnboarding = ({
  userId,
  fullName,
  refreshProfile,
  onDone,
  onSkip,
}: {
  userId: string;
  fullName: string;
  refreshProfile: () => Promise<void>;
  onDone: () => void;
  onSkip: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<HostData>(HOST_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<HostData>) => setData((prev) => ({ ...prev, ...p }));

  const next = async () => {
    if (step < HOST_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    try {
      await updateProfile(userId, {
        headline: data.headline.trim() || undefined,
        location: data.location.trim() || undefined,
        bio: data.bio.trim() || undefined,
        skills: data.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin_url: data.linkedinUrl.trim() || undefined,
        role_type: "referral_host",
      });
      await upsertHostSettings(userId, {
        monthly_capacity: parseInt(data.monthlyCapacity, 10) || 3,
        open_to_coffee_chats: data.coffeeChats,
        open_to_referrals: data.referrals,
        open_to_resume_feedback: data.resumeFeedback,
        roles_supported: data.rolesSupported
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        industries_supported: data.industriesSupported
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      await refreshProfile();
      toast.success("Host profile ready!", {
        description: "Candidates can now discover you in rooms.",
      });
      onDone();
    } catch {
      toast.error("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const skillsList = useMemo(
    () =>
      data.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [data.skills],
  );

  const sectionLabel = step === 0 ? "Hosts welcome" : "Open up";
  const headline =
    step === 0 ? (
      <>
        Help candidates <span className="display-italic">find</span> you.
      </>
    ) : (
      <>
        What are you <span className="display-italic">open to</span>?
      </>
    );
  const description =
    step === 0
      ? "Hosts who share their context get 4× more thoughtful messages. Tell candidates where you work and what you can speak to."
      : "Switch on the kinds of help you're up for. You can change this any time.";

  const preview =
    step === 0 ? (
      <ProfilePreviewCard
        name={fullName}
        headline={data.headline || "Referral host"}
        location={data.location}
        bio={data.bio}
        skills={skillsList}
        toneIdx={1}
      />
    ) : (
      <div style={cardStyle}>
        <p
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--clay)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Availability summary
        </p>
        <h3
          style={{
            fontFamily: "var(--display)",
            fontSize: 22,
            marginTop: 8,
            lineHeight: 1.15,
            fontWeight: 500,
          }}
        >
          Open to {[
            data.coffeeChats && "coffee chats",
            data.referrals && "referrals",
            data.resumeFeedback && "resume feedback",
          ]
            .filter(Boolean)
            .join(", ") || "—"}.
        </h3>
        <p style={{ marginTop: 14, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          Capacity: <strong style={{ color: "var(--ink)" }}>{data.monthlyCapacity}</strong>{" "}
          per month.
        </p>
        {data.rolesSupported && (
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-soft)" }}>
            Roles: {data.rolesSupported}
          </p>
        )}
        {data.industriesSupported && (
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-soft)" }}>
            Industries: {data.industriesSupported}
          </p>
        )}
      </div>
    );

  let formContent: ReactNode;
  if (step === 0) {
    formContent = (
      <>
        <Field label="Headline">
          <TextInput
            value={data.headline}
            onChange={(v) => update({ headline: v })}
            placeholder="e.g. Senior PM @ Shopify"
            disabled={saving}
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={data.location}
            onChange={(v) => update({ location: v })}
            placeholder="City, country"
            disabled={saving}
          />
        </Field>
        <Field label="About you">
          <TextArea
            value={data.bio}
            onChange={(v) => update({ bio: v })}
            placeholder="Why do you host rooms? What kinds of candidates do you want to help?"
            rows={4}
            disabled={saving}
          />
        </Field>
        <Field label="Skills you can speak to" hint="Separate with commas.">
          <TextInput
            value={data.skills}
            onChange={(v) => update({ skills: v })}
            placeholder="e.g. PM, Operations, Go-to-market"
            disabled={saving}
          />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput
            value={data.linkedinUrl}
            onChange={(v) => update({ linkedinUrl: v })}
            placeholder="https://linkedin.com/in/yourname"
            type="url"
            disabled={saving}
          />
        </Field>
      </>
    );
  } else {
    formContent = (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              key: "coffeeChats" as const,
              label: "Open to coffee chats",
              desc: "Short intro conversations with candidates",
            },
            {
              key: "referrals" as const,
              label: "Open to referrals",
              desc: "Submitting a formal referral to your ATS",
            },
            {
              key: "resumeFeedback" as const,
              label: "Open to resume feedback",
              desc: "Reviewing and commenting on resumes",
            },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid var(--line-soft)",
                background: "var(--paper)",
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, color: "var(--ink-mute)", margin: 0 }}>{desc}</p>
              </div>
              <Toggle on={data[key]} onChange={(v) => update({ [key]: v })} disabled={saving} />
            </div>
          ))}
        </div>
        <Field label="Monthly capacity">
          <SelectInput
            value={data.monthlyCapacity}
            onChange={(v) => update({ monthlyCapacity: v })}
            options={monthlyCapacityOptions}
            disabled={saving}
          />
        </Field>
        <Field label="Roles you support">
          <TextInput
            value={data.rolesSupported}
            onChange={(v) => update({ rolesSupported: v })}
            placeholder="e.g. PM, Operations, Engineering"
            disabled={saving}
          />
        </Field>
        <Field label="Industries">
          <TextInput
            value={data.industriesSupported}
            onChange={(v) => update({ industriesSupported: v })}
            placeholder="e.g. Tech, Finance, Healthcare"
            disabled={saving}
          />
        </Field>
      </>
    );
  }

  return (
    <OnboardingShell
      steps={HOST_STEPS}
      currentStep={step}
      saving={saving}
      canBack={step > 0}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={next}
      onSkip={onSkip}
      isFinal={step === HOST_STEPS.length - 1}
      finalLabel="Launch host profile"
      sectionLabel={sectionLabel}
      headline={headline}
      description={description}
      formContent={formContent}
      preview={preview}
    />
  );
};

// ---------------------------------------------------------------------------
// Recruiter flow (2 steps)
// ---------------------------------------------------------------------------

interface RecruiterData {
  headline: string;
  companyName: string;
  recruiterTitle: string;
  hiringFocus: string;
  departmentsHiring: string;
  locationsHiring: string;
  companyDescription: string;
  linkedinUrl: string;
}

const REC_EMPTY: RecruiterData = {
  headline: "",
  companyName: "",
  recruiterTitle: "",
  hiringFocus: "",
  departmentsHiring: "",
  locationsHiring: "",
  companyDescription: "",
  linkedinUrl: "",
};

const REC_STEPS = [
  { label: "Your company", hint: "Tell candidates who you're hiring for." },
  {
    label: "Hiring focus",
    hint: "What roles and locations are you actively sourcing?",
  },
];

const RecruiterOnboarding = ({
  userId,
  fullName,
  refreshProfile,
  onDone,
  onSkip,
}: {
  userId: string;
  fullName: string;
  refreshProfile: () => Promise<void>;
  onDone: () => void;
  onSkip: () => void;
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RecruiterData>(REC_EMPTY);
  const [saving, setSaving] = useState(false);
  const update = (p: Partial<RecruiterData>) => setData((prev) => ({ ...prev, ...p }));

  const next = async () => {
    if (step < REC_STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSaving(true);
    try {
      await updateProfile(
        userId,
        {
          headline: data.recruiterTitle
            ? `${data.recruiterTitle} @ ${data.companyName}`
            : data.companyName || undefined,
          bio: data.companyDescription.trim() || undefined,
          linkedin_url: data.linkedinUrl.trim() || undefined,
          role_type: "recruiter",
          // Extended recruiter fields (migration 004)
          company_name: data.companyName.trim() || undefined,
          recruiter_title: data.recruiterTitle.trim() || undefined,
          hiring_focus: data.hiringFocus
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          departments_hiring: data.departmentsHiring
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          locations_hiring: data.locationsHiring
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          company_description: data.companyDescription.trim() || undefined,
        } as Record<string, unknown> as Parameters<typeof updateProfile>[1],
      );
      await refreshProfile();
      toast.success("Recruiter profile ready!", {
        description: "Start creating rooms to attract warm candidates.",
      });
      onDone();
    } catch {
      toast.error("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const sectionLabel = step === 0 ? "Hiring honestly" : "Hiring focus";
  const headline =
    step === 0 ? (
      <>
        Tell candidates <span className="display-italic">who</span>
        <br />
        you're hiring for.
      </>
    ) : (
      <>
        What are you <span className="display-italic">sourcing</span>?
      </>
    );
  const description =
    step === 0
      ? "Recruiters who share their company context get more honest engagement. Candidates can opt in or out of your rooms."
      : "Add the roles and locations you're actively sourcing — this powers candidate matching in your rooms.";

  const preview =
    step === 0 ? (
      <ProfilePreviewCard
        name={fullName}
        headline={
          data.recruiterTitle && data.companyName
            ? `${data.recruiterTitle} @ ${data.companyName}`
            : data.companyName || "Recruiter"
        }
        bio={data.companyDescription}
        toneIdx={2}
      />
    ) : (
      <div style={cardStyle}>
        <p
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--clay)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Hiring snapshot
        </p>
        <h3
          style={{
            fontFamily: "var(--display)",
            fontSize: 22,
            marginTop: 8,
            lineHeight: 1.15,
            fontWeight: 500,
          }}
        >
          {data.companyName || "Your company"}
          {data.hiringFocus && (
            <>
              {" "}
              is hiring for{" "}
              <span className="display-italic">
                {data.hiringFocus.split(",").slice(0, 3).map((s) => s.trim()).filter(Boolean).join(", ")}
              </span>
            </>
          )}
          .
        </h3>
        {data.locationsHiring && (
          <p style={{ marginTop: 12, fontSize: 14, color: "var(--ink-soft)" }}>
            Locations:{" "}
            <strong style={{ color: "var(--ink)" }}>{data.locationsHiring}</strong>
          </p>
        )}
        {data.departmentsHiring && (
          <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-soft)" }}>
            Departments: {data.departmentsHiring}
          </p>
        )}
        <p
          style={{
            marginTop: 14,
            padding: "12px 14px",
            borderRadius: 14,
            background: "var(--cream)",
            border: "1px solid var(--line-soft)",
            fontSize: 13,
            color: "var(--ink-soft)",
            lineHeight: 1.5,
          }}
        >
          After setup, create your first hiring room from the Recruiter Dashboard
          to start attracting warm candidates.
        </p>
      </div>
    );

  let formContent: ReactNode;
  if (step === 0) {
    formContent = (
      <>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Field label="Company name">
            <TextInput
              value={data.companyName}
              onChange={(v) => update({ companyName: v })}
              placeholder="e.g. Shopify"
              disabled={saving}
            />
          </Field>
          <Field label="Your title">
            <TextInput
              value={data.recruiterTitle}
              onChange={(v) => update({ recruiterTitle: v })}
              placeholder="e.g. Talent Partner"
              disabled={saving}
            />
          </Field>
        </div>
        <Field label="Company description">
          <TextArea
            value={data.companyDescription}
            onChange={(v) => update({ companyDescription: v })}
            placeholder="What does your company do? Why would a candidate be excited to join?"
            rows={4}
            disabled={saving}
          />
        </Field>
        <Field label="LinkedIn / company URL">
          <TextInput
            value={data.linkedinUrl}
            onChange={(v) => update({ linkedinUrl: v })}
            placeholder="https://linkedin.com/company/yourcompany"
            type="url"
            disabled={saving}
          />
        </Field>
      </>
    );
  } else {
    formContent = (
      <>
        <Field label="Hiring focus" hint="Separate with commas.">
          <TextInput
            value={data.hiringFocus}
            onChange={(v) => update({ hiringFocus: v })}
            placeholder="e.g. Product, Operations, Engineering"
            disabled={saving}
          />
        </Field>
        <Field label="Departments / teams hiring">
          <TextInput
            value={data.departmentsHiring}
            onChange={(v) => update({ departmentsHiring: v })}
            placeholder="e.g. Growth, Platform, Data"
            disabled={saving}
          />
        </Field>
        <Field label="Locations hiring">
          <TextInput
            value={data.locationsHiring}
            onChange={(v) => update({ locationsHiring: v })}
            placeholder="e.g. Toronto, Remote, NYC"
            disabled={saving}
          />
        </Field>
      </>
    );
  }

  return (
    <OnboardingShell
      steps={REC_STEPS}
      currentStep={step}
      saving={saving}
      canBack={step > 0}
      onBack={() => setStep(Math.max(0, step - 1))}
      onNext={next}
      onSkip={onSkip}
      isFinal={step === REC_STEPS.length - 1}
      finalLabel="Launch recruiter profile"
      sectionLabel={sectionLabel}
      headline={headline}
      description={description}
      formContent={formContent}
      preview={preview}
    />
  );
};

// ---------------------------------------------------------------------------
// Loading & router
// ---------------------------------------------------------------------------

const OnboardingLoading = () => (
  <div
    className="hy hy-bg-hero"
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <p
      className="mono"
      style={{
        fontSize: 12,
        color: "var(--ink-mute)",
        letterSpacing: ".12em",
        textTransform: "uppercase",
      }}
    >
      Loading your invite…
    </p>
  </div>
);

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId, profile, refreshProfile } = useCurrentUser();

  const urlRole = searchParams.get("role");
  const effectiveRole: RoleType = (urlRole ?? profile?.role_type ?? "job_seeker") as RoleType;

  const onDone = () => navigate("/app/dashboard");
  const onSkip = () => navigate("/app/dashboard");
  const fullName = profile?.full_name ?? "";

  if (!userId) return <OnboardingLoading />;

  if (effectiveRole === "referral_host") {
    return (
      <HostOnboarding
        userId={userId}
        fullName={fullName}
        refreshProfile={refreshProfile}
        onDone={onDone}
        onSkip={onSkip}
      />
    );
  }
  if (effectiveRole === "recruiter") {
    return (
      <RecruiterOnboarding
        userId={userId}
        fullName={fullName}
        refreshProfile={refreshProfile}
        onDone={onDone}
        onSkip={onSkip}
      />
    );
  }
  return (
    <JobSeekerOnboarding
      userId={userId}
      fullName={fullName}
      refreshProfile={refreshProfile}
      onDone={onDone}
      onSkip={onSkip}
    />
  );
};

export default Onboarding;
