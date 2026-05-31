import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Home, Mic, Handshake, MessageCircle, User, Sun, Moon } from "lucide-react";
import { AppSidebar } from "@/components/hayy/AppSidebar";
import { Logo } from "@/components/hayy/Logo";
import { cn } from "@/lib/utils";
import { usePalette } from "@/lib/palette";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useBadgeCounts } from "@/hooks/useBadgeCounts";

const bottomTabs = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/rooms", label: "Rooms", icon: Mic, end: false },
  { to: "/app/referrals", label: "Refer", icon: Handshake, end: false, badgeKey: "referrals" as const },
  { to: "/app/messages", label: "Messages", icon: MessageCircle, end: false, badgeKey: "messages" as const },
  { to: "/app/profile", label: "Profile", icon: User, end: false },
];

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { palette, setPalette } = usePalette();
  const togglePalette = () => setPalette(palette === "dusk" ? "warm" : "dusk");
  const PaletteIcon = palette === "dusk" ? Sun : Moon;

  const { userId } = useCurrentUser();
  const { unreadMessages, unreadNotifications, pendingReferrals } = useBadgeCounts(userId);

  const badges = {
    referrals: pendingReferrals,
    messages: unreadMessages,
    notifications: unreadNotifications,
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      {/* Mobile top bar — logo + palette toggle only */}
      <header className="lg:hidden sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-cream/95 backdrop-blur border-b border-border">
        <div className="scale-90 origin-left">
          <Logo />
        </div>
        <button
          onClick={togglePalette}
          className="h-11 w-11 inline-flex items-center justify-center rounded-xl hover:bg-card transition-colors"
          aria-label={palette === "dusk" ? "Switch to warm palette" : "Switch to dusk palette"}
        >
          <PaletteIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="lg:flex w-full max-w-full">
        {/* Desktop sidebar — hidden on mobile, never unmounted so transitions work */}
        <div className="hidden lg:block">
          <AppSidebar
            mobileOpen={sidebarOpen}
            onMobileOpenChange={setSidebarOpen}
            badges={{ unreadMessages, unreadNotifications, pendingReferrals }}
          />
        </div>

        <main className="flex-1 min-w-0 w-full max-w-full overflow-x-hidden">
          <div
            key={pathname}
            className="w-full max-w-6xl mx-auto px-4 lg:px-8 pt-6 pb-28 lg:py-12 box-border animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar — native app style */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex h-16">
          {bottomTabs.map((tab) => {
            const badgeCount = tab.badgeKey ? badges[tab.badgeKey] : 0;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn(
                    "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors",
                    isActive ? "text-clay" : "text-foreground/45",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <tab.icon
                        className={cn("h-[22px] w-[22px]", isActive && "stroke-[2.5px]")}
                      />
                      {badgeCount > 0 && (
                        <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-clay text-paper text-[9px] flex items-center justify-center font-semibold leading-none">
                          {badgeCount > 9 ? "9+" : badgeCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium leading-none",
                        isActive ? "text-clay" : "text-foreground/45",
                      )}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
