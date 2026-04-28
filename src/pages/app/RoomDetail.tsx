import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  Mic,
  ArrowLeft,
  Bookmark,
  Video,
  CheckCircle2,
  Coffee,
  Handshake,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getUser, users } from "@/data/mockData";
import { getRoomById, joinRoom, waitlistRoom, getRoomParticipantStatus } from "@/lib/api/rooms";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/hayy/ErrorState";
import { StatusBadge } from "@/components/hayy/StatusBadge";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { Button } from "@/components/ui/button";

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

// Static content — will be superseded when room_agenda and room_rules tables ship
const agenda = [
  { time: "0:00", title: "Welcome + room rules", desc: "Quick intro to how Hayy rooms work and how to get the most out of today." },
  { time: "0:05", title: "Host introductions", desc: "Hear from operators, recruiters, and analysts inside Canadian corporates." },
  { time: "0:15", title: "Live Q&A", desc: "Bring your questions about resumes, ATS, and the referral process." },
  { time: "0:35", title: "Breakout networking", desc: "Smaller rooms grouped by target industry and city." },
  { time: "0:50", title: "Referral request instructions", desc: "How to send a thoughtful, high-signal referral request after the room." },
];

const hostRoles = [
  { user: users[5], role: "Operations Manager", company: "Top-3 Canadian retailer", openTo: "coffee chats" as const },
  { user: users[3], role: "Recruiter", company: "Tech-forward bank", openTo: "referrals" as const },
  { user: users[2], role: "Product Analyst", company: "Insurance & fintech", openTo: "coffee chats" as const },
  { user: users[1], role: "Founder / Community host", company: "Hayy", openTo: "referrals" as const },
];

const audience = [
  "Early-career professionals",
  "International students",
  "Newcomers to Canada",
  "People targeting corporate roles",
  "People looking to understand referrals",
];

const rules = [
  { title: "Be respectful", desc: "Hayy is a warm, human community — treat every host and member that way." },
  { title: "Don't spam referral requests", desc: "Earn the intro. Quality over quantity, every time." },
  { title: "Ask specific questions", desc: "Specific questions get specific, useful answers." },
  { title: "Follow up professionally", desc: "If a host opens a door, walk through it on time and prepared." },
];

const RoomDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  const { data: room, loading, error, refetch } = useAsync(() => getRoomById(id), [id]);
  const { data: participantStatus, refetch: refetchStatus } = useAsync(
    () => (userId ? getRoomParticipantStatus(id, userId) : Promise.resolve(null)),
    [id, userId],
  );

  const [joining, setJoining] = useState(false);
  const [waitlisting, setWaitlisting] = useState(false);

  const handleJoin = async () => {
    if (!userId) { toast.error("Please sign in to join."); return; }
    setJoining(true);
    try {
      const { error: err } = await joinRoom(id, userId);
      if (err) throw err;
      await refetchStatus();
      toast.success("You're registered!", { description: "Head into the live room when it starts." });
      // Navigate directly into the live room
      navigate(`/app/rooms/${id}/live`);
    } catch {
      toast.error("Couldn't join the room — please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleWaitlist = async () => {
    if (!userId) { toast.error("Please sign in to join the waitlist."); return; }
    setWaitlisting(true);
    try {
      const { error: err } = await waitlistRoom(id, userId);
      if (err) throw err;
      await refetchStatus();
      toast.success("Added to waitlist!", { description: "We'll let you know if a spot opens up." });
    } catch {
      toast.error("Couldn't join the waitlist — please try again.");
    } finally {
      setWaitlisting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState description="Couldn't load this room." onRetry={refetch} />;
  }

  if (!room) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-display text-2xl">Room not found</h2>
        <Link to="/app/rooms" className="text-primary mt-4 inline-block">← Back to rooms</Link>
      </div>
    );
  }

  const isRegistered = participantStatus === "registered";
  const isWaitlisted = participantStatus === "waitlisted";
  const isWaitlistRoom = room.access === "waitlist";

  return (
    <div className="space-y-10">
      <Link to="/app/rooms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />Back to rooms
      </Link>

      {/* Hero */}
      <div className={`${room.coverColor} rounded-3xl p-8 md:p-12 text-clay-foreground relative overflow-hidden shadow-warm`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/95 text-foreground px-3 py-1 text-[11px] font-medium uppercase tracking-wider">
            Founding Room
          </span>
          <StatusBadge status={room.status} className="bg-card/90 text-foreground border-transparent" />
        </div>

        <h1 className="font-display text-3xl md:text-5xl mt-5 max-w-3xl leading-tight">{room.title}</h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg opacity-95">
          Meet professionals inside target companies, ask questions, and learn how to turn a conversation into a warm intro.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm opacity-95">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{fmtDateTime(room.startsAt)}</span>
          <span className="flex items-center gap-1.5"><Video className="h-4 w-4" />Online · Hayy live room</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{room.attendees} going</span>
          <span className="flex items-center gap-1.5"><Mic className="h-4 w-4" />{room.speakers} speakers</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {isRegistered ? (
            <Button
              size="lg"
              variant="soft"
              className="bg-card text-foreground hover:bg-cream"
              onClick={() => navigate(`/app/rooms/${room.id}/live`)}
            >
              Enter room
            </Button>
          ) : isWaitlisted ? (
            <Button size="lg" variant="soft" className="bg-card text-foreground hover:bg-cream" disabled>
              On waitlist
            </Button>
          ) : isWaitlistRoom ? (
            <Button
              size="lg"
              variant="soft"
              className="bg-card text-foreground hover:bg-cream"
              onClick={handleWaitlist}
              disabled={waitlisting}
            >
              {waitlisting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {waitlisting ? "Joining waitlist…" : "Join waitlist"}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="soft"
              className="bg-card text-foreground hover:bg-cream"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {joining ? "Joining…" : "Join room"}
            </Button>
          )}
          <Button size="lg" variant="ghost" className="text-clay-foreground hover:bg-card/15 hover:text-clay-foreground">
            <Bookmark className="h-4 w-4" />Save room
          </Button>
        </div>

        {(isRegistered || isWaitlisted) && (
          <p className="mt-3 text-sm opacity-80">
            {isRegistered ? "✓ You're registered for this room." : "You're on the waitlist — we'll notify you if a spot opens."}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground">About this room</h2>
            <div className="mt-4 space-y-3 text-foreground/80 leading-relaxed">
              <p>
                {room.description ||
                  "This is a founding Hayy room built for anyone trying to break into corporate roles in Canada — whether you're an international student, a newcomer, or an early-career professional pivoting into a bigger company."}
              </p>
            </div>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {[
                "How warm referrals move through ATS systems",
                "What hiring managers actually scan for",
                "How to position your story for Canadian roles",
                "How to ask for a referral without it feeling cold",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-clay shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Agenda — TODO: load from DB when room_agenda table exists */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground">Agenda</h2>
            <ol className="mt-6 relative border-l border-border ml-3 space-y-6">
              {agenda.map((a) => (
                <li key={a.title} className="pl-6 relative">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-clay ring-4 ring-card" />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.time}</span>
                    <p className="font-display text-base font-semibold text-foreground">{a.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Hosts — TODO: load from room_participants where role = host */}
          <section className="rounded-3xl bg-card border border-border p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground">Hosts</h2>
            <p className="mt-1 text-sm text-muted-foreground">Real people inside corporate Canada — here to help.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {hostRoles.map((h) => {
                const Icon = h.openTo === "coffee chats" ? Coffee : Handshake;
                return (
                  <div key={h.role} className="rounded-2xl border border-border bg-cream/40 p-4 flex gap-4">
                    <UserAvatar user={h.user} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-foreground truncate">{h.user.name}</p>
                      <p className="text-sm text-foreground/80">{h.role}</p>
                      <p className="text-xs text-muted-foreground truncate">{h.company}</p>
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-olive/15 text-olive px-2.5 py-0.5 text-[11px] font-medium">
                        <Icon className="h-3 w-3" />Open to {h.openTo}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-3xl bg-cream border border-border p-6">
            <h3 className="font-display text-lg text-foreground">Who should join</h3>
            <ul className="mt-4 space-y-3">
              {audience.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-clay shrink-0 mt-0.5" />{a}
                </li>
              ))}
            </ul>
          </section>

          {/* Rules — TODO: load from DB when room_rules table exists */}
          <section className="rounded-3xl bg-card border border-border p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-clay" />
              <h3 className="font-display text-lg text-foreground">Room rules</h3>
            </div>
            <ul className="mt-4 space-y-4">
              {rules.map((r) => (
                <li key={r.title}>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-cream border border-border p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-clay">Topics</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {room.tags.length > 0 ? (
                room.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-xs">{t}</span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No tags yet</span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetail;
