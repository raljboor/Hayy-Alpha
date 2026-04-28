/**
 * Profiles API placeholder.
 * Falls back to mock data when Supabase isn't configured.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { users } from "@/data/mockData";
import type { UserProfile } from "@/types/models";

const toProfile = (u: (typeof users)[number]): UserProfile => ({
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
  role_type: "candidate",
  created_at: new Date().toISOString(),
});

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as UserProfile) ?? null;
  }
  const u = users.find((x) => x.id === userId);
  return u ? toProfile(u) : null;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data as UserProfile;
  }
  // Mock: no persistence — just echo back the merged shape.
  const current = await getProfile(userId);
  return current ? { ...current, ...updates } : null;
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
