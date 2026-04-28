import { Building2, Clock, Eye, Bell, X, Coffee, Handshake, FileText, MessageCircle, Lightbulb } from "lucide-react";
import type { ReferralRequest, ReferralType } from "@/lib/mockData";
import { getUser } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const typeMeta: Record<ReferralType, { icon: typeof Coffee; label: string }> = {
  "coffee chat": { icon: Coffee, label: "Coffee chat" },
  referral: { icon: Handshake, label: "Referral" },
  "resume feedback": { icon: FileText, label: "Resume feedback" },
  "interview prep": { icon: MessageCircle, label: "Interview prep" },
  "company insight": { icon: Lightbulb, label: "Company insight" },
};

interface Props {
  request: ReferralRequest;
  perspective?: "candidate" | "host";
  onView?: (r: ReferralRequest) => void;
  onFollowUp?: (r: ReferralRequest) => void;
  onCancel?: (r: ReferralRequest) => void;
}

export const ReferralRequestCard = ({ request, perspective = "candidate", onView, onFollowUp, onCancel }: Props) => {
  const candidate = getUser(request.candidateId);
  const host = getUser(request.hostId);
  const counterpart = perspective === "candidate" ? host : candidate;
  if (!counterpart) return null;

  const TypeIcon = typeMeta[request.type].icon;
  const canCancel = request.status === "pending";

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-warm transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <UserAvatar user={counterpart} size="md" />
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{counterpart.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {counterpart.role}{counterpart.company && ` · ${counterpart.company}`}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream border border-border px-2.5 py-0.5 text-[11px] font-medium text-foreground/80">
          <TypeIcon className="h-3 w-3" />{typeMeta[request.type].label}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />{request.role} · {request.company}
        </span>
      </div>

      <p className="mt-4 text-sm text-foreground/80 italic border-l-2 border-clay/40 pl-3 line-clamp-2">
        "{request.message}"
      </p>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />Updated {timeAgo(request.updatedAt)}
        </span>
        <div className="flex gap-1.5">
          {perspective === "host" && request.status === "pending" ? (
            <>
              <Button size="sm" variant="hero">Accept</Button>
              <Button size="sm" variant="soft">Decline</Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => onView?.(request)}>
                <Eye className="h-3.5 w-3.5" />View
              </Button>
              {request.status !== "completed" && request.status !== "declined" && (
                <Button size="sm" variant="soft" onClick={() => onFollowUp?.(request)}>
                  <Bell className="h-3.5 w-3.5" />Follow up
                </Button>
              )}
              {canCancel && (
                <Button size="sm" variant="ghost" onClick={() => onCancel?.(request)} className="text-destructive hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};
