/**
 * Converts a DB-shaped room row (snake_case from Supabase) into the
 * UI-shaped Room type used by the frontend (camelCase, from lib/mockData.ts).
 *
 * This adapter runs at the API boundary so pages never need to know whether
 * data came from Supabase or from mock fixtures.
 */

import type { Room as MockRoom, RoomStatus, RoomAccess } from "@/lib/mockData";

/**
 * Minimal shape of a raw Supabase `rooms` table row.
 * Columns mirror src/types/models.ts Room + extra UI fields we store.
 */
export interface DbRoom {
  id: string;
  title: string;
  description: string;
  category: string;
  host_id: string;
  start_time: string;
  status: string;
  room_type: string;
  max_speakers: number;
  attendee_count: number;
  created_at: string;
  // Optional extended columns that may be added later
  company?: string | null;
  access?: string | null;
  duration_min?: number | null;
  cover_color?: string | null;
  tags?: string[] | null;
  speaker_count?: number | null;
}

export function adaptRoomFromDb(row: DbRoom): MockRoom {
  return {
    id: row.id,
    title: row.title,
    company: row.company ?? "",
    category: row.category as MockRoom["category"],
    status: row.status as RoomStatus,
    access: (row.access ?? "open") as RoomAccess,
    startsAt: row.start_time,
    durationMin: row.duration_min ?? 60,
    hostId: row.host_id,
    description: row.description,
    coverColor: row.cover_color ?? "bg-primary",
    attendees: row.attendee_count,
    speakers: row.speaker_count ?? 0,
    tags: row.tags ?? [],
  };
}

export function adaptRoomsFromDb(rows: DbRoom[]): MockRoom[] {
  return rows.map(adaptRoomFromDb);
}
