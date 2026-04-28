/**
 * Rooms API.
 *
 * Mock mode: returns fixtures from src/lib/mockData.ts.
 * Supabase mode: fetches from the `rooms` table and passes rows through
 * adaptRoomsFromDb() so pages always receive the same UI-shaped Room type.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { rooms, type Room as MockRoom } from "@/data/mockData";
import { adaptRoomsFromDb, adaptRoomFromDb, type DbRoom } from "@/lib/adapters/roomsAdapter";

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
  return { ...(rooms[0]), ...roomData, id: `mock-${Date.now()}` } as MockRoom;
}

export async function joinRoom(roomId: string, userId: string) {
  if (isSupabaseConfigured && supabase) {
    return supabase.from("room_participants").insert({
      room_id: roomId,
      user_id: userId,
      participant_role: "attendee",
      attendance_status: "joined",
      joined_at: new Date().toISOString(),
    });
  }
  return { data: { roomId, userId }, error: null };
}

export async function leaveRoom(roomId: string, userId: string) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("room_participants")
      .update({ attendance_status: "left" })
      .eq("room_id", roomId)
      .eq("user_id", userId);
  }
  return { data: { roomId, userId }, error: null };
}
