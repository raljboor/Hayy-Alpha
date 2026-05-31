import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Home, Mic, Handshake, MessageCircle, User, Bell, UserCheck, Briefcase, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { AppSidebar } from "@/components/hayy/AppSidebar";
import { Logo } from "@/components/hayy/Logo";
import { NavBadge } from "@/components/hayy/InboxPrimitives";
import { cn } from "@/lib/utils";
import { usePalette } from "@/lib/palette";

// Primary 5 tabs shown in the mobile bottom bar
const bottomNav = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/rooms", label: "Rooms", icon: Mic, end: false },
  { to: "/app/referrals", label: "Referrals", icon: Handshake, end: false },
  { to: "/app/messages", label: "Messages", icon: MessageCircle, end: false },
  { to: "/app/profile", label: "Profile", icon: User, end: false },
];

// Secondary items reachable via the hamburger dropdown
const secondaryNav = [
  { to: "/app/notifications", label: "Notifications", icon: Bell, badge: 0 },
  { to: "/app/host", label: "Host dashboard", icon: UserCheck, badge: 0 },
  { to: "/app/recruiter", label: "Recruiter dashboard", icon: Briefcase, badge: 0 },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon, badge: 0 },
];

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { palette, setPalette } = usePalette();
  const togglePalette = () => setPalette(palette === "dusk" ? "warm" : "dusk");
  const PaletteIcon = palette === "dusk" ? Sun : Moon;

  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">

      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-cream/95 backdrop-blur border-b border-border">
        <div className="scale-90 origin-left">
          <Logo />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={togglePalette}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-card transition-colors"
            aria-label={palette === "dusk" ? "Switch to warm palette" : "Switch to dusk palette"}
          >
            <PaletteIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="h-10 w-10 inline-flex items-center justify-center rounded-xl hover:bg-card transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile secondary dropdown (hamburger) ──────────────────── */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-14 bg-foreground/30 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="lg:hidden fixed top-14 inset-x-0 z-40 bg-cream border-b border-border shadow-soft px-4 py-3">
            <ul className="space-y-1">
              {secondaryNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-card",
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <NavBadge count={item.badge} />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}

      {/* ── Main content area ──────────────────────────────────────── */}
      <div className="lg:flex w-full max-w-full">
        <div className="hidden lg:block">
          <AppSidebar mobileOpen={sidebarOpen} onMobileOpenChange={setSidebarOpen} />
        </div>
        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
          <div
            key={pathname}
            className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-28 lg:py-12 box-border animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ──────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch h-16">
          {bottomNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.2]")} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default AppLayout;
