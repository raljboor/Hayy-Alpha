/**
 * Profile — ported from the redesign Profile (story-style) and ProfileEdit
 * mocks (frontend-new/hayy/project/components/more-screens.jsx → Profile,
 * extra-screens.jsx → ProfileEdit).
 *
 * Single page that flips between view mode (editorial story layout with
 * quote-led intro, bio paragraphs, tags, sidebar of stats / availability /
 * "happy to help with") and edit mode (inline form with native inputs).
 *
 * Real data via getProfile + updateProfile + uploadResume + uploadVideoIntro
 * + uploadAvatar. Wiring contracts preserved verbatim.
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
  borderRadius: "var(--radius-xl)",
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

const FieldGroup = ({
  label,
  children,
  style,
}: {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    <span style={fieldLabelStyle}>{label}</span>
    {children}
  </label>
);

const UploadTile = ({
  label,
  hint,
  accept,
  uploading,
  hasFile,
  onFile,
}: {
  label: string;
  hint: string;
  accept: string;
  uploading: boolean;
  hasFile: boolean;
  onFile: (f: File) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
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
        onClick={() => ref.current?.click()}
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
              {uploading ? "Uploading…" : hasFile ? "Uploaded ✓ — click to replace" : hint}
            </p>
          </div>
        </div>
      </button>
    </>
  );
};

const Profile = () => {
  const { userId, refreshProfile } = useCurrentUser();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => (userId ? getProfile(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editName, setEditName] = useState("");
  const [editHeadline, setEditHeadline] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPronouns, setEditPronouns] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTargetRoles, setEditTargetRoles] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editReferralGoals, setEditReferralGoals] = useState("");

  const [resumeUploading, setResumeUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && editing) {
      setEditName(profile.full_name ?? "");
      setEditHeadline(profile.headline ?? "");
      setEditLocation(profile.location ?? "");
      setEditPronouns(profile.pronouns ?? "");
      setEditBio(profile.bio ?? "");
      setEditTargetRoles((profile.target_roles ?? []).join(", "));
      setEditSkills((profile.skills ?? []).join(", "));
      setEditLinkedin(profile.linkedin_url ?? "");
      setEditReferralGoals(profile.referral_goals ?? "");
    }
  }, [profile, editing]);

  const saveEdit = async () => {
    if (!userId) {
      toast.error("Not signed in.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(userId, {
        full_name: editName.trim() || undefined,
        headline: editHeadline.trim() || undefined,
        location: editLocation.trim() || undefined,
        pronouns: editPronouns.trim() || undefined,
        bio: editBio.trim() || undefined,
        referral_goals: editReferralGoals.trim() || null,
        target_roles: editTargetRoles
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: editSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        linkedin_url: editLinkedin.trim() || undefined,
      });
      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
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
        msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")
          ? "Resume upload unavailable — storage bucket not configured yet."
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
        msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")
          ? "Video upload unavailable — storage bucket not configured yet."
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
        msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")
          ? "Avatar upload unavailable — create the 'avatars' storage bucket."
          : "Photo upload failed.",
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const skills = useMemo(() => profile?.skills ?? [], [profile]);
  const targetRoles = useMemo(() => profile?.target_roles ?? [], [profile]);

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

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "32px 16px",
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
        {/* Left: the story */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, minWidth: 0 }}>
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
                    border: "3px solid var(--paper)",
                  }}
                />
              ) : (
                <Avatar name={fullName} size={76} tone="dark" />
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
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                title="Upload photo"
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--paper)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: avatarUploading ? "not-allowed" : "pointer",
                  color: "var(--ink-soft)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                {I.plus}
              </button>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--olive)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Open to coffee chats
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
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>
                  {[headline, location].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>

          {editing ? (
            <div style={{ ...cardStyle, padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FieldGroup label="Display name">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={inputStyle}
                    disabled={saving}
                  />
                </FieldGroup>
                <FieldGroup label="Pronouns">
                  <input
                    value={editPronouns}
                    onChange={(e) => setEditPronouns(e.target.value)}
                    placeholder="she / her"
                    style={inputStyle}
                    disabled={saving}
                  />
                </FieldGroup>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 12,
                }}
              >
                <FieldGroup label="Headline">
                  <input
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    placeholder="Senior PM @ Shopify"
                    style={inputStyle}
                    disabled={saving}
                  />
                </FieldGroup>
                <FieldGroup label="Location">
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, country"
                    style={inputStyle}
                    disabled={saving}
                  />
                </FieldGroup>
              </div>
              <FieldGroup label="Bio" style={{ marginTop: 12 }}>
                <textarea
                  rows={4}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="A few warm sentences about who you are."
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
                  disabled={saving}
                />
              </FieldGroup>
              <FieldGroup label="Target roles (comma-separated)" style={{ marginTop: 12 }}>
                <input
                  value={editTargetRoles}
                  onChange={(e) => setEditTargetRoles(e.target.value)}
                  placeholder="Product Marketing, Operations Analyst…"
                  style={inputStyle}
                  disabled={saving}
                />
              </FieldGroup>
              <FieldGroup label="Skills (comma-separated)" style={{ marginTop: 12 }}>
                <input
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Market research, SQL, storytelling…"
                  style={inputStyle}
                  disabled={saving}
                />
              </FieldGroup>
              <FieldGroup label="Referral goals" style={{ marginTop: 12 }}>
                <textarea
                  rows={2}
                  value={editReferralGoals}
                  onChange={(e) => setEditReferralGoals(e.target.value)}
                  placeholder="What kinds of warm intros are you hoping to access?"
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
                  disabled={saving}
                />
              </FieldGroup>
              <FieldGroup label="LinkedIn URL" style={{ marginTop: 12 }}>
                <input
                  type="url"
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  style={inputStyle}
                  disabled={saving}
                />
              </FieldGroup>
              <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                <Btn kind="primary" size="md" onClick={saveEdit} disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Btn>
                <Btn
                  kind="ghost"
                  size="md"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </Btn>
              </div>
            </div>
          ) : (
            <>
              {profile?.referral_goals && (
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
                  <span style={{ fontStyle: "italic" }}>
                    "{profile.referral_goals}"
                  </span>
                </blockquote>
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
                    fontSize: 14,
                    color: "var(--ink-mute)",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  No bio yet — click "Edit profile" to add yours.
                </p>
              )}

              {(skills.length > 0 || targetRoles.length > 0) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {[...targetRoles, ...skills].slice(0, 12).map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
              </div>

              <div style={cardStyle}>
                <p style={sectionLabelStyle}>Documents</p>
                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                  className="profile-uploads"
                >
                  <UploadTile
                    label="Resume"
                    hint="PDF or DOCX, up to 5MB"
                    accept=".pdf,.doc,.docx"
                    uploading={resumeUploading}
                    hasFile={!!profile?.resume_url}
                    onFile={handleResumeUpload}
                  />
                  <UploadTile
                    label="Video intro"
                    hint="Optional · 60s"
                    accept="video/*"
                    uploading={videoUploading}
                    hasFile={!!profile?.video_intro_url}
                    onFile={handleVideoUpload}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: editorial sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div style={cardStyle}>
            {[
              { n: targetRoles.length, l: "Target roles set" },
              { n: skills.length, l: "Skills listed" },
              { n: profile?.linkedin_url ? "✓" : "—", l: "LinkedIn linked" },
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

          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Linked</p>
            {profile?.linkedin_url ? (
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
            ) : (
              <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 8 }}>
                Add your LinkedIn from edit mode.
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Happy to help with</p>
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
              {targetRoles.length === 0 && skills.length === 0 ? (
                <li style={{ fontSize: 13, color: "var(--ink-mute)" }}>
                  Set your target roles and skills to populate this list.
                </li>
              ) : (
                <>
                  {targetRoles.slice(0, 3).map((r) => (
                    <li
                      key={r}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "var(--olive)" }}>{I.check}</span>
                      Conversations on {r}
                    </li>
                  ))}
                  {skills.slice(0, 2).map((s) => (
                    <li
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: "var(--olive)" }}>{I.check}</span>
                      {s} feedback
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          <Link to="/app/settings" style={{ textDecoration: "none" }}>
            <Btn kind="ghost" size="md" iconRight={I.arrow}>
              Settings &amp; visibility
            </Btn>
          </Link>
        </aside>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .profile-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
          .profile-uploads { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
