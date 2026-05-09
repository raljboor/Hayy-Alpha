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
    <section id="for-hosts" className="py-12 md:py-16" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
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
              For referral hosts
            </span>
            <h2
              className="font-display font-medium"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--ink)",
                marginBottom: 20,
              }}
            >
              Help someone{" "}
              <span style={{ fontStyle: "italic", color: "var(--clay)" }}>get seen.</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 32 }}>
              Hayy hosts are professionals, recruiters, founders, and employees who join rooms to share honest advice, answer questions, and connect promising candidates to opportunities.
            </p>

            <ul className="space-y-3 mb-8">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--clay)", color: "var(--paper)" }}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span style={{ color: "var(--ink)" }}>{p}</span>
                </li>
              ))}
            </ul>

            <Button variant="hero" size="lg" asChild>
              <Link to="/signup?type=host">Become a referral host</Link>
            </Button>
          </div>

          <div className="relative">
            <div
              className="absolute -top-6 -right-6 h-32 w-32 rounded-full blur-3xl"
              style={{ background: "hsl(12 58% 34% / 0.2)" }}
            />
            <div
              className="relative rounded-3xl p-7 shadow-warm"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-center gap-4 pb-5" style={{ borderBottom: "1px solid var(--line)" }}>
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center font-semibold text-lg"
                  style={{ background: "var(--clay)", color: "var(--paper)" }}
                >
                  AM
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: "var(--ink)" }}>Operations Manager</h4>
                  <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>Toronto · Verified host</p>
                </div>
              </div>

              <div className="py-5 flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--olive)" }} />
                <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  Open to 3 coffee chats / month
                </span>
              </div>

              <div className="rounded-2xl p-5" style={{ background: "var(--cream)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="h-4 w-4" style={{ color: "var(--clay)" }} />
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--ink-mute)",
                    }}
                  >
                    Referral request
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.6, marginBottom: 16 }}>
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
