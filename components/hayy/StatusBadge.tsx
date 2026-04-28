import { cn } from "@/lib/utils";

type Status = "live" | "upcoming" | "ended" | "pending" | "accepted" | "declined" | "submitted" | "completed" | "new" | "reviewed" | "shortlisted" | "passed";

const styles: Record<Status, string> = {
  live: "bg-clay/15 text-clay border-clay/30",
  upcoming: "bg-olive/15 text-olive border-olive/30",
  ended: "bg-muted text-muted-foreground border-border",
  pending: "bg-clay/10 text-clay border-clay/30",
  accepted: "bg-olive/15 text-olive border-olive/30",
  declined: "bg-destructive/10 text-destructive border-destructive/30",
  submitted: "bg-primary/10 text-primary border-primary/30",
  completed: "bg-olive/20 text-olive border-olive/30",
  new: "bg-clay/15 text-clay border-clay/30",
  reviewed: "bg-secondary text-foreground border-border",
  shortlisted: "bg-primary/10 text-primary border-primary/30",
  passed: "bg-muted text-muted-foreground border-border",
};

export const StatusBadge = ({ status, className }: { status: Status; className?: string }) => {
  const isLive = status === "live";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider", styles[status], className)}>
      {isLive && <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full rounded-full bg-clay opacity-75 animate-ping" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" /></span>}
      {status}
    </span>
  );
};
