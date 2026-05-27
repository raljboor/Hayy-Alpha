/**
 * Rooms list — ported from the redesign "Rooms list" mock
 * (frontend-new/hayy/project/components/more-screens.jsx → RoomsList).
 *
 * Editorial agenda timeline: a day-by-day vertical list (Today / Tomorrow /
 * weekday), not a card grid. Wrapped in `.hy` so the redesign CSS vars
 * resolve; layout uses Tailwind responsive grid utilities (which don't
 * collide with the .hy token overrides) and inline `var(--…)` styles for
 * colour + type, matching the Login/Signup port idiom.
 *
 * Data wiring (getRooms, dedup, search + category filter) is unchanged.
 * "Propose a room" now routes to the Schedule a Room screen (the old
 * create-room dialog was replaced by that page); ended rooms open the recap.
 */
import { useState, type CSSProperties, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Btn, Avatar, LiveTag, I, type AvatarTone } from "@/components/ui/primitives";
import { getRooms } from "@/lib/api/rooms";
import { getUser, type Room } from "@/lib/mockData";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

const filters = [
  "All",
  "Operations",
  "Tech",
  "Finance",
  "Newcomers",
  "Product",
  "Consulting",
  "Canada",
  "MENA community",
] as const;

const searchInputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--paper)",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  maxWidth: 520,
  outline: "none",
  fontFamily: "var(--sans)",
};

const TONES: AvatarTone[] = ["clay", "olive", "sand", "dark"];
const toneFor = (seed: string): AvatarTone => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
};

const fmtTime = (iso: string) =>
  new Date(iso)
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(/\s/g, "")
    .toLowerCase();

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const dayLabel = (d: Date, now: Date) => {
  const diff = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long" });
};

const dateSub = (d: Date) =>
  d
    .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    .replace(", ", " · ");

const liveLabel = (r: Room) => {
  const mins = Math.floor((Date.now() - new Date(r.startsAt).getTime()) / 60_000);
  return mins > 0 && mins < 600 ? `Live · ${mins} min in` : "Live";
};

const ctaLabel = (r: Room) =>
  r.status === "live" ? "Join now" : r.status === "ended" ? "Watch replay" : "RSVP";

interface DayGroup {
  key: string;
  label: string;
  date: string;
  items: Room[];
}

const groupByDay = (rooms: Room[]): DayGroup[] => {
  const sorted = [...rooms].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  const map = new Map<string, Room[]>();
  for (const r of sorted) {
    const d = new Date(r.startsAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    (map.get(key) ?? map.set(key, []).get(key)!).push(r);
  }
  const now = new Date();
  return [...map.entries()].map(([key, items]) => {
    const d = new Date(items[0].startsAt);
    return { key, label: dayLabel(d, now), date: dateSub(d), items };
  });
};

const RoomsList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: rooms, loading, error, refetch } = useAsync(() => getRooms(), []);
  const { isAuthenticated } = useCurrentUser();

  const goSchedule = () => navigate("/app/rooms/schedule");

  // Deduplicate by room.id, keeping the first occurrence
  const seen = new Set<string>();
  const deduped = (rooms ?? []).filter((r) => {
    if (seen.has(r.id)) {
      if (import.meta.env.DEV) {
        console.warn("[RoomsList] Duplicate room id skipped:", r.id, r.title);
      }
      return false;
    }
    seen.add(r.id);
    return true;
  });

  const list = deduped.filter((r) => {
    if (filter !== "All") {
      const hay = `${r.category} ${r.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(filter.toLowerCase())) return false;
    }
    if (
      q &&
      !`${r.title} ${r.company} ${r.tags.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  const groups = groupByDay(list);

  return (
    <div className="hy" style={{ background: "transparent", color: "var(--ink)" }}>
      {/* Header strip */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <p
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--clay)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              The agenda
            </p>
            <h1 style={{ fontSize: "clamp(30px, 5vw, 42px)", marginTop: 6, lineHeight: 1.05 }}>
              What's <span className="display-italic">happening</span> next.
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn kind="ghost" size="md" icon={I.search} onClick={() => setSearchOpen((v) => !v)}>
              Search
            </Btn>
            {isAuthenticated && (
              <Btn kind="soft" size="md" icon={I.plus} onClick={goSchedule}>
                Propose a room
              </Btn>
            )}
          </div>
        </div>

        {searchOpen && (
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rooms, companies, topics…"
            style={searchInputStyle}
          />
        )}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 500,
                  background: active ? "var(--ink)" : "transparent",
                  color: active ? "var(--paper)" : "var(--ink-soft)",
                  border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[92px_1fr] gap-5 items-center py-4 animate-pulse"
              style={{ borderTop: i === 0 ? "none" : "1px dashed var(--line-soft)" }}
            >
              <div className="h-4 rounded" style={{ background: "var(--sand)", width: 56 }} />
              <div className="flex flex-col gap-2">
                <div className="h-5 rounded" style={{ background: "var(--sand)", width: "62%" }} />
                <div className="h-3 rounded" style={{ background: "var(--sand)", width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center" style={{ padding: "64px 0" }}>
          <p style={{ fontFamily: "var(--display)", fontSize: 24 }}>Couldn't load rooms</p>
          <p style={{ color: "var(--ink-mute)", marginTop: 8, fontSize: 14 }}>
            We couldn't load rooms right now.
          </p>
          <div className="mt-6 flex justify-center">
            <Btn kind="soft" onClick={refetch}>
              Try again
            </Btn>
          </div>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center" style={{ padding: "64px 0" }}>
          <p style={{ fontFamily: "var(--display)", fontSize: 24 }}>
            {isSupabaseConfigured ? "No rooms yet" : "No rooms match yet"}
          </p>
          <p style={{ color: "var(--ink-mute)", marginTop: 8, fontSize: 14 }}>
            {isSupabaseConfigured
              ? "Create the first room for the community."
              : "Try a different filter or search term — new rooms drop every week."}
          </p>
          {isSupabaseConfigured && isAuthenticated && (
            <div className="mt-6 flex justify-center">
              <Btn kind="soft" icon={I.plus} onClick={goSchedule}>
                Propose a room
              </Btn>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          {groups.map((day) => (
            <section
              key={day.key}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 md:gap-7 pt-5 pb-1 mt-1.5"
              style={{ borderTop: "1px solid var(--line-soft)" }}
            >
              <div className="md:sticky md:top-6 self-start">
                <h2 style={{ fontSize: "clamp(22px, 3vw, 28px)", lineHeight: 1.1 }}>{day.label}</h2>
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

              <div className="flex flex-col">
                {day.items.map((r, i) => {
                  const host = getUser(r.hostId);
                  const isLive = r.status === "live";
                  const dest =
                    r.status === "ended" ? `/app/rooms/${r.id}/recap` : `/app/rooms/${r.id}`;
                  const go = (e?: MouseEvent) => {
                    e?.stopPropagation();
                    navigate(dest);
                  };
                  return (
                    <article
                      key={r.id}
                      onClick={() => go()}
                      className="grid grid-cols-[70px_1fr] md:grid-cols-[92px_1fr_auto] gap-3 md:gap-5 items-center cursor-pointer py-3.5 md:py-[18px]"
                      style={{ borderTop: i === 0 ? "none" : "1px dashed var(--line-soft)" }}
                    >
                      <div>
                        <p
                          className="mono"
                          style={{
                            fontSize: 13,
                            color: isLive ? "var(--clay)" : "var(--ink)",
                            fontWeight: 600,
                            letterSpacing: ".02em",
                          }}
                        >
                          {isLive ? "Now" : fmtTime(r.startsAt)}
                        </p>
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
                          {r.category}
                        </p>
                      </div>

                      <div className="min-w-0 flex flex-col gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isLive && <LiveTag>{liveLabel(r)}</LiveTag>}
                          <h3
                            style={{
                              fontFamily: "var(--display)",
                              fontSize: "clamp(18px, 2.4vw, 22px)",
                              fontWeight: 500,
                              lineHeight: 1.15,
                            }}
                          >
                            {r.title}
                          </h3>
                        </div>
                        <div
                          className="flex items-center gap-2 flex-wrap"
                          style={{ color: "var(--ink-soft)", fontSize: 12 }}
                        >
                          <Avatar name={host?.name ?? "Hayy Host"} size={22} tone={toneFor(r.hostId)} />
                          <span>
                            {host?.name ?? "Hayy Host"} ·{" "}
                            <span style={{ color: "var(--ink-mute)" }}>{host?.role ?? "Host"}</span>
                          </span>
                          <span style={{ color: "var(--ink-mute)" }}>·</span>
                          <span style={{ color: "var(--ink-mute)" }}>{r.attendees} going</span>
                        </div>
                      </div>

                      <div className="hidden md:block">
                        <Btn
                          kind={isLive ? "primary" : "soft"}
                          size="md"
                          iconRight={isLive ? I.arrow : undefined}
                          onClick={go}
                        >
                          {ctaLabel(r)}
                        </Btn>
                      </div>
                      <div className="md:hidden col-span-2 flex justify-end -mt-1">
                        <Btn kind={isLive ? "primary" : "soft"} size="md" onClick={go}>
                          {ctaLabel(r)}
                        </Btn>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsList;
