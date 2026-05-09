import { Briefcase, Users2, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Sparkles, text: "Live Q&A rooms with curated audiences" },
  { icon: Users2, text: "Meet candidates referred by trusted hosts" },
  { icon: Briefcase, text: "See talent in conversation, before applications" },
];

export const ForRecruiters = () => {
  return (
    <section id="recruiters" className="py-12 md:py-16" style={{ background: "var(--bg)" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="order-2 lg:order-1 relative">
            <div
              className="absolute -top-8 -left-8 h-40 w-40 rounded-full blur-3xl"
              style={{ background: "hsl(75 22% 38% / 0.2)" }}
            />
            <div
              className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full blur-3xl"
              style={{ background: "hsl(12 58% 34% / 0.2)" }}
            />

            <div
              className="relative rounded-3xl p-7 shadow-warm"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--clay)",
                  }}
                >
                  Recruiter view
                </span>
                <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>Live signal</span>
              </div>

              <h4 className="font-display font-semibold" style={{ fontSize: 19, color: "var(--ink)" }}>
                Warm candidate
              </h4>
              <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>From "Breaking Into Amazon" room</p>

              <div className="mt-5 flex items-center gap-3 pb-5" style={{ borderBottom: "1px solid var(--line)" }}>
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center font-display font-semibold"
                  style={{ background: "var(--clay)", color: "var(--paper)" }}
                >
                  AK
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: "var(--ink)" }}>Amira Khan</p>
                  <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>Operations · Toronto</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: "hsl(12 58% 34% / 0.1)", color: "var(--clay)" }}
                >
                  92 match
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-5" style={{ borderBottom: "1px solid var(--line)" }}>
                <div>
                  <p className="font-display text-2xl font-semibold" style={{ color: "var(--clay)" }}>12</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Rooms attended</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold" style={{ color: "var(--clay)" }}>3</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Warm referrals</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold" style={{ color: "var(--clay)" }}>98%</p>
                  <p style={{ fontSize: 11, color: "var(--ink-mute)" }}>Reply rate</p>
                </div>
              </div>

              <div className="pt-5 flex gap-2">
                <Button variant="hero" size="sm" className="flex-1">Open intro</Button>
                <Button variant="soft" size="sm" className="flex-1">Save</Button>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
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
              For recruiters
            </span>
            <h2
              className="font-display font-medium"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--ink)",
                marginBottom: 20,
              }}
            >
              Host better{" "}
              <span style={{ fontStyle: "italic", color: "var(--clay)" }}>hiring conversations.</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 32 }}>
              Create live Q&A rooms, meet referred candidates, and see talent before the application stage.
            </p>

            <ul className="space-y-3 mb-8">
              {perks.map((p) => (
                <li key={p.text} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(75 22% 38% / 0.15)", color: "var(--olive)" }}
                  >
                    <p.icon className="h-3.5 w-3.5" />
                  </span>
                  <span style={{ color: "var(--ink)" }}>{p.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup?type=recruiter">
                  Explore recruiter tools
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="soft" size="lg" asChild>
                <Link to="/signup?type=recruiter">Host a hiring room</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
