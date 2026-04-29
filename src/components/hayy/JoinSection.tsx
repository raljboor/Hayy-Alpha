import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Quote, Sparkles, ArrowRight, Users, Star } from "lucide-react";

const roleToType: Record<string, string> = {
  "job-seeker": "seeker",
  "referral-host": "host",
  "recruiter": "recruiter",
  "partner": "partner",
};

const testimonials = [
  {
    quote: "I finally understood how referrals actually work.",
    author: "Sarah K.",
    role: "PM at Shopify",
    rating: 5,
  },
  {
    quote: "This felt more useful than sending 100 applications.",
    author: "James R.",
    role: "Operations Analyst",
    rating: 5,
  },
  {
    quote: "The room made networking feel human, not awkward.",
    author: "Leila M.",
    role: "Designer at Airbnb",
    rating: 5,
  },
];

const stats = [
  { value: "500+", label: "Warm intros made" },
  { value: "85%", label: "Response rate" },
  { value: "12", label: "Founding rooms" },
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
    <section id="join" className="py-20 md:py-28 bg-gradient-warm relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pattern-arabesque opacity-50" />
      <div className="absolute top-10 right-10 h-40 w-40 rounded-full border border-primary/10 opacity-30" />
      <div className="absolute bottom-20 left-10 h-24 w-24 rounded-xl bg-clay/10 rotate-12 opacity-40" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Copy and testimonials */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
              <Sparkles className="h-3 w-3" />
              Founding community
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight mb-6 text-balance">
              Be part of the{" "}
              <span className="italic text-primary">first Hayy rooms.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Join as a job seeker, referral host, recruiter, employer, or community partner. Shape what Hayy becomes.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10 pb-10 border-b border-border/60">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-semibold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.quote} className="rounded-2xl bg-card/80 backdrop-blur border border-border/60 p-5 transition-all hover:shadow-soft">
                  <div className="flex items-start gap-4">
                    <Quote className="h-5 w-5 text-clay shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-display text-base text-foreground leading-snug mb-3">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-clay text-primary-foreground flex items-center justify-center text-[10px] font-semibold">
                            {t.author.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{t.author}</span>
                            <span className="text-muted-foreground"> · {t.role}</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-clay text-clay" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="rounded-[2rem] bg-card/95 backdrop-blur border border-border/60 p-7 sm:p-9 shadow-elevated relative">
            {/* Corner accent */}
            <div className="absolute -top-3 -right-3 h-20 w-20 rounded-2xl bg-gradient-to-br from-clay/20 to-transparent rotate-12 blur-xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-clay" />
                <h3 className="font-display text-xl font-semibold text-foreground">Request founding access</h3>
              </div>
              
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                  <Input 
                    id="name" 
                    required 
                    placeholder="Amira Mansour" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60 focus:border-primary/40 focus:ring-primary/20" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60 focus:border-primary/40 focus:ring-primary/20" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">I am a</Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger className="h-12 rounded-xl bg-cream/80 border-border/60">
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
                  <Label htmlFor="target" className="text-sm font-medium">Target role or industry</Label>
                  <Input 
                    id="target" 
                    placeholder="e.g. Operations in Canada" 
                    className="h-12 rounded-xl bg-cream/80 border-border/60 focus:border-primary/40 focus:ring-primary/20" 
                  />
                </div>
                
                <Button type="submit" variant="hero" size="lg" className="w-full group mt-2">
                  Request founding access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  We&apos;re hand-picking the first cohort. No spam, ever.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
