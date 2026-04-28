import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiveRoomCard } from "./LiveRoomCard";

const trustPoints = ["Live career rooms", "Referral-first networking", "Built for real conversations"];

export const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-1.5 text-xs font-medium text-foreground/80 shadow-soft mb-6">
              <Sparkles className="h-3.5 w-3.5 text-clay" />
              Founding rooms now open
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.05]">
              Where careers <br />
              <span className="text-primary italic">come alive.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Hayy is a live career community where ambitious professionals meet real people, build warm connections, and earn referrals before applying.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Join the first Hayy room
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="soft" size="xl" asChild>
                <Link to="/signup?type=host">Become a referral host</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustPoints.map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <LiveRoomCard />
          </div>
        </div>
      </div>
    </section>
  );
};
