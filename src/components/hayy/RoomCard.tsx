import { Link } from "react-router-dom";
import { Calendar, Users, Mic, Lock, Clock } from "lucide-react";
import type { Room } from "@/lib/mockData";
import { getUser } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const accessMeta = {
  open: { label: "Open", icon: Users },
  waitlist: { label: "Waitlist", icon: Clock },
  "invite-only": { label: "Invite-only", icon: Lock },
} as const;

const ctaLabel = (room: Room) => {
  if (room.status === "ended") return "Watch replay";
  if (room.access === "open") return room.status === "live" ? "Join" : "Join";
  if (room.access === "waitlist") return "Join waitlist";
  return "Notify me";
};

export const RoomCard = ({ room }: { room: Room }) => {
  const host = getUser(room.hostId);
  const Access = accessMeta[room.access];
  return (
    <article className="group rounded-3xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-warm transition-all hover:-translate-y-0.5 flex flex-col">
      <div className={`${room.coverColor} h-24 relative`}>
        <div className="absolute top-3 left-3"><StatusBadge status={room.status} /></div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground">
            <Access.icon className="h-3 w-3" />{Access.label}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-clay-foreground">
          <span className="text-xs font-medium uppercase tracking-wider opacity-90">{room.category}</span>
          <span className="text-xs opacity-90">{room.company}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-lg font-semibold text-foreground leading-snug">
          <Link to={`/app/rooms/${room.id}`} className="hover:text-primary transition-colors">
            {room.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{room.description}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{fmtDate(room.startsAt)}</span>
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{room.attendees}</span>
          <span className="flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" />{room.speakers}</span>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {host && <UserAvatar user={host} size="sm" />}
            <div className="text-xs min-w-0">
              <p className="font-medium text-foreground truncate">{host?.name}</p>
              <p className="text-muted-foreground truncate">{host?.role}</p>
            </div>
          </div>
          <Button asChild size="sm" variant={room.status === "live" ? "hero" : "soft"}>
            <Link to={`/app/rooms/${room.id}`}>{ctaLabel(room)}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
};
