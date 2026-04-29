/**
 * Converts a DB-shaped room row (snake_case from Supabase) into the
 * UI-shaped Room type used by the frontend (camelCase, from lib/mockData.ts).
 *
 * DB column → UI field mapping:
 *   id             → id
 *   title          → title
 *   description    → description
 *   category       → category
 *   host_id        → hostId
 *   start_time     → startsAt
 *   status         → status  (DB: 'draft'|'open'|'waitlist'|'closed'|'completed'
 *                             UI: 'live'|'upcoming'|'ended')
 *   room_type      → (stored; no direct UI mapping yet — kept for future use)
 *   max_speakers   → speakers (capacity; attendee_count is the live count)
 *   attendee_count → attendees
 *   company        → company  (optional column)
 *   access         → access   (optional column: 'open'|'waitlist'|'invite-only')
 *   duration_min   → durationMin
 *   cover_color    → coverColor
 *   tags           → tags
 */

import type { Room as MockRoom, RoomStatus, RoomAccess } from "@/lib/mockData";

export interface DbRoom {
  id: string;
  title: string;
  description: string;
  category: string;
  host_id: string;
  created_by?: string | null;
  start_time: string;
  status: string;
  room_type: string | null;
  max_speakers: number;
  attendee_count: number;
  created_at: string;
  updated_at?: string | null;
  // Optional columns (may not exist in all deployments)
  company?: string | null;
  access?: string | null;
  duration_min?: number | null;
  cover_color?: string | null;
  tags?: string[] | null;
  speaker_count?: number | null;
}

/**
 * Maps DB room status values to the UI RoomStatus type.
 * The DB schema uses: 'draft' | 'open' | 'waitlist' | 'closed' | 'completed'
 * The UI uses:        'live'  | 'upcoming' | 'ended'
 *
 * We infer 'live' from a room that is 'open' and whose start_time is in the past.
 */
function mapStatus(row: DbRoom): RoomStatus {
  const raw = row.status?.toLowerCase() ?? "";
  if (raw === "completed" || raw === "closed") return "ended";
  if (raw === "open" || raw === "waitlist") {
    // Treat as live if start_time is in the past (within last 3 hours)
    const started = new Date(row.start_time).getTime();
    const now = Date.now();
    const threeHours = 3 * 60 * 60 * 1000;
    if (started <= now && now - started <= threeHours) return "live";
    if (started <= now) return "live"; // already started
    return "upcoming";
  }
  if (raw === "draft") return "upcoming";
  return "upcoming";
}

/**
 * Maps DB access value to the UI RoomAccess type.
 */
function mapAccess(raw: string | null | undefined): RoomAccess {
  switch (raw?.toLowerCase()) {
    case "waitlist": return "waitlist";
    case "invite-only":
    case "invite_only": return "invite-only";
    default: return "open";
  }
}

export function adaptRoomFromDb(row: DbRoom): MockRoom {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    company: row.company ?? "",
    category: row.category as MockRoom["category"],
    status: mapStatus(row),
    access: mapAccess(row.access),
    startsAt: row.start_time,
    durationMin: row.duration_min ?? 60,
    hostId: row.host_id,
    coverColor: row.cover_color ?? "bg-primary",
    attendees: row.attendee_count ?? 0,
    speakers: row.speaker_count ?? row.max_speakers ?? 0,
    tags: row.tags ?? [],
  };
}

export function adaptRoomsFromDb(rows: DbRoom[]): MockRoom[] {
  return rows.map(adaptRoomFromDb);
}
