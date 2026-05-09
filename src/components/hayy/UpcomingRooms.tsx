import { Calendar, Users, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";

const rooms = [
  {
    tag: "Founding Room",
    tagBg: "var(--clay)",
    tagColor: "var(--paper)",
    title: "How to Get Referred Into Corporate Roles in Canada",
    host: "Hayy Community",
    date: "Thursday · 7:00 PM EST",
    attendees: "82 signed up",
    cta: "Sign up to join",
    statusVariant: "hero" as const,
  },
  {
    tag: "Operations",
    tagBg: "hsl(75 22% 38% / 0.15)",
    tagColor: "var(--olive)",
    title: "Breaking Into Amazon, Logistics & Program Management",
    host: "Ops Professionals",
    date: "Next week",
    attendees: "41 signed up",
    cta: "Sign up to waitlist",
    statusVariant: "soft" as const,
  },
  {
    tag: "Newcomers",
    tagBg: "hsl(12 58% 34% / 0.1)",
    tagColor: "var(--clay)",
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
    <section id="rooms" className="py-12 md:py-16" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div className="max-w-2xl mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--clay)",
                display: "block",
                marginBottom: 12,
              }}
            >
              Upcoming rooms
            </span>
            <h2
              className="font-display font-medium"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--ink)",
              }}
            >
              Start with focused{" "}
              <span style={{ fontStyle: "italic", color: "var(--clay)" }}>career conversations.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {rooms.map((r) => (
            <div
              key={r.title}
              className="group rounded-3xl p-7 flex flex-col hover:shadow-warm transition-all"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  className="inline-block text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: r.tagBg, color: r.tagColor }}
                >
                  {r.tag}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-colors" style={{ color: "var(--ink-mute)" }} />
              </div>
              <h3
                className="font-display font-semibold leading-snug mb-2 min-h-[3.5rem]"
                style={{ fontSize: 19, color: "var(--ink)" }}
              >
                {r.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 20 }}>
                Hosted by {r.host}
              </p>

              <div className="space-y-2.5 flex-1 mb-6" style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: "var(--clay)" }} />
                  {r.date}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" style={{ color: "var(--clay)" }} />
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
