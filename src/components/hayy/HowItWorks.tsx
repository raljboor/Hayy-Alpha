import { DoorOpen, MessageCircle, Handshake, ListChecks, ArrowRight } from "lucide-react";

const steps = [
  { 
    n: "01", 
    icon: DoorOpen, 
    title: "Join a live room", 
    desc: "Enter focused rooms by career path, company, or community. No awkward networking events.",
    highlight: "Real conversations"
  },
  { 
    n: "02", 
    icon: MessageCircle, 
    title: "Share your story", 
    desc: "Introduce yourself beyond bullet points. Hosts want to know who you are, not just what you've done.",
    highlight: "Be authentic"
  },
  { 
    n: "03", 
    icon: Handshake, 
    title: "Request a referral", 
    desc: "Ask for coffee chats, advice, resume feedback, or referrals. Hosts say yes to people they've met.",
    highlight: "Warm intros only"
  },
  { 
    n: "04", 
    icon: ListChecks, 
    title: "Track follow-ups", 
    desc: "Keep your warm connections and referral requests organized. Never lose track of a promising intro.",
    highlight: "Stay organized"
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-cream to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 h-40 w-40 rounded-full border border-primary/10 opacity-40" />
      <div className="absolute bottom-20 right-20 h-24 w-24 rounded-xl border border-olive/15 rotate-12 opacity-30" />
      
      <div className="container relative">
        {/* Section header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay/10 border border-clay/20 text-xs font-semibold uppercase tracking-widest text-clay mb-5">
            How it works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight text-balance">
            From room to referral{" "}
            <span className="italic text-primary">in four steps.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            Hayy replaces cold outreach with warm, human conversations. Here&apos;s how it works.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div 
              key={s.n} 
              className="group rounded-[1.75rem] bg-card border border-border/60 p-7 hover:shadow-warm transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                {/* Icon and step number */}
                <div className="flex items-start justify-between mb-6">
                  <span className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-clay group-hover:text-primary-foreground transition-all duration-300 shadow-soft">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-3xl font-semibold text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                    {s.n}
                  </span>
                </div>
                
                {/* Highlight tag */}
                <span className="inline-block px-2 py-1 rounded-md bg-olive/10 text-[10px] font-semibold uppercase tracking-wider text-olive mb-3">
                  {s.highlight}
                </span>
                
                {/* Title and description */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 leading-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
                
                {/* Arrow connector (except last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-border group-hover:text-primary/40 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
