import { Link } from "react-router-dom";
import { Calendar, Users, Mic, Lock, Clock, ArrowRight } from "lucide-react";
import type { Room } from "@/lib/mockData";
import { getUser } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const accessMeta = {
  open: { label: "Open", icon: Users, style: "bg-olive/15 text-olive border-olive/30" },
  waitlist: { label: "Waitlist", icon: Clock, style: "bg-clay/15 text-clay border-clay/30" },
  "invite-only": { label: "Invite-only", icon: Lock, style: "bg-primary/15 text-primary border-primary/30" },
} as const;

const ctaLabel = (room: Room) => {
  if (room.status === "ended") return "Watch replay";
  if (room.access === "open") return room.status === "live" ? "Join now" : "Join";
  if (room.access === "waitlist") return "Join waitlist";
  return "Get notified";
};

export const RoomCard = ({ room }: { room: Room }) => {
  const host = getUser(room.hostId);
  const Access = accessMeta[room.access];
  const isLive = room.status === "live";
  
  return (
    <article className={cn(
      "group rounded-[1.75rem] bg-card border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1",
      isLive 
        ? "border-clay/40 shadow-warm hover:shadow-glow" 
        : "border-border/60 shadow-soft hover:shadow-warm"
    )}>
      {/* Cover / header */}
      <div className={cn(
        "h-28 relative overflow-hidden",
        room.coverColor
      )}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 pattern-geometric opacity-10" />
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <StatusBadge status={room.status} />
        </div>
        
        <div className="absolute top-3 right-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-sm",
            Access.style
          )}>
            <Access.icon className="h-3 w-3" />
            {Access.label}
          </span>
        </div>
        
        {/* Category and company */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-primary-foreground">
          <span className="text-xs font-semibold uppercase tracking-wider bg-background/20 backdrop-blur-sm px-2 py-1 rounded-md">
            {room.category}
          </span>
          {room.company && (
            <span className="text-xs font-medium opacity-90">{room.company}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-2 text-balance">
          <Link 
            to={`/app/rooms/${room.id}`} 
            className="hover:text-primary transition-colors"
          >
            {room.title}
          </Link>
        </h3>
        
        {room.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
            {room.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-clay" />
            {fmtDate(room.startsAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-olive" />
            {room.attendees}
          </span>
          <span className="flex items-center gap-1.5">
            <Mic className="h-3.5 w-3.5 text-primary" />
            {room.speakers}
          </span>
        </div>

        {/* Footer with host info and CTA */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
          {host && (
            <div className="flex items-center gap-2.5 min-w-0">
              <UserAvatar user={host} size="sm" />
              <div className="text-xs min-w-0">
                <p className="font-medium text-foreground truncate">{host.name}</p>
                <p className="text-muted-foreground truncate">{host.role}</p>
              </div>
            </div>
          )}
          <Button 
            asChild 
            size="sm" 
            variant={isLive ? "hero" : "soft"}
            className="shrink-0 group/btn"
          >
            <Link to={`/app/rooms/${room.id}`}>
              {ctaLabel(room)}
              <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
};
