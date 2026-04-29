import { ArrowRight, Sparkles, Users, Mic, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiveRoomCard } from "./LiveRoomCard";

const trustPoints = [
  { icon: Mic, label: "Live career rooms" },
  { icon: Users, label: "Referral-first networking" },
  { icon: Award, label: "Built for real conversations" },
];

const stats = [
  { value: "500+", label: "Warm intros made" },
  { value: "85%", label: "Response rate" },
  { value: "12", label: "Founding rooms" },
];

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Premium layered background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 pattern-arabesque" />
      
      {/* Decorative geometric accents */}
      <div className="absolute top-20 left-10 h-32 w-32 rounded-full border border-primary/10 opacity-60" />
      <div className="absolute top-40 left-20 h-16 w-16 rounded-xl border border-clay/15 rotate-12 opacity-40" />
      <div className="absolute bottom-32 right-[15%] h-24 w-24 rounded-full border-2 border-dashed border-olive/20 opacity-50" />
      <div className="absolute top-1/3 right-10 h-20 w-20 rounded-xl bg-clay/5 rotate-45 opacity-60" />
      
      <div className="container relative py-20 md:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <div className="animate-float-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-card/80 backdrop-blur border border-border/60 px-4 py-2 shadow-soft mb-8">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-olive opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-olive" />
              </span>
              <span className="text-sm font-medium text-foreground">Founding rooms now open</span>
              <Sparkles className="h-3.5 w-3.5 text-clay" />
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.05]">
              Where careers{" "}
              <span className="relative">
                <span className="text-primary italic">come alive.</span>
                {/* Decorative underline */}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-clay/30" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                  <path d="M2 8 Q50 2 100 7 T198 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Hayy is a live career community where ambitious professionals meet real people, build warm connections, and earn referrals before applying.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild className="group">
                <Link to="/signup">
                  Join the first Hayy room
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button variant="soft" size="xl" asChild>
                <Link to="/signup?type=host">Become a referral host</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              {trustPoints.map((t) => (
                <div key={t.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-card border border-border/60 shadow-soft">
                    <t.icon className="h-4 w-4 text-clay" />
                  </span>
                  <span className="font-medium">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-semibold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Live room preview */}
          <div className="lg:pl-8 animate-float-up" style={{ animationDelay: "0.15s" }}>
            <LiveRoomCard />
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
