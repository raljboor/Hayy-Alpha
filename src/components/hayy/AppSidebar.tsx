import { NavLink, useNavigate } from "react-router-dom";
import { Home, Mic, Handshake, User, Briefcase, UserCheck, LogOut, Settings, X, MessageCircle, Bell, FlaskConical } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavBadge } from "./InboxPrimitives";
import { useAuthContext } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getReferralThreads, getReferralRequests } from "@/lib/api/referrals";
import { getNotifications } from "@/lib/api/notifications";
import { useAsync } from "@/lib/useAsync";

const supplyNav = [
  { to: "/app/host", label: "Host dashboard", icon: UserCheck },
  { to: "/app/recruiter", label: "Recruiter dashboard", icon: Briefcase },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

/**
 * Derives live badge counts from API data.
 * Falls back to 0 while loading so the sidebar never shows stale fixture numbers.
 */
function useBadgeCounts(userId: string | null) {
  const { data: threads } = useAsync(
    () => getReferralThreads(userId ?? undefined),
    [userId],
  );
  const { data: referrals } = useAsync(
    () => getReferralRequests(userId ?? undefined),
    [userId],
  );
  const { data: notifications } = useAsync(
    () => getNotifications(userId ?? undefined),
    [userId],
  );

  const unreadMessages = (threads ?? []).filter((t) => t.unread).length;
  const unreadNotifications = (notifications ?? []).filter((n) => n.unread).length;
  const pendingReferrals = (referrals ?? []).filter(
    (r) => r.status === "pending",
  ).length;

  return { unreadMessages, unreadNotifications, pendingReferrals };
}

export const AppSidebar = ({ mobileOpen = false, onMobileOpenChange }: AppSidebarProps) => {
  const close = () => onMobileOpenChange?.(false);
  const { signOut } = useAuthContext();
  const { userId } = useCurrentUser();
  const navigate = useNavigate();

  const { unreadMessages, unreadNotifications, pendingReferrals } = useBadgeCounts(userId);

  const mainNav = [
    { to: "/app", label: "Home", icon: Home, end: true, badge: 0 },
    { to: "/app/rooms", label: "Rooms", icon: Mic, end: false, badge: 0 },
    { to: "/app/referrals", label: "Referrals", icon: Handshake, end: false, badge: pendingReferrals },
    { to: "/app/messages", label: "Messages", icon: MessageCircle, end: false, badge: unreadMessages },
    { to: "/app/notifications", label: "Notifications", icon: Bell, end: false, badge: unreadNotifications },
    { to: "/app/profile", label: "Profile", icon: User, end: false, badge: 0 },
  ];

  const handleSignOut = async () => {
    close();
    await signOut();
    navigate("/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/35 z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-[100dvh] lg:h-screen shrink-0 bg-cream border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0",
          "w-[min(84vw,340px)] lg:w-64 rounded-r-2xl lg:rounded-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Logo />
          <button
            onClick={close}
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-card"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground px-3 mb-2">Community</p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:bg-card hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  <NavBadge count={item.badge} />
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground px-3 mb-2">Supply side</p>
            <div className="space-y-1">
              {supplyNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-foreground/70 hover:bg-card hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {import.meta.env.VITE_ENABLE_DEV_TOOLS === "true" && (
          <div className="px-4 pb-2">
            <NavLink
              to="/app/dev/livekit-test"
              onClick={close}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  isActive ? "bg-yellow-100 text-yellow-800" : "text-muted-foreground hover:bg-yellow-50 hover:text-yellow-800",
                )
              }
            >
              <FlaskConical className="h-3.5 w-3.5" />
              LiveKit test
            </NavLink>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <div className="rounded-2xl bg-card p-4 mb-3">
            <p className="font-display text-sm font-semibold text-foreground">Founding member</p>
            <p className="text-xs text-muted-foreground mt-1">You're shaping Hayy from day one.</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </aside>
    </>
  );
};
