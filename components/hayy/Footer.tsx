import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-14">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-clay text-clay-foreground">
                <span className="font-display text-xl leading-none -mt-0.5">ح</span>
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight">Hayy</span>
            </Link>
            <p className="mt-4 font-display text-xl italic text-primary-foreground/80 max-w-md">
              Real people. Real referrals. Real growth.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/80">
              <a href="/#rooms" className="hover:text-primary-foreground transition-colors">Rooms</a>
              <a href="/#how-it-works" className="hover:text-primary-foreground transition-colors">How it works</a>
              <a href="/#for-hosts" className="hover:text-primary-foreground transition-colors">For hosts</a>
              <a href="/#recruiters" className="hover:text-primary-foreground transition-colors">Recruiters</a>
            </nav>
            <div className="flex gap-2">
              <Button asChild variant="soft" size="sm"><Link to="/login">Log in</Link></Button>
              <Button asChild variant="clay" size="sm"><Link to="/signup">Join Hayy</Link></Button>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-foreground/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-primary-foreground/60">
          <span>© {new Date().getFullYear()} Hayy. Where careers come alive.</span>
          <span>Built with warmth ✦</span>
        </div>
      </div>
    </footer>
  );
};
