/**
 * Notifications — ported from the redesign Notifications mock
 * (frontend-new/hayy/project/components/extra-screens.jsx → Notifications).
 *
 * Editorial inbox grouped by recency. Filter pills (All, Mentions, Referrals,
 * Rooms, Messages). Real data via getNotifications + markAllNotificationsRead
 * + markNotificationRead. Optimistic UI on read state; navigates to the
 * related entity if one is attached.
 */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, LiveTag, Pill } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import type { Notification, NotificationType } from "@/lib/inboxData";

const FILTERS: { label: string; types?: NotificationType[] }[] = [
  { label: "All" },
  { label: "Referrals", types: ["Referral accepted", "Referral update"] },
  { label: "Rooms", types: ["Room reminder"] },
  { label: "Messages", types: ["New message"] },
  { label: "Hosts", types: ["Host joined"] },
];

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

function routeForNotification(
  n: Notification & { related_entity_type?: string; related_entity_id?: string },
): string | null {
  if (!n.related_entity_type || !n.related_entity_id) return null;
  if (
    n.related_entity_type === "referral_request" ||
    n.related_entity_type === "referral_message"
  ) {
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
  const [filter, setFilter] = useState<string>("All");
  const [items, setItems] = useState<Notification[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId ?? undefined),
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const totalUnread = items.filter((n) => n.unread).length;

  const filtered = useMemo(() => {
    const def = FILTERS.find((f) => f.label === filter);
    if (!def?.types) return items;
    return items.filter((n) => def.types!.includes(n.type));
  }, [items, filter]);

  const today = filtered.filter((n) => n.group === "Today");
  const earlier = filtered.filter((n) => n.group === "Earlier");

  const markAll = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (userId) await markAllNotificationsRead(userId);
    toast.success("All caught up");
  };

  const handleClick = async (n: Notification) => {
    if (n.unread) {
      setItems((prev) =>
        prev.map((it) => (it.id === n.id ? { ...it, unread: false } : it)),
      );
      await markNotificationRead(n.id);
    }
    const route = routeForNotification(
      n as Notification & { related_entity_type?: string; related_entity_id?: string },
    );
    if (route) navigate(route);
  };

  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];
  const kindLabel: Record<NotificationType, string> = {
    "Referral accepted": "Referral",
    "Referral update": "Referral",
    "New message": "Message",
    "Room reminder": "Room",
    "Host joined": "Host",
  };

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "32px 16px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          paddingBottom: 18,
          borderBottom: "1px solid var(--line-soft)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={sectionLabelStyle}>Inbox</p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 6, fontFamily: "var(--display)" }}>
              {totalUnread > 0 ? (
                <>
                  <span style={{ color: "var(--clay)" }}>{totalUnread}</span> things{" "}
                  <span className="display-italic">need you</span>.
                </>
              ) : (
                <>You're all <span className="display-italic">caught up</span>.</>
              )}
            </h1>
          </div>
          <Btn kind="ghost" size="md" onClick={markAll} disabled={totalUnread === 0}>
            Mark all read
          </Btn>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(f.label)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                fontSize: 12,
                fontWeight: 500,
                background: filter === f.label ? "var(--ink)" : "transparent",
                color: filter === f.label ? "var(--paper)" : "var(--ink-soft)",
                border: `1px solid ${filter === f.label ? "var(--ink)" : "var(--line)"}`,
                cursor: "pointer",
                fontFamily: "var(--sans)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 8 }}>
        {isLoading && (
          <p
            style={{
              padding: "32px 0",
              color: "var(--ink-mute)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Loading notifications…
          </p>
        )}
        {error && (
          <p style={{ padding: 24, color: "var(--ink-soft)" }}>
            Couldn't load notifications.
          </p>
        )}

        {[
          { label: "Today", date: new Date().toLocaleDateString(), items: today },
          {
            label: "Earlier",
            date: "",
            items: earlier,
          },
        ]
          .filter((g) => g.items.length > 0)
          .map((g) => (
            <section
              key={g.label}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 28,
                paddingTop: 16,
                paddingBottom: 4,
                borderTop: "1px solid var(--line-soft)",
                marginTop: 8,
              }}
              className="notifications-section"
            >
              <div>
                <h2 style={{ fontSize: 22, lineHeight: 1.1, fontFamily: "var(--display)" }}>
                  {g.label}
                </h2>
                {g.date && (
                  <p
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-mute)",
                      marginTop: 4,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {g.date}
                  </p>
                )}
              </div>
              <div>
                {g.items.map((n, i) => {
                  const tone = tones[i % tones.length];
                  return (
                    <article
                      key={n.id}
                      onClick={() => handleClick(n)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: 18,
                        alignItems: "center",
                        padding: "14px 0",
                        borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                        cursor: "pointer",
                      }}
                    >
                      <Avatar name={n.title} size={44} tone={tone} />
                      <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <Pill style={{ background: "var(--cream)" }}>{kindLabel[n.type]}</Pill>
                          {n.type === "Room reminder" && <LiveTag>Live</LiveTag>}
                          {n.unread && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: 99,
                                background: "var(--clay)",
                              }}
                            />
                          )}
                          <span
                            className="mono"
                            style={{ fontSize: 10, color: "var(--ink-mute)" }}
                          >
                            {n.time}
                          </span>
                        </div>
                        <p style={{ fontSize: 15, margin: 0 }}>
                          <span style={{ fontWeight: 600 }}>{n.title}</span>
                        </p>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--ink-mute)",
                            lineHeight: 1.5,
                          }}
                        >
                          {n.body}
                        </p>
                      </div>
                      <Btn kind="soft" size="md" iconRight={I.arrow}>
                        Open
                      </Btn>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

        {!isLoading && filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              borderRadius: "var(--radius-xl)",
              background: "var(--cream)",
              border: "1px dashed var(--line)",
              textAlign: "center",
              marginTop: 24,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              No activity here.
            </h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)" }}>
              {filter === "All"
                ? "Updates and replies will land here."
                : "Try a different filter."}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .notifications-section { grid-template-columns: 1fr !important; gap: 10px !important; }
          .notifications-section > div:last-child article { grid-template-columns: auto 1fr !important; }
          .notifications-section > div:last-child article > button { grid-column: 1 / -1; justify-self: flex-end; }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
