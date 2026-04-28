import { Link } from "react-router-dom";
import { ArrowRight, Mic, Handshake, Users, Sparkles, Coffee, Check, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/hayy/SectionHeader";
import { StatCard } from "@/components/hayy/StatCard";
import { RoomCard } from "@/components/hayy/RoomCard";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { StatusBadge } from "@/components/hayy/StatusBadge";
import { UnreadDot } from "@/components/hayy/InboxPrimitives";
import { RoomCardSkeleton } from "@/components/hayy/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/hayy/ErrorState";
import { users, getUser, type Room } from "@/data/mockData";
import { getRooms } from "@/lib/api/rooms";
import { getReferralRequests, getReferralThreads } from "@/lib/api/referrals";
import { getNotifications } from "@/lib/api/notifications";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

const mockMe = users[0]; // Amira — display fallback in mock mode

const suggestedRoomTitles = [
  "Amazon Canada Career Room",
  "Product, Data & Software Career Room",
  "Career Access for International Professionals",
];

const recommendedHosts = [
  { user: users[1], capacity: "3 chats / month open" },
  { user: users[2], capacity: "2 chats / month open" },
  { user: users[5], capacity: "1 chat / month open" },
];

const checklist = [
  { label: "Add bio", done: true },
  { label: "Add skills", done: true },
  { label: "Add resume", done: false },
  { label: "Add LinkedIn", done: false },
  { label: "Add video intro", done: false },
];

const Dashboard = () => {
  const { userId, profile } = useCurrentUser();
  const me = profile
    ? { name: profile.full_name || mockMe.name, id: userId ?? mockMe.id }
    : mockMe;

  const roomsQ = useAsync(() => getRooms(), []);
  const referralsQ = useAsync(() => getReferralRequests(userId ?? undefined), [userId]);
  const threadsQ = useAsync(() => getReferralThreads(userId ?? undefined), [userId]);
  const notificationsQ = useAsync(() => getNotifications(userId ?? undefined), [userId]);

  const rooms = roomsQ.data ?? [];
  const referralRequests = referralsQ.data ?? [];
  const threads = threadsQ.data ?? [];
  const notifications = notificationsQ.data ?? [];

  // Build a stable list of "suggested rooms" using rooms data + curated titles
  const suggestedRooms: Room[] = suggestedRoomTitles
    .map((title, i): Room | null => {
      const base = rooms[i % rooms.length];
      if (!base) return null;
      return { ...base, id: `s${i}`, title, status: i === 0 ? "live" : "upcoming" };
    })
    .filter((r): r is Room => r !== null);

  const pending = referralRequests.slice(0, 3);
  const completed = checklist.filter((c) => c.done).length;
  const pct = Math.round((completed / checklist.length) * 100);

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
            Welcome back, <span className="italic text-primary">{me.name.split(" ")[0]}.</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Your career command center — calm, warm, and built around real people.
          </p>
        </div>
        <Button asChild variant="hero" size="lg">
          <Link to="/app/rooms">Find a room <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Referral requests" value={6} tone="primary" icon={Handshake} />
        <StatCard label="Accepted chats" value={3} tone="clay" icon={Coffee} />
        <StatCard label="Rooms joined" value={2} tone="olive" icon={Mic} />
        <StatCard label="Host intros" value={1} icon={Sparkles} />
      </div>

      {/* Suggested rooms */}
      <section>
        <SectionHeader
          eyebrow="Curated for you"
          title="Suggested rooms"
          description="Live and upcoming spaces matched to your goals."
          action={<Button asChild variant="soft" size="sm"><Link to="/app/rooms">Browse all</Link></Button>}
        />
        {roomsQ.loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
          </div>
        ) : roomsQ.error ? (
          <ErrorState description="We couldn't load suggested rooms." onRetry={roomsQ.refetch} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suggestedRooms.map((r) => <RoomCard key={r.id} room={r} />)}
          </div>
        )}
      </section>

      {/* Pending follow-ups + Profile checklist (two columns on desktop) */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="Stay warm"
            title="Pending follow-ups"
            action={<Button asChild variant="ghost" size="sm"><Link to="/app/referrals">All referrals <ArrowRight className="h-4 w-4" /></Link></Button>}
          />
          <ul className="rounded-3xl bg-card border border-border divide-y divide-border overflow-hidden">
            {pending.map((r) => {
              const counterpart = getUser(r.hostId);
              if (!counterpart) return null;
              return (
                <li key={r.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={counterpart} size="md" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{counterpart.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.role} · {r.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={r.status} />
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                      <Link to="/app/referrals">View</Link>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Profile completion */}
        <aside className="rounded-3xl bg-cream border border-border p-6 flex flex-col">
          <p className="text-xs font-medium uppercase tracking-widest text-clay">Profile completion</p>
          <h3 className="font-display text-2xl text-foreground mt-1">{pct}% complete</h3>
          <p className="text-sm text-muted-foreground mt-1">Hosts say yes more often to complete profiles.</p>

          <div className="mt-4 h-1.5 w-full rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>

          <ul className="mt-5 space-y-2.5 flex-1">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-center gap-3 text-sm">
                <span className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center shrink-0 border",
                  c.done ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border text-transparent",
                )}>
                  <Check className="h-3 w-3" />
                </span>
                <span className={cn(c.done ? "text-muted-foreground line-through" : "text-foreground")}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>

          <Button asChild variant="soft" size="sm" className="mt-5">
            <Link to="/app/profile">Complete profile</Link>
          </Button>
        </aside>
      </section>

      {/* Latest messages + Notifications */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-clay" />
              <h3 className="font-display text-xl text-foreground">Latest messages</h3>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/messages">Open inbox <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {threadsQ.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="p-4"><Skeleton className="h-12 w-full" /></li>
              ))
            ) : threadsQ.error ? (
              <li className="p-4 text-sm text-muted-foreground">Couldn't load messages.</li>
            ) : threads.length === 0 ? (
              <li className="p-6 text-sm text-muted-foreground text-center">No messages yet.</li>
            ) : (
              threads.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/app/referrals/${t.id}`}
                    className={cn(
                      "flex items-start gap-3 p-4 transition-colors hover:bg-cream/60",
                      t.unread && "bg-clay/5",
                    )}
                  >
                    <UserAvatar user={t.person} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{t.person.name}</p>
                        {t.unread && <UnreadDot />}
                        <span className="ml-auto text-[11px] text-muted-foreground shrink-0">{t.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-0.5">{t.lastPreview}</p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-clay" />
              <h3 className="font-display text-xl text-foreground">Notifications</h3>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/notifications">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {notificationsQ.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="p-4"><Skeleton className="h-12 w-full" /></li>
              ))
            ) : notificationsQ.error ? (
              <li className="p-4 text-sm text-muted-foreground">Couldn't load notifications.</li>
            ) : notifications.length === 0 ? (
              <li className="p-6 text-sm text-muted-foreground text-center">No activity yet.</li>
            ) : (
              notifications.slice(0, 3).map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "p-4 flex items-start gap-3",
                    n.unread && "bg-clay/5",
                  )}
                >
                  <span className="h-9 w-9 rounded-xl bg-secondary inline-flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-clay" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                        {n.type}
                      </p>
                      {n.unread && <UnreadDot />}
                      <span className="ml-auto text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className={cn("text-sm mt-1", n.unread ? "font-medium text-foreground" : "text-foreground/85")}>
                      {n.title}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Recommended hosts */}
      <section>
        <SectionHeader
          eyebrow="Warm intros"
          title="Recommended hosts"
          description="People in your target companies who are open to a conversation right now."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedHosts.map(({ user, capacity }) => (
            <article key={user.id} className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-warm transition-all">
              <div className="flex items-center gap-3">
                <UserAvatar user={user} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-foreground truncate">{user.name}</p>
                    {user.verified && <Sparkles className="h-3.5 w-3.5 text-clay shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.role}{user.company && ` · ${user.company}`}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-foreground/70">
                <span className="h-2 w-2 rounded-full bg-olive" />
                {capacity}
              </div>

              <p className="mt-4 text-sm text-foreground/80 line-clamp-2">{user.bio}</p>

              <Button variant="hero" size="sm" className="mt-5 w-full">
                <Coffee className="h-4 w-4" /> Request coffee chat
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Footer nudge */}
      <div className="rounded-3xl bg-gradient-clay text-clay-foreground p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest opacity-90">Founding member</p>
          <h3 className="font-display text-2xl mt-1">Help shape what Hayy becomes next.</h3>
        </div>
        <Button variant="soft" className="bg-card text-foreground hover:bg-cream" asChild>
          <Link to="/app/settings"><Users className="h-4 w-4" />Share feedback</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
