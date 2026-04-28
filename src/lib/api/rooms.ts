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

export async function createRoom(roomData: Partial<MockRoom>): Promise<MockRoom> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("rooms")
      .insert(roomData)
      .select()
      .single();
    if (error) throw error;
    return adaptRoomFromDb(data as DbRoom);
  }
  // Mock: not persisted between renders
  return { ...(rooms[0]), ...roomData, id: `mock-${Date.now()}` } as MockRoom;
}
