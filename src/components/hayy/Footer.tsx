import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { label: "Rooms", href: "/#rooms" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "For hosts", href: "/#for-hosts" },
  { label: "Recruiters", href: "/#recruiters" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Community guidelines", href: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary via-primary to-primary/95 text-primary-foreground py-16 md:py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-clay/20 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-olive/15 blur-[80px]" />
      <div className="absolute top-20 left-20 h-32 w-32 rounded-xl border border-primary-foreground/10 rotate-12 opacity-30" />
      
      <div className="container relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 pb-12 border-b border-primary-foreground/15">
          {/* Brand section */}
          <div className="max-w-md">
            {/* Logo in light theme for footer */}
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <span className="relative flex h-10 w-10 items-center justify-center">
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-clay to-clay/80 rotate-3" />
                <span className="absolute inset-[2px] rounded-lg bg-clay" />
                <span className="relative font-display text-lg font-semibold text-clay-foreground">ح</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight">Hayy</span>
            </Link>
            
            <p className="font-display text-xl italic text-primary-foreground/85 leading-relaxed mb-6">
              Real people. Real referrals.{" "}
              <span className="text-clay-foreground">Real growth.</span>
            </p>
            
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
              Hayy means &ldquo;alive&rdquo; and &ldquo;neighborhood&rdquo; in Arabic. 
              We&apos;re building a warm professional neighborhood where careers come alive through real conversations.
            </p>
            
            <div className="flex gap-3">
              <Button asChild variant="soft" size="sm" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-clay text-clay-foreground hover:bg-clay/90 shadow-warm group">
                <Link to="/signup">
                  Join Hayy
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-10 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Navigate</p>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
            
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Legal</p>
              <nav className="flex flex-col gap-3">
                {legalLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
            
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Community</p>
              <div className="rounded-2xl bg-primary-foreground/10 border border-primary-foreground/15 p-4 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-clay-foreground" />
                  <span className="text-sm font-medium text-primary-foreground">Founding members</span>
                </div>
                <p className="text-xs text-primary-foreground/70 leading-relaxed">
                  You&apos;re helping shape what Hayy becomes. Every conversation matters.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <span className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Hayy. Where careers come alive.
          </span>
          <span className="text-sm text-primary-foreground/60 flex items-center gap-2">
            Built with warmth
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-clay/30 text-clay-foreground text-[10px]">
              ✦
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};
