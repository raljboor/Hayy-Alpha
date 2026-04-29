import { NavLink, useNavigate } from "react-router-dom";
import { Home, Mic, Handshake, User, Briefcase, UserCheck, LogOut, Settings, X, MessageCircle, Bell, Sparkles } from "lucide-react";
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
  const { userId, profile } = useCurrentUser();
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

  const userName = profile?.full_name?.split(" ")[0] || "Member";

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-[100dvh] lg:h-screen shrink-0 bg-card/98 backdrop-blur-xl border-r border-border/60 flex flex-col transition-transform duration-300 lg:translate-x-0",
          "w-[min(84vw,320px)] lg:w-[17rem] rounded-r-3xl lg:rounded-none shadow-elevated lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="h-18 flex items-center justify-between px-5 border-b border-border/60">
          <Logo size="sm" />
          <button
            onClick={close}
            className="lg:hidden p-2 -mr-2 rounded-xl hover:bg-secondary transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 px-3 mb-2.5">
              Community
            </p>
            <div className="space-y-1">
              {mainNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive 
                        ? "bg-gradient-to-r from-primary to-clay text-primary-foreground shadow-soft" 
                        : "text-foreground/70 hover:bg-secondary/60 hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  <span>{item.label}</span>
                  <NavBadge count={item.badge} />
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/70 px-3 mb-2.5">
              Supply side
            </p>
            <div className="space-y-1">
              {supplyNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive 
                        ? "bg-gradient-to-r from-primary to-clay text-primary-foreground shadow-soft" 
                        : "text-foreground/70 hover:bg-secondary/60 hover:text-foreground",
                    )
                  }
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 space-y-3">
          {/* Founding member card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-clay/5 to-olive/10 border border-primary/20 p-4 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-clay/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-clay" />
                <p className="font-display text-sm font-semibold text-foreground">Founding member</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thanks for shaping Hayy, {userName}.
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </aside>
    </>
  );
};
