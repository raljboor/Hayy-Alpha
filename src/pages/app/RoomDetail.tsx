/**
 * Room detail — re-skinned to the redesign idiom.
 *
 * There's no dedicated room-detail mock in the bundle, so this follows the
 * established detail-page idiom (workflow-screens.jsx → ReferralDetail) and
 * the room-join idiom (GreenRoom): breadcrumb back, an editorial warm hero,
 * a two-column body of `.hy-card` sections with mono eyebrows, and a
 * ReferralDetail-style agenda timeline. Wrapped in `.hy` so the redesign CSS
 * vars resolve; layout uses Tailwind responsive grids + inline var(--…)
 * styles, matching the RoomsList port.
 *
 * Data wiring (getRoomById, participant status, join / waitlist / enter,
 * navigation to the live room) is unchanged.
 *
 * NOTE: agenda / hosts / rules are still hardcoded — superseded once the
 * room_agenda / room_rules tables and host loading land.
 */
import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { type Room } from "@/data/mockData";
import {
  getRoomById,
  waitlistRoom,
  getRoomParticipantStatus,
  getRoomAgenda,
  getRoomRules,
  getRoomHosts,
  DEFAULT_AGENDA,
  DEFAULT_RULES,
} from "@/lib/api/rooms";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, Btn, LiveTag, Pill, I, type AvatarTone } from "@/components/ui/primitives";

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const TONES: AvatarTone[] = ["clay", "olive", "sand", "dark"];
const toneFor = (seed: string): AvatarTone => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
};

const backIcon = (
  <span style={{ display: "inline-flex", transform: "scaleX(-1)" }}>{I.arrow}</span>
);

const audience = [
  "Early-career professionals",
  "International students",
  "Newcomers to Canada",
  "People targeting corporate roles",
  "People looking to understand referrals",
];

const aboutBullets = [
  "How warm referrals move through ATS systems",
  "What hiring managers actually scan for",
  "How to position your story for Canadian roles",
  "How to ask for a referral without it feeling cold",
];

const eyebrow = (text: string): ReactNode => (
  <p
    className="mono"
    style={{
      fontSize: 11,
      color: "var(--clay)",
      letterSpacing: ".12em",
      textTransform: "uppercase",
      fontWeight: 600,
    }}
  >
    {text}
  </p>
);

const sectionHeading = (text: string): ReactNode => (
  <h2 style={{ fontFamily: "var(--display)", fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 500 }}>
    {text}
  </h2>
);

const middot = <span style={{ color: "var(--ink-mute)" }}>·</span>;

const RoomDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { userId } = useCurrentUser();

  const { data: room, loading, error, refetch } = useAsync(() => getRoomById(id), [id]);
  const { data: participantStatus, refetch: refetchStatus } = useAsync(
    () => (userId ? getRoomParticipantStatus(id, userId) : Promise.resolve(null)),
    [id, userId],
  );

  // Agenda / rules / hosts now load from the DB (room_agenda, room_rules,
  // room_participants where role = 'host'); fall back to defaults so the page
  // stays populated for rooms that haven't customised these yet.
  const { data: agendaData } = useAsync(() => getRoomAgenda(id), [id]);
  const { data: rulesData } = useAsync(() => getRoomRules(id), [id]);
  const { data: hostsData } = useAsync(() => getRoomHosts(id), [id]);
  const agenda = agendaData && agendaData.length > 0 ? agendaData : DEFAULT_AGENDA;
  const rules = rulesData && rulesData.length > 0 ? rulesData : DEFAULT_RULES;
  const hosts = hostsData ?? [];

  const [waitlisting, setWaitlisting] = useState(false);

  // Tapping Join opens the green room (the "are you sure?" pause), which
  // performs the actual joinRoom() write before entering the live room.
  const handleJoin = () => {
    if (!userId) { toast.error("Please sign in to join."); return; }
    navigate(`/app/rooms/${id}/green`);
  };

  const handleWaitlist = async () => {
    if (!userId) { toast.error("Please sign in to join the waitlist."); return; }
    setWaitlisting(true);
    try {
      const { error: err } = await waitlistRoom(id, userId);
      if (err) throw err;
      await refetchStatus();
      toast.success("Added to waitlist!", { description: "We'll let you know if a spot opens up." });
    } catch {
      toast.error("Couldn't join the waitlist — please try again.");
    } finally {
      setWaitlisting(false);
    }
  };

  if (loading) {
    return (
      <div className="hy" style={{ background: "transparent", color: "var(--ink)" }}>
        <div className="animate-pulse space-y-6">
          <div className="h-4 rounded" style={{ background: "var(--sand)", width: 120 }} />
          <div className="rounded-[22px]" style={{ background: "var(--sand)", height: 220 }} />
          <div className="rounded-[22px]" style={{ background: "var(--sand)", height: 160 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hy text-center" style={{ background: "transparent", color: "var(--ink)", padding: "64px 0" }}>
        <p style={{ fontFamily: "var(--display)", fontSize: 24 }}>Couldn't load this room</p>
        <div className="mt-6 flex justify-center">
          <Btn kind="soft" onClick={refetch}>Try again</Btn>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="hy text-center" style={{ background: "transparent", color: "var(--ink)", padding: "80px 0" }}>
        <h2 style={{ fontFamily: "var(--display)", fontSize: 28 }}>Room not found</h2>
        <div className="mt-6 flex justify-center">
          <Btn kind="soft" icon={backIcon} onClick={() => navigate("/app/rooms")}>Back to rooms</Btn>
        </div>
      </div>
    );
  }

  const isRegistered = participantStatus === "registered";
  const isWaitlisted = participantStatus === "waitlisted";
  const isWaitlistRoom = (room as Room).access === "waitlist";

  const statusPill = room.status === "live"
    ? <LiveTag>Live</LiveTag>
    : (
      <Pill
        style={{
          background: room.status === "ended" ? "var(--sand)" : "var(--paper)",
          color: "var(--ink-soft)",
        }}
      >
        {room.status === "ended" ? "Ended" : "Upcoming"}
      </Pill>
    );

  const primaryCta = room.status === "ended" ? (
    <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => navigate(`/app/rooms/${room.id}/recap`)}>
      Watch recap
    </Btn>
  ) : isRegistered ? (
    <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={() => navigate(`/app/rooms/${room.id}/live`)}>
      Enter room
    </Btn>
  ) : isWaitlisted ? (
    <Btn kind="soft" size="lg" disabled>On waitlist</Btn>
  ) : isWaitlistRoom ? (
    <Btn kind="primary" size="lg" onClick={handleWaitlist} disabled={waitlisting}>
      {waitlisting ? "Joining waitlist…" : "Join waitlist"}
    </Btn>
  ) : (
    <Btn kind="primary" size="lg" iconRight={I.arrow} onClick={handleJoin}>
      Join room
    </Btn>
  );

  return (
    <div className="hy" style={{ background: "transparent", color: "var(--ink)" }}>
      <Btn kind="ghost" size="md" icon={backIcon} onClick={() => navigate("/app/rooms")}>
        Back to rooms
      </Btn>

      {/* Hero */}
      <div
        className="hy-card"
        style={{
          marginTop: 16,
          padding: "clamp(24px, 4vw, 44px)",
          background: "linear-gradient(180deg, var(--cream), var(--paper))",
          boxShadow: "var(--shadow-warm)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Pill style={{ background: "var(--ink)", color: "var(--paper)", borderColor: "transparent" }}>
            Founding Room
          </Pill>
          {statusPill}
        </div>

        <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 500, lineHeight: 1.08, marginTop: 16, maxWidth: 760 }}>
          {room.title}
        </h1>
        <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "var(--ink-soft)", marginTop: 14, maxWidth: 640, lineHeight: 1.55 }}>
          Meet professionals inside target companies, ask questions, and learn how to turn a conversation into a warm intro.
        </p>

        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-soft)" }}>
          <span>{fmtDateTime(room.startsAt)}</span>
          {middot}
          <span>Online · Hayy live room</span>
          {middot}
          <span>{room.attendees} going</span>
          {middot}
          <span>{room.speakers} speakers</span>
        </div>

        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {primaryCta}
          <Btn kind="ghost" size="lg" icon={I.heart}>Save room</Btn>
        </div>

        {(isRegistered || isWaitlisted) && (
          <p style={{ marginTop: 12, fontSize: 13, color: "var(--ink-mute)" }}>
            {isRegistered
              ? "✓ You're registered for this room."
              : "You're on the waitlist — we'll notify you if a spot opens."}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-8 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {/* About */}
          <section className="hy-card" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
            {sectionHeading("About this room")}
            <p style={{ marginTop: 14, color: "var(--ink-soft)", lineHeight: 1.6, fontSize: 15 }}>
              {room.description ||
                "This is a founding Hayy room built for anyone trying to break into corporate roles in Canada — whether you're an international student, a newcomer, or an early-career professional pivoting into a bigger company."}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 mt-6" style={{ padding: 0, listStyle: "none" }}>
              {aboutBullets.map((t) => (
                <li key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--clay)", flex: "none", marginTop: 1 }}>{I.check}</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* Agenda */}
          <section className="hy-card" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
            {sectionHeading("Agenda")}
            <div className="mt-4 flex flex-col">
              {agenda.map((a, i) => (
                <div
                  key={a.id}
                  className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-1 md:gap-4 py-4"
                  style={{ borderTop: i === 0 ? "1px solid var(--line-soft)" : "1px dashed var(--line-soft)" }}
                >
                  <p className="mono" style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em", paddingTop: 2 }}>
                    {a.time}
                  </p>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--clay)", flex: "none" }} />
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</p>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4, lineHeight: 1.5 }}>{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hosts */}
          <section className="hy-card" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
            {sectionHeading("Hosts")}
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--ink-mute)" }}>
              Real people inside corporate Canada — here to help.
            </p>
            {hosts.length === 0 ? (
              <p style={{ marginTop: 16, fontSize: 14, color: "var(--ink-mute)" }}>
                Hosts will be announced soon.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {hosts.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--line)",
                      background: "var(--cream)",
                      padding: 16,
                      display: "flex",
                      gap: 14,
                    }}
                  >
                    <Avatar name={h.name} size={48} tone={toneFor(h.id)} />
                    <div className="min-w-0 flex-1">
                      <p style={{ fontFamily: "var(--display)", fontSize: 16, fontWeight: 600, lineHeight: 1.2 }} className="truncate">
                        {h.name}
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{h.role}</p>
                      {h.company && <p style={{ fontSize: 12, color: "var(--ink-mute)" }} className="truncate">{h.company}</p>}
                      <span className="mt-2 inline-flex">
                        <Pill style={{ color: "var(--olive)" }}>
                          <span style={{ display: "inline-flex", transform: "scale(0.7)" }}>
                            {h.openTo === "coffee chats" ? I.msg : I.shake}
                          </span>
                          Open to {h.openTo}
                        </Pill>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 min-w-0">
          <section className="hy-card" style={{ padding: 22, background: "var(--cream)" }}>
            <h3 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500 }}>Who should join</h3>
            <ul className="mt-4 flex flex-col gap-3" style={{ padding: 0, listStyle: "none" }}>
              {audience.map((a) => (
                <li key={a} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--ink-soft)" }}>
                  <span style={{ color: "var(--clay)", flex: "none", marginTop: 1 }}>{I.check}</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section className="hy-card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--clay)", display: "inline-flex" }}>{I.lock}</span>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500 }}>Room rules</h3>
            </div>
            <ul className="mt-4 flex flex-col gap-4" style={{ padding: 0, listStyle: "none" }}>
              {rules.map((r) => (
                <li key={r.id}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{r.title}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2, lineHeight: 1.5 }}>{r.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="hy-card" style={{ padding: 22, background: "var(--cream)" }}>
            {eyebrow("Topics")}
            <div className="mt-3 flex flex-wrap gap-2">
              {room.tags.length > 0 ? (
                room.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      borderRadius: 999,
                      border: "1px solid var(--line)",
                      background: "var(--paper)",
                      padding: "4px 12px",
                      fontSize: 12,
                    }}
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>No tags yet</span>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default RoomDetail;
