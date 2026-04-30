import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type NavLinkItem = { label: string; to: string; kind: "anchor" | "route" };

const links: NavLinkItem[] = [
  { label: "Rooms",       to: "/#rooms",        kind: "anchor" },
  { label: "How it works",to: "/#how-it-works", kind: "anchor" },
  { label: "For hosts",   to: "/#for-hosts",    kind: "anchor" },
  { label: "Recruiters",  to: "/#recruiters",   kind: "anchor" },
];

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--ink-soft)",
  textDecoration: "none",
  fontFamily: "'Inter', system-ui, sans-serif",
  fontWeight: 500,
  transition: "color .15s",
};

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--bg)",
        borderBottom: "1px solid var(--line-soft)",
        height: 64,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 56px",
        }}
        className="hy-header-inner"
      >
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              borderRadius: 10,
              background: "var(--clay)",
              color: "var(--paper)",
              fontFamily: "'Fraunces', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            h
          </span>
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 22,
              color: "var(--ink)",
              letterSpacing: "-.01em",
            }}
          >
            Hayy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
          className="hy-desktop-only"
        >
          {links.map((l) =>
            l.kind === "route" ? (
              <Link
                key={l.to}
                to={l.to}
                style={linkStyle}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink-soft)")}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.to}
                href={l.to}
                style={linkStyle}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink-soft)")}
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        {/* Desktop right actions */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 10 }}
          className="hy-desktop-only"
        >
          <ThemeToggle />

          <Link
            to="/login"
            style={{
              ...linkStyle,
              padding: "7px 16px",
              borderRadius: "var(--radius-pill)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink-soft)")}
          >
            Log in
          </Link>

          <Link
            to="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              background: "var(--clay)",
              color: "var(--paper)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Inter', system-ui, sans-serif",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Join founding community
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{
            display: "none",
            padding: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--ink)",
          }}
          className="hy-mobile-only"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "var(--bg)",
            borderBottom: "1px solid var(--line)",
            padding: "16px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 49,
          }}
        >
          {links.map((l) =>
            l.kind === "route" ? (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--ink)",
                  textDecoration: "none",
                  padding: "10px 0",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  borderBottom: "1px solid var(--line-soft)",
                }}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--ink)",
                  textDecoration: "none",
                  padding: "10px 0",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  borderBottom: "1px solid var(--line-soft)",
                }}
              >
                {l.label}
              </a>
            ),
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              style={{
                textAlign: "center",
                padding: "10px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--line)",
                background: "var(--paper)",
                color: "var(--ink)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              style={{
                textAlign: "center",
                padding: "10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--clay)",
                color: "var(--paper)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Join Hayy
            </Link>
          </div>
          <div style={{ marginTop: 10 }}>
            <ThemeToggle />
          </div>
        </div>
      )}

      {/* Mobile responsive overrides injected via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .hy-header-inner { padding: 0 20px !important; }
          .hy-desktop-only { display: none !important; }
          .hy-mobile-only  { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
