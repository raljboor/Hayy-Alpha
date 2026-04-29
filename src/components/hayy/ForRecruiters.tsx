import { Briefcase, Users2, Sparkles, ArrowRight, TrendingUp, Star, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const perks = [
  { icon: Sparkles, text: "Live Q&A rooms with curated audiences", highlight: "High engagement" },
  { icon: Users2, text: "Meet candidates referred by trusted hosts", highlight: "Pre-vetted" },
  { icon: Briefcase, text: "See talent in conversation, before applications", highlight: "Real signal" },
];

export const ForRecruiters = () => {
  return (
    <section id="recruiters" className="py-20 md:py-28 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full border-2 border-dashed border-olive/15 opacity-50" />
      <div className="absolute bottom-20 right-20 h-24 w-24 rounded-xl bg-primary/5 -rotate-12" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual - Recruiter dashboard preview */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-gradient-to-br from-olive/20 to-transparent blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-gradient-to-br from-clay/20 to-transparent blur-3xl" />

            <div className="relative rounded-[2rem] bg-card/95 backdrop-blur border border-border/60 p-7 shadow-elevated">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive/15 border border-olive/25 text-xs font-semibold text-olive uppercase tracking-wider">
                  <TrendingUp className="h-3 w-3" />
                  Recruiter view
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive animate-pulse" />
                  Live signal
                </span>
              </div>

              {/* Candidate preview */}
              <div className="rounded-2xl bg-gradient-to-br from-cream to-sand/30 border border-border/60 p-5 mb-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Warm candidate</p>
                
                <div className="flex items-center gap-3 pb-4 border-b border-border/60">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-clay to-primary/80 text-primary-foreground flex items-center justify-center font-display font-semibold text-lg shadow-warm">
                    AK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-lg font-semibold text-foreground">Amira Khan</p>
                      <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-bold text-primary">92%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Operations · Toronto</p>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-3">From &ldquo;Breaking Into Amazon&rdquo; room</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 py-5 border-b border-border/60">
                <div className="text-center">
                  <p className="font-display text-2xl font-semibold text-primary">12</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Rooms attended</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-semibold text-clay">3</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Warm referrals</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-semibold text-olive">98%</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Reply rate</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-5 flex gap-3">
                <Button variant="hero" size="sm" className="flex-1 group">
                  <MessageCircle className="h-4 w-4" />
                  Open intro
                </Button>
                <Button variant="soft" size="sm" className="flex-1">
                  <Star className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive/10 border border-olive/20 text-xs font-semibold uppercase tracking-widest text-olive mb-6">
              <Briefcase className="h-3 w-3" />
              For recruiters
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-6 text-balance">
              Host better{" "}
              <span className="italic text-primary">hiring conversations.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Create live Q&A rooms, meet referred candidates, and see talent before the application stage.
            </p>

            {/* Perks list */}
            <ul className="space-y-4 mb-10">
              {perks.map((p) => (
                <li key={p.text} className="flex items-start gap-4">
                  <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-olive/20 to-olive/5 text-olive flex items-center justify-center flex-shrink-0 border border-olive/20">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <div className="pt-1">
                    <span className="text-foreground text-lg leading-tight">{p.text}</span>
                    <span className="ml-2 px-2 py-0.5 rounded-md bg-olive/10 text-[10px] font-semibold uppercase text-olive">
                      {p.highlight}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" asChild className="group">
                <Link to="/signup?type=recruiter">
                  Explore recruiter tools
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
