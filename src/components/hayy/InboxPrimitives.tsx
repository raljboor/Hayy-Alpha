import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ThreadStatus } from "@/lib/inboxData";

const statusStyles: Record<ThreadStatus, string> = {
  Pending: "bg-clay/15 text-clay border-clay/30",
  Accepted: "bg-olive/15 text-olive border-olive/30",
  Waitlisted: "bg-secondary text-foreground border-border",
  Declined: "bg-destructive/10 text-destructive border-destructive/30",
  Completed: "bg-primary/10 text-primary border-primary/30",
};

export const StatusPill = ({ status, className }: { status: ThreadStatus; className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
      statusStyles[status],
      className,
    )}
  >
    {status}
  </span>
);

export const NavBadge = ({ count, tone = "clay" }: { count: number; tone?: "clay" | "primary" | "olive" }) => {
  if (!count) return null;
  const tones = {
    clay: "bg-clay text-clay-foreground",
    primary: "bg-primary text-primary-foreground",
    olive: "bg-olive text-olive-foreground",
  };
  return (
    <span
      className={cn(
        "ml-auto inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-[11px] font-semibold",
        tones[tone],
      )}
    >
      {count}
    </span>
  );
};

export const UnreadDot = () => (
  <span className="inline-block h-2 w-2 rounded-full bg-clay shrink-0" aria-label="unread" />
);

export const BackLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
  >
    <span aria-hidden>←</span>
    {children}
  </Link>
);
