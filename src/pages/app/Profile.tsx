/**
 * Profile — public/editorial page styled per the redesign Profile mock
 * (frontend-new/hayy/project/components/more-screens.jsx → Profile).
 *
 * Two modes share the same route /app/profile:
 *   - VIEW mode: editorial story layout — identity row with online dot,
 *     clay-bordered quote, two-paragraph bio with inline metric, tag Pills,
 *     owner CTAs (Edit / Share / Preview), career timeline (renders only
 *     when DB-backed), testimonial (renders only when DB-backed), stats
 *     sidebar (intros / rooms / reply time), signature-room card,
 *     availability calendar, "happy to help with" host-settings list.
 *   - EDIT mode: ProfileEdit mock layout from extra-screens.jsx — header
 *     strip with View / Save Btns, then three 200px/1fr sections:
 *     Identity (photo + name/pronouns/headline/location), Your story
 *     (quote + bio + tag chip editor), What you'll help with (toggle
 *     rows backed by host_settings — only rendered for referral hosts).
 *
 * All API wiring uses existing functions from src/lib/api/*; no new
 * helpers added. Sections that have no backing data (career timeline,
 * testimonial, mutual connections) are hidden until the relevant tables
 * exist (Phase 3).
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, Pill } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  uploadVideoIntro,
} from "@/lib/api/profiles";
import { getHostSettings, upsertHostSettings } from "@/lib/api/hostSettings";
import { getReferralRequests } from "@/lib/api/referrals";
import { getRooms } from "@/lib/api/rooms";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-lg-hy)",
  padding: 18,
  boxShadow: "var(--shadow-soft)",
};

const cardCreamStyle: CSSProperties = {
  background: "var(--cream)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-lg-hy)",
  padding: 22,
};

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
    {hint && (
      <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>{hint}</span>
    )}
  </label>
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
      }}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TONES: ("clay" | "olive" | "sand" | "dark")[] = [
  "clay",
  "olive",
  "sand",
  "dark",
];

function avgReplyTimeLabel(): string {
  // Average-reply-time requires aggregating timestamps across messages —
  // not worth a client-side fetch on every Profile mount. Until we add a
  // dedicated RPC, render an em-dash; the metric still has a slot in the
  // layout so the redesign rhythm holds.
  return "—";
}

function formatNextRoomSlot(startsAt: string): string {
  const d = new Date(startsAt);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Profile = () => {
  const { userId, refreshProfile } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => (userId ? getProfile(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });

  const { data: hostSettings } = useQuery({
    queryKey: ["host-settings", userId],
    queryFn: () => (userId ? getHostSettings(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });

  const { data: referrals = [] } = useQuery({
    queryKey: ["profile-referrals", userId],
    queryFn: () => getReferralRequests(userId ?? undefined),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["profile-rooms"],
    queryFn: getRooms,
    staleTime: 60_000,
  });

  // -------------------------------------------------------------------------
  // Derived metrics
  // -------------------------------------------------------------------------

  const intrsMade = useMemo(
    () =>
      referrals.filter(
        (r) =>
          (r.status === "accepted" || r.status === "completed") &&
          // Only count where current user was the HOST (intros they made for others)
          r.hostId === userId,
      ).length,
    [referrals, userId],
  );

  const hostedRooms = useMemo(
    () => rooms.filter((r) => r.hostId === userId),
    [rooms, userId],
  );

  // "Signature room" = most recently scheduled room hosted by this user
  const signatureRoom = useMemo(() => {
    if (hostedRooms.length === 0) return null;
    return [...hostedRooms].sort(
      (a, b) =>
        new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    )[0];
  }, [hostedRooms]);

  // Availability heat-map for the next 7 days. We can only really mark days
  // I've hosting a room on as "open"; everything else is "off". When a real
  // booking model exists, "taken" becomes a third state.
  const availability = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMs = 86_400_000;
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const startOfWeek = new Date(today);
    const offset = (today.getDay() + 6) % 7; // Monday as start
    startOfWeek.setDate(today.getDate() - offset);

    return labels.map((label, i) => {
      const date = new Date(startOfWeek.getTime() + i * dayMs);
      const hasRoom = hostedRooms.some((r) => {
        const start = new Date(r.startsAt);
        return (
          start.getFullYear() === date.getFullYear() &&
          start.getMonth() === date.getMonth() &&
          start.getDate() === date.getDate()
        );
      });
      return {
        d: label,
        n: date.getDate(),
        s: hasRoom ? ("open" as const) : ("off" as const),
      };
    });
  }, [hostedRooms]);

  const isHost = profile?.role_type === "referral_host";

  // -------------------------------------------------------------------------
  // Edit mode state
  // -------------------------------------------------------------------------

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editName, setEditName] = useState("");
  const [editHeadline, setEditHeadline] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPronouns, setEditPronouns] = useState("");
  const [editQuote, setEditQuote] = useState(""); // referral_goals
  const [editBio, setEditBio] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  // Tags = target_roles + skills (deduped). On save we split back: first 4
  // go to target_roles, rest to skills — a heuristic. The redesign uses one
  // chip field; the DB has two columns. This is intentionally lossy and
  // documented inline.
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");

  // Host availability toggles
  const [editCoffee, setEditCoffee] = useState(true);
  const [editReferrals, setEditReferrals] = useState(true);
  const [editResume, setEditResume] = useState(false);

  // Uploads
  const [resumeUploading, setResumeUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Seed edit fields when entering edit mode
  useEffect(() => {
    if (profile && editing) {
      setEditName(profile.full_name ?? "");
      setEditHeadline(profile.headline ?? "");
      setEditLocation(profile.location ?? "");
      setEditPronouns(profile.pronouns ?? "");
      setEditQuote(profile.referral_goals ?? "");
      setEditBio(profile.bio ?? "");
      setEditLinkedin(profile.linkedin_url ?? "");
      const tags = Array.from(
        new Set([
          ...(profile.target_roles ?? []),
          ...(profile.skills ?? []),
        ]),
      );
      setEditTags(tags);
      setTagDraft("");
    }
  }, [profile, editing]);

  useEffect(() => {
    if (hostSettings && editing) {
      setEditCoffee(hostSettings.open_to_coffee_chats);
      setEditReferrals(hostSettings.open_to_referrals);
      setEditResume(hostSettings.open_to_resume_feedback);
    }
  }, [hostSettings, editing]);

  const removeTag = (t: string) =>
    setEditTags((prev) => prev.filter((x) => x !== t));
  const addTagDraft = () => {
    const t = tagDraft.trim();
    if (!t) return;
    setEditTags((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setTagDraft("");
  };

  const saveEdit = async () => {
    if (!userId) {
      toast.error("Not signed in.");
      return;
    }
    setSaving(true);
    try {
      // Split tags: first 4 → target_roles, rest → skills (heuristic)
      const targetRoles = editTags.slice(0, 4);
      const skills = editTags.slice(4);

      await updateProfile(userId, {
        full_name: editName.trim() || undefined,
        headline: editHeadline.trim() || undefined,
        location: editLocation.trim() || undefined,
        pronouns: editPronouns.trim() || undefined,
        referral_goals: editQuote.trim() || null,
        bio: editBio.trim() || undefined,
        linkedin_url: editLinkedin.trim() || undefined,
        target_roles: targetRoles,
        skills: skills,
      });

      if (isHost) {
        await upsertHostSettings(userId, {
          open_to_coffee_chats: editCoffee,
          open_to_referrals: editReferrals,
          open_to_resume_feedback: editResume,
          monthly_capacity: hostSettings?.monthly_capacity ?? 3,
          roles_supported: hostSettings?.roles_supported ?? [],
          industries_supported: hostSettings?.industries_supported ?? [],
        });
      }

      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["host-settings", userId] });
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't save profile — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!userId) return;
    setResumeUploading(true);
    try {
      await uploadResume(userId, file);
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Resume uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        /bucket|storage/i.test(msg)
          ? "Resume upload unavailable — storage bucket not configured."
          : "Resume upload failed.",
      );
    } finally {
      setResumeUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!userId) return;
    setVideoUploading(true);
    try {
      await uploadVideoIntro(userId, file);
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Video intro uploaded");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        /bucket|storage/i.test(msg)
          ? "Video upload unavailable — storage bucket not configured."
          : "Video upload failed.",
      );
    } finally {
      setVideoUploading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!userId) return;
    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(userId, file);
      setAvatarPreview(url);
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile photo updated");
    } catch (err) {
      setAvatarPreview(null);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(
        /bucket|storage/i.test(msg)
          ? "Avatar upload unavailable — create the 'avatars' storage bucket."
          : "Photo upload failed.",
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render guards
  // -------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="hy" style={{ padding: 32 }}>
        <p
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--ink-mute)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Loading profile…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hy" style={{ padding: 32 }}>
        <p style={{ color: "var(--ink-soft)" }}>Couldn't load profile.</p>
      </div>
    );
  }

  const fullName = profile?.full_name || "Your profile";
  const headline = profile?.headline || "";
  const location = profile?.location || "";
  const allTags = computeTags(profile);
  const tags = editing ? editTags : allTags;
  const openToCoffee = hostSettings?.open_to_coffee_chats ?? false;

  // -------------------------------------------------------------------------
  // EDIT MODE — ProfileEdit redesign layout
  // -------------------------------------------------------------------------

  if (editing) {
    return (
      <div
        className="hy"
        style={{
          background: "var(--bg)",
          color: "var(--ink)",
          margin: "-24px -16px",
          padding: 0,
        }}
      >
        {/* Header strip */}
        <div
          style={{
            padding: "28px 48px 18px",
            borderBottom: "1px solid var(--line-soft)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={sectionLabelStyle}>Edit profile</p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 38px)",
                marginTop: 6,
                fontFamily: "var(--display)",
                lineHeight: 1.1,
              }}
            >
              How others <span className="display-italic">meet</span> you on Hayy.
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="ghost" size="md" onClick={() => setEditing(false)} disabled={saving}>
              View public profile
            </Btn>
            <Btn kind="primary" size="md" onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Btn>
          </div>
        </div>

        <div
          style={{
            padding: "24px 48px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Identity section */}
          <EditSection
            title="Identity"
            description="Your name, photo, and the line under your face."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {avatarPreview || profile?.avatar_url ? (
                  <img
                    src={avatarPreview ?? profile!.avatar_url!}
                    alt={fullName}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid var(--paper)",
                    }}
                  />
                ) : (
                  <Avatar name={fullName} size={64} tone="dark" />
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleAvatarUpload(f);
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <Btn
                    kind="soft"
                    size="md"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? "Uploading…" : "Upload new"}
                  </Btn>
                  <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                    JPG or PNG · max 4MB
                  </span>
                </div>
              </div>

              <div
                className="edit-row"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <Field label="Display name">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={inputStyle}
                    disabled={saving}
                  />
                </Field>
                <Field label="Pronouns">
                  <input
                    value={editPronouns}
                    onChange={(e) => setEditPronouns(e.target.value)}
                    placeholder="she / her"
                    style={inputStyle}
                    disabled={saving}
                  />
                </Field>
              </div>

              <div
                className="edit-row"
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              >
                <Field label="Headline">
                  <input
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    placeholder="Senior Product Designer"
                    style={inputStyle}
                    disabled={saving}
                  />
                </Field>
                <Field label="Location">
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, country"
                    style={inputStyle}
                    disabled={saving}
                  />
                </Field>
              </div>

              <Field label="LinkedIn URL">
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  style={inputStyle}
                  disabled={saving}
                />
              </Field>
            </div>
          </EditSection>

          {/* Your story */}
          <EditSection
            title="Your story"
            description="The opening line and a short bio. Stays editorial."
            divider
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field
                label="Quote (one line)"
                hint="What you'd want a stranger to read first."
              >
                <textarea
                  rows={2}
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  placeholder="I rebuilt my career from scratch in a new country — and I want to make that path shorter for the next person."
                  style={{
                    ...inputStyle,
                    fontFamily: "var(--display)",
                    fontStyle: "italic",
                    fontSize: 16,
                    lineHeight: 1.45,
                    resize: "none",
                  }}
                  disabled={saving}
                />
              </Field>

              <Field label="Bio">
                <textarea
                  rows={5}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="A few warm sentences about who you are."
                  style={{
                    ...inputStyle,
                    resize: "none",
                    lineHeight: 1.6,
                    minHeight: 100,
                  }}
                  disabled={saving}
                />
              </Field>

              <Field label="Tags">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    background: "var(--paper)",
                    alignItems: "center",
                  }}
                >
                  {editTags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 4px 4px 10px",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--cream)",
                        border: "1px solid var(--line-soft)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: "var(--ink-soft)",
                      }}
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        aria-label={`Remove ${t}`}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--ink-mute)",
                          fontSize: 14,
                          padding: "0 6px",
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagDraft}
                    onChange={(e) => setTagDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTagDraft();
                      } else if (
                        e.key === "Backspace" &&
                        !tagDraft &&
                        editTags.length > 0
                      ) {
                        removeTag(editTags[editTags.length - 1]);
                      }
                    }}
                    onBlur={addTagDraft}
                    placeholder={editTags.length === 0 ? "Add a tag…" : "+ Add"}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      padding: "4px 8px",
                      border: "none",
                      outline: "none",
                      fontSize: 13,
                      color: "var(--ink)",
                      background: "transparent",
                      fontFamily: "var(--sans)",
                    }}
                    disabled={saving}
                  />
                </div>
              </Field>
            </div>
          </EditSection>

          {/* What you'll help with — referral hosts only */}
          {isHost && (
            <EditSection
              title="What you'll help with"
              description="What others can ask of you. Be specific."
              divider
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(
                  [
                    {
                      key: "coffee" as const,
                      label: "Coffee chats",
                      desc: "Short intro conversations with candidates.",
                      on: editCoffee,
                      set: setEditCoffee,
                    },
                    {
                      key: "referrals" as const,
                      label: "Referrals",
                      desc: "Submitting a formal referral to your ATS.",
                      on: editReferrals,
                      set: setEditReferrals,
                    },
                    {
                      key: "resume" as const,
                      label: "Resume reviews",
                      desc: "Same-week feedback on a CV.",
                      on: editResume,
                      set: setEditResume,
                    },
                  ]
                ).map((row) => (
                  <div
                    key={row.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "var(--paper)",
                      border: "1px solid var(--line-soft)",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>
                        {row.label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--ink-mute)",
                          marginTop: 2,
                          margin: 0,
                        }}
                      >
                        {row.desc}
                      </p>
                    </div>
                    <Toggle on={row.on} onChange={row.set} disabled={saving} />
                  </div>
                ))}
              </div>
            </EditSection>
          )}

          {/* Documents (resume/video) — owner-only convenience */}
          <EditSection
            title="Documents"
            description="What hosts and recruiters can read about you."
            divider
          >
            <div
              className="edit-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <UploadTile
                label="Resume"
                hint="PDF or DOCX, up to 5MB"
                accept=".pdf,.doc,.docx"
                uploading={resumeUploading}
                hasFile={!!profile?.resume_url}
                refEl={resumeInputRef}
                onFile={handleResumeUpload}
              />
              <UploadTile
                label="Video intro"
                hint="Optional · 60s"
                accept="video/*"
                uploading={videoUploading}
                hasFile={!!profile?.video_intro_url}
                refEl={videoInputRef}
                onFile={handleVideoUpload}
              />
            </div>
          </EditSection>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .edit-row { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW MODE — Profile redesign layout
  // -------------------------------------------------------------------------

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "40px clamp(18px, 4vw, 64px) 32px",
      }}
    >
      <div
        className="profile-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.45fr 1fr",
          gap: 56,
        }}
      >
        {/* LEFT — the story */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            minWidth: 0,
          }}
        >
          {/* Identity row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative" }}>
              {avatarPreview || profile?.avatar_url ? (
                <img
                  src={avatarPreview ?? profile!.avatar_url!}
                  alt={fullName}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Avatar name={fullName} size={76} tone="dark" />
              )}
              {/* Online dot — olive when open to coffee chats, neutral otherwise */}
              <span
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 16,
                  height: 16,
                  borderRadius: 99,
                  background: openToCoffee ? "var(--olive)" : "var(--ink-mute)",
                  border: "3px solid var(--paper)",
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  color: openToCoffee ? "var(--olive)" : "var(--ink-mute)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {openToCoffee ? "Open to coffee chats" : "Not currently open"}
              </p>
              <h1
                style={{
                  fontSize: 40,
                  marginTop: 2,
                  lineHeight: 1.05,
                  fontFamily: "var(--display)",
                }}
              >
                {fullName}
              </h1>
              {(headline || location) && (
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--ink-soft)",
                    marginTop: 4,
                  }}
                >
                  {[headline, location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {/* Quote-led intro */}
          <blockquote
            style={{
              borderLeft: "3px solid var(--clay)",
              padding: "6px 0 6px 20px",
              fontFamily: "var(--display)",
              fontSize: 30,
              lineHeight: 1.25,
              fontWeight: 400,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {profile?.referral_goals ? (
              <span style={{ fontStyle: "italic" }}>
                "{profile.referral_goals}"
              </span>
            ) : (
              <span
                style={{
                  fontStyle: "italic",
                  color: "var(--ink-mute)",
                }}
              >
                Add a one-line story so hosts know why you're here.
              </span>
            )}
          </blockquote>

          {/* Bio paragraphs */}
          {profile?.bio ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                fontSize: 15,
                color: "var(--ink-soft)",
                lineHeight: 1.65,
                maxWidth: 600,
              }}
            >
              <p style={{ margin: 0 }}>{profile.bio}</p>
              {intrsMade > 0 && (
                <p style={{ margin: 0 }}>
                  I've made{" "}
                  <span style={{ color: "var(--clay)", fontWeight: 600 }}>
                    {intrsMade} warm intro{intrsMade === 1 ? "" : "s"}
                  </span>{" "}
                  through Hayy.
                </p>
              )}
            </div>
          ) : (
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-mute)",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              No bio yet — tap "Edit profile" to write one.
            </p>
          )}

          {/* Tag pills */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tags.slice(0, 12).map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          )}

          {/* Owner CTAs */}
          <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
            <Btn
              kind="primary"
              size="lg"
              icon={I.shake}
              onClick={() => setEditing(true)}
            >
              Edit profile
            </Btn>
            <Btn
              kind="soft"
              size="lg"
              icon={I.link}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                toast.success("Profile link copied");
              }}
            >
              Share
            </Btn>
            <Btn
              kind="ghost"
              size="lg"
              onClick={() => toast("Visitor preview coming soon")}
            >
              View as visitor
            </Btn>
          </div>

          {/* Documents (only on the owner's view, since redesign doesn't include
              this — but we need a place to manage uploads when not editing) */}
          {(profile?.resume_url || profile?.video_intro_url) && (
            <div style={cardStyle}>
              <p style={sectionLabelStyle}>Documents</p>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--clay)",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "var(--cream)",
                      border: "1px solid var(--line-soft)",
                    }}
                  >
                    {I.reactN} View resume
                  </a>
                )}
                {profile?.video_intro_url && (
                  <a
                    href={profile.video_intro_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--clay)",
                      textDecoration: "none",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "var(--cream)",
                      border: "1px solid var(--line-soft)",
                    }}
                  >
                    {I.spark} View video intro
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — editorial sidebar */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minWidth: 0,
          }}
        >
          {/* Stats — vertical, editorial */}
          <div style={cardCreamStyle}>
            {[
              {
                n: intrsMade,
                l: "Warm intros made through Hayy",
              },
              {
                n: hostedRooms.length,
                l: "Rooms hosted",
              },
              {
                n: avgReplyTimeLabel(),
                l: "Average time to reply",
              },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  paddingTop: i === 0 ? 0 : 14,
                  borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 32,
                    lineHeight: 1,
                    fontWeight: 500,
                    color: "var(--clay)",
                    flex: "none",
                    margin: 0,
                  }}
                >
                  {s.n}
                </p>
                <p
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          {/* Signature room — only if user hosts something */}
          {signatureRoom && (
            <div
              style={{
                padding: 18,
                background:
                  "linear-gradient(135deg, var(--clay), var(--clay-2))",
                color: "var(--paper)",
                borderRadius: "var(--radius-lg-hy)",
                boxShadow: "var(--shadow-warm)",
              }}
            >
              <p
                className="mono"
                style={{
                  fontSize: 10,
                  opacity: 0.8,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Signature room
              </p>
              <h3
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 20,
                  marginTop: 6,
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                {signatureRoom.title}
              </h3>
              {signatureRoom.description && (
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    opacity: 0.9,
                    lineHeight: 1.5,
                  }}
                >
                  {signatureRoom.description.length > 120
                    ? `${signatureRoom.description.slice(0, 120)}…`
                    : signatureRoom.description}
                </p>
              )}
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, opacity: 0.85 }}
                >
                  {signatureRoom.status === "live"
                    ? "Live now"
                    : `Next · ${formatNextRoomSlot(signatureRoom.startsAt)}`}
                </span>
                <Link
                  to={`/app/rooms/${signatureRoom.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Btn
                    kind="soft"
                    size="md"
                    style={{
                      background: "var(--paper)",
                      color: "var(--ink)",
                      borderColor: "transparent",
                    }}
                  >
                    {signatureRoom.status === "live" ? "Join" : "RSVP"}
                  </Btn>
                </Link>
              </div>
            </div>
          )}

          {/* Availability calendar */}
          <div style={cardStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <p style={{ ...sectionLabelStyle, fontSize: 10 }}>This week</p>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: "var(--ink-mute)",
                  letterSpacing: ".06em",
                }}
              >
                {availability.filter((d) => d.s === "open").length} day
                {availability.filter((d) => d.s === "open").length === 1
                  ? ""
                  : "s"}{" "}
                open
              </span>
            </div>
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 6,
              }}
            >
              {availability.map((d) => {
                const cell =
                  d.s === "open"
                    ? {
                        bg: "var(--paper)",
                        fg: "var(--ink)",
                        border: "var(--olive)",
                      }
                    : {
                        bg: "var(--cream)",
                        fg: "var(--ink-mute)",
                        border: "transparent",
                      };
                return (
                  <div
                    key={d.d}
                    style={{
                      padding: "8px 0",
                      borderRadius: 10,
                      textAlign: "center",
                      background: cell.bg,
                      color: cell.fg,
                      border: `1.5px solid ${cell.border}`,
                    }}
                  >
                    <p
                      className="mono"
                      style={{
                        fontSize: 9,
                        opacity: 0.7,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      {d.d}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--display)",
                        fontSize: 16,
                        fontWeight: 500,
                        marginTop: 2,
                        margin: 0,
                      }}
                    >
                      {d.n}
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                fontSize: 11,
                color: "var(--ink-mute)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    border: "1.5px solid var(--olive)",
                  }}
                />
                Hosting
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: "var(--cream)",
                    border: "1px solid var(--line-soft)",
                  }}
                />
                Free
              </span>
            </div>
          </div>

          {/* Happy to help with — only renders for referral hosts with settings */}
          {isHost && hostSettings && (
            <div style={cardStyle}>
              <p style={{ ...sectionLabelStyle, fontSize: 10 }}>
                Happy to help with
              </p>
              <ul
                style={{
                  marginTop: 10,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  {
                    enabled: hostSettings.open_to_coffee_chats,
                    label: `Coffee chats (${hostSettings.monthly_capacity} / month)`,
                  },
                  {
                    enabled: hostSettings.open_to_referrals,
                    label: "Referrals to your ATS",
                  },
                  {
                    enabled: hostSettings.open_to_resume_feedback,
                    label: "Resume review",
                  },
                ]
                  .filter((row) => row.enabled)
                  .map((row) => (
                    <li
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "var(--olive)" }}>{I.check}</span>
                      {row.label}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Linked accounts — small editorial card */}
          {profile?.linkedin_url && (
            <div style={cardStyle}>
              <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Linked</p>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--clay)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {I.link} LinkedIn profile
              </a>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .profile-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------------
// EditSection — the 200px / 1fr two-column layout from ProfileEdit mock
// ---------------------------------------------------------------------------

const EditSection = ({
  title,
  description,
  divider,
  children,
}: {
  title: string;
  description: string;
  divider?: boolean;
  children: ReactNode;
}) => (
  <section
    style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 40,
      paddingTop: divider ? 22 : 0,
      borderTop: divider ? "1px solid var(--line-soft)" : "none",
    }}
    className="edit-section"
  >
    <div>
      <h2
        style={{
          fontSize: 20,
          lineHeight: 1.1,
          fontFamily: "var(--display)",
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          marginTop: 6,
          fontSize: 12,
          color: "var(--ink-mute)",
        }}
      >
        {description}
      </p>
    </div>
    {children}
    <style>{`
      @media (max-width: 720px) {
        .edit-section { grid-template-columns: 1fr !important; gap: 14px !important; }
      }
    `}</style>
  </section>
);

// ---------------------------------------------------------------------------
// UploadTile — used in the Documents section of edit mode
// ---------------------------------------------------------------------------

const UploadTile = ({
  label,
  hint,
  accept,
  uploading,
  hasFile,
  onFile,
  refEl,
}: {
  label: string;
  hint: string;
  accept: string;
  uploading: boolean;
  hasFile: boolean;
  onFile: (f: File) => void;
  refEl: React.RefObject<HTMLInputElement>;
}) => (
  <>
    <input
      ref={refEl}
      type="file"
      accept={accept}
      style={{ display: "none" }}
      onChange={(e) => {
        const f = e.target.files?.[0];
        if (f) onFile(f);
      }}
    />
    <button
      type="button"
      onClick={() => refEl.current?.click()}
      disabled={uploading}
      style={{
        textAlign: "left",
        padding: 14,
        borderRadius: 14,
        border: `1.5px dashed ${hasFile ? "var(--olive)" : "var(--line)"}`,
        background: "var(--cream)",
        cursor: uploading ? "not-allowed" : "pointer",
        fontFamily: "var(--sans)",
        color: "var(--ink)",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: hasFile ? "var(--olive)" : "var(--paper)",
            color: hasFile ? "var(--paper)" : "var(--clay)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--line-soft)",
          }}
        >
          {I.reactN}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{label}</p>
          <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: "2px 0 0" }}>
            {uploading
              ? "Uploading…"
              : hasFile
                ? "Uploaded ✓ — click to replace"
                : hint}
          </p>
        </div>
      </div>
    </button>
  </>
);

// ---------------------------------------------------------------------------
// computeTags — combine target_roles + skills, dedup case-insensitively,
// preserve original order. NOT a hook (plain function) so it can safely be
// called below the component's early returns.
// ---------------------------------------------------------------------------

function computeTags(
  profile: {
    target_roles?: string[] | null;
    skills?: string[] | null;
  } | null | undefined,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of profile?.target_roles ?? []) {
    const key = (t ?? "").toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(t);
    }
  }
  for (const t of profile?.skills ?? []) {
    const key = (t ?? "").toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(t);
    }
  }
  return out;
}

export default Profile;
