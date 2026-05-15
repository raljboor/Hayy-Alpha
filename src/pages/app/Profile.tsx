/**
 * Profile — ported from the ProfileRoster mock
 * (frontend-new/hayy/project/components/profile-redesign.jsx → ProfileRoster).
 *
 * The mock explicitly replaces the older story-led Profile in more-screens.jsx.
 * It's a LinkedIn × Polywork × Geneva direction:
 *   - Banner card with warm gradient wash, avatar overlapping the bottom edge,
 *     name + role + badge pills, mode-aware action buttons, and a 4-cell stat
 *     strip across the bottom of the card.
 *   - Tab navigation: Rooms / Path / Referrals / Vouches / About / Insights.
 *     Insights is owner-only.
 *   - Body is a two-column grid (1.5fr / 1fr) per tab.
 *
 * The route /app/profile is always the owner's view, so this component
 * defaults to mode="owner". The viewer branch is already wired in case a
 * future /app/profile/:id route is added.
 *
 * Edit mode (triggered by the owner's "Edit profile" Btn) uses the
 * ProfileEdit mock from extra-screens.jsx — three editorial sections
 * (Identity / Your story / What you'll help with) plus a Documents block,
 * with a chip-style tag editor and host-settings toggles.
 *
 * Real-data wiring vs DB gaps
 * ─────────────────────────────
 * Wired to existing src/lib/api/* :
 *   - profile, host_settings, referrals (incoming + outgoing), rooms (hosted)
 * Stats — owner mode:
 *   - Pending requests = referrals where I'm host & status === pending
 *   - Warm intros made = referrals where I'm host & status in
 *     (accepted|completed)
 *   - Drafts             = "—" (no drafts model)
 *   - Profile views      = "—" (no analytics yet)
 * Stats — viewer mode (kept ready for /app/profile/:id):
 *   - Warm intros, rooms hosted, vouches ("—"), avg reply ("—")
 * Tabs that need backing tables not yet shipped surface honest empty
 * states with a one-line explanation, rather than fake content:
 *   - Path     → needs a career_history column / table
 *   - Vouches  → needs the vouches table (Phase 3 plan)
 *   - Insights → needs analytics aggregation
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import {
  getReferralRequests,
  getReferralThreads,
} from "@/lib/api/referrals";
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

const monoLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: ".08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-lg-hy)",
  padding: 18,
  boxShadow: "var(--shadow-soft)",
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

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

type TabKey = "rooms" | "path" | "referrals" | "vouches" | "about" | "insights";

interface TabDef {
  key: TabKey;
  label: string;
  ownerOnly?: boolean;
}

const TABS: TabDef[] = [
  { key: "rooms", label: "Rooms" },
  { key: "path", label: "Path" },
  { key: "referrals", label: "Referrals" },
  { key: "vouches", label: "Vouches" },
  { key: "about", label: "About" },
  { key: "insights", label: "Insights", ownerOnly: true },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function yearsOnHayy(createdAt: string | null | undefined): number {
  if (!createdAt) return 0;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return 0;
  const ms = Date.now() - created;
  return Math.max(0, Math.floor(ms / (365.25 * 24 * 3600 * 1000)));
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatNextRoomSlot(startsAt: string): string {
  return new Date(startsAt)
    .toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .toUpperCase();
}

function computeTags(profile: {
  target_roles?: string[] | null;
  skills?: string[] | null;
} | null | undefined): string[] {
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Profile = () => {
  const navigate = useNavigate();
  const { userId, refreshProfile } = useCurrentUser();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // The /app/profile route is always the owner's view in this app — there's
  // no /app/profile/:id yet. The component still supports viewer mode so
  // when that route ships, the same component can render either way.
  // `actualOwner` = is this the signed-in user's own profile (used to gate
  // owner-only controls like Edit/Preview).
  // `previewMode` = owner has clicked "Preview as visitor" to see their
  // own page as someone else would. While previewing, the page renders the
  // visitor branch of every section (stats, CTAs, right rail) and surfaces
  // the "Preview mode" banner with an Exit button.
  const actualOwner = true;
  const [previewMode, setPreviewMode] = useState(false);
  const isOwner = actualOwner && !previewMode;

  // Tab state — synced to URL so the section is shareable / refresh-stable.
  const rawTab = searchParams.get("tab") as TabKey | null;
  const tab: TabKey =
    rawTab && TABS.some((t) => t.key === rawTab && (!t.ownerOnly || isOwner))
      ? rawTab
      : "rooms";
  const setTab = (k: TabKey) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (k === "rooms") next.delete("tab");
      else next.set("tab", k);
      return next;
    });

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

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

  const { data: threads = [] } = useQuery({
    queryKey: ["profile-threads", userId],
    queryFn: () => getReferralThreads(userId ?? undefined),
    enabled: !!userId,
    staleTime: 60_000,
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["profile-rooms"],
    queryFn: getRooms,
    staleTime: 60_000,
  });

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------

  const hostedRooms = useMemo(
    () => rooms.filter((r) => r.hostId === userId),
    [rooms, userId],
  );

  const pendingRequests = useMemo(
    () =>
      referrals.filter(
        (r) =>
          r.status === "pending" && (r.hostId === userId || r.candidateId === userId),
      ),
    [referrals, userId],
  );

  const warmIntros = useMemo(
    () =>
      referrals.filter(
        (r) =>
          (r.status === "accepted" || r.status === "completed") &&
          r.hostId === userId,
      ).length,
    [referrals, userId],
  );

  const unreadMessages = useMemo(
    () => threads.filter((t) => t.unread).length,
    [threads],
  );

  // "Signature room" = most recent room the user hosts.
  const signatureRoom = useMemo(() => {
    if (hostedRooms.length === 0) return null;
    return [...hostedRooms].sort(
      (a, b) =>
        new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    )[0];
  }, [hostedRooms]);

  const tags = computeTags(profile);
  const openToCoffee = hostSettings?.open_to_coffee_chats ?? false;
  const openToReferrals = hostSettings?.open_to_referrals ?? false;
  const openToResume = hostSettings?.open_to_resume_feedback ?? false;
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
  const [editQuote, setEditQuote] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagDraft, setTagDraft] = useState("");
  const [editCoffee, setEditCoffee] = useState(true);
  const [editReferrals, setEditReferrals] = useState(true);
  const [editResume, setEditResume] = useState(false);

  const [resumeUploading, setResumeUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && editing) {
      setEditName(profile.full_name ?? "");
      setEditHeadline(profile.headline ?? "");
      setEditLocation(profile.location ?? "");
      setEditPronouns(profile.pronouns ?? "");
      setEditQuote(profile.referral_goals ?? "");
      setEditBio(profile.bio ?? "");
      setEditLinkedin(profile.linkedin_url ?? "");
      setEditTags(
        Array.from(
          new Set([
            ...(profile.target_roles ?? []),
            ...(profile.skills ?? []),
          ]),
        ),
      );
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

  // -------------------------------------------------------------------------
  // Render guards
  // -------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="hy" style={{ padding: 32 }}>
        <p className="mono" style={monoLabelStyle}>
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

  // -------------------------------------------------------------------------
  // EDIT MODE — ProfileEdit redesign layout
  // -------------------------------------------------------------------------

  const fullName = profile?.full_name || "Your profile";
  const headline = profile?.headline || "";
  const location = profile?.location || "";

  if (editing) {
    return (
      <EditView
        profile={profile}
        isHost={isHost}
        saving={saving}
        onCancel={() => setEditing(false)}
        onSave={saveEdit}
        editName={editName}
        setEditName={setEditName}
        editHeadline={editHeadline}
        setEditHeadline={setEditHeadline}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        editPronouns={editPronouns}
        setEditPronouns={setEditPronouns}
        editQuote={editQuote}
        setEditQuote={setEditQuote}
        editBio={editBio}
        setEditBio={setEditBio}
        editLinkedin={editLinkedin}
        setEditLinkedin={setEditLinkedin}
        editTags={editTags}
        tagDraft={tagDraft}
        setTagDraft={setTagDraft}
        addTagDraft={addTagDraft}
        removeTag={removeTag}
        editCoffee={editCoffee}
        setEditCoffee={setEditCoffee}
        editReferrals={editReferrals}
        setEditReferrals={setEditReferrals}
        editResume={editResume}
        setEditResume={setEditResume}
        avatarUploading={avatarUploading}
        avatarPreview={avatarPreview}
        avatarInputRef={avatarInputRef}
        onAvatarChange={(f) => void handleAvatarUpload(f)}
        resumeUploading={resumeUploading}
        videoUploading={videoUploading}
        resumeInputRef={resumeInputRef}
        videoInputRef={videoInputRef}
        onResumeFile={handleResumeUpload}
        onVideoFile={handleVideoUpload}
      />
    );
  }

  // -------------------------------------------------------------------------
  // VIEW MODE — ProfileRoster layout
  // -------------------------------------------------------------------------

  const yearsActive = yearsOnHayy(profile?.created_at);

  const visibleTabs = TABS.filter((t) => !t.ownerOnly || isOwner);

  const tabBadgeCounts: Partial<Record<TabKey, number>> = {
    rooms: hostedRooms.length,
    referrals: warmIntros,
  };

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
      {/* Header card */}
      <div
        style={{
          padding: "24px clamp(18px, 4vw, 48px) 0",
        }}
      >
        <div
          className="hy-card"
          style={{
            padding: 0,
            overflow: "hidden",
            borderRadius: "var(--radius-xl)",
          }}
        >
          {/* Warm wash banner */}
          <div
            className="profile-banner"
            style={{
              height: 110,
              background:
                "radial-gradient(ellipse at 80% 60%, hsl(28 55% 86% / .8), transparent 55%)," +
                "radial-gradient(ellipse at 0% 40%, hsl(12 50% 80% / .55), transparent 60%)," +
                "var(--cream)",
              borderBottom: "1px solid var(--line-soft)",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 14,
                right: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px 5px 8px",
                borderRadius: 999,
                background: "var(--paper)",
                border: `1px solid ${openToCoffee ? "var(--olive)" : "var(--line)"}`,
                fontSize: 12,
                fontWeight: 500,
                color: openToCoffee ? "var(--olive)" : "var(--ink-mute)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 99,
                  background: openToCoffee ? "var(--olive)" : "var(--ink-mute)",
                }}
              />
              {openToCoffee ? "Open to coffee chats" : "Not currently open"}
              {isOwner && (
                <span style={{ color: "var(--ink-mute)", fontSize: 11 }}>
                  · edit
                </span>
              )}
            </span>
            {actualOwner && previewMode && (
              <span
                style={{
                  position: "absolute",
                  top: 14,
                  left: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "5px 6px 5px 10px",
                  borderRadius: 999,
                  background: "var(--ink)",
                  color: "var(--paper)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                }}
              >
                Preview mode · this is how visitors see you
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  style={{
                    background: "var(--paper)",
                    color: "var(--ink)",
                    border: "none",
                    borderRadius: 999,
                    padding: "2px 10px",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                    letterSpacing: ".04em",
                  }}
                >
                  EXIT
                </button>
              </span>
            )}
          </div>

          {/* Identity block — avatar overlaps the banner edge */}
          <div
            className="profile-identity"
            style={{
              padding: "0 28px 24px",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 24,
              alignItems: "flex-end",
            }}
          >
            <div style={{ marginTop: -42 }}>
              <span
                style={{
                  display: "inline-block",
                  borderRadius: 999,
                  border: "4px solid var(--paper)",
                  background: "var(--paper)",
                }}
              >
                {avatarPreview || profile?.avatar_url ? (
                  <img
                    src={avatarPreview ?? profile!.avatar_url!}
                    alt={fullName}
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Avatar name={fullName} size={96} tone="dark" />
                )}
              </span>
            </div>

            <div style={{ minWidth: 0, paddingTop: 18 }}>
              <h1
                style={{
                  fontSize: 34,
                  lineHeight: 1.05,
                  fontFamily: "var(--display)",
                  margin: 0,
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
              {/* Badge pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {hostedRooms.length > 0 && (
                  <BadgePill clay>Host</BadgePill>
                )}
                {openToReferrals && <BadgePill>Refers</BadgePill>}
                {openToResume && <BadgePill>Reviews resumes</BadgePill>}
                {yearsActive > 0 && (
                  <BadgePill>
                    {yearsActive} yr{yearsActive === 1 ? "" : "s"} on Hayy
                  </BadgePill>
                )}
              </div>
            </div>

            <div
              className="profile-cta"
              style={{
                paddingTop: 18,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              {isOwner ? (
                <>
                  <Btn
                    kind="ghost"
                    size="md"
                    onClick={() => setPreviewMode(true)}
                  >
                    Preview as visitor
                  </Btn>
                  <Btn
                    kind="soft"
                    size="md"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success("Profile link copied");
                    }}
                  >
                    Share profile
                  </Btn>
                  <Btn kind="primary" size="md" onClick={() => setEditing(true)}>
                    Edit profile
                  </Btn>
                </>
              ) : (
                <>
                  <Btn kind="ghost" size="md">
                    Save
                  </Btn>
                  <Btn
                    kind="soft"
                    size="md"
                    icon={I.msg}
                    onClick={() => navigate("/app/messages")}
                  >
                    Message
                  </Btn>
                  <Btn
                    kind="primary"
                    size="md"
                    icon={I.shake}
                    onClick={() => navigate("/app/referrals")}
                  >
                    Request a referral
                  </Btn>
                </>
              )}
            </div>
          </div>

          {/* Stat strip across the bottom of the header card */}
          <div
            className="profile-stat-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              padding: "16px 28px",
              borderTop: "1px solid var(--line-soft)",
              background: "var(--cream)",
            }}
          >
            {(isOwner
              ? [
                  {
                    n: String(pendingRequests.length),
                    l: "Pending requests",
                    c: "var(--clay)",
                  },
                  { n: String(warmIntros), l: "Warm intros" },
                  { n: "—", l: "Drafts" },
                  { n: "—", l: "Profile views · 30d" },
                ]
              : [
                  {
                    n: String(warmIntros),
                    l: "Warm intros",
                    c: "var(--clay)",
                  },
                  { n: String(hostedRooms.length), l: "Rooms hosted" },
                  { n: "—", l: "Vouches" },
                  { n: "—", l: "Avg reply" },
                ]
            ).map((s, i) => (
              <div
                key={s.l}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  paddingLeft: i > 0 ? 18 : 0,
                  borderLeft: i > 0 ? "1px solid var(--line-soft)" : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 24,
                    lineHeight: 1,
                    fontWeight: 500,
                    color: s.c || "var(--ink)",
                    margin: 0,
                  }}
                >
                  {s.n}
                </p>
                <p style={monoLabelStyle}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="profile-tabs"
        style={{
          padding: "20px clamp(18px, 4vw, 48px) 0",
          borderBottom: "1px solid var(--line-soft)",
          display: "flex",
          gap: 4,
          overflowX: "auto",
        }}
      >
        {visibleTabs.map((t) => {
          const active = t.key === tab;
          const count = tabBadgeCounts[t.key];
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                padding: "12px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: active ? "var(--ink)" : "var(--ink-mute)",
                borderBottom: `2px solid ${active ? "var(--clay)" : "transparent"}`,
                whiteSpace: "nowrap",
                flex: "none",
                marginBottom: -1,
                background: "transparent",
                border: "none",
                borderBottomWidth: 2,
                borderBottomStyle: "solid",
                borderBottomColor: active ? "var(--clay)" : "transparent",
                cursor: "pointer",
                fontFamily: "var(--sans)",
              }}
            >
              {t.label}
              {typeof count === "number" && count > 0 && (
                <span
                  className="mono"
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    letterSpacing: ".04em",
                  }}
                >
                  · {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div
        className="profile-body"
        style={{
          padding: "24px clamp(18px, 4vw, 48px) 28px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 36,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {tab === "rooms" && (
            <RoomsTab
              hostedRooms={hostedRooms}
              isOwner={isOwner}
              navigate={navigate}
            />
          )}
          {tab === "path" && <PathTab onAdd={() => setEditing(true)} />}
          {tab === "referrals" && (
            <ReferralsTab
              referrals={referrals}
              isOwner={isOwner}
            />
          )}
          {tab === "vouches" && <VouchesTab />}
          {tab === "about" && (
            <AboutTab profile={profile ?? null} tags={tags} />
          )}
          {tab === "insights" && <InsightsTab />}
        </div>

        {/* Right rail */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minWidth: 0,
          }}
        >
          {isOwner && (pendingRequests.length > 0 || unreadMessages > 0) && (
            <div
              className="hy-card"
              style={{
                padding: 18,
                background: "var(--paper)",
                border: "1px solid var(--clay)",
                borderRadius: "var(--radius-lg-hy)",
              }}
            >
              <p style={sectionLabelStyle}>Today · needs you</p>
              <ul
                style={{
                  margin: "10px 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {pendingRequests.length > 0 && (
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      paddingBottom: 8,
                      borderBottom: "1px dashed var(--line-soft)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {pendingRequests.length} referral request
                      {pendingRequests.length === 1 ? "" : "s"}
                    </span>
                    <span className="mono" style={{ ...monoLabelStyle, fontSize: 10 }}>
                      Oldest pending
                    </span>
                  </li>
                )}
                {unreadMessages > 0 && (
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      paddingBottom: 8,
                      borderBottom: "1px dashed var(--line-soft)",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {unreadMessages} unread message
                      {unreadMessages === 1 ? "" : "s"}
                    </span>
                    <span className="mono" style={{ ...monoLabelStyle, fontSize: 10 }}>
                      Reply
                    </span>
                  </li>
                )}
              </ul>
              <Link to="/app/messages" style={{ textDecoration: "none" }}>
                <Btn
                  kind="primary"
                  size="md"
                  iconRight={I.arrow}
                  style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
                >
                  Open inbox
                </Btn>
              </Link>
            </div>
          )}

          {/* Ask block / Your offers — driven by host_settings */}
          <div
            className="hy-card"
            style={{
              padding: 18,
              background: "var(--cream)",
              borderRadius: "var(--radius-lg-hy)",
            }}
          >
            <p style={sectionLabelStyle}>
              {isOwner ? "Your offers" : "Ask me for"}
            </p>
            <ul
              style={{
                margin: "12px 0 0",
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                {
                  enabled: openToCoffee,
                  label: "Coffee chat",
                  detail: `${hostSettings?.monthly_capacity ?? 3} / month`,
                },
                {
                  enabled: openToReferrals,
                  label: "Referral",
                  detail: "Submitted to ATS",
                },
                {
                  enabled: openToResume,
                  label: "Resume review",
                  detail: "Async, same week",
                },
              ]
                .filter((o) => o.enabled || isOwner)
                .map((o) => (
                  <li
                    key={o.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      paddingBottom: 8,
                      borderBottom: "1px dashed var(--line-soft)",
                      opacity: o.enabled ? 1 : 0.4,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</span>
                    <span className="mono" style={{ ...monoLabelStyle, fontSize: 10 }}>
                      {o.detail}
                    </span>
                  </li>
                ))}
            </ul>
            <Btn
              kind={isOwner ? "soft" : "primary"}
              size="md"
              iconRight={I.arrow}
              onClick={() => (isOwner ? setEditing(true) : navigate("/app/referrals"))}
              style={{ marginTop: 14, width: "100%", justifyContent: "center" }}
            >
              {isOwner ? "Edit offers" : "Book one"}
            </Btn>
          </div>

          {/* Signature room — most recent room hosted */}
          {signatureRoom && (
            <div
              style={{
                padding: 18,
                background: "linear-gradient(135deg, var(--clay), var(--clay-2))",
                color: "var(--paper)",
                borderRadius: "var(--radius-lg-hy)",
                boxShadow: "var(--shadow-warm)",
              }}
            >
              <p
                className="mono"
                style={{
                  fontSize: 10,
                  opacity: 0.85,
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
                <p style={{ marginTop: 8, fontSize: 12, opacity: 0.92, lineHeight: 1.5 }}>
                  {signatureRoom.description.length > 110
                    ? `${signatureRoom.description.slice(0, 110)}…`
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
                <span className="mono" style={{ fontSize: 11, opacity: 0.9 }}>
                  {signatureRoom.status === "live"
                    ? "LIVE NOW"
                    : `NEXT · ${formatNextRoomSlot(signatureRoom.startsAt)}`}
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

          {/* This week's reach (owner) / You both know (viewer)
              Both need DB backing we don't have — show a soft "coming
              when analytics/connections ship" message in owner mode,
              and just hide for viewer mode for now. */}
          {isOwner && (
            <div className="hy-card" style={{ ...cardStyle }}>
              <p style={sectionLabelStyle}>This week's reach</p>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: "var(--ink-mute)",
                  lineHeight: 1.55,
                }}
              >
                Profile views, booking clicks, and new asks will appear here
                when the analytics aggregation ships.
              </p>
            </div>
          )}

          {/* Quiet privacy line */}
          <p
            style={{
              fontSize: 11,
              color: "var(--ink-mute)",
              display: "flex",
              gap: 6,
              alignItems: "flex-start",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            <span style={{ color: "var(--olive)", marginTop: 1 }}>{I.lock}</span>
            {isOwner
              ? "Visitors only see published recaps and your public stats."
              : "They see exactly what you'd send before deciding to reply."}
          </p>
        </aside>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .profile-banner { height: 80px !important; }
          .profile-identity {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 0 18px 18px !important;
            align-items: flex-start !important;
          }
          .profile-identity > div:first-child { margin-top: -34px !important; }
          .profile-identity > div:last-child {
            padding-top: 4px !important;
            justify-content: stretch !important;
          }
          .profile-identity > div:last-child > * { flex: 1; justify-content: center; }
          .profile-stat-strip {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
            padding: 14px 18px !important;
          }
          .profile-stat-strip > div { padding-left: 0 !important; border-left: none !important; }
          .profile-body {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
        }
      `}</style>
    </div>
  );
};

// ---------------------------------------------------------------------------
// BadgePill — small chip used in the identity header
// ---------------------------------------------------------------------------

const BadgePill = ({
  children,
  clay,
}: {
  children: ReactNode;
  clay?: boolean;
}) => (
  <span
    style={{
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background: clay ? "var(--clay)" : "transparent",
      color: clay ? "var(--paper)" : "var(--ink-soft)",
      border: `1px solid ${clay ? "transparent" : "var(--line)"}`,
    }}
  >
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Tab content — Rooms
// ---------------------------------------------------------------------------

interface MinimalRoom {
  id: string;
  title: string;
  startsAt: string;
  durationMin: number;
  attendees: number;
}

const RoomsTab = ({
  hostedRooms,
  isOwner,
  navigate,
}: {
  hostedRooms: MinimalRoom[];
  isOwner: boolean;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <div>
          <p style={sectionLabelStyle}>Activity</p>
          <h2
            style={{
              fontSize: 24,
              marginTop: 4,
              fontFamily: "var(--display)",
              fontWeight: 500,
              margin: "4px 0 0",
            }}
          >
            Rooms I host
          </h2>
        </div>
      </div>

      {hostedRooms.length === 0 ? (
        <EmptyPanel
          label="No rooms hosted yet"
          hint="Once you host a room, the recap and attendees will show up here."
          action={
            <Link to="/app/rooms" style={{ textDecoration: "none" }}>
              <Btn kind="soft" size="md">
                Browse rooms
              </Btn>
            </Link>
          }
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {hostedRooms.slice(0, 6).map((r) => {
            const when = new Date(r.startsAt);
            const isPast = when.getTime() < Date.now();
            return (
              <article
                key={r.id}
                className="hy-card"
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  background: "var(--paper)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: "var(--radius-lg-hy)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Pill
                    style={{
                      background: "var(--clay)",
                      color: "var(--paper)",
                      borderColor: "transparent",
                    }}
                  >
                    Host
                  </Pill>
                  <span className="mono" style={monoLabelStyle}>
                    {formatDateShort(when).toUpperCase()}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 99,
                      background: "var(--ink-mute)",
                    }}
                  />
                  <span className="mono" style={monoLabelStyle}>
                    {r.attendees} ATTENDED
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 99,
                      background: "var(--ink-mute)",
                    }}
                  />
                  <span className="mono" style={monoLabelStyle}>
                    {r.durationMin} MIN
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 20,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {r.title}
                </h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Btn
                    kind="soft"
                    size="md"
                    onClick={() => navigate(`/app/rooms/${r.id}`)}
                  >
                    {isPast ? "View recap" : "View details"}
                  </Btn>
                  {isOwner && (
                    <span
                      className="mono"
                      style={{
                        marginLeft: "auto",
                        fontSize: 10,
                        color: "var(--ink-mute)",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {isPast ? "Hosted" : "Upcoming"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Tab content — Path / Vouches / Insights (DB-blocked, honest empty states)
// ---------------------------------------------------------------------------

const PathTab = ({ onAdd }: { onAdd: () => void }) => (
  <EmptyPanel
    label="Career timeline"
    hint="A year-by-year list of where you've worked. We need a career_history table before this can render — it'll land in Phase 3."
    action={
      <Btn kind="soft" size="md" onClick={onAdd}>
        Edit profile in the meantime
      </Btn>
    }
  />
);

const VouchesTab = () => (
  <EmptyPanel
    label="Vouches from peers"
    hint="Short attestations from people you've helped. Lands when the vouches table ships (Phase 3 of the assessment plan)."
  />
);

const InsightsTab = () => (
  <EmptyPanel
    label="Insights"
    hint="Profile views, booking clicks, and recap reach. Needs the analytics aggregation — not yet wired."
  />
);

// ---------------------------------------------------------------------------
// Tab content — Referrals
// ---------------------------------------------------------------------------

interface MinimalReferral {
  id: string;
  company: string;
  role: string;
  status: string;
  direction: "incoming" | "outgoing";
  hostId: string;
  candidateId: string;
  updatedAt: string;
}

const ReferralsTab = ({
  referrals,
  isOwner,
}: {
  referrals: MinimalReferral[];
  isOwner: boolean;
}) => {
  // For now, surface everything the user is involved in (incoming + outgoing)
  // and sort by recency. We can split into "Made for others" / "Made for me"
  // when there's a UX need.
  const sorted = [...referrals].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <EmptyPanel
        label="No referrals yet"
        hint={
          isOwner
            ? "Once you send or receive a referral, it shows up here."
            : "Their referral history will appear here once they have one."
        }
      />
    );
  }

  return (
    <>
      <div>
        <p style={sectionLabelStyle}>Referrals</p>
        <h2
          style={{
            fontSize: 24,
            margin: "4px 0 0",
            fontFamily: "var(--display)",
            fontWeight: 500,
          }}
        >
          Warm intros, both ways.
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.slice(0, 8).map((r) => {
          const isIncoming = r.direction === "incoming";
          const updated = new Date(r.updatedAt);
          return (
            <Link
              key={r.id}
              to={`/app/referrals/${r.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                className="hy-card"
                style={{
                  padding: 16,
                  background: "var(--paper)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: "var(--radius-lg-hy)",
                  boxShadow: "var(--shadow-soft)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Pill
                    style={{
                      background: isIncoming ? "var(--olive)" : "var(--clay)",
                      color: "var(--paper)",
                      borderColor: "transparent",
                    }}
                  >
                    {isIncoming ? "Incoming" : "Outgoing"}
                  </Pill>
                  <span className="mono" style={monoLabelStyle}>
                    {r.status.toUpperCase()}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: 99,
                      background: "var(--ink-mute)",
                    }}
                  />
                  <span className="mono" style={monoLabelStyle}>
                    {formatDateShort(updated).toUpperCase()}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 17,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {r.role} <span style={{ color: "var(--ink-mute)" }}>·</span>{" "}
                  <span style={{ color: "var(--ink-mute)" }}>{r.company}</span>
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// Tab content — About
// ---------------------------------------------------------------------------

const AboutTab = ({
  profile,
  tags,
}: {
  profile: {
    bio?: string | null;
    referral_goals?: string | null;
    linkedin_url?: string | null;
  } | null;
  tags: string[];
}) => (
  <>
    <div>
      <p style={sectionLabelStyle}>About</p>
      <h2
        style={{
          fontSize: 24,
          margin: "4px 0 0",
          fontFamily: "var(--display)",
          fontWeight: 500,
        }}
      >
        The story behind the badges.
      </h2>
    </div>

    {profile?.referral_goals ? (
      <blockquote
        style={{
          borderLeft: "3px solid var(--clay)",
          padding: "6px 0 6px 20px",
          fontFamily: "var(--display)",
          fontStyle: "italic",
          fontSize: 24,
          lineHeight: 1.3,
          color: "var(--ink)",
          margin: 0,
          maxWidth: 600,
        }}
      >
        "{profile.referral_goals}"
      </blockquote>
    ) : (
      <p
        style={{
          fontStyle: "italic",
          color: "var(--ink-mute)",
          fontSize: 14,
          margin: 0,
        }}
      >
        Add a one-line quote from the edit screen.
      </p>
    )}

    {profile?.bio ? (
      <p
        style={{
          fontSize: 15,
          color: "var(--ink-soft)",
          lineHeight: 1.65,
          maxWidth: 600,
          margin: 0,
        }}
      >
        {profile.bio}
      </p>
    ) : (
      <p
        style={{
          fontStyle: "italic",
          color: "var(--ink-mute)",
          fontSize: 14,
          margin: 0,
        }}
      >
        No bio yet.
      </p>
    )}

    {tags.length > 0 && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.slice(0, 16).map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
    )}

    {profile?.linkedin_url && (
      <a
        href={profile.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
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
    )}
  </>
);

// ---------------------------------------------------------------------------
// EmptyPanel — used by Path / Vouches / Insights / no-data Rooms
// ---------------------------------------------------------------------------

const EmptyPanel = ({
  label,
  hint,
  action,
}: {
  label: string;
  hint: string;
  action?: ReactNode;
}) => (
  <div
    style={{
      padding: 40,
      borderRadius: "var(--radius-xl)",
      background: "var(--cream)",
      border: "1px dashed var(--line)",
      textAlign: "center",
    }}
  >
    <h3
      style={{
        fontFamily: "var(--display)",
        fontSize: 22,
        margin: 0,
        fontWeight: 500,
      }}
    >
      {label}
    </h3>
    <p
      style={{
        marginTop: 8,
        fontSize: 14,
        color: "var(--ink-soft)",
        lineHeight: 1.5,
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {hint}
    </p>
    {action && <div style={{ marginTop: 14 }}>{action}</div>}
  </div>
);

// ---------------------------------------------------------------------------
// EditView — ProfileEdit redesign (extra-screens.jsx → ProfileEdit)
// Three editorial sections + Documents block.
// ---------------------------------------------------------------------------

interface EditViewProps {
  profile: {
    avatar_url?: string | null;
    resume_url?: string | null;
    video_intro_url?: string | null;
    full_name?: string | null;
  } | null;
  isHost: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: () => Promise<void>;

  editName: string;
  setEditName: (s: string) => void;
  editHeadline: string;
  setEditHeadline: (s: string) => void;
  editLocation: string;
  setEditLocation: (s: string) => void;
  editPronouns: string;
  setEditPronouns: (s: string) => void;
  editQuote: string;
  setEditQuote: (s: string) => void;
  editBio: string;
  setEditBio: (s: string) => void;
  editLinkedin: string;
  setEditLinkedin: (s: string) => void;

  editTags: string[];
  tagDraft: string;
  setTagDraft: (s: string) => void;
  addTagDraft: () => void;
  removeTag: (t: string) => void;

  editCoffee: boolean;
  setEditCoffee: (b: boolean) => void;
  editReferrals: boolean;
  setEditReferrals: (b: boolean) => void;
  editResume: boolean;
  setEditResume: (b: boolean) => void;

  avatarUploading: boolean;
  avatarPreview: string | null;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  onAvatarChange: (f: File) => void;

  resumeUploading: boolean;
  videoUploading: boolean;
  resumeInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  onResumeFile: (f: File) => void;
  onVideoFile: (f: File) => void;
}

const EditView = (p: EditViewProps) => {
  const fullName = p.profile?.full_name || "Your profile";
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
          padding: "28px clamp(18px, 4vw, 48px) 18px",
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
          <Btn
            kind="ghost"
            size="md"
            onClick={p.onCancel}
            disabled={p.saving}
          >
            View public profile
          </Btn>
          <Btn
            kind="primary"
            size="md"
            onClick={() => void p.onSave()}
            disabled={p.saving}
          >
            {p.saving ? "Saving…" : "Save changes"}
          </Btn>
        </div>
      </div>

      <div
        style={{
          padding: "24px clamp(18px, 4vw, 48px) 28px",
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
              {p.avatarPreview || p.profile?.avatar_url ? (
                <img
                  src={p.avatarPreview ?? p.profile!.avatar_url!}
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
                ref={p.avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) p.onAvatarChange(f);
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Btn
                  kind="soft"
                  size="md"
                  onClick={() => p.avatarInputRef.current?.click()}
                  disabled={p.avatarUploading}
                >
                  {p.avatarUploading ? "Uploading…" : "Upload new"}
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
                  value={p.editName}
                  onChange={(e) => p.setEditName(e.target.value)}
                  style={inputStyle}
                  disabled={p.saving}
                />
              </Field>
              <Field label="Pronouns">
                <input
                  value={p.editPronouns}
                  onChange={(e) => p.setEditPronouns(e.target.value)}
                  placeholder="she / her"
                  style={inputStyle}
                  disabled={p.saving}
                />
              </Field>
            </div>

            <div
              className="edit-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              <Field label="Headline">
                <input
                  value={p.editHeadline}
                  onChange={(e) => p.setEditHeadline(e.target.value)}
                  placeholder="Senior Product Designer"
                  style={inputStyle}
                  disabled={p.saving}
                />
              </Field>
              <Field label="Location">
                <input
                  value={p.editLocation}
                  onChange={(e) => p.setEditLocation(e.target.value)}
                  placeholder="City, country"
                  style={inputStyle}
                  disabled={p.saving}
                />
              </Field>
            </div>

            <Field label="LinkedIn URL">
              <input
                type="url"
                value={p.editLinkedin}
                onChange={(e) => p.setEditLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                style={inputStyle}
                disabled={p.saving}
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
                value={p.editQuote}
                onChange={(e) => p.setEditQuote(e.target.value)}
                placeholder="I rebuilt my career from scratch in a new country."
                style={{
                  ...inputStyle,
                  fontFamily: "var(--display)",
                  fontStyle: "italic",
                  fontSize: 16,
                  lineHeight: 1.45,
                  resize: "none",
                }}
                disabled={p.saving}
              />
            </Field>
            <Field label="Bio">
              <textarea
                rows={5}
                value={p.editBio}
                onChange={(e) => p.setEditBio(e.target.value)}
                placeholder="A few warm sentences about who you are."
                style={{
                  ...inputStyle,
                  resize: "none",
                  lineHeight: 1.6,
                  minHeight: 100,
                }}
                disabled={p.saving}
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
                {p.editTags.map((t) => (
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
                      onClick={() => p.removeTag(t)}
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
                  value={p.tagDraft}
                  onChange={(e) => p.setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      p.addTagDraft();
                    } else if (
                      e.key === "Backspace" &&
                      !p.tagDraft &&
                      p.editTags.length > 0
                    ) {
                      p.removeTag(p.editTags[p.editTags.length - 1]);
                    }
                  }}
                  onBlur={p.addTagDraft}
                  placeholder={p.editTags.length === 0 ? "Add a tag…" : "+ Add"}
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
                  disabled={p.saving}
                />
              </div>
            </Field>
          </div>
        </EditSection>

        {/* What you'll help with — host only */}
        {p.isHost && (
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
                    desc: "Short intro conversations.",
                    on: p.editCoffee,
                    set: p.setEditCoffee,
                  },
                  {
                    key: "referrals" as const,
                    label: "Referrals",
                    desc: "Submitting a formal referral.",
                    on: p.editReferrals,
                    set: p.setEditReferrals,
                  },
                  {
                    key: "resume" as const,
                    label: "Resume reviews",
                    desc: "Same-week feedback.",
                    on: p.editResume,
                    set: p.setEditResume,
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
                  <ToggleSwitch
                    on={row.on}
                    onChange={row.set}
                    disabled={p.saving}
                  />
                </div>
              ))}
            </div>
          </EditSection>
        )}

        {/* Documents */}
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
              uploading={p.resumeUploading}
              hasFile={!!p.profile?.resume_url}
              refEl={p.resumeInputRef}
              onFile={p.onResumeFile}
            />
            <UploadTile
              label="Video intro"
              hint="Optional · 60s"
              accept="video/*"
              uploading={p.videoUploading}
              hasFile={!!p.profile?.video_intro_url}
              refEl={p.videoInputRef}
              onFile={p.onVideoFile}
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
};

// ---------------------------------------------------------------------------
// Small primitives used by EditView
// ---------------------------------------------------------------------------

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

const ToggleSwitch = ({
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
    className="edit-section"
    style={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      gap: 40,
      paddingTop: divider ? 22 : 0,
      borderTop: divider ? "1px solid var(--line-soft)" : "none",
    }}
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
      <p style={{ marginTop: 6, fontSize: 12, color: "var(--ink-mute)" }}>
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

export default Profile;
