import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="py-14" style={{ background: "var(--clay)", color: "var(--paper)" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
              <span
                className="relative flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.15)", color: "var(--paper)" }}
              >
                <span className="font-display text-xl leading-none -mt-0.5">ح</span>
              </span>
              <span
                className="font-display text-2xl font-semibold tracking-tight"
                style={{ color: "var(--paper)" }}
              >
                Hayy
              </span>
            </Link>
            <p
              className="mt-4 font-display text-xl italic max-w-md"
              style={{ color: "var(--paper)", opacity: 0.8 }}
            >
              Real people. Real referrals. Real growth.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <nav
              className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
              style={{ color: "var(--paper)", opacity: 0.8 }}
            >
              <a
                href="/#rooms"
                className="hover:opacity-100 transition-opacity"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Rooms
              </a>
              <a
                href="/#how-it-works"
                className="hover:opacity-100 transition-opacity"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                How it works
              </a>
              <a
                href="/#for-hosts"
                className="hover:opacity-100 transition-opacity"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                For hosts
              </a>
              <a
                href="/#recruiters"
                className="hover:opacity-100 transition-opacity"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Recruiters
              </a>
            </nav>
            <div className="flex gap-2">
              <Button asChild variant="soft" size="sm"><Link to="/login">Log in</Link></Button>
              <Button asChild variant="clay" size="sm"><Link to="/signup">Join Hayy</Link></Button>
            </div>
          </div>
        </div>
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.15)",
            color: "var(--paper)",
            opacity: 0.6,
          }}
        >
          <span>© {new Date().getFullYear()} Hayy. Where careers come alive.</span>
          <span>Built with warmth ✶</span>
        </div>
      </div>
    </footer>
  );
};
