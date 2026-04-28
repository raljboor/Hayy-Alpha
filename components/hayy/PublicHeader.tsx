import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

type NavLinkItem = { label: string; to: string; kind: "anchor" | "route" };

const links: NavLinkItem[] = [
  { label: "Rooms", to: "/#rooms", kind: "anchor" },
  { label: "How it works", to: "/#how-it-works", kind: "anchor" },
  { label: "For hosts", to: "/#for-hosts", kind: "anchor" },
  { label: "Recruiters", to: "/#recruiters", kind: "anchor" },
  { label: "Join", to: "/signup", kind: "route" },
];

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) =>
            l.kind === "route" ? (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-foreground"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.to}
                href={l.to}
                className={cn(
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-foreground",
                  pathname === "/" ? "" : "",
                )}
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Log in</Link></Button>
          <Button asChild variant="hero" size="sm"><Link to="/signup">Join founding community</Link></Button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container py-4 flex flex-col gap-3">
            {links.map((l) =>
              l.kind === "route" ? (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 py-1.5 hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 py-1.5 hover:text-foreground transition-colors"
                >
                  {l.label}
                </a>
              ),
            )}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="soft"><Link to="/login" onClick={() => setOpen(false)}>Log in</Link></Button>
              <Button asChild variant="hero"><Link to="/signup" onClick={() => setOpen(false)}>Join Hayy</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
