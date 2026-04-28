import { DoorOpen, MessageCircle, Handshake, ListChecks } from "lucide-react";

const steps = [
  { n: "01", icon: DoorOpen, title: "Join a live room", desc: "Enter focused rooms by career path, company, or community." },
  { n: "02", icon: MessageCircle, title: "Share your story", desc: "Introduce yourself beyond bullet points and job titles." },
  { n: "03", icon: Handshake, title: "Request a referral", desc: "Ask for coffee chats, advice, resume feedback, or referrals." },
  { n: "04", icon: ListChecks, title: "Track follow-ups", desc: "Keep your warm connections and referral requests organized." },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-cream">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-medium uppercase tracking-widest text-clay mb-3 block">How it works</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight">
            From room to referral <span className="italic text-primary">in four steps.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="group rounded-3xl bg-card border border-border p-7 hover:shadow-warm transition-all hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <span className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-2xl text-muted-foreground/60">{s.n}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
