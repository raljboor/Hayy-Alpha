import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Briefcase,
  Users,
  Sparkles,
  CalendarPlus,
  Plus,
  Send,
  Eye,
  Star,
  MessageCircle,
  CalendarIcon,
  Filter,
  TrendingUp,
  Mic,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/hayy/StatCard";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/hayy/EmptyState";
import { ErrorState } from "@/components/hayy/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { users } from "@/lib/mockData";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { isMockMode } from "@/lib/runtimeMode";
import { getRooms, createRoom } from "@/lib/api/rooms";
import {
  getRecruiterCandidates,
  updateRecruiterCandidateStatus,
  archiveRecruiterCandidate,
  type PipelineCandidate,
  type CandidateStatus,
} from "@/lib/api/recruiterCandidates";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ---------------------------------------------------------------------------
// Types / constants
// ---------------------------------------------------------------------------

const statusStyles: Record<CandidateStatus, string> = {
  Referred: "bg-clay/15 text-clay border-clay/30",
  Applied: "bg-primary/10 text-primary border-primary/30",
  Shortlisted: "bg-olive/15 text-olive border-olive/30",
  Interviewed: "bg-accent/30 text-foreground border-accent",
  Archived: "bg-muted text-muted-foreground border-border",
};

const statusFilters: ("All" | CandidateStatus)[] = [
  "All", "Referred", "Applied", "Shortlisted", "Interviewed", "Archived",
];

// Static performance table — will be replaced when analytics tables exist
const performanceRooms = [
  { name: "Amazon Canada Career Room", signups: 184, attendance: 78, questions: 42, requests: 31, shortlisted: 6 },
  { name: "Shopify Engineering Open House", signups: 96, attendance: 71, questions: 28, requests: 19, shortlisted: 4 },
  { name: "Operations Referral Night", signups: 64, attendance: 84, questions: 22, requests: 15, shortlisted: 3 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const RecruiterDashboard = () => {
  const { userId, profile } = useCurrentUser();

  const {
    data: apiCandidates,
    loading: candidatesLoading,
    error: candidatesError,
    refetch: refetchCandidates,
  } = useAsync(
    // Only fetch when userId is known; return [] otherwise so Supabase is never
    // called with a placeholder string that would return RLS-filtered results.
    () => (userId ? getRecruiterCandidates(userId) : Promise.resolve([])),
    [userId],
  );

  const {
    data: apiRooms,
    loading: roomsLoading,
  } = useAsync(() => getRooms(), []);

  // Local pipeline state — seeded from API result
  const [pipeline, setPipeline] = useState<PipelineCandidate[]>([]);

  useEffect(() => {
    // apiCandidates is [] (empty) when Supabase returns no rows — show empty state.
    // apiCandidates is the mock pipeline when Supabase is not configured.
    if (apiCandidates !== null) setPipeline(apiCandidates);
  }, [apiCandidates]);

  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("All");
  const [date, setDate] = useState<Date | undefined>();
  const [creatingRoom, setCreatingRoom] = useState(false);

  // Rooms created by this recruiter.
  // In Supabase mode: filter by hostId = userId (may be empty — that's fine).
  // In mock mode (userId null and Supabase not configured): show first 3 mock rooms.
  const recruiterRooms = useMemo(() => {
    const allRooms = apiRooms ?? [];
    if (isSupabaseConfigured && userId) {
      return allRooms.filter((r) => r.hostId === userId).slice(0, 5);
    }
    // Mock mode: show first 3 as demo upcoming rooms
    return allRooms.slice(0, 3);
  }, [apiRooms, userId]);

  // In mock mode, show demo upcoming rooms when the recruiter has no rooms yet.
  // In Supabase mode, only show real rooms (may be empty — handled in sidebar).
  const mockUpcomingRooms = !isSupabaseConfigured
    ? [
        { id: "er1", title: "Amazon Canada · PMM Q&A", startsAt: new Date(Date.now() + 2 * 86400000).toISOString(), attendees: 142, tags: ["Q&A"] },
        { id: "er2", title: "Shopify Engineering Open House", startsAt: new Date(Date.now() + 5 * 86400000).toISOString(), attendees: 96, tags: ["Open house"] },
        { id: "er3", title: "Newcomer Coffee Chat — Ops", startsAt: new Date(Date.now() + 9 * 86400000).toISOString(), attendees: 38, tags: ["Coffee chat"] },
      ]
    : [];
  const displayRooms = recruiterRooms.length > 0
    ? recruiterRooms.map((r) => ({ id: r.id, title: r.title, startsAt: r.startsAt, attendees: r.attendees, tags: r.tags }))
    : mockUpcomingRooms;

  const filtered = useMemo(
    () => (filter === "All" ? pipeline : pipeline.filter((c) => c.status === filter)),
    [pipeline, filter],
  );

  const counts = useMemo(
    () => ({
      activeRooms: displayRooms.length,
      referred: pipeline.length,
      shortlisted: pipeline.filter((c) => c.status === "Shortlisted").length,
      interviews: pipeline.filter((c) => c.status === "Interviewed").length,
    }),
    [pipeline, displayRooms.length],
  );

  // Recruiters can create hiring rooms; all other roles see the form disabled.
  const isRecruiter = isMockMode
    ? true
    : profile?.role_type === "recruiter" || profile?.role_type === "admin";

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;

    setCreatingRoom(true);
    try {
      await createRoom({
        title,
        description: String(form.get("desc") ?? ""),
        hostId: userId ?? undefined,
        startsAt: date?.toISOString() ?? new Date(Date.now() + 86400000).toISOString(),
        status: "open",
        room_type: "hiring",
        attendees: 0,
        speakers: 0,
        tags: [],
        company: "",
        category: "Tech",
        coverColor: "bg-primary",
        durationMin: 60,
        access: (String(form.get("visibility") ?? "open")) as "open" | "waitlist" | "invite-only",
      });
      e.currentTarget.reset();
      setDate(undefined);
      toast.success("Hiring room created", { description: "Candidates will be notified gently." });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create room — please try again.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const updateStatus = async (id: string, status: CandidateStatus) => {
    setPipeline((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await updateRecruiterCandidateStatus(id, status).catch(() => {});
    toast.success(`Moved to ${status}`);
  };

  const handleArchive = async (id: string) => {
    setPipeline((prev) => prev.map((c) => (c.id === id ? { ...c, status: "Archived" as CandidateStatus } : c)));
    await archiveRecruiterCandidate(id).catch(() => {});
    toast("Archived");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-clay">Recruiter space</p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground mt-1">
            Create rooms and review referred talent.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Sourced from live conversations and warm referrals — never cold inbound.
          </p>
        </div>
        <Button variant="hero" size="lg" asChild>
          <a href="#create-room"><Plus className="h-4 w-4" />Create Q&A room</a>
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active rooms" value={counts.activeRooms} tone="primary" icon={Briefcase} />
        <StatCard label="Referred candidates" value={counts.referred} tone="clay" icon={Sparkles} />
        <StatCard label="Shortlisted" value={counts.shortlisted} tone="olive" icon={Star} />
        <StatCard label="Interviews scheduled" value={counts.interviews} icon={CalendarPlus} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Create hiring room */}
          <section id="create-room" className="rounded-3xl bg-card border border-border p-6 md:p-8 scroll-mt-20">
            <div className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-clay" />
              <h2 className="font-display text-2xl text-foreground">Create a hiring room</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Warm, low-pressure conversations — not interviews.</p>

            {isRecruiter === false && (
              <div className="mt-4 rounded-2xl border border-border bg-cream/60 px-4 py-3 text-sm text-muted-foreground">
                Hiring rooms are for verified recruiters only. Your other rooms (community, referral) can be created from the Rooms page.
              </div>
            )}

            <form onSubmit={onCreate} className={cn("mt-6 grid sm:grid-cols-2 gap-4", isRecruiter === false && "pointer-events-none opacity-50")}>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="title">Room title</Label>
                <Input id="title" name="title" required placeholder="e.g. Stripe Canada · APAC Ops Q&A" className="bg-cream" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">Attached job</Label>
                <Input id="job" name="job" placeholder="e.g. Operations Analyst · req-2148" className="bg-cream" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept">Department</Label>
                <Input id="dept" name="dept" placeholder="e.g. Operations" className="bg-cream" />
              </div>

              <div className="space-y-2">
                <Label>Date / time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-cream hover:bg-cream",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 opacity-60" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().toDateString())}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Room format</Label>
                <Select name="format" defaultValue="qa">
                  <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qa">Q&A</SelectItem>
                    <SelectItem value="coffee">Coffee chat</SelectItem>
                    <SelectItem value="open-house">Open house</SelectItem>
                    <SelectItem value="referral-night">Referral night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Candidate limit</Label>
                <Input id="limit" name="limit" type="number" min={5} max={500} defaultValue={50} className="bg-cream" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select name="visibility" defaultValue="open">
                  <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="waitlist">Waitlist</SelectItem>
                    <SelectItem value="invite">Invite-only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  name="desc"
                  rows={4}
                  placeholder="Tell candidates what to expect, who's hosting, and how this connects to a real role."
                  className="bg-cream resize-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" variant="hero" size="lg" disabled={creatingRoom || isRecruiter === false}>
                  {creatingRoom ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creatingRoom ? "Creating…" : "Create hiring room"}
                </Button>
              </div>
            </form>
          </section>

          {/* Pipeline */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="font-display text-2xl text-foreground">Candidate pipeline</h2>
                <p className="text-sm text-muted-foreground">Sourced from live rooms and warm referrals.</p>
              </div>
              <Button variant="soft" size="sm"><Filter className="h-4 w-4" />Export</Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={cn(
                    "rounded-full px-3.5 py-1 text-xs font-medium border transition-colors",
                    filter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-cream text-foreground/70 border-border hover:bg-sand",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {candidatesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
              </div>
            ) : candidatesError ? (
              <ErrorState description="Couldn't load the candidate pipeline." onRetry={refetchCandidates} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No candidates in this stage"
                description="Candidates referred from live rooms will appear here."
              />
            ) : (
              <div className="space-y-3">
                {filtered.map((c) => (
                  <article key={c.id} className="rounded-2xl border border-border bg-cream/40 p-4 md:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <UserAvatar
                          user={{ name: c.candidateName, initials: c.candidateInitials, avatarColor: c.candidateAvatarColor }}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{c.candidateName}</p>
                          <p className="text-xs text-muted-foreground truncate">→ {c.targetRole}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">via {c.referralSource}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FitScore score={c.fitScore} />
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
                            statusStyles[c.status],
                          )}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.skills.map((s) => (
                        <span key={s} className="rounded-full bg-card border border-border px-2.5 py-0.5 text-[11px] text-foreground/70">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast(`Opening ${c.candidateName}'s profile`)}>
                        <Eye className="h-4 w-4" />View profile
                      </Button>
                      {c.status !== "Shortlisted" ? (
                        <Button size="sm" variant="hero" onClick={() => updateStatus(c.id, "Shortlisted")}>
                          <Star className="h-4 w-4" />Shortlist
                        </Button>
                      ) : (
                        <Button size="sm" variant="soft" onClick={() => updateStatus(c.id, "Interviewed")}>
                          <Check className="h-4 w-4" />Move to interview
                        </Button>
                      )}
                      <Button size="sm" variant="soft" onClick={() => toast.success(`Message sent to ${c.candidateName.split(" ")[0]}`)}>
                        <MessageCircle className="h-4 w-4" />Message
                      </Button>
                      {c.status !== "Archived" && (
                        <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => handleArchive(c.id)}>
                          Archive
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Room performance — only shown in mock mode; analytics table not yet wired */}
          {isMockMode && <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-clay" />
              <h2 className="font-display text-2xl text-foreground">Room performance</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">How your last rooms turned conversations into pipeline.</p>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm min-w-[640px]">
                <thead className="bg-cream text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-4 font-medium">Room</th>
                    <th className="text-left p-4 font-medium">Signups</th>
                    <th className="text-left p-4 font-medium">Attendance</th>
                    <th className="text-left p-4 font-medium">Questions</th>
                    <th className="text-left p-4 font-medium">Referral requests</th>
                    <th className="text-left p-4 font-medium">Shortlisted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {performanceRooms.map((r) => (
                    <tr key={r.name}>
                      <td className="p-4 font-medium text-foreground">{r.name}</td>
                      <td className="p-4 text-foreground/80">{r.signups}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Progress value={r.attendance} className="h-1.5 w-20" />
                          <span className="text-xs text-muted-foreground">{r.attendance}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground/80">{r.questions}</td>
                      <td className="p-4 text-foreground/80">{r.requests}</td>
                      <td className="p-4">
                        <span className="font-display text-base font-semibold text-clay">{r.shortlisted}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-3xl bg-cream border border-border p-6">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-clay" />
              <h3 className="font-display text-lg text-foreground">Upcoming employer rooms</h3>
            </div>
            {roomsLoading ? (
              <div className="mt-4 space-y-2">
                {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
              </div>
            ) : displayRooms.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-border bg-cream/40 p-5 text-center text-sm text-muted-foreground">
                No rooms yet — create your first hiring room above.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {displayRooms.map((r) => (
                  <li key={r.id} className="rounded-2xl bg-card border border-border p-4">
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(r.startsAt), "EEE, MMM d · p")}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream border border-border px-2 py-0.5 text-foreground/70">
                        {r.tags[0] ?? "Room"}
                      </span>
                      <span className="text-muted-foreground inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />{r.attendees} signups
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="soft" size="sm" className="mt-4 w-full" asChild>
              <a href="/app/rooms">Manage all rooms</a>
            </Button>
          </section>

          {/* Top hosts — mock-only until host discovery is built */}
          {isMockMode && (
            <section className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-display text-lg text-foreground">Top hosts this month</h3>
              <ul className="mt-4 space-y-3">
                {users.slice(1, 4).map((u) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <UserAvatar user={u} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{u.role}{u.company && ` · ${u.company}`}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`Pinged ${u.name.split(" ")[0]}`)}>
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const FitScore = ({ score }: { score: number }) => {
  const tone = score >= 85 ? "text-olive" : score >= 70 ? "text-primary" : "text-muted-foreground";
  return (
    <div className="text-right">
      <p className={cn("font-display text-lg font-semibold leading-none", tone)}>{score}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">Fit</p>
    </div>
  );
};

export default RecruiterDashboard;
