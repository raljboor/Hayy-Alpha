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
    <section id="recruiters" className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-8 -left-8 h-40 w-40 rounded-full bg-olive/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-clay/20 blur-3xl" />

            <div className="relative rounded-3xl bg-card border border-border p-7 shadow-warm">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-medium uppercase tracking-widest text-clay">Recruiter view</span>
                <span className="text-[11px] text-muted-foreground">Live signal</span>
              </div>

              <h4 className="font-display text-xl font-semibold text-foreground">Warm candidate</h4>
              <p className="text-sm text-muted-foreground">From "Breaking Into Amazon" room</p>

              <div className="mt-5 flex items-center gap-3 pb-5 border-b border-border">
                <div className="h-12 w-12 rounded-2xl bg-gradient-clay text-clay-foreground flex items-center justify-center font-display font-semibold">
                  AK
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Amira Khan</p>
                  <p className="text-xs text-muted-foreground">Operations · Toronto</p>
                </div>
                <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">92 match</span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-5 border-b border-border">
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">12</p>
                  <p className="text-[11px] text-muted-foreground">Rooms attended</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">3</p>
                  <p className="text-[11px] text-muted-foreground">Warm referrals</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">98%</p>
                  <p className="text-[11px] text-muted-foreground">Reply rate</p>
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
            <span className="text-xs font-medium uppercase tracking-widest text-clay mb-3 block">For recruiters</span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-5">
              Host better <span className="italic text-primary">hiring conversations.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Create live Q&A rooms, meet referred candidates, and see talent before the application stage.
            </p>

            <ul className="space-y-3 mb-8">
              {perks.map((p) => (
                <li key={p.text} className="flex items-start gap-3">
                  <span className="mt-0.5 h-7 w-7 rounded-full bg-olive/15 text-olive flex items-center justify-center flex-shrink-0">
                    <p.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground">{p.text}</span>
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
