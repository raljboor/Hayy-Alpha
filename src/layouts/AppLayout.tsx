import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Home, Mic, Handshake, MessageCircle, Bell, User, UserCheck, Briefcase, Settings as SettingsIcon } from "lucide-react";
import { AppSidebar } from "@/components/hayy/AppSidebar";
import { Logo } from "@/components/hayy/Logo";
import { NavBadge } from "@/components/hayy/InboxPrimitives";
import { cn } from "@/lib/utils";

const mobileNav = [
  { to: "/app", label: "Home", icon: Home, end: true, badge: 0 },
  { to: "/app/rooms", label: "Rooms", icon: Mic, badge: 0 },
  { to: "/app/referrals", label: "Referrals", icon: Handshake, badge: 4 },
  { to: "/app/messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { to: "/app/notifications", label: "Notifications", icon: Bell, badge: 3 },
  { to: "/app/profile", label: "Profile", icon: User, badge: 0 },
  { to: "/app/host", label: "Host Dashboard", icon: UserCheck, badge: 0 },
  { to: "/app/recruiter", label: "Recruiter Dashboard", icon: Briefcase, badge: 0 },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon, badge: 0 },
];

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      {/* Compact mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 h-16 flex items-center justify-between px-4 bg-card/95 backdrop-blur-xl border-b border-border/60 shadow-soft">
        <Logo size="sm" />
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-secondary/60 hover:bg-secondary transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-16 bg-foreground/30 backdrop-blur-sm z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="lg:hidden fixed top-16 inset-x-0 z-40 bg-card/98 backdrop-blur-xl border-b border-border shadow-elevated px-4 py-4 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <ul className="space-y-1">
              {mobileNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                        isActive 
                          ? "bg-gradient-to-r from-primary to-clay text-primary-foreground shadow-soft" 
                          : "text-foreground/80 hover:bg-secondary/60 active:bg-secondary",
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

      <div className="lg:flex w-full max-w-full">
        <div className="hidden lg:block">
          <AppSidebar mobileOpen={sidebarOpen} onMobileOpenChange={setSidebarOpen} />
        </div>
        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
          {/* Subtle pattern background for content area */}
          <div className="relative min-h-[calc(100vh-4rem)] lg:min-h-screen">
            <div className="absolute inset-0 pattern-geometric opacity-20 pointer-events-none" />
            <div
              key={pathname}
              className="relative w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 box-border animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
