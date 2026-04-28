import {
  MapPin,
  BadgeCheck,
  Pencil,
  Share2,
  Sparkles,
  Target,
  Coffee,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/hayy/ErrorState";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import { useAsync } from "@/lib/useAsync";

const ME_ID = "u1";

const fallbackMe = {
  name: "Amira Khan",
  initials: "AK",
  avatarColor: "bg-clay",
  headline: "Product Marketing · seeking warm intros into Canadian corporates",
  location: "Toronto, CA",
  pronouns: "she/her",
};

const careerStory = [
  "Newcomer to Canada, ex-Careem. Building my first corporate role here.",
  "I'm an early-career professional with an industrial engineering background, focused on operations and program management. After leading process-improvement projects in MENA, I'm building toward a corporate role in Canada where I can keep solving messy ops problems with data and a team.",
];

const targetRoles = [
  "Product Marketing",
  "Operations Analyst",
  "Program Manager",
  "Growth Associate",
];

const skills = [
  "Market research",
  "Operations",
  "Power BI",
  "Stakeholder management",
  "Process improvement",
  "Storytelling",
];

const referralGoal =
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

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`w-full max-w-full box-border rounded-[28px] bg-card border border-border/70 p-6 shadow-soft ${className}`}
  >
    {children}
  </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-display text-[26px] md:text-[28px] leading-tight text-foreground">
    {children}
  </h2>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-secondary text-foreground px-3.5 py-1.5 text-sm font-medium border border-border/60">
    {children}
  </span>
);

const Profile = () => {
  const { data: profile, loading, error, refetch } = useAsync(() => getProfile(ME_ID), []);

  const me = profile
    ? {
        name: profile.full_name || fallbackMe.name,
        initials: (profile.full_name || fallbackMe.name)
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join(""),
        avatarColor: fallbackMe.avatarColor,
        headline: profile.headline || fallbackMe.headline,
        location: profile.location || fallbackMe.location,
        pronouns: profile.pronouns || fallbackMe.pronouns,
      }
    : fallbackMe;

  // Surface updateProfile so the API is reachable from this page.
  // Wired to the existing "Edit profile" button.
  const handleEdit = async () => {
    await updateProfile(ME_ID, { headline: me.headline });
    toast("Profile updated");
  };

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
        {/* LEFT COLUMN (mobile: stacked first) */}
        <div className="lg:col-span-1 space-y-5 md:space-y-6 min-w-0">
          {/* Profile hero */}
          <section className="w-full max-w-full box-border rounded-[28px] bg-gradient-warm border border-clay/20 p-6 shadow-soft">
            <UserAvatar user={me} size="xl" className="ring-4 ring-card" />

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

            <p className="mt-4 text-[16px] leading-[1.6] text-foreground/85">
              {me.headline}
            </p>

            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>
                {me.location} · {me.pronouns}
              </span>
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Button
                variant="hero"
                size="sm"
                className="w-full sm:w-auto"
                onClick={handleEdit}
              >
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
          </section>

          {/* Referral goals (desktop: left col) */}
          <Card className="hidden lg:block">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clay" />
              <SectionTitle>Referral goals</SectionTitle>
            </div>
            <p className="mt-3 text-[16px] leading-[1.6] text-foreground/85">
              {referralGoal}
            </p>
          </Card>
        </div>

        {/* RIGHT/MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6 min-w-0">
          {/* Career story */}
          <Card>
            <SectionTitle>Career story</SectionTitle>
            <div className="mt-4 space-y-3">
              {careerStory.map((p, i) => (
                <p
                  key={i}
                  className="text-[16px] md:text-[17px] leading-[1.6] text-foreground/85 max-w-[68ch]"
                >
                  {p}
                </p>
              ))}
            </div>
          </Card>

          {/* Target roles */}
          <Card>
            <SectionTitle>Target roles</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {targetRoles.map((r) => (
                <Chip key={r}>{r}</Chip>
              ))}
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <SectionTitle>Skills</SectionTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </Card>

          {/* Referral goals (mobile only) */}
          <Card className="lg:hidden">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-clay" />
              <SectionTitle>Referral goals</SectionTitle>
            </div>
            <p className="mt-3 text-[16px] leading-[1.6] text-foreground/85">
              {referralGoal}
            </p>
          </Card>

          {/* Rooms joined */}
          <Card>
            <SectionTitle>Rooms joined</SectionTitle>
            <ul className="mt-4 divide-y divide-border">
              {roomsJoined.map((r) => (
                <li
                  key={r}
                  className="py-3 text-[15px] leading-[1.5] text-foreground/85"
                >
                  {r}
                </li>
              ))}
            </ul>
          </Card>

          {/* Referrals received */}
          <Card>
            <SectionTitle>Referrals received</SectionTitle>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {referralsReceived.map((r) => {
                const Icon = r.icon;
                return (
                  <article
                    key={r.name}
                    className="w-full max-w-full box-border rounded-2xl border border-border bg-cream/60 p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar user={r} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {r.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {r.role} @ {r.company}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                        r.tone === "olive"
                          ? "bg-olive/15 text-olive border-olive/30"
                          : "bg-clay/15 text-clay border-clay/30"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {r.status}
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
