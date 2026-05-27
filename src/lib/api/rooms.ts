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
import { rooms, users, type Room as MockRoom } from "@/data/mockData";
import { adaptRoomsFromDb, adaptRoomFromDb, type DbRoom } from "@/lib/adapters/roomsAdapter";
import {
  adaptAgendaFromDb,
  adaptRulesFromDb,
  adaptHostsFromDb,
  adaptHostFromDb,
  type AgendaItem,
  type RoomRule,
  type RoomHost,
  type DbRoomAgendaItem,
  type DbRoomRule,
  type DbRoomHostRow,
} from "@/lib/adapters/roomContentAdapter";

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
// Agenda / rules / hosts
//
// In Supabase mode these read from room_agenda / room_rules and from
// room_participants (role = 'host'). In mock mode — and as a fallback when a
// real room has no agenda/rules rows yet — RoomDetail uses these defaults so
// the page never looks empty.
// ---------------------------------------------------------------------------

export const DEFAULT_AGENDA: AgendaItem[] = [
  { id: "a0", time: "0:00", title: "Welcome + room rules", desc: "Quick intro to how Hayy rooms work and how to get the most out of today." },
  { id: "a1", time: "0:05", title: "Host introductions", desc: "Hear from operators, recruiters, and analysts inside Canadian corporates." },
  { id: "a2", time: "0:15", title: "Live Q&A", desc: "Bring your questions about resumes, ATS, and the referral process." },
  { id: "a3", time: "0:35", title: "Breakout networking", desc: "Smaller rooms grouped by target industry and city." },
  { id: "a4", time: "0:50", title: "Referral request instructions", desc: "How to send a thoughtful, high-signal referral request after the room." },
];

export const DEFAULT_RULES: RoomRule[] = [
  { id: "r0", title: "Be respectful", desc: "Hayy is a warm, human community — treat every host and member that way." },
  { id: "r1", title: "Don't spam referral requests", desc: "Earn the intro. Quality over quantity, every time." },
  { id: "r2", title: "Ask specific questions", desc: "Specific questions get specific, useful answers." },
  { id: "r3", title: "Follow up professionally", desc: "If a host opens a door, walk through it on time and prepared." },
];

const DEFAULT_HOSTS: RoomHost[] = [
  { id: users[5]?.id ?? "h0", name: users[5]?.name ?? "Operations host", role: "Operations Manager", company: "Top-3 Canadian retailer", openTo: "coffee chats" },
  { id: users[3]?.id ?? "h1", name: users[3]?.name ?? "Recruiter", role: "Recruiter", company: "Tech-forward bank", openTo: "referrals" },
  { id: users[2]?.id ?? "h2", name: users[2]?.name ?? "Product analyst", role: "Product Analyst", company: "Insurance & fintech", openTo: "coffee chats" },
  { id: users[1]?.id ?? "h3", name: users[1]?.name ?? "Community host", role: "Founder / Community host", company: "Hayy", openTo: "referrals" },
];

const PROFILE_FIELDS = "id, full_name, headline, location";

export async function getRoomAgenda(roomId: string): Promise<AgendaItem[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_agenda")
      .select("*")
      .eq("room_id", roomId)
      .order("position", { ascending: true });
    if (error) throw error;
    return adaptAgendaFromDb((data ?? []) as DbRoomAgendaItem[]);
  }
  return DEFAULT_AGENDA;
}

export async function getRoomRules(roomId: string): Promise<RoomRule[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_rules")
      .select("*")
      .eq("room_id", roomId)
      .order("position", { ascending: true });
    if (error) throw error;
    return adaptRulesFromDb((data ?? []) as DbRoomRule[]);
  }
  return DEFAULT_RULES;
}

export async function getRoomHosts(roomId: string): Promise<RoomHost[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("room_participants")
      .select(`user_id, participant_role, user_profiles(${PROFILE_FIELDS})`)
      .eq("room_id", roomId)
      .eq("participant_role", "host");
    if (error) throw error;
    const hosts = adaptHostsFromDb((data ?? []) as unknown as DbRoomHostRow[]);
    if (hosts.length > 0) return hosts;

    // Fallback: surface the room owner even if no host participant row exists.
    const { data: roomRow } = await supabase
      .from("rooms")
      .select("host_id")
      .eq("id", roomId)
      .maybeSingle();
    const hostId = (roomRow as { host_id?: string } | null)?.host_id;
    if (!hostId) return [];
    const { data: prof } = await supabase
      .from("user_profiles")
      .select(PROFILE_FIELDS)
      .eq("id", hostId)
      .maybeSingle();
    if (!prof) return [];
    return [adaptHostFromDb({ user_id: hostId, participant_role: "host", user_profiles: prof as never })];
  }
  return DEFAULT_HOSTS;
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
    if (import.meta.env.DEV) {
      console.debug("[createRoom] insert payload", insert);
    }
    const { data, error } = await supabase
      .from("rooms")
      .insert(insert)
      .select()
      .single();
    if (error) {
      if (import.meta.env.DEV) {
        console.error("[createRoom] Supabase error", { code: error.code, message: error.message, details: error.details, hint: error.hint });
      }
      throw new Error(error.message);
    }
    const created = adaptRoomFromDb(data as DbRoom);

    // Best-effort: register the creator as the room host so getRoomHosts()
    // (room_participants where role = 'host') surfaces them. Non-fatal.
    const hostId = insert.host_id;
    if (hostId) {
      await supabase
        .from("room_participants")
        .upsert(
          {
            room_id: created.id,
            user_id: hostId,
            participant_role: "host",
            attendance_status: "registered",
            joined_at: new Date().toISOString(),
          },
          { onConflict: "room_id,user_id" },
        )
        .then(({ error: partErr }) => {
          if (partErr && import.meta.env.DEV) {
            console.warn("[createRoom] host participant upsert failed", partErr.message);
          }
        });
    }

    return created;
  }
  // Mock: not persisted between renders
  return { ...(rooms[0]), ...roomData, id: `mock-${Date.now()}` } as MockRoom;
}
