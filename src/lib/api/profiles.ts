/**
 * Profiles API.
 *
 * Mock mode: returns UI-shaped User fixtures from mockData.
 * Supabase mode: fetches DB-shaped UserProfile rows and converts them to the
 * UI-shaped User type via profilesAdapter.
 *
 * Also exposes the canonical UserProfile (DB shape) for pages that need it.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { users } from "@/data/mockData";
import type { UserProfile } from "@/types/models";
import {
  adaptProfileFromDb,
  adaptProfileUpdateToDb,
} from "@/lib/adapters/profilesAdapter";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as UserProfile) ?? null;
  }
  const u = users.find((x) => x.id === userId);
  if (!u) return null;
  // Convert mock User to the canonical UserProfile shape for consistency.
  return {
    id: u.id,
    full_name: u.name,
    avatar_url: null,
    headline: u.role,
    location: u.location,
    pronouns: u.pronouns ?? null,
    bio: u.bio,
    target_roles: [],
    skills: [],
    linkedin_url: null,
    resume_url: null,
    video_intro_url: null,
    role_type: "job_seeker",
    created_at: new Date().toISOString(),
  };
}

/**
 * Returns the mock User shape (camelCase) used by most UI components.
 * Prefer getProfile() for profile pages; use this for avatar/name display.
 */
export async function getProfileUi(userId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return adaptProfileFromDb(data as UserProfile);
  }
  return users.find((x) => x.id === userId) ?? null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return (data as UserProfile) ?? null;
  }
  const current = await getProfile(userId);
  return current ? { ...current, ...updates } : null;
}

/**
 * Update profile using UI-shaped (camelCase) fields — converts to DB columns
 * via the adapter before sending to Supabase.
 */
export async function updateProfileUi(
  userId: string,
  updates: Parameters<typeof adaptProfileUpdateToDb>[0],
): Promise<UserProfile | null> {
  return updateProfile(userId, adaptProfileUpdateToDb(updates));
}

export async function uploadResume(userId: string, file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const path = `${userId}/resume-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, {
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("resumes").getPublicUrl(path);
    return data.publicUrl;
  }
  return URL.createObjectURL(file);
}

export async function uploadVideoIntro(userId: string, file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const path = `${userId}/video-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("video-intros").upload(path, file, {
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("video-intros").getPublicUrl(path);
    return data.publicUrl;
  }
  return URL.createObjectURL(file);
}
