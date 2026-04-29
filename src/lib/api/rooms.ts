/**
 * Rooms API.
 *
 * Mock mode: returns fixtures from src/lib/mockData.ts.
 * Supabase mode: fetches from the `rooms` table and passes rows through
 * adaptRoomsFromDb() so pages always receive the same UI-shaped Room type.
 *
 * Schema reference: supabase/migrations/001_initial_schema.sql
 *   room_participants.attendance_status: 'registered' | 'waitlisted' | 'attended' | 'no_show'
 *   room_participants.participant_role:  'host' | 'speaker' | 'listener' | 'spectator' | 'moderator'
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { rooms, type Room as MockRoom } from "@/data/mockData";
import { adaptRoomsFromDb, adaptRoomFromDb, type DbRoom } from "@/lib/adapters/roomsAdapter";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getRooms(): Promise<MockRoom[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("start_time", { ascending: true });
    if (error) throw error;
    return adaptRoomsFromDb((data ?? []) as DbRoom[]);
  }
  return rooms;
}

export async function getRoomById(roomId: string): Promise<MockRoom | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return adaptRoomFromDb(data as DbRoom);
  }
  return rooms.find((r) => r.id === roomId) ?? null;
}

// ---------------------------------------------------------------------------
// Room participant status helper
// ---------------------------------------------------------------------------

export type ParticipantStatus = "registered" | "waitlisted" | "attended" | "no_show" | null;

export async function getRoomParticipantStatus(
  roomId: string,
  userId: string,
): Promise<ParticipantStatus> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_participants")
      .select("attendance_status")
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return (data?.attendance_status as ParticipantStatus) ?? null;
  }
  // Mock mode: no participant state tracked — return null
  return null;
}

// ---------------------------------------------------------------------------
// Join / waitlist / leave
// ---------------------------------------------------------------------------

/**
 * Register for a room (open access).
 * Upserts on (room_id, user_id) via ON CONFLICT — safe to call multiple times.
 */
export async function joinRoom(roomId: string, userId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_participants")
      .upsert(
        {
          room_id: roomId,
          user_id: userId,
          participant_role: "listener",
          attendance_status: "registered",
          joined_at: new Date().toISOString(),
        },
        { onConflict: "room_id,user_id" },
      )
      .select()
      .single();
    return { data, error };
  }
  return { data: { roomId, userId }, error: null };
}

/**
 * Join the waitlist for a room with limited access.
 * Sets attendance_status = 'waitlisted' and leaves joined_at null.
 */
export async function waitlistRoom(roomId: string, userId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_participants")
      .upsert(
        {
          room_id: roomId,
          user_id: userId,
          participant_role: "listener",
          attendance_status: "waitlisted",
          joined_at: null,
        },
        { onConflict: "room_id,user_id" },
      )
      .select()
      .single();
    return { data, error };
  }
  return { data: { roomId, userId }, error: null };
}

/**
 * Leave / deregister from a room.
 * Deletes the participant row rather than updating status so the user
 * can rejoin fresh later.
 */
export async function leaveRoom(roomId: string, userId: string) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("room_participants")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);
    return { data: { roomId, userId }, error };
  }
  return { data: { roomId, userId }, error: null };
}

// ---------------------------------------------------------------------------
// Create (host / recruiter)
// ---------------------------------------------------------------------------

// Valid DB status values (from the check constraint in 001_initial_schema.sql)
const DB_STATUSES = new Set(["draft", "open", "waitlist", "closed", "completed"]);

/**
 * Maps UI-facing status strings to the DB check-constraint values.
 * UI uses 'upcoming' / 'live' / 'ended'; DB uses 'open' / 'completed' etc.
 */
function toDbStatus(raw: unknown): string {
  const s = String(raw ?? "open");
  if (DB_STATUSES.has(s)) return s;
  if (s === "upcoming") return "open";
  if (s === "live") return "open";
  if (s === "ended") return "completed";
  return "open";
}

/**
 * Normalises a UI-shaped (camelCase) room object into the DB column names
 * (snake_case) that Supabase expects, accepting either naming convention.
 */
type RoomInsertData = Partial<MockRoom> & { hostId?: string; startsAt?: string; room_type?: string };

function toDbInsert(roomData: RoomInsertData): Record<string, unknown> {
  const hostId = (roomData as Record<string, unknown>).host_id ?? roomData.hostId;
  return {
    title: roomData.title,
    description: roomData.description ?? "",
    category: roomData.category ?? "Tech",
    host_id: hostId,
    created_by: hostId,
    start_time: (roomData as Record<string, unknown>).start_time ?? roomData.startsAt,
    status: toDbStatus((roomData as Record<string, unknown>).status ?? roomData.status),
    room_type: roomData.room_type ?? "community",
    max_speakers: (roomData as Record<string, unknown>).max_speakers ?? 8,
    attendee_count: roomData.attendees ?? 0,
  };
}

export async function createRoom(roomData: RoomInsertData): Promise<MockRoom> {
  if (isSupabaseConfigured && supabase) {
    const insert = toDbInsert(roomData);
    const { data, error } = await supabase
      .from("rooms")
      .insert(insert)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return adaptRoomFromDb(data as DbRoom);
  }
  // Mock: not persisted between renders
  return { ...(rooms[0]), ...roomData, id: `mock-${Date.now()}` } as MockRoom;
}
