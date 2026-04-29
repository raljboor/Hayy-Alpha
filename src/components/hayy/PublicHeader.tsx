import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

type NavLinkItem = { label: string; to: string; kind: "anchor" | "route" };

const links: NavLinkItem[] = [
  { label: "Rooms", to: "/#rooms", kind: "anchor" },
  { label: "How it works", to: "/#how-it-works", kind: "anchor" },
  { label: "For hosts", to: "/#for-hosts", kind: "anchor" },
  { label: "Recruiters", to: "/#recruiters", kind: "anchor" },
];

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border/40">
      <div className="container flex h-18 items-center justify-between gap-6">
        <Logo size="md" />

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const NavComponent = l.kind === "route" ? Link : "a";
            return (
              <NavComponent
                key={l.to}
                to={l.kind === "route" ? l.to : undefined}
                href={l.kind === "anchor" ? l.to : undefined}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                {l.label}
              </NavComponent>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="group">
            <Link to="/signup">
              Join founding community
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2.5 -mr-2 rounded-xl hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container py-6">
            <nav className="flex flex-col gap-1 mb-6">
              {links.map((l) => {
                const NavComponent = l.kind === "route" ? Link : "a";
                return (
                  <NavComponent
                    key={l.to}
                    to={l.kind === "route" ? l.to : undefined}
                    href={l.kind === "anchor" ? l.to : undefined}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    {l.label}
                  </NavComponent>
                );
              })}
            </nav>
            
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
              <Button asChild variant="soft" size="lg">
                <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
              </Button>
              <Button asChild variant="hero" size="lg">
                <Link to="/signup" onClick={() => setOpen(false)}>Join Hayy</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
