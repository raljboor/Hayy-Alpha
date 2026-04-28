import { useEffect, useState } from "react";
import {
  Coffee,
  Handshake,
  FileText,
  Users,
  Inbox,
  CheckCircle2,
  CalendarPlus,
  Send,
  HelpCircle,
  Eye,
  ExternalLink,
  Sparkles,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/hayy/StatCard";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { StatusBadge } from "@/components/hayy/StatusBadge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users, getUser, type ReferralRequest as MockReferralRequest } from "@/data/mockData";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { getIncomingReferralRequests, updateReferralStatus } from "@/lib/api/referrals";
import { getHostSettings, upsertHostSettings, updateHostCapacity, updateHostAvailability } from "@/lib/api/hostSettings";
import { updateProfile } from "@/lib/api/profiles";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ThreadStatus } from "@/data/mockData";

type RequestType = "Coffee chat" | "Referral" | "Resume feedback";
type RequestStatus = "pending" | "accepted";

interface IncomingRequest {
  id: string;
  candidateId: string;
  type: RequestType;
  targetRole: string;
  targetCompany: string;
  message: string;
  skills: string[];
  status: RequestStatus;
  nextAction?: "Schedule chat" | "Review resume" | "Submit referral" | "Mark complete";
}

/** Converts an API-shaped MockReferralRequest into the richer IncomingRequest used by this page. */
function toIncomingRequest(r: MockReferralRequest): IncomingRequest {
  const rawType = r.type as string;
  const type: RequestType =
    rawType === "coffee chat"
      ? "Coffee chat"
      : rawType === "resume feedback"
      ? "Resume feedback"
      : "Referral";

  const statusMap: Record<string, RequestStatus> = {
    pending: "pending",
    accepted: "accepted",
    declined: "pending",
    submitted: "accepted",
    completed: "accepted",
  };

  const nextActionMap: Record<RequestType, IncomingRequest["nextAction"]> = {
    "Coffee chat": "Schedule chat",
    "Resume feedback": "Review resume",
    Referral: "Submit referral",
  };

  const status: RequestStatus = statusMap[r.status] ?? "pending";
  const nextAction: IncomingRequest["nextAction"] =
    status === "accepted" ? nextActionMap[type] : undefined;

  return {
    id: r.id,
    candidateId: r.candidateId,
    type,
    targetRole: r.role,
    targetCompany: r.company,
    message: r.message,
    // Skills are not stored on mock requests; leave empty until DB schema ships.
    skills: [],
    status,
    nextAction,
  };
}

/** Mock fallback — rich fixtures with skills shown when Supabase is not configured. */
const mockFallbackRequests: IncomingRequest[] = [
  {
    id: "hr1",
    candidateId: "u1",
    type: "Referral",
    targetRole: "Product Marketing Manager",
    targetCompany: "Amazon",
    message: "Loved your perspective in the Canada Career room. I've shipped 3 launches at Careem and would value a referral into the PMM team.",
    skills: ["PMM", "Go-to-market", "B2C", "Analytics"],
    status: "pending",
  },
  {
    id: "hr2",
    candidateId: "u5",
    type: "Coffee chat",
    targetRole: "UX Designer",
    targetCompany: "Shopify",
    message: "Newcomer to Berlin → exploring Canada. Would love 20 minutes to learn how design partners with eng on the merchant team.",
    skills: ["UX", "Figma", "Research", "Systems"],
    status: "pending",
  },
  {
    id: "hr3",
    candidateId: "u3",
    type: "Resume feedback",
    targetRole: "Senior Software Engineer",
    targetCompany: "Notion",
    message: "Quick resume review before I apply this week — would love a sharp set of eyes.",
    skills: ["Backend", "Distributed systems", "TypeScript"],
    status: "pending",
  },
  {
    id: "hr4",
    candidateId: "u4",
    type: "Coffee chat",
    targetRole: "Talent Partner",
    targetCompany: "Stripe",
    message: "Recruiter looking to swap notes on referral patterns across fintechs.",
    skills: ["Recruiting", "Sourcing", "Fintech"],
    status: "accepted",
    nextAction: "Schedule chat",
  },
  {
    id: "hr5",
    candidateId: "u1",
    type: "Referral",
    targetRole: "Operations Associate",
    targetCompany: "Uber",
    message: "Following up after our chat — sharing my resume and a short pitch.",
    skills: ["Operations", "Excel", "Lean", "Logistics"],
    status: "accepted",
    nextAction: "Submit referral",
  },
  {
    id: "hr6",
    candidateId: "u5",
    type: "Resume feedback",
    targetRole: "Product Designer",
    targetCompany: "Figma",
    message: "Resume + portfolio review before I submit on Friday 🙏",
    skills: ["Design", "Portfolio", "Systems"],
    status: "accepted",
    nextAction: "Review resume",
  },
  {
    id: "hr7",
    candidateId: "u3",
    type: "Coffee chat",
    targetRole: "Software Engineer",
    targetCompany: "Shopify",
    message: "Backend → infra pivot. Would love your read on the team.",
    skills: ["Backend", "Infra"],
    status: "accepted",
    nextAction: "Mark complete",
  },
];

const nextActionMeta = {
  "Schedule chat": { icon: CalendarPlus, variant: "soft" as const },
  "Review resume": { icon: FileText, variant: "soft" as const },
  "Submit referral": { icon: Send, variant: "hero" as const },
  "Mark complete": { icon: CheckCircle2, variant: "soft" as const },
};

const HostDashboard = () => {
  const { userId, profile, refreshProfile } = useCurrentUser();
  // Fall back to "u2" (Yusuf) in mock mode so the page renders with fixtures.
  const hostId = userId ?? "u2";
  const host = getUser(hostId) ?? getUser("u2")!;

  const { data: apiRequests, refetch } = useAsync(
    () => getIncomingReferralRequests(hostId),
    [hostId],
  );
  const { data: hostSettings } = useAsync(
    () => (hostId ? getHostSettings(hostId) : Promise.resolve(null)),
    [hostId],
  );

  // Seed local state from the API result.
  // - Mock mode (Supabase not configured): starts with rich fixture data.
  // - Supabase mode: starts empty; shows real data or empty state once loaded.
  const [requests, setRequests] = useState<IncomingRequest[]>(
    isSupabaseConfigured ? [] : mockFallbackRequests,
  );

  useEffect(() => {
    if (apiRequests !== null) {
      // Always reflect what the API returned — empty [] means "no requests yet",
      // not "fall back to mock data".
      setRequests(apiRequests.map(toIncomingRequest));
    }
  }, [apiRequests]);

  // Availability toggles — seeded from host_settings once loaded
  const [coffeeChats, setCoffeeChats] = useState(true);
  const [referrals, setReferrals] = useState(true);
  const [resumeFeedback, setResumeFeedback] = useState(false);
  const [capacity, setCapacity] = useState("3");
  const [enablingHostMode, setEnablingHostMode] = useState(false);

  useEffect(() => {
    if (hostSettings) {
      setCoffeeChats(hostSettings.open_to_coffee_chats);
      setReferrals(hostSettings.open_to_referrals);
      setResumeFeedback(hostSettings.open_to_resume_feedback);
      setCapacity(String(hostSettings.monthly_capacity));
    }
  }, [hostSettings]);

  // Persist toggle changes
  const handleToggleCoffeeChats = async (v: boolean) => {
    setCoffeeChats(v);
    if (userId) await updateHostAvailability(userId, { open_to_coffee_chats: v }).catch(() => {});
  };
  const handleToggleReferrals = async (v: boolean) => {
    setReferrals(v);
    if (userId) await updateHostAvailability(userId, { open_to_referrals: v }).catch(() => {});
  };
  const handleToggleResumeFeedback = async (v: boolean) => {
    setResumeFeedback(v);
    if (userId) await updateHostAvailability(userId, { open_to_resume_feedback: v }).catch(() => {});
  };
  const handleCapacityChange = async (v: string) => {
    setCapacity(v);
    if (userId) await updateHostCapacity(userId, parseInt(v, 10) || 3).catch(() => {});
  };

  const handleEnableHostMode = async () => {
    if (!userId) return;
    setEnablingHostMode(true);
    try {
      await updateProfile(userId, { role_type: "referral_host" });
      await upsertHostSettings(userId, {});
      await refreshProfile();
      toast.success("Host mode enabled! You can now receive referral requests.");
    } catch {
      toast.error("Couldn't enable host mode — please try again.");
    } finally {
      setEnablingHostMode(false);
    }
  };

  const incoming = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");

  const updateStatus = (id: string, status: RequestStatus, nextAction?: IncomingRequest["nextAction"]) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, nextAction } : r)));
  };

  const onAccept = async (r: IncomingRequest) => {
    const action: IncomingRequest["nextAction"] =
      r.type === "Coffee chat" ? "Schedule chat" : r.type === "Resume feedback" ? "Review resume" : "Submit referral";
    updateStatus(r.id, "accepted", action);
    await updateReferralStatus(r.id, "Accepted" as ThreadStatus);
    refetch();
    toast.success("Accepted — they'll be notified gently");
  };
  const onDecline = async (r: IncomingRequest) => {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    await updateReferralStatus(r.id, "Declined" as ThreadStatus);
    refetch();
    toast("Declined kindly");
  };
  const onAskMore = () => toast.success("Sent a quick follow-up question");
  const onComplete = async (r: IncomingRequest) => {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    await updateReferralStatus(r.id, "Completed" as ThreadStatus);
    refetch();
    toast.success(`Marked complete with ${getUser(r.candidateId)?.name.split(" ")[0]}`);
  };

  // referral_host and admin can access the host dashboard without a prompt
  const isHost = !profile || profile.role_type === "referral_host" || profile.role_type === "admin";

  return (
    <div className="space-y-8">
      {/* Soft role prompt — shown when user is not yet a host */}
      {!isHost && (
        <div className="rounded-3xl bg-cream border border-clay/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg text-foreground">Become a referral host</p>
            <p className="text-sm text-muted-foreground mt-1">
              Enable host mode to receive referral requests from candidates in live rooms.
            </p>
          </div>
          <Button variant="hero" size="sm" onClick={handleEnableHostMode} disabled={enablingHostMode}>
            {enablingHostMode ? "Enabling…" : "Enable host mode"}
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">Host space</p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground mt-1">Help someone get seen.</h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Review requests, set your capacity, and support candidates you genuinely trust.
          </p>
        </div>
      </header>

      {/* Stats — derived from live request counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Monthly capacity" value={capacity} tone="primary" icon={Users} hint="You set the pace" />
        <StatCard label="Requests received" value={requests.length} tone="clay" icon={Inbox} />
        <StatCard label="Accepted" value={accepted.length} tone="olive" icon={CheckCircle2} />
        <StatCard label="Referrals made" value={requests.filter((r) => r.nextAction === "Submit referral").length} icon={Handshake} hint="This month" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Incoming */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-2xl text-foreground">Incoming requests</h2>
                <p className="text-sm text-muted-foreground">Take your time — there's no penalty for saying no.</p>
              </div>
              <span className="text-xs text-muted-foreground">{incoming.length} waiting</span>
            </div>

            {incoming.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-cream/40 p-8 text-center text-sm text-muted-foreground">
                You're all caught up. Nicely done.
              </p>
            ) : (
              <div className="space-y-4">
                {incoming.map((r) => {
                  const c = getUser(r.candidateId)!;
                  return (
                    <article key={r.id} className="rounded-2xl border border-border bg-cream/40 p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-start gap-3 min-w-0">
                          <UserAvatar user={c} size="md" />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.role} · {c.location}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
                          {r.type}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground/80">
                        <span className="font-medium">→ {r.targetRole}</span>
                        <span className="text-muted-foreground">at {r.targetCompany}</span>
                      </div>

                      <p className="mt-3 text-sm text-foreground/85 italic border-l-2 border-clay/40 pl-3">"{r.message}"</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.skills.map((s) => (
                          <span key={s} className="rounded-full bg-card border border-border px-2.5 py-0.5 text-[11px] text-foreground/70">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="hero" onClick={() => onAccept(r)}>
                          <CheckCircle2 className="h-4 w-4" />Accept
                        </Button>
                        <Button size="sm" variant="soft" onClick={onAskMore}>
                          <HelpCircle className="h-4 w-4" />Ask for more info
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onDecline(r)} className="text-muted-foreground">
                          Decline
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Accepted */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="font-display text-2xl text-foreground">Accepted candidates</h2>
                <p className="text-sm text-muted-foreground">Move them forward when you have a moment.</p>
              </div>
              <StatusBadge status="accepted" />
            </div>

            {accepted.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-cream/40 p-8 text-center text-sm text-muted-foreground">
                Nothing in motion right now.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {accepted.map((r) => {
                  const c = getUser(r.candidateId)!;
                  const action = r.nextAction ?? "Mark complete";
                  const meta = nextActionMeta[action];
                  const Icon = meta.icon;
                  return (
                    <li key={r.id} className="py-4 flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar user={c} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {c.name} <span className="text-muted-foreground font-normal">· {r.targetRole} at {r.targetCompany}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{r.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={meta.variant}
                          onClick={() => action === "Mark complete" ? onComplete(r) : toast.success(action)}
                        >
                          <Icon className="h-4 w-4" />{action}
                        </Button>
                        {action !== "Mark complete" && (
                          <Button size="sm" variant="ghost" onClick={() => onComplete(r)}>
                            <CheckCircle2 className="h-4 w-4" />Done
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Availability */}
          <section className="rounded-3xl bg-cream border border-border p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-clay" />
              <h3 className="font-display text-lg text-foreground">Availability</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">You're in control. Adjust anytime.</p>

            <div className="mt-5 space-y-4">
              <ToggleRow
                icon={Coffee}
                label="Open to coffee chats"
                checked={coffeeChats}
                onCheckedChange={handleToggleCoffeeChats}
              />
              <ToggleRow
                icon={Handshake}
                label="Open to referrals"
                checked={referrals}
                onCheckedChange={handleToggleReferrals}
              />
              <ToggleRow
                icon={FileText}
                label="Open to resume feedback"
                checked={resumeFeedback}
                onCheckedChange={handleToggleResumeFeedback}
              />

              <div className="pt-2 space-y-2">
                <Label className="text-sm">Monthly capacity</Label>
                <Select value={capacity} onValueChange={handleCapacityChange}>
                  <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "5", "8", "Unlimited"].map((v) => (
                      <SelectItem key={v} value={v}>{v} {v === "Unlimited" ? "" : "per month"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Label className="text-sm">Industries / roles I support</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Operations", "PM", "Engineering", "Newcomers", "Canada"].map((t) => (
                    <span key={t} className="rounded-full bg-card border border-border px-3 py-1 text-xs">{t}</span>
                  ))}
                  <button className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:bg-card">
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Host profile preview */}
          <section className="rounded-3xl bg-card border border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-foreground">How candidates see you</h3>
              <Button variant="ghost" size="sm"><Eye className="h-4 w-4" />Preview</Button>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-cream/50 p-5">
              <div className="flex items-center gap-3">
                <UserAvatar user={host} size="lg" />
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-foreground truncate">{host.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{host.role} · {host.company}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />{host.location}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {coffeeChats && <Badge tone="olive">Coffee chats</Badge>}
                {referrals && <Badge tone="clay">Referrals</Badge>}
                {resumeFeedback && <Badge tone="primary">Resume feedback</Badge>}
              </div>
              <p className="mt-3 text-sm text-foreground/80 line-clamp-3">{host.bio}</p>
              <Button variant="soft" size="sm" className="mt-4 w-full" asChild>
                <a href={`/app/profile`}><ExternalLink className="h-4 w-4" />Open public profile</a>
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const ToggleRow = ({
  icon: Icon,
  label,
  checked,
  onCheckedChange,
}: {
  icon: typeof Coffee;
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card text-clay border border-border">
        <Icon className="h-4 w-4" />
      </span>
      <Label className="text-sm font-medium text-foreground cursor-pointer">{label}</Label>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

const Badge = ({ children, tone }: { children: React.ReactNode; tone: "olive" | "clay" | "primary" }) => {
  const styles = {
    olive: "bg-olive/15 text-olive border-olive/30",
    clay: "bg-clay/15 text-clay border-clay/30",
    primary: "bg-primary/10 text-primary border-primary/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
};

export default HostDashboard;
