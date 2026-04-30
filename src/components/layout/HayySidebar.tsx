import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Mic,
  Handshake,
  MessageCircle,
  Bell,
  User,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const NAV: NavItem[] = [
  { label: "Home",          to: "/app/dashboard",      icon: Home         },
  { label: "Rooms",         to: "/app/rooms",           icon: Mic          },
  { label: "Referrals",     to: "/app/referrals",       icon: Handshake    },
  { label: "Messages",      to: "/app/messages",        icon: MessageCircle},
  { label: "Notifications", to: "/app/notifications",   icon: Bell         },
  { label: "Profile",       to: "/app/profile",         icon: User         },
];

interface HayySidebarProps {
  active?: string;
}

export const HayySidebar = ({ active }: HayySidebarProps) => {
  const { pathname } = useLocation();

  const isActive = (item: NavItem) =>
    active
      ? item.label === active
      : pathname === item.to || pathname.startsWith(item.to + "/");

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--cream)",
        borderRight: "1px solid var(--line)",
        padding: "24px 0 20px",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--clay)",
              color: "var(--paper)",
              fontFamily: "'Fraunces', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            h
          </span>
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: 20,
              color: "var(--ink)",
              letterSpacing: "-.01em",
            }}
          >
            Hayy
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 12px",
                    borderRadius: "var(--radius-sm)",
                    background: active ? "var(--clay)" : "transparent",
                    color: active ? "var(--paper)" : "var(--ink-soft)",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none",
                    transition: "background .15s, color .15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "var(--sand)";
                      (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--ink-soft)";
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom card */}
      <div style={{ padding: "20px 12px 0" }}>
        <div
          style={{
            background: "var(--paper)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-md)",
            padding: "14px 14px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--clay)",
              margin: "0 0 6px",
            }}
          >
            Founding member
          </p>
          <p
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 15,
              fontWeight: 500,
              color: "var(--ink)",
              margin: 0,
              lineHeight: 1.35,
            }}
          >
            You're shaping Hayy.
          </p>
        </div>
      </div>
    </aside>
  );
};
