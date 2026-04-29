import { X, ArrowRight, Sparkles } from "lucide-react";

export const ProblemSolution = () => {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 pattern-geometric opacity-30" />
      
      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Problem card */}
          <div className="rounded-[2rem] bg-card/80 backdrop-blur border border-border/60 p-8 sm:p-10 shadow-soft relative overflow-hidden group">
            {/* Decorative X marks */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-20">
              <X className="h-4 w-4 text-destructive" />
              <X className="h-4 w-4 text-destructive" />
              <X className="h-4 w-4 text-destructive" />
            </div>
            
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold uppercase tracking-widest text-destructive/80 mb-6">
              The problem
            </span>
            
            <h3 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight mb-5 text-balance">
              Cold applications are broken.
            </h3>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              Most people are not ignored because they lack potential. They are ignored because nobody knows their story.
            </p>
            
            {/* Stats showing the problem */}
            <div className="flex items-center gap-6 pt-6 border-t border-border/60">
              <div>
                <p className="font-display text-2xl font-semibold text-foreground">2%</p>
                <p className="text-xs text-muted-foreground mt-1">Cold app response</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-semibold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground mt-1">Apps per role</p>
              </div>
            </div>
          </div>
          
          {/* Solution card */}
          <div className="rounded-[2rem] bg-gradient-to-br from-primary via-primary to-clay/90 text-primary-foreground p-8 sm:p-10 shadow-warm relative overflow-hidden group">
            {/* Decorative blurs */}
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-clay/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-olive/20 blur-3xl" />
            
            {/* Decorative geometric shape */}
            <div className="absolute top-6 right-6 h-20 w-20 rounded-xl border border-primary-foreground/20 rotate-12 opacity-60" />
            
            <div className="relative">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur border border-primary-foreground/20 text-xs font-semibold uppercase tracking-widest text-primary-foreground mb-6">
                <Sparkles className="h-3 w-3" />
                The Hayy way
              </span>
              
              <h3 className="font-display text-3xl sm:text-4xl font-medium leading-tight mb-5 text-balance">
                Hayy makes access human again.
              </h3>
              
              <p className="text-base sm:text-lg text-primary-foreground/90 leading-relaxed mb-6">
                Join live rooms, meet professionals inside your target companies, ask real questions, and request warm career conversations or referrals.
              </p>
              
              {/* Stats showing the solution */}
              <div className="flex items-center gap-6 pt-6 border-t border-primary-foreground/20">
                <div>
                  <p className="font-display text-2xl font-semibold">85%</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Response rate</p>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <div>
                  <p className="font-display text-2xl font-semibold">10x</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">More likely hired</p>
                </div>
                <ArrowRight className="h-5 w-5 ml-auto opacity-60 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
