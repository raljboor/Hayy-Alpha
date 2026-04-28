import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  BadgeCheck,
  Pencil,
  Share2,
  Sparkles,
  Target,
  Coffee,
  FileText,
  X,
  Check,
  Upload,
  Video,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/hayy/ErrorState";
import { getProfile, updateProfile, uploadResume, uploadVideoIntro } from "@/lib/api/profiles";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isMockMode } from "@/lib/runtimeMode";

// ---------------------------------------------------------------------------
// Static mock data — display-only; never used in API calls
// ---------------------------------------------------------------------------

const fallbackMe = {
  name: "Amira Khan",
  initials: "AK",
  avatarColor: "bg-clay",
  headline: "Product Marketing · seeking warm intros into Canadian corporates",
  location: "Toronto, CA",
  pronouns: "she/her",
};

const mockCareerStory = [
  "Newcomer to Canada, ex-Careem. Building my first corporate role here.",
  "I'm an early-career professional with an industrial engineering background, focused on operations and program management.",
];
const mockTargetRoles = ["Product Marketing", "Operations Analyst", "Program Manager"];
const mockSkills = ["Market research", "Operations", "Power BI", "Stakeholder management"];
const mockReferralGoal =
  "Looking for warm introductions into Canadian corporate teams where operations, growth, and customer experience meet.";

const roomsJoined = [
  "How to Get Referred Into Corporate Roles in Canada",
  "Product Leaders in Tech",
  "Newcomer Career Access Circle",
];

const referralsReceived = [
  {
    name: "Khalid A.",
    initials: "KA",
    avatarColor: "bg-primary",
    role: "Product Manager",
    company: "Google",
    status: "Coffee chat accepted",
    icon: Coffee,
    tone: "olive" as const,
  },
  {
    name: "Leila M.",
    initials: "LM",
    avatarColor: "bg-olive",
    role: "Design Lead",
    company: "Airbnb",
    status: "Resume feedback pending",
    icon: FileText,
    tone: "clay" as const,
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`w-full max-w-full box-border rounded-[28px] bg-card border border-border/70 p-6 shadow-soft ${className}`}>
    {children}
  </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-[26px] md:text-[28px] leading-tight text-foreground">{children}</h2>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-secondary text-foreground px-3.5 py-1.5 text-sm font-medium border border-border/60">
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Inline file upload button
// ---------------------------------------------------------------------------

interface UploadButtonProps {
  label: string;
  hint: string;
  icon: typeof Upload;
  accept: string;
  uploading: boolean;
  currentUrl: string | null | undefined;
  onFile: (f: File) => void;
}

const UploadButton = ({ label, hint, icon: Icon, accept, uploading, currentUrl, onFile }: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
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
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl border border-dashed border-border bg-cream/60 p-4 text-left hover:border-primary/40 hover:bg-cream transition-colors group w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-card flex items-center justify-center text-clay shadow-soft shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {currentUrl ? "Uploaded ✓ — click to replace" : hint}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Profile = () => {
  const { userId, loading: authLoading, refreshProfile } = useCurrentUser();
  const { data: profile, loading: profileLoading, error, refetch } = useAsync(
    () => (userId ? getProfile(userId) : Promise.resolve(null)),
    [userId],
  );
  const loading = authLoading || profileLoading;

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable form fields — seeded from profile when edit mode opens
  const [editName, setEditName] = useState("");
  const [editHeadline, setEditHeadline] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPronouns, setEditPronouns] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTargetRoles, setEditTargetRoles] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");

  // Upload states
  const [resumeUploading, setResumeUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  // Seed edit fields whenever the profile loads or edit mode opens
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
    }
  }, [profile, editing]);

  const openEdit = () => {
    // Pre-seed fields from current profile (or fallback display values)
    setEditName(profile?.full_name ?? fallbackMe.name);
    setEditHeadline(profile?.headline ?? fallbackMe.headline);
    setEditLocation(profile?.location ?? fallbackMe.location);
    setEditPronouns(profile?.pronouns ?? fallbackMe.pronouns);
    setEditBio(profile?.bio ?? "");
    setEditTargetRoles((profile?.target_roles ?? mockTargetRoles).join(", "));
    setEditSkills((profile?.skills ?? mockSkills).join(", "));
    setEditLinkedin(profile?.linkedin_url ?? "");
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

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
      refetch();
      setEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't save profile — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!userId) { toast.error("Not signed in."); return; }
    setResumeUploading(true);
    try {
      await uploadResume(userId, file);
      await refreshProfile();
      refetch();
      toast.success("Resume uploaded successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")) {
        toast.error("Resume upload unavailable — storage bucket not configured yet.");
      } else {
        toast.error("Resume upload failed. Please try again.");
      }
    } finally {
      setResumeUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!userId) { toast.error("Not signed in."); return; }
    setVideoUploading(true);
    try {
      await uploadVideoIntro(userId, file);
      await refreshProfile();
      refetch();
      toast.success("Video intro uploaded successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("bucket") || msg.toLowerCase().includes("storage")) {
        toast.error("Video upload unavailable — storage bucket not configured yet.");
      } else {
        toast.error("Video intro upload failed. Please try again.");
      }
    } finally {
      setVideoUploading(false);
    }
  };

  // Derived display values: prefer live profile, fall back to mock display data
  const me = profile
    ? {
        name: profile.full_name || fallbackMe.name,
        initials: (profile.full_name || fallbackMe.name).split(" ").map((s) => s[0]).slice(0, 2).join(""),
        avatarColor: fallbackMe.avatarColor,
        headline: profile.headline || fallbackMe.headline,
        location: profile.location || fallbackMe.location,
        pronouns: profile.pronouns || fallbackMe.pronouns,
      }
    : fallbackMe;

  // In production: show real data or null/empty (render empty states below).
  // In mock mode: fall back to Amira's fixture data for a richer demo.
  const displayBio = useMemo(() => {
    if (profile?.bio) return [profile.bio];
    return isMockMode ? mockCareerStory : null;
  }, [profile]);

  const displayTargetRoles = useMemo(() => {
    if (profile?.target_roles?.length) return profile.target_roles;
    return isMockMode ? mockTargetRoles : [];
  }, [profile]);

  const displaySkills = useMemo(() => {
    if (profile?.skills?.length) return profile.skills;
    return isMockMode ? mockSkills : [];
  }, [profile]);

  const displayGoal = useMemo(() => {
    if (profile?.bio) return profile.bio;
    return isMockMode ? mockReferralGoal : null;
  }, [profile]);

  // Rooms and referrals — real data not fetched on Profile page yet.
  // Show mock data in demo mode; show empty state in production.
  const displayRoomsJoined = isMockMode ? roomsJoined : [];
  const displayReferralsReceived = isMockMode ? referralsReceived : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-[28px]" />
        <Skeleton className="h-64 w-full rounded-[28px]" />
      </div>
    );
  }

  if (error) {
    return <ErrorState description="We couldn't load your profile." onRetry={refetch} />;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-5 md:space-y-6 min-w-0">
          {/* Profile hero — view or edit */}
          <section className="w-full max-w-full box-border rounded-[28px] bg-gradient-warm border border-clay/20 p-6 shadow-soft">
            <UserAvatar user={me} size="xl" className="ring-4 ring-card" />

            {editing ? (
              /* ---------- Edit mode ---------- */
              <div className="mt-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full name</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-10 rounded-xl bg-card border-border"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Headline</Label>
                  <Input
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    className="h-10 rounded-xl bg-card border-border"
                    disabled={saving}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Location</Label>
                    <Input
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="h-10 rounded-xl bg-card border-border"
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Pronouns</Label>
                    <Input
                      value={editPronouns}
                      onChange={(e) => setEditPronouns(e.target.value)}
                      className="h-10 rounded-xl bg-card border-border"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="hero" size="sm" onClick={saveEdit} disabled={saving} className="flex-1">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                    <X className="h-4 w-4" />Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* ---------- View mode ---------- */
              <>
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-[34px] sm:text-[38px] leading-tight text-foreground">
                    {me.name}
                  </h1>
                  <BadgeCheck className="h-5 w-5 text-clay shrink-0" />
                </div>

                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-card border border-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground">
                    <Sparkles className="h-3 w-3 text-clay" />
                    Founding member
                  </span>
                </div>

                <p className="mt-4 text-[16px] leading-[1.6] text-foreground/85">{me.headline}</p>

                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{me.location} · {me.pronouns}</span>
                </p>

                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                    LinkedIn profile
                  </a>
                )}

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <Button variant="hero" size="sm" className="w-full sm:w-auto" onClick={openEdit}>
                    <Pencil className="h-4 w-4" />
                    Edit profile
                  </Button>
                  <Button
                    variant="soft"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success("Profile link copied");
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* Uploads */}
          <Card>
            <p className="text-xs font-medium uppercase tracking-widest text-clay mb-4">Documents</p>
            <div className="space-y-3">
              <UploadButton
                label="Resume"
                hint="PDF or DOCX, up to 5MB"
                icon={Upload}
                accept=".pdf,.doc,.docx"
                uploading={resumeUploading}
                currentUrl={profile?.resume_url}
                onFile={handleResumeUpload}
              />
              <UploadButton
                label="Video intro"
                hint="Optional · 60 seconds"
                icon={Video}
                accept="video/*"
                uploading={videoUploading}
                currentUrl={profile?.video_intro_url}
                onFile={handleVideoUpload}
              />
            </div>
          </Card>

          {/* Referral goals (desktop left col) */}
          <Card className="hidden lg:block">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clay" />
              <SectionTitle>Referral goals</SectionTitle>
            </div>
            {displayGoal ? (
              <p className="mt-3 text-[16px] leading-[1.6] text-foreground/85">{displayGoal}</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground italic">Add your bio to describe your referral goals.</p>
            )}
          </Card>
        </div>

        {/* RIGHT/MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6 min-w-0">
          {/* Career story — editable in edit mode */}
          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SectionTitle>Career story</SectionTitle>
              {editing && (
                <span className="text-xs text-muted-foreground">Editing below</span>
              )}
            </div>
            {editing ? (
              <Textarea
                rows={5}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="A few warm sentences about who you are, what you've built, and what you're chasing next."
                className="rounded-xl bg-cream border-border resize-none"
                disabled={saving}
              />
            ) : displayBio ? (
              <div className="space-y-3">
                {displayBio.map((p, i) => (
                  <p key={i} className="text-[16px] md:text-[17px] leading-[1.6] text-foreground/85 max-w-[68ch]">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No career story yet. Click "Edit profile" to add your bio.
              </p>
            )}
          </Card>

          {/* Target roles */}
          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SectionTitle>Target roles</SectionTitle>
            </div>
            {editing ? (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Separate with commas</Label>
                <Input
                  value={editTargetRoles}
                  onChange={(e) => setEditTargetRoles(e.target.value)}
                  placeholder="Product Marketing, Operations Analyst…"
                  className="h-11 rounded-xl bg-cream border-border"
                  disabled={saving}
                />
              </div>
            ) : displayTargetRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displayTargetRoles.map((r) => <Chip key={r}>{r}</Chip>)}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No target roles yet — add them by editing your profile.</p>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
              <SectionTitle>Skills</SectionTitle>
            </div>
            {editing ? (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Separate with commas</Label>
                <Input
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Market research, SQL, storytelling…"
                  className="h-11 rounded-xl bg-cream border-border"
                  disabled={saving}
                />
              </div>
            ) : displaySkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {displaySkills.map((s) => <Chip key={s}>{s}</Chip>)}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No skills yet — add them by editing your profile.</p>
            )}
          </Card>

          {/* LinkedIn — editable in edit mode */}
          {editing && (
            <Card>
              <SectionTitle>Links</SectionTitle>
              <div className="mt-4 space-y-1.5">
                <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
                <Input
                  value={editLinkedin}
                  onChange={(e) => setEditLinkedin(e.target.value)}
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  className="h-11 rounded-xl bg-cream border-border"
                  disabled={saving}
                />
              </div>
              {/* Bottom save bar in edit mode for convenience */}
              <div className="mt-5 flex gap-2">
                <Button variant="hero" size="sm" onClick={saveEdit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {saving ? "Saving…" : "Save all changes"}
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                  <X className="h-4 w-4" />Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Referral goals (mobile only) */}
          <Card className="lg:hidden">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clay" />
              <SectionTitle>Referral goals</SectionTitle>
            </div>
            {displayGoal ? (
              <p className="mt-3 text-[16px] leading-[1.6] text-foreground/85">{displayGoal}</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground italic">Add your bio to describe your referral goals.</p>
            )}
          </Card>

          {/* Rooms joined */}
          <Card>
            <SectionTitle>Rooms joined</SectionTitle>
            {displayRoomsJoined.length > 0 ? (
              <ul className="mt-4 divide-y divide-border">
                {displayRoomsJoined.map((r) => (
                  <li key={r} className="py-3 text-[15px] leading-[1.5] text-foreground/85">{r}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground italic">
                No rooms joined yet. <Link to="/app/rooms" className="text-primary hover:underline">Browse rooms</Link> to get started.
              </p>
            )}
          </Card>

          {/* Referrals received */}
          <Card>
            <SectionTitle>Referrals received</SectionTitle>
            {displayReferralsReceived.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayReferralsReceived.map((r) => {
                  const Icon = r.icon;
                  return (
                    <article key={r.name} className="w-full max-w-full box-border rounded-2xl border border-border bg-cream/60 p-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar user={r} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{r.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{r.role} @ {r.company}</p>
                        </div>
                      </div>
                      <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                        r.tone === "olive"
                          ? "bg-olive/15 text-olive border-olive/30"
                          : "bg-clay/15 text-clay border-clay/30"
                      }`}>
                        <Icon className="h-3 w-3" />
                        {r.status}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground italic">
                No referrals received yet. Join a room to get started.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
