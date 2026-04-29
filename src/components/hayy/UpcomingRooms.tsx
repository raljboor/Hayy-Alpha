import { Calendar, Users, ArrowUpRight, ArrowRight, Mic, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

const rooms = [
  {
    tag: "Founding Room",
    tagStyle: "bg-gradient-to-r from-clay to-primary text-primary-foreground",
    title: "How to Get Referred Into Corporate Roles in Canada",
    host: "Hayy Community",
    hostInitials: "HC",
    date: "Thursday · 7:00 PM EST",
    attendees: 82,
    speakers: 4,
    cta: "Sign up to join",
    statusVariant: "hero" as const,
    featured: true,
  },
  {
    tag: "Operations",
    tagStyle: "bg-olive/15 text-olive border border-olive/30",
    title: "Breaking Into Amazon, Logistics & Program Management",
    host: "Ops Professionals",
    hostInitials: "OP",
    date: "Next week",
    attendees: 41,
    speakers: 3,
    cta: "Join waitlist",
    statusVariant: "soft" as const,
    featured: false,
  },
  {
    tag: "Newcomers",
    tagStyle: "bg-primary/10 text-primary border border-primary/20",
    title: "Career Access for International Professionals",
    host: "Referral Hosts",
    hostInitials: "RH",
    date: "Coming soon",
    attendees: 29,
    speakers: 2,
    cta: "Get notified",
    statusVariant: "soft" as const,
    featured: false,
  },
];

export const UpcomingRooms = () => {
  const { isAuthenticated } = useAuthContext();
  const viewAllTo = isAuthenticated ? "/app/rooms" : "/signup";

  return (
    <section id="rooms" className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 h-32 w-32 rounded-full border-2 border-dashed border-primary/10 opacity-50" />
      <div className="absolute bottom-20 left-10 h-24 w-24 rounded-xl bg-olive/5 rotate-12" />
      
      <div className="container relative">
        {/* Section header */}
        <div className="max-w-2xl mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            <Sparkles className="h-3 w-3" />
            Upcoming rooms
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight text-balance">
            Start with focused{" "}
            <span className="italic text-primary">career conversations.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Join live rooms designed around specific industries, companies, and career paths.
          </p>
        </div>

        {/* Rooms grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {rooms.map((r) => (
            <article 
              key={r.title} 
              className={`group rounded-[1.75rem] bg-card border p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                r.featured 
                  ? "border-primary/30 shadow-warm hover:shadow-glow" 
                  : "border-border/60 shadow-soft hover:shadow-warm"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${r.tagStyle}`}>
                  {r.featured && <Sparkles className="h-3 w-3" />}
                  {r.tag}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              
              {/* Title */}
              <h3 className="font-display text-xl font-semibold text-foreground leading-snug mb-3 min-h-[3.5rem] text-balance">
                {r.title}
              </h3>
              
              {/* Host */}
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-clay/20 flex items-center justify-center text-xs font-semibold text-foreground">
                  {r.hostInitials}
                </div>
                <span className="text-sm text-muted-foreground">Hosted by {r.host}</span>
              </div>

              {/* Meta info */}
              <div className="space-y-2.5 text-sm text-muted-foreground mb-6 flex-1">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-clay" />
                  <span>{r.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-clay" />
                    {r.attendees} signed up
                  </span>
                  <span className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-olive" />
                    {r.speakers} speakers
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button variant={r.statusVariant} className="w-full group/btn" asChild>
                <Link to="/signup">
                  {r.cta}
                  <ArrowRight className="h-4 w-4 opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-12 flex justify-center">
          <Button variant="soft" size="lg" asChild className="group">
            <Link to={viewAllTo}>
              View all rooms
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
