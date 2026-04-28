import { Mic, Hand, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const participants = [
  { initials: "AM", color: "bg-clay/90" },
  { initials: "SK", color: "bg-olive/90" },
  { initials: "JR", color: "bg-primary/90" },
  { initials: "PD", color: "bg-clay/70" },
  { initials: "NL", color: "bg-olive/70" },
  { initials: "TF", color: "bg-primary/70" },
];

export const LiveRoomCard = () => {
  return (
    <div className="relative">
      {/* decorative blob */}
      <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-clay/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-olive/20 blur-3xl" />

      <div className="relative rounded-3xl bg-card p-6 sm:p-7 shadow-warm border border-border/60">
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-clay/10 px-3 py-1.5 text-xs font-medium text-clay">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-clay" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay" />
            </span>
            Live Room Preview
          </span>
          <Radio className="h-4 w-4 text-muted-foreground" />
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground leading-tight mb-1">
          Breaking Into Corporate Roles in Canada
        </h3>
        <p className="text-sm text-muted-foreground mb-5">Hosted by Hayy Community</p>

        <div className="grid grid-cols-6 gap-2 mb-5">
          {participants.map((p, i) => (
            <div key={i} className="aspect-square relative">
              <div className={`h-full w-full rounded-2xl ${p.color} flex items-center justify-center text-white text-xs font-semibold`}>
                {p.initials}
              </div>
              {i < 2 && (
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card flex items-center justify-center border border-border">
                  <Mic className="h-2.5 w-2.5 text-clay" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-5 pb-5 border-b border-border/60">
          <span><span className="font-semibold text-foreground">8</span> speakers</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span><span className="font-semibold text-foreground">64</span> listening</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-clay font-medium">Live now</span>
        </div>

        <div className="rounded-2xl bg-cream p-4 mb-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Live question</p>
          <p className="text-sm text-foreground italic leading-relaxed">
            "How do I ask for a referral without sounding transactional?"
          </p>
        </div>

        <Button variant="hero" className="w-full" size="lg" asChild>
          <Link to="/signup">
            <Hand className="h-4 w-4" />
            Sign up to join the room
          </Link>
        </Button>
      </div>
    </div>
  );
};
