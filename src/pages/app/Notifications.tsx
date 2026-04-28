import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  MessageSquare,
  Mic,
  RefreshCw,
  UserPlus,
  CheckCheck,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/hayy/EmptyState";
import { ErrorState } from "@/components/hayy/ErrorState";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api/notifications";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { type Notification, type NotificationType } from "@/lib/inboxData";
import { cn } from "@/lib/utils";

const iconFor: Record<NotificationType, { Icon: typeof Handshake; tone: string }> = {
  "Referral accepted": { Icon: Handshake, tone: "bg-olive/15 text-olive" },
  "New message": { Icon: MessageSquare, tone: "bg-clay/15 text-clay" },
  "Room reminder": { Icon: Mic, tone: "bg-primary/10 text-primary" },
  "Referral update": { Icon: RefreshCw, tone: "bg-clay/15 text-clay" },
  "Host joined": { Icon: UserPlus, tone: "bg-secondary text-foreground" },
};

/** Maps notification related_entity_type to a frontend route. */
function routeForNotification(n: Notification & { related_entity_type?: string; related_entity_id?: string }): string | null {
  if (!n.related_entity_type || !n.related_entity_id) return null;
  if (n.related_entity_type === "referral_request" || n.related_entity_type === "referral_message") {
    return `/app/referrals/${n.related_entity_id}`;
  }
  if (n.related_entity_type === "room") {
    return `/app/rooms/${n.related_entity_id}`;
  }
  return null;
}

const Notifications = () => {
  const { userId } = useCurrentUser();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(
    () => getNotifications(userId ?? undefined),
    [userId],
  );
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const today = items.filter((n) => n.group === "Today");
  const earlier = items.filter((n) => n.group === "Earlier");

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (userId) await markAllNotificationsRead(userId);
    toast.success("All caught up");
  };

  const handleNotificationClick = async (n: Notification) => {
    // Mark read optimistically
    if (n.unread) {
      setItems((prev) => prev.map((item) => item.id === n.id ? { ...item, unread: false } : item));
      await markNotificationRead(n.id);
    }
    // Navigate if we have a related entity
    const route = routeForNotification(n as Notification & { related_entity_type?: string; related_entity_id?: string });
    if (route) navigate(route);
  };

  return (
    <div className="w-full max-w-full space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-clay font-medium">Activity</p>
          <h1 className="font-display text-[30px] sm:text-4xl text-foreground leading-tight mt-1">
            Activity center
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            System updates, referral replies, room reminders, and host activity.
          </p>
        </div>
        <Button variant="soft" size="sm" onClick={markAll} disabled={loading || !!error}>
          <CheckCheck className="h-4 w-4" />
          Mark all read
        </Button>
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load notifications right now." onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New activity will land here." />
      ) : (
        <>
          <Group title="Today" items={today} onClickItem={handleNotificationClick} />
          <Group title="Earlier" items={earlier} onClickItem={handleNotificationClick} />
        </>
      )}
    </div>
  );
};

interface GroupProps {
  title: string;
  items: Notification[];
  onClickItem: (n: Notification) => void;
}

const Group = ({ title, items, onClickItem }: GroupProps) => {
  if (!items.length) return null;
  return (
    <section className="space-y-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium px-1">{title}</p>
      <ul className="rounded-3xl bg-card border border-border divide-y divide-border overflow-hidden">
        {items.map((n) => {
          const { Icon, tone } = iconFor[n.type];
          const clickable = !!(n as Notification & { related_entity_type?: string }).related_entity_type || n.unread;
          return (
            <li
              key={n.id}
              onClick={() => onClickItem(n)}
              className={cn(
                "p-4 sm:p-5 flex items-start gap-3 transition-colors",
                n.unread && "bg-clay/5",
                clickable && "cursor-pointer hover:bg-cream/60",
              )}
            >
              <span className={cn("h-10 w-10 rounded-2xl inline-flex items-center justify-center shrink-0", tone)}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                    {n.type}
                  </span>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-clay shrink-0" />}
                  <span className="ml-auto text-[11px] text-muted-foreground">{n.time}</span>
                </div>
                <p className={cn("mt-1 text-[15px] leading-snug", n.unread ? "text-foreground font-medium" : "text-foreground/90")}>
                  {n.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{n.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Notifications;
