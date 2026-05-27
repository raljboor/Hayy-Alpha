/**
 * RoomsList — ported from the redesign RoomsList mock
 * (frontend-new/hayy/project/components/more-screens.jsx → RoomsList).
 *
 * Day-by-day vertical agenda layout (not a card grid). Real rooms via
 * useQuery(getRooms), bucketed into Tonight / Tomorrow / This week / Later
 * by start date. Filter pills (All, Tech, Operations, …) match the redesign.
 *
 * Create-room dialog is preserved verbatim from the previous implementation
 * (createRoom() call, role gating, three room types) but re-skinned with
 * redesign tokens — no @/components/ui/dialog usage.
 */

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, LiveTag } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getRooms, createRoom } from "@/lib/api/rooms";
import type { Room } from "@/data/mockData";

const FILTERS = [
  "All",
  "Tech",
  "Operations",
  "Finance",
  "Newcomers",
  "Product",
  "Design",
  "MENA",
] as const;
type Filter = (typeof FILTERS)[number];

interface DayBucket {
  label: string;
  date: string;
  items: Room[];
}

function bucketRooms(rooms: Room[]): DayBucket[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const tonight: Room[] = [];
  const tomorrow: Room[] = [];
  const thisWeek: Room[] = [];
  const later: Room[] = [];

  // Live always lands in "Tonight"
  rooms.forEach((r) => {
    if (r.status === "live") {
      tonight.push(r);
      return;
    }
    const t = new Date(r.startsAt).getTime();
    if (t >= todayStart && t < todayStart + dayMs) tonight.push(r);
    else if (t >= todayStart + dayMs && t < todayStart + 2 * dayMs) tomorrow.push(r);
    else if (t >= todayStart + 2 * dayMs && t < todayStart + 7 * dayMs) thisWeek.push(r);
    else later.push(r);
  });

  const sortByStart = (a: Room, b: Room) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();

  const fmt = (date: Date) =>
    date
      .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
      .toUpperCase();

  return [
    {
      label: "Tonight",
      date: fmt(now),
      items: tonight.sort(sortByStart),
    },
    {
      label: "Tomorrow",
      date: fmt(new Date(todayStart + dayMs)),
      items: tomorrow.sort(sortByStart),
    },
    {
      label: "This week",
      date: `${fmt(new Date(todayStart + 2 * dayMs))} — ${fmt(new Date(todayStart + 6 * dayMs))}`,
      items: thisWeek.sort(sortByStart),
    },
    {
      label: "Later",
      date: "FUTURE",
      items: later.sort(sortByStart),
    },
  ].filter((b) => b.items.length > 0);
}

function timeLabel(room: Room): string {
  if (room.status === "live") return "Now";
  return new Date(room.startsAt).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function liveDuration(room: Room): string {
  const min = Math.max(
    1,
    Math.round((Date.now() - new Date(room.startsAt).getTime()) / 60_000),
  );
  return `${min} min in`;
}

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--paper)",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  outline: "none",
  fontFamily: "var(--sans)",
};

const fieldLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

// ---------------------------------------------------------------------------
// Modal helpers (no @/components/ui/dialog)
// ---------------------------------------------------------------------------

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(15,15,20,.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        overflow: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hy"
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 520,
          width: "100%",
          padding: 28,
          boxShadow: "var(--shadow-warm)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const RoomsList = () => {
  const { userId, profile, isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("All");
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Create-room form state
  const [creating, setCreating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRoomType, setFormRoomType] = useState<"community" | "referral" | "hiring">(
    "community",
  );
  const [formStartsAt, setFormStartsAt] = useState("");

  const isRecruiter =
    profile?.role_type === "recruiter" || profile?.role_type === "admin";

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms-list"],
    queryFn: getRooms,
    staleTime: 30_000,
  });

  // Deduplicate by id
  const deduped = useMemo(() => {
    const seen = new Set<string>();
    return rooms.filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
  }, [rooms]);

  // Apply filter + search
  const filtered = useMemo(() => {
    return deduped.filter((r) => {
      if (filter !== "All") {
        const hay = `${r.category} ${r.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(filter.toLowerCase())) return false;
      }
      if (
        q &&
        !`${r.title} ${r.company} ${r.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [deduped, filter, q]);

  const buckets = useMemo(() => bucketRooms(filtered), [filtered]);

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormRoomType("community");
    setFormStartsAt("");
  }

  async function handleCreate() {
    if (!formTitle.trim() || !userId) return;
    setCreating(true);
    try {
      await createRoom({
        title: formTitle.trim(),
        description: formDescription.trim(),
        room_type: formRoomType,
        hostId: userId,
        startsAt: formStartsAt || new Date().toISOString(),
        status: "upcoming",
      });
      toast.success("Room created", { description: "Your room is now visible to others." });
      setDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["rooms-list"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create room.");
    } finally {
      setCreating(false);
    }
  }

  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "32px 16px",
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          paddingBottom: 20,
          borderBottom: "1px solid var(--line-soft)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p style={sectionLabelStyle}>The agenda</p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 6, lineHeight: 1.05 }}>
              What's <span className="display-italic">happening</span> next.
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn kind="ghost" size="md" icon={I.search}>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  color: "var(--ink)",
                  width: 140,
                  fontFamily: "var(--sans)",
                }}
              />
            </Btn>
            {isAuthenticated && (
              <Btn kind="soft" size="md" icon={I.plus} onClick={() => setDialogOpen(true)}>
                Propose a room
              </Btn>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                fontSize: 12,
                fontWeight: 500,
                background: filter === f ? "var(--ink)" : "transparent",
                color: filter === f ? "var(--paper)" : "var(--ink-soft)",
                border: `1px solid ${filter === f ? "var(--ink)" : "var(--line)"}`,
                cursor: "pointer",
                fontFamily: "var(--sans)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
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
            Loading rooms…
          </p>
        )}

        {!isLoading && buckets.length === 0 && (
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
            <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Quiet on the agenda</p>
            <h3
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                marginTop: 8,
                lineHeight: 1.15,
                fontWeight: 500,
              }}
            >
              No rooms match yet.
            </h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-soft)" }}>
              Try a different filter, clear the search, or propose the first room.
            </p>
            {isAuthenticated && (
              <Btn
                kind="primary"
                size="md"
                onClick={() => setDialogOpen(true)}
                style={{ marginTop: 14 }}
              >
                Propose a room
              </Btn>
            )}
          </div>
        )}

        {buckets.map((day) => (
          <section
            key={day.label}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: 28,
              paddingTop: 18,
              paddingBottom: 4,
              borderTop: "1px solid var(--line-soft)",
              marginTop: 6,
            }}
            className="rooms-day"
          >
            <div style={{ position: "sticky", top: 0 }}>
              <h2 style={{ fontSize: 28, lineHeight: 1.1, fontFamily: "var(--display)" }}>
                {day.label}
              </h2>
              <p
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--ink-mute)",
                  marginTop: 4,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                {day.date}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {day.items.map((r, i) => {
                const isLive = r.status === "live";
                return (
                  <article
                    key={r.id}
                    className="rooms-item"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "92px 1fr auto",
                      gap: 20,
                      alignItems: "center",
                      padding: "18px 0",
                      borderTop: i === 0 ? "0" : "1px dashed var(--line-soft)",
                    }}
                  >
                    <div>
                      <p
                        className="mono"
                        style={{
                          fontSize: 13,
                          color: isLive ? "var(--clay)" : "var(--ink)",
                          fontWeight: 600,
                          letterSpacing: ".02em",
                          margin: 0,
                        }}
                      >
                        {timeLabel(r)}
                      </p>
                      {r.tags[0] && (
                        <p
                          className="mono"
                          style={{
                            fontSize: 10,
                            color: "var(--ink-mute)",
                            marginTop: 3,
                            letterSpacing: ".08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {r.tags[0]}
                        </p>
                      )}
                    </div>

                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        {isLive && <LiveTag>Live · {liveDuration(r)}</LiveTag>}
                        <h3
                          style={{
                            fontFamily: "var(--display)",
                            fontSize: 22,
                            fontWeight: 500,
                            lineHeight: 1.15,
                          }}
                        >
                          {r.title}
                        </h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "var(--ink-soft)",
                          fontSize: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <Avatar name={r.company} size={22} tone={tones[i % tones.length]} />
                        <span>
                          {r.company}{" "}
                          <span style={{ color: "var(--ink-mute)" }}>· {r.category}</span>
                        </span>
                        <span style={{ color: "var(--ink-mute)" }}>·</span>
                        <span style={{ color: "var(--ink-mute)" }}>
                          {r.attendees} going
                        </span>
                      </div>
                    </div>

                    <Link to={`/app/rooms/${r.id}`} style={{ textDecoration: "none" }}>
                      <Btn
                        kind={isLive ? "primary" : "soft"}
                        size="md"
                        iconRight={isLive ? I.arrow : undefined}
                      >
                        {isLive ? "Join now" : "RSVP"}
                      </Btn>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Create-room modal */}
      <Modal
        open={dialogOpen}
        onClose={() => {
          if (creating) return;
          setDialogOpen(false);
          resetForm();
        }}
      >
        <p style={sectionLabelStyle}>New room</p>
        <h2
          style={{
            fontSize: 28,
            marginTop: 6,
            lineHeight: 1.1,
            fontFamily: "var(--display)",
          }}
        >
          Host a <span className="display-italic">conversation</span>.
        </h2>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Room title *</span>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Breaking into product at a startup"
              style={inputStyle}
              disabled={creating}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Description</span>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Two sentences. Be honest about who'd benefit."
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
              disabled={creating}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Room type</span>
            <select
              value={formRoomType}
              onChange={(e) =>
                setFormRoomType(e.target.value as "community" | "referral" | "hiring")
              }
              disabled={creating}
              style={{
                ...inputStyle,
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              <option value="community">Community</option>
              <option value="referral">Referral</option>
              {isRecruiter && <option value="hiring">Hiring</option>}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Scheduled time</span>
            <input
              type="datetime-local"
              value={
                formStartsAt
                  ? new Date(formStartsAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                setFormStartsAt(e.target.value ? new Date(e.target.value).toISOString() : "")
              }
              style={inputStyle}
              disabled={creating}
            />
          </label>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <Btn
            kind="ghost"
            size="md"
            onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}
            disabled={creating}
          >
            Cancel
          </Btn>
          <Btn
            kind="primary"
            size="md"
            iconRight={I.arrow}
            onClick={handleCreate}
            disabled={creating || !formTitle.trim()}
          >
            {creating ? "Creating…" : "Schedule room"}
          </Btn>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 720px) {
          .rooms-day { grid-template-columns: 1fr !important; gap: 12px !important; }
          .rooms-item { grid-template-columns: 70px 1fr !important; }
          .rooms-item > a { grid-column: 1 / -1; justify-self: flex-end; }
        }
      `}</style>
    </div>
  );
};

export default RoomsList;
