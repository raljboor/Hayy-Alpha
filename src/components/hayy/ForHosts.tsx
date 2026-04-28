import { Check, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const points = [
  "Set your monthly referral capacity",
  "Choose roles or industries you can support",
  "Accept only the requests you trust",
];

export const ForHosts = () => {
  return (
    <section id="for-hosts" className="py-20 md:py-28 bg-cream">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-xs font-medium uppercase tracking-widest text-clay mb-3 block">For referral hosts</span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-5">
              Help someone <span className="italic text-primary">get seen.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Hayy hosts are professionals, recruiters, founders, and employees who join rooms to share honest advice, answer questions, and connect promising candidates to opportunities.
            </p>

            <ul className="space-y-3 mb-8">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground">{p}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild>
              <Link to="/signup?type=host">Become a referral host</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-clay/20 blur-3xl" />
            <div className="relative rounded-3xl bg-card border border-border p-7 shadow-warm">
              <div className="flex items-center gap-4 pb-5 border-b border-border">
                <div className="h-14 w-14 rounded-2xl bg-gradient-clay text-clay-foreground flex items-center justify-center font-semibold text-lg">
                  AM
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Operations Manager</h4>
                  <p className="text-sm text-muted-foreground">Toronto · Verified host</p>
                </div>
              </div>

              <div className="py-5 flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-olive" />
                <span className="text-sm font-medium text-foreground">Open to 3 coffee chats / month</span>
              </div>

              <div className="rounded-2xl bg-cream p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="h-4 w-4 text-clay" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Referral request</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  Candidate is targeting operations and program management roles in Canada.
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
