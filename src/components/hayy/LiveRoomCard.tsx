import { Mic, Hand, Radio, MessageSquare, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const speakers = [
  { initials: "AM", name: "Amira", role: "Host", color: "bg-gradient-to-br from-primary to-clay", speaking: true },
  { initials: "SK", name: "Sarah", role: "Speaker", color: "bg-gradient-to-br from-clay to-primary/80", speaking: true },
  { initials: "JR", name: "James", role: "Speaker", color: "bg-gradient-to-br from-olive to-olive/70", speaking: false },
];

const listeners = [
  { initials: "PD", color: "bg-clay/80" },
  { initials: "NL", color: "bg-olive/80" },
  { initials: "TF", color: "bg-primary/80" },
  { initials: "RK", color: "bg-bronze/80" },
  { initials: "+58", color: "bg-secondary text-foreground" },
];

export const LiveRoomCard = () => {
  return (
    <div className="relative">
      {/* Premium decorative blobs */}
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br from-clay/25 to-transparent blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-olive/20 to-transparent blur-3xl" />
      <div className="absolute top-1/2 -right-8 h-24 w-24 rounded-xl bg-primary/10 rotate-12 blur-2xl" />

      <div className="relative rounded-[2rem] bg-card/95 backdrop-blur-sm p-7 sm:p-8 shadow-elevated border border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-clay/15 border border-clay/25 px-3.5 py-1.5 text-xs font-semibold text-clay uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
              </span>
              Live now
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="h-4 w-4" />
            <Radio className="h-4 w-4" />
          </div>
        </div>

        {/* Room title */}
        <h3 className="font-display text-2xl sm:text-[1.75rem] font-semibold text-foreground leading-tight mb-2">
          Breaking Into Corporate Roles in Canada
        </h3>
        <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-olive" />
          Hosted by Hayy Community
        </p>

        {/* Speakers grid */}
        <div className="mb-5">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-3">On stage</p>
          <div className="grid grid-cols-3 gap-3">
            {speakers.map((s, i) => (
              <div key={i} className="relative group">
                <div className={`aspect-square rounded-2xl ${s.color} flex flex-col items-center justify-center text-white shadow-soft transition-transform group-hover:scale-[1.02]`}>
                  <span className="text-lg font-semibold">{s.initials}</span>
                  <span className="text-[10px] opacity-80 mt-0.5">{s.name}</span>
                </div>
                {/* Speaking indicator */}
                {s.speaking && (
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card flex items-center justify-center border-2 border-clay shadow-soft">
                    <Mic className="h-3 w-3 text-clay" />
                  </span>
                )}
                {/* Role badge */}
                <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-md bg-card border border-border text-[9px] font-medium text-foreground shadow-soft">
                  {s.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Listeners */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/60">
          <div className="flex -space-x-2">
            {listeners.map((l, i) => (
              <div
                key={i}
                className={`h-8 w-8 rounded-full ${l.color} flex items-center justify-center text-[10px] font-semibold text-white border-2 border-card`}
              >
                {l.initials}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="font-semibold text-foreground">3</span> speakers</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span><span className="font-semibold text-foreground">64</span> listening</span>
          </div>
        </div>

        {/* Live question bubble */}
        <div className="rounded-2xl bg-gradient-to-br from-cream to-sand/50 border border-border/60 p-4 mb-5 relative">
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-medium text-clay uppercase tracking-wider flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            Live question
          </div>
          <p className="text-sm text-foreground italic leading-relaxed mt-1 font-display">
            &ldquo;How do I ask for a referral without sounding transactional?&rdquo;
          </p>
        </div>

        {/* CTA */}
        <Button variant="hero" className="w-full group" size="lg" asChild>
          <Link to="/signup">
            <Hand className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            Sign up to enter the room
          </Link>
        </Button>
        
        {/* Subtle trust indicator */}
        <p className="text-center text-[11px] text-muted-foreground mt-4">
          Join 500+ professionals in founding rooms
        </p>
      </div>
    </div>
  );
};
