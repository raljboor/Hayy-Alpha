/**
 * Host settings API.
 *
 * Manages the host_settings table — one row per referral host.
 * Mock mode: returns a default settings object.
 * Supabase mode: reads/writes host_settings by user_id.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export interface HostSettings {
  id?: string;
  user_id: string;
  open_to_coffee_chats: boolean;
  open_to_referrals: boolean;
  open_to_resume_feedback: boolean;
  monthly_capacity: number;
  roles_supported: string[];
  industries_supported: string[];
}

export interface HostAvailability {
  open_to_coffee_chats?: boolean;
  open_to_referrals?: boolean;
  open_to_resume_feedback?: boolean;
}

const DEFAULT_SETTINGS: Omit<HostSettings, "user_id"> = {
  open_to_coffee_chats: true,
  open_to_referrals: true,
  open_to_resume_feedback: false,
  monthly_capacity: 3,
  roles_supported: [],
  industries_supported: [],
};

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getHostSettings(userId: string): Promise<HostSettings | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("host_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as HostSettings) ?? null;
  }
  // Mock: return default settings so UI renders usable toggles
  return { ...DEFAULT_SETTINGS, user_id: userId };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function upsertHostSettings(
  userId: string,
  settings: Partial<Omit<HostSettings, "id" | "user_id">>,
): Promise<HostSettings> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("host_settings")
      .upsert({ user_id: userId, ...settings }, { onConflict: "user_id" })
      .select()
      .single();
    if (error) throw error;
    return data as HostSettings;
  }
  return { ...DEFAULT_SETTINGS, user_id: userId, ...settings };
}

export async function updateHostCapacity(userId: string, monthlyCapacity: number) {
  return upsertHostSettings(userId, { monthly_capacity: monthlyCapacity });
}

export async function updateHostAvailability(
  userId: string,
  availability: HostAvailability,
) {
  return upsertHostSettings(userId, availability);
}
