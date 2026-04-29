import { Check, Coffee, ArrowRight, Users, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const points = [
  { icon: Users, text: "Set your monthly referral capacity" },
  { icon: Shield, text: "Choose roles or industries you can support" },
  { icon: Check, text: "Accept only the requests you trust" },
];

const hostStats = [
  { value: "85%", label: "Avg response rate" },
  { value: "3", label: "Chats per month" },
];

export const ForHosts = () => {
  return (
    <section id="for-hosts" className="py-20 md:py-28 bg-gradient-to-b from-cream to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 h-40 w-40 rounded-full border border-clay/10 opacity-40" />
      <div className="absolute bottom-10 left-20 h-20 w-20 rounded-xl bg-olive/5 rotate-12" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay/10 border border-clay/20 text-xs font-semibold uppercase tracking-widest text-clay mb-6">
              <Sparkles className="h-3 w-3" />
              For referral hosts
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-6 text-balance">
              Help someone{" "}
              <span className="italic text-primary">get seen.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Hayy hosts are professionals, recruiters, founders, and employees who join rooms to share honest advice, answer questions, and connect promising candidates to opportunities.
            </p>

            {/* Benefits list */}
            <ul className="space-y-4 mb-10">
              {points.map((p) => (
                <li key={p.text} className="flex items-start gap-4">
                  <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-clay text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-soft">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span className="text-foreground text-lg leading-tight pt-2">{p.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild className="group">
              <Link to="/signup?type=host">
                Become a referral host
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Visual card */}
          <div className="relative">
            {/* Decorative blurs */}
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-gradient-to-br from-clay/25 to-transparent blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-olive/20 to-transparent blur-3xl" />
            
            <div className="relative rounded-[2rem] bg-card/95 backdrop-blur border border-border/60 p-7 shadow-elevated">
              {/* Host profile header */}
              <div className="flex items-center gap-4 pb-6 border-b border-border/60">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-clay to-primary/80 text-primary-foreground flex items-center justify-center font-display font-semibold text-xl shadow-warm">
                  AM
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg font-semibold text-foreground">Operations Manager</h4>
                    <span className="px-2 py-0.5 rounded-full bg-olive/15 text-[10px] font-semibold uppercase text-olive">Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Toronto, Canada</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 py-5 border-b border-border/60">
                {hostStats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-semibold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-olive animate-pulse" />
                  <span className="text-sm font-medium text-olive">Open</span>
                </div>
              </div>

              {/* Referral request preview */}
              <div className="rounded-2xl bg-gradient-to-br from-cream to-sand/50 border border-border/60 p-5 mt-5 relative">
                <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-lg bg-card border border-border text-[10px] font-semibold text-clay uppercase tracking-wider flex items-center gap-1.5">
                  <Coffee className="h-3 w-3" />
                  Referral request
                </div>
                
                <p className="text-sm text-foreground leading-relaxed mt-2 mb-5">
                  &ldquo;Targeting operations and program management roles in Canada. Would love your perspective on breaking in.&rdquo;
                </p>
                
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1">Accept</Button>
                  <Button variant="soft" size="sm" className="flex-1">Decline</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
