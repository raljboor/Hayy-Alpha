import { Calendar, Users, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

const rooms = [
  {
    tag: "Founding Room",
    tagStyle: "bg-clay text-clay-foreground",
    title: "How to Get Referred Into Corporate Roles in Canada",
    host: "Hayy Community",
    date: "Thursday · 7:00 PM EST",
    attendees: "82 signed up",
    cta: "Sign up to join",
    statusVariant: "hero" as const,
  },
  {
    tag: "Operations",
    tagStyle: "bg-olive/15 text-olive",
    title: "Breaking Into Amazon, Logistics & Program Management",
    host: "Ops Professionals",
    date: "Next week",
    attendees: "41 signed up",
    cta: "Sign up to waitlist",
    statusVariant: "soft" as const,
  },
  {
    tag: "Newcomers",
    tagStyle: "bg-primary/10 text-primary",
    title: "Career Access for International Professionals",
    host: "Referral Hosts",
    date: "Coming soon",
    attendees: "29 interested",
    cta: "Sign up to get notified",
    statusVariant: "soft" as const,
  },
];

export const UpcomingRooms = () => {
  const { isAuthenticated } = useAuthContext();
  const viewAllTo = isAuthenticated ? "/app/rooms" : "/signup";

  return (
    <section id="rooms" className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-clay mb-3 block">Upcoming rooms</span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight">
              Start with focused <span className="italic text-primary">career conversations.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {rooms.map((r) => (
            <div key={r.title} className="group rounded-3xl bg-card border border-border p-7 flex flex-col hover:shadow-warm transition-all">
              <div className="flex items-center justify-between mb-5">
                <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${r.tagStyle}`}>
                  {r.tag}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground leading-snug mb-2 min-h-[3.5rem]">
                {r.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">Hosted by {r.host}</p>

              <div className="space-y-2.5 text-sm text-muted-foreground mb-6 flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-clay" />
                  {r.date}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-clay" />
                  {r.attendees}
                </div>
              </div>

              <Button variant={r.statusVariant} className="w-full" asChild>
                <Link to="/signup">{r.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="soft" size="lg" asChild>
            <Link to={viewAllTo}>
              View all rooms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
