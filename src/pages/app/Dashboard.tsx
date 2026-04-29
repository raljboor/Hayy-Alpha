import { Link } from "react-router-dom";
import { ArrowRight, Mic, Handshake, Users, Sparkles, Coffee, Check, MessageSquare, Bell, Calendar, Star } from "lucide-react";
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

const mockMe = users[0];

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
    <div className="space-y-10 sm:space-y-14">
      {/* Welcome Header */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream via-card to-sand/50 border border-border p-6 sm:p-8 lg:p-10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-clay/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 pattern-arabesque opacity-30" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Star className="h-3 w-3" />
              Founding Member
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
              Welcome back,{" "}
              <span className="italic text-primary">{me.name.split(" ")[0]}.</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
              Your career command center — calm, warm, and built around real people.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <Link to="/app/rooms">
                <Calendar className="h-4 w-4" />
                Browse Rooms
              </Link>
            </Button>
            <Button asChild variant="hero" size="lg" className="rounded-xl shadow-warm">
              <Link to="/app/referrals">
                Request Referral
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Referral requests" 
            value={6} 
            tone="primary" 
            icon={Handshake}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard 
            label="Accepted chats" 
            value={3} 
            tone="clay" 
            icon={Coffee}
            hint="2 pending responses"
          />
          <StatCard 
            label="Rooms joined" 
            value={2} 
            tone="olive" 
            icon={Mic}
          />
          <StatCard 
            label="Host intros" 
            value={1} 
            icon={Sparkles}
            hint="Keep building momentum"
          />
        </div>
      </section>

      {/* Suggested Rooms */}
      <section>
        <SectionHeader
          eyebrow="Curated for you"
          title="Suggested rooms"
          description="Live and upcoming spaces matched to your goals."
          action={
            <Button asChild variant="soft" size="sm" className="rounded-xl">
              <Link to="/app/rooms">Browse all</Link>
            </Button>
          }
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

      {/* Pending Follow-ups + Profile Checklist */}
      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionHeader
            eyebrow="Stay warm"
            title="Pending follow-ups"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/app/referrals">
                  All referrals
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
          <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
            <ul className="divide-y divide-border">
              {pending.length === 0 ? (
                <li className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                    <Handshake className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No pending follow-ups</p>
                </li>
              ) : (
                pending.map((r) => {
                  const counterpart = getUser(r.hostId);
                  if (!counterpart) return null;
                  return (
                    <li key={r.id} className="group">
                      <Link 
                        to="/app/referrals"
                        className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-cream/50"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <UserAvatar user={counterpart} size="md" />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                              {counterpart.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {r.role} · {r.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <StatusBadge status={r.status} />
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>

        {/* Profile Completion Card */}
        <aside className="rounded-3xl bg-gradient-to-b from-cream to-cream/50 border border-border p-6 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 pattern-arabesque opacity-20" />
          
          <div className="relative">
            <p className="text-xs font-medium uppercase tracking-widest text-clay">Profile completion</p>
            <h3 className="font-display text-3xl text-foreground mt-1">{pct}%</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Hosts say yes more often to complete profiles.
            </p>

            <div className="mt-5 h-2 w-full rounded-full bg-border/80 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-clay rounded-full transition-all duration-500" 
                style={{ width: `${pct}%` }} 
              />
            </div>

            <ul className="mt-6 space-y-3 flex-1">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  <span className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all",
                    c.done 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-card border-border text-transparent hover:border-primary/30",
                  )}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className={cn(
                    "transition-colors",
                    c.done ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>

            <Button asChild variant="hero" size="sm" className="mt-6 w-full rounded-xl">
              <Link to="/app/profile">Complete profile</Link>
            </Button>
          </div>
        </aside>
      </section>

      {/* Messages + Notifications */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Latest Messages */}
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-cream/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-clay/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-clay" />
              </div>
              <h3 className="font-display text-xl text-foreground">Messages</h3>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/messages">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {threadsQ.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="p-4"><Skeleton className="h-14 w-full rounded-xl" /></li>
              ))
            ) : threadsQ.error ? (
              <li className="p-6 text-sm text-muted-foreground text-center">Couldn&apos;t load messages.</li>
            ) : threads.length === 0 ? (
              <li className="p-8 text-center">
                <p className="text-muted-foreground">No messages yet.</p>
              </li>
            ) : (
              threads.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/app/referrals/${t.id}`}
                    className={cn(
                      "flex items-start gap-4 p-4 transition-colors hover:bg-cream/50 group",
                      t.unread && "bg-clay/5",
                    )}
                  >
                    <UserAvatar user={t.person} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {t.person.name}
                        </p>
                        {t.unread && <UnreadDot />}
                        <span className="ml-auto text-xs text-muted-foreground shrink-0">{t.lastUpdated}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{t.lastPreview}</p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-cream/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-olive/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-olive" />
              </div>
              <h3 className="font-display text-xl text-foreground">Notifications</h3>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/notifications">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {notificationsQ.loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="p-4"><Skeleton className="h-14 w-full rounded-xl" /></li>
              ))
            ) : notificationsQ.error ? (
              <li className="p-6 text-sm text-muted-foreground text-center">Couldn&apos;t load notifications.</li>
            ) : notifications.length === 0 ? (
              <li className="p-8 text-center">
                <p className="text-muted-foreground">No activity yet.</p>
              </li>
            ) : (
              notifications.slice(0, 3).map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "p-4 flex items-start gap-4 transition-colors hover:bg-cream/50",
                    n.unread && "bg-clay/5",
                  )}
                >
                  <span className="h-10 w-10 rounded-xl bg-secondary inline-flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-clay" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                        {n.type}
                      </p>
                      {n.unread && <UnreadDot />}
                      <span className="ml-auto text-xs text-muted-foreground">{n.time}</span>
                    </div>
                    <p className={cn(
                      "text-sm mt-1 leading-relaxed",
                      n.unread ? "font-medium text-foreground" : "text-foreground/85"
                    )}>
                      {n.title}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* Recommended Hosts */}
      <section>
        <SectionHeader
          eyebrow="Warm intros"
          title="Recommended hosts"
          description="People in your target companies who are open to a conversation right now."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedHosts.map(({ user, capacity }) => (
            <article 
              key={user.id} 
              className="group rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-warm transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-center gap-4">
                  <UserAvatar user={user} size="lg" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      {user.verified && (
                        <span className="h-5 w-5 rounded-full bg-clay/10 flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-clay" />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.role}{user.company && ` · ${user.company}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-olive animate-pulse" />
                  <span className="text-olive font-medium">{capacity}</span>
                </div>

                <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {user.bio}
                </p>

                <Button variant="hero" size="sm" className="mt-5 w-full rounded-xl">
                  <Coffee className="h-4 w-4" />
                  Request coffee chat
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Founding Member CTA */}
      <section className="rounded-3xl bg-gradient-to-br from-primary via-primary to-clay text-primary-foreground p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute inset-0 pattern-arabesque opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium mb-3">
              <Users className="h-4 w-4" />
              Founding member
            </div>
            <h3 className="font-display text-2xl sm:text-3xl leading-tight">
              Help shape what Hayy becomes next.
            </h3>
            <p className="mt-2 text-primary-foreground/80">
              Your feedback directly influences our roadmap.
            </p>
          </div>
          <Button 
            variant="soft" 
            size="lg"
            className="bg-white text-primary hover:bg-cream shadow-lg rounded-xl shrink-0" 
            asChild
          >
            <Link to="/app/settings">Share feedback</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
