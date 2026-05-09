import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Quote } from "lucide-react";

const roleToType: Record<string, string> = {
  "job-seeker": "seeker",
  "referral-host": "host",
  "recruiter": "recruiter",
  "partner": "partner",
};

const testimonials = [
  "I finally understood how referrals actually work.",
  "This felt more useful than sending 100 applications.",
  "The room made networking feel human, not awkward.",
];

export const JoinSection = () => {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const type = roleToType[role] ?? "seeker";
    navigate(`/signup?type=${type}`);
  };

  return (
    <section id="join" className="py-12 md:py-16" style={{ background: "var(--cream)" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
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
              Founding community
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
              Be part of the{" "}
              <span style={{ fontStyle: "italic", color: "var(--clay)" }}>first Hayy rooms.</span>
            </h2>
            <p style={{ fontSize: 17, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 40 }}>
              Join as a job seeker, referral host, recruiter, employer, or community partner.
            </p>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t}
                  className="rounded-2xl p-5"
                  style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
                >
                  <Quote className="h-4 w-4 mb-2" style={{ color: "var(--clay)" }} />
                  <p className="font-display text-lg italic leading-snug" style={{ color: "var(--ink)" }}>
                    "{t}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-3xl p-7 sm:p-9 shadow-warm"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
          >
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required placeholder="Amira Mansour" className="h-12 rounded-xl bg-cream border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" className="h-12 rounded-xl bg-cream border-border" />
              </div>
              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="h-12 rounded-xl bg-cream border-border">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job-seeker">Job seeker</SelectItem>
                    <SelectItem value="referral-host">Referral host</SelectItem>
                    <SelectItem value="recruiter">Recruiter / employer</SelectItem>
                    <SelectItem value="partner">Community partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target role or industry</Label>
                <Input id="target" placeholder="e.g. Operations in Canada" className="h-12 rounded-xl bg-cream border-border" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Request founding access
              </Button>
              <p className="text-xs text-center" style={{ color: "var(--ink-mute)" }}>
                We're hand-picking the first cohort. No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
