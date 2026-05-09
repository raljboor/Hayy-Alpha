import { DoorOpen, MessageCircle, Handshake, ListChecks } from "lucide-react";

const steps = [
  { n: "01", icon: DoorOpen, title: "Join a live room", desc: "Enter focused rooms by career path, company, or community." },
  { n: "02", icon: MessageCircle, title: "Share your story", desc: "Introduce yourself beyond bullet points and job titles." },
  { n: "03", icon: Handshake, title: "Request a referral", desc: "Ask for coffee chats, advice, resume feedback, or referrals." },
  { n: "04", icon: ListChecks, title: "Track follow-ups", desc: "Keep your warm connections and referral requests organized." },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-16" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="max-w-2xl mb-8">
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
            How it works
          </span>
          <h2
            className="font-display font-medium"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "var(--ink)",
            }}
          >
            From room to referral{" "}
            <span style={{ fontStyle: "italic", color: "var(--clay)" }}>in four steps.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group rounded-3xl p-7 hover:-translate-y-1 transition-all hover:shadow-warm"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-start justify-between mb-6">
                <span
                  className="h-12 w-12 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  style={{ background: "hsl(12 58% 34% / 0.1)", color: "var(--clay)" }}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <span
                  className="font-display text-2xl"
                  style={{ color: "var(--ink-mute)", opacity: 0.6 }}
                >
                  {s.n}
                </span>
              </div>
              <h3
                className="font-display font-semibold mb-2"
                style={{ fontSize: 19, color: "var(--ink)" }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
