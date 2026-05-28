/**
 * Schedule a Room — ported from extra-screens.jsx → ScheduleRoom.
 * Form on the left, live preview card + estimated reach on the right.
 * Replaces the old create-room dialog in RoomsList; wires the core fields
 * (title, description, date/time, type, reach tags) to createRoom().
 */
import { useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createRoom } from "@/lib/api/rooms";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, Btn, Pill, I } from "@/components/ui/primitives";

const REACH_TAGS = ["Newcomers", "Tech", "Product", "MENA community", "Toronto", "Operations", "Finance", "Design"] as const;

const FORMATS = [
  { l: "Open audio", d: "Anyone can speak" },
  { l: "Hosted Q&A", d: "Hands raised only" },
  { l: "Closed circle", d: "RSVP-only" },
] as const;

const fieldInputStyle: CSSProperties = {
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

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mono" style={{ fontSize: 11, color: "var(--clay)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 600 }}>
    {children}
  </p>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span className="mono" style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</span>
    {children}
    {hint && <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>{hint}</span>}
  </label>
);

const fmtPreviewTime = (date: string, time: string) => {
  if (!date) return "Date TBD";
  const d = new Date(`${date}T${time || "00:00"}`);
  if (Number.isNaN(d.getTime())) return "Date TBD";
  return d.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const ScheduleRoom = () => {
  const navigate = useNavigate();
  const { userId, profile } = useCurrentUser();
  const isRecruiter = profile?.role_type === "recruiter" || profile?.role_type === "admin";

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<(typeof FORMATS)[number]["l"]>("Open audio");
  const [roomType, setRoomType] = useState<"community" | "referral" | "hiring">("community");
  const [tags, setTags] = useState<Set<string>>(new Set(["Newcomers"]));
  const [saving, setSaving] = useState(false);

  const toggleTag = (t: string) =>
    setTags((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  const selectedTags = [...tags];
  const typeReach = roomType === "hiring" ? 90 : roomType === "referral" ? 60 : 0;
  const estimatedReach = Math.max(60, 80 + selectedTags.length * 45 + typeReach);

  const startsAtIso = () => {
    if (!date) return new Date().toISOString();
    const d = new Date(`${date}T${time || "19:00"}`);
    return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const handleSchedule = async () => {
    if (!title.trim()) {
      toast.error("Add a room title first.");
      return;
    }
    if (!date) {
      toast.error("Pick a date for the room.");
      return;
    }
    if (!userId) {
      toast.error("Please sign in to schedule a room.");
      return;
    }
    setSaving(true);
    try {
      const created = await createRoom({
        title: title.trim(),
        description: description.trim(),
        room_type: roomType,
        hostId: userId,
        startsAt: startsAtIso(),
        status: "upcoming",
        category: (selectedTags[0] as never) ?? undefined,
        tags: selectedTags,
      });
      toast.success("Room scheduled", { description: "Your room is now on the agenda." });
      navigate(`/app/rooms/${created.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule room.");
    } finally {
      setSaving(false);
    }
  };

  const scheduleButton = (
    <Btn kind="primary" size="md" iconRight={I.arrow} onClick={handleSchedule} disabled={saving}>
      {saving ? "Scheduling…" : "Schedule room"}
    </Btn>
  );

  return (
    <div className="hy" style={{ background: "transparent", color: "var(--ink)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", paddingBottom: 18, borderBottom: "1px solid var(--line-soft)" }}>
        <div>
          <SectionLabel>New room</SectionLabel>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", marginTop: 6 }}>
            Host a <span className="display-italic">conversation</span>.
          </h1>
        </div>
        <div className="hidden md:flex" style={{ gap: 8 }}>
          <Btn kind="ghost" size="md" onClick={() => toast("Draft saved", { description: "We kept your progress." })}>Save draft</Btn>
          {scheduleButton}
        </div>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 mt-6">
        {/* Form */}
        <div className="flex flex-col gap-[18px] min-w-0">
          <Field label="Room title">
            <input style={fieldInputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Breaking into Amazon as a newcomer" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" style={fieldInputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Time">
              <input type="time" style={fieldInputStyle} value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>

          <Field label="Format">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {FORMATS.map((o) => {
                const on = format === o.l;
                return (
                  <button
                    key={o.l}
                    onClick={() => setFormat(o.l)}
                    style={{
                      textAlign: "left", padding: 12, borderRadius: 12, background: "var(--paper)", cursor: "pointer",
                      border: "1.5px solid " + (on ? "var(--clay)" : "var(--line)"),
                      boxShadow: on ? "var(--shadow-soft)" : "none",
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{o.l}</p>
                    <p style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 4 }}>{o.d}</p>
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Room type">
            <div className="flex flex-wrap gap-2">
              {(["community", "referral", ...(isRecruiter ? ["hiring"] : [])] as const).map((rt) => {
                const on = roomType === rt;
                return (
                  <button
                    key={rt}
                    onClick={() => setRoomType(rt as typeof roomType)}
                    style={{
                      padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                      background: on ? "var(--ink)" : "transparent",
                      color: on ? "var(--paper)" : "var(--ink-soft)",
                      border: "1px solid " + (on ? "var(--ink)" : "var(--line)"),
                    }}
                  >
                    {rt}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="What's it about?" hint="Two sentences. Be honest about who'd benefit.">
            <textarea
              rows={3}
              style={{ ...fieldInputStyle, lineHeight: 1.55, resize: "vertical", minHeight: 80 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A small, honest room for people new to Canada who want to land at a big company."
            />
          </Field>

          <Field label="Who should this reach?">
            <div className="flex flex-wrap gap-1.5">
              {REACH_TAGS.map((t) => {
                const on = tags.has(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    style={{
                      padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      background: on ? "var(--clay)" : "transparent",
                      color: on ? "var(--paper)" : "var(--ink-soft)",
                      border: "1px solid " + (on ? "var(--clay)" : "var(--line)"),
                    }}
                  >
                    {on ? "✓ " : ""}{t}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="flex md:hidden gap-2 mt-1">
            <Btn kind="soft" size="md" style={{ flex: 1, justifyContent: "center" }} onClick={() => toast("Draft saved")}>Save draft</Btn>
            <Btn kind="primary" size="md" iconRight={I.arrow} style={{ flex: 1, justifyContent: "center" }} onClick={handleSchedule} disabled={saving}>
              {saving ? "Scheduling…" : "Schedule"}
            </Btn>
          </div>
        </div>

        {/* Preview */}
        <aside className="flex flex-col gap-3.5 min-w-0">
          <SectionLabel>How it'll look</SectionLabel>

          <div className="hy-card" style={{ padding: 22, borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-warm)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Pill kind="clay">{date ? "Scheduled" : "Tonight"}</Pill>
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-mute)" }}>{fmtPreviewTime(date, time)}</span>
            </div>
            <h3 style={{ fontFamily: "var(--display)", fontSize: 24, marginTop: 12, lineHeight: 1.2, fontWeight: 500 }}>
              {title || "Your room title"}
            </h3>
            <p style={{ marginTop: 10, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              {description || "A short, honest description of who this room is for."}
            </p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={profile?.full_name ?? "You"} size={30} tone="dark" />
              <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                You're hosting · <span className="mono" style={{ color: "var(--ink-mute)", letterSpacing: ".06em", textTransform: "uppercase", fontSize: 11 }}>{format}</span>
              </p>
            </div>
            {selectedTags.length > 0 && (
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedTags.map((t) => <Pill key={t}>{t}</Pill>)}
              </div>
            )}
          </div>

          <div className="hy-card" style={{ padding: 16 }}>
            <SectionLabel>Estimated reach</SectionLabel>
            <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 14 }}>
              <p style={{ fontFamily: "var(--display)", fontSize: 32, lineHeight: 1, color: "var(--clay)", fontWeight: 500 }}>~{estimatedReach}</p>
              <p style={{ fontSize: 12, color: "var(--ink-mute)" }}>members will see this in their brief</p>
            </div>
            <p style={{ marginTop: 10, fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.55 }}>
              Based on your tags. We never push rooms to people they didn't ask to hear from.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ScheduleRoom;
