/**
 * Adapters for room sub-content loaded by RoomDetail:
 *   - room_agenda → AgendaItem[]
 *   - room_rules  → RoomRule[]
 *   - room_participants (role = host) + user_profiles → RoomHost[]
 *
 * Keeps the DB (snake_case) shapes out of the page so RoomDetail always
 * receives the same UI-shaped types.
 */

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  desc: string;
}

export interface RoomRule {
  id: string;
  title: string;
  desc: string;
}

export type HostOpenTo = "coffee chats" | "referrals";

export interface RoomHost {
  id: string;
  name: string;
  role: string;
  company: string;
  openTo: HostOpenTo;
}

export interface DbRoomAgendaItem {
  id: string;
  room_id: string;
  position: number;
  time_label: string | null;
  title: string;
  description: string | null;
}

export interface DbRoomRule {
  id: string;
  room_id: string;
  position: number;
  title: string;
  description: string | null;
}

/** A joined user_profiles row may arrive as an object or a single-element array. */
type JoinedProfile =
  | { id: string; full_name: string | null; headline: string | null; location: string | null }
  | null;

export interface DbRoomHostRow {
  user_id: string;
  participant_role: string;
  user_profiles?: JoinedProfile | JoinedProfile[];
}

// Deterministic "open to" so each host card carries a badge even before
// host_settings is wired into this query.
export function pickOpenTo(seed: string): HostOpenTo {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 2 === 0 ? "coffee chats" : "referrals";
}

export function adaptAgendaFromDb(rows: DbRoomAgendaItem[]): AgendaItem[] {
  return rows.map((r) => ({
    id: r.id,
    time: r.time_label ?? "",
    title: r.title,
    desc: r.description ?? "",
  }));
}

export function adaptRulesFromDb(rows: DbRoomRule[]): RoomRule[] {
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    desc: r.description ?? "",
  }));
}

export function adaptHostFromDb(row: DbRoomHostRow): RoomHost {
  const profile = Array.isArray(row.user_profiles) ? row.user_profiles[0] : row.user_profiles;
  return {
    id: row.user_id,
    name: profile?.full_name?.trim() || "Hayy host",
    role: profile?.headline ?? "Host",
    company: profile?.location ?? "",
    openTo: pickOpenTo(row.user_id),
  };
}

export function adaptHostsFromDb(rows: DbRoomHostRow[]): RoomHost[] {
  return rows.map(adaptHostFromDb);
}
