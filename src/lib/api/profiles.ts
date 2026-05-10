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
    referral_goals: null,
    target_roles: [],
    skills: [],
    linkedin_url: null,
    resume_url: null,
    video_intro_url: null,
    role_type: "job_seeker",
    // The mock fixture user is fully populated; surface them as already
    // onboarded so the fail-closed decideLandingRoute helper doesn't
    // bounce mock-mode users to /onboarding on every login.
    onboarding_completed: true,
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

/**
 * Upload a profile avatar image to the `avatars` storage bucket,
 * then update the user_profiles.avatar_url column with the public URL.
 *
 * Returns the public URL of the uploaded image.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const path = `${userId}/avatar-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Persist the URL to the profile row
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);
    if (updateError) throw updateError;

    return publicUrl;
  }
  // Mock mode: return an object URL so the preview updates immediately
  return URL.createObjectURL(file);
}

// ---------------------------------------------------------------------------
// Suggested profiles (Dashboard "People to meet" section)
//
// Returns hosts + recruiters whose skills / roles / hiring-focus tokens
// overlap with the current user's target_roles + skills. Scored client-side
// so this works against the existing schema with no new RPCs. If no matches
// are found, returns the same role-typed users without the score filter so
// the section never goes empty.
// ---------------------------------------------------------------------------

export interface SuggestedProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  headline: string | null;
  role_type: string;
  skills: string[];
  company_name: string | null;
  match_score: number;
  shared_tokens: string[];
}

export interface GetSuggestedProfilesArgs {
  /** Tokens from the current user's target_roles + skills (case-insensitive). */
  interests: string[];
  /** Exclude this user id from the results. */
  selfId: string | null;
  /** Max profiles to return (default 6). */
  limit?: number;
}

function normalizeTokens(...lists: (string[] | string | null | undefined)[]): string[] {
  const out: string[] = [];
  for (const entry of lists) {
    if (!entry) continue;
    if (Array.isArray(entry)) {
      for (const t of entry) {
        const s = (t ?? "").toLowerCase().trim();
        if (s) out.push(s);
      }
    } else {
      const s = entry.toLowerCase().trim();
      if (s) out.push(s);
    }
  }
  return out;
}

function scoreOverlap(
  interestTokens: string[],
  candidateTokens: string[],
): { score: number; shared: string[] } {
  const interestSet = new Set(interestTokens);
  const shared = new Set<string>();
  let score = 0;
  for (const c of candidateTokens) {
    if (interestSet.has(c)) {
      score += 2;
      shared.add(c);
      continue;
    }
    for (const i of interestSet) {
      if (i.length >= 3 && (c.includes(i) || i.includes(c))) {
        score += 1;
        shared.add(c);
        break;
      }
    }
  }
  return { score, shared: Array.from(shared) };
}

export async function getSuggestedProfiles({
  interests,
  selfId,
  limit = 6,
}: GetSuggestedProfilesArgs): Promise<SuggestedProfile[]> {
  const interestTokens = normalizeTokens(interests);

  if (isSupabaseConfigured && supabase) {
    const { data: rows, error } = await supabase
      .from("user_profiles")
      .select("*")
      .in("role_type", ["referral_host", "recruiter"])
      .limit(80);
    if (error) throw error;

    type Row = {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      headline: string | null;
      role_type: string | null;
      skills: string[] | null;
      target_roles: string[] | null;
      // Recruiter / host extended fields (migrations 004, 001)
      company_name?: string | null;
      hiring_focus?: string[] | null;
      departments_hiring?: string[] | null;
      industries_supported?: string[] | null;
      roles_supported?: string[] | null;
    };

    const candidates = ((rows ?? []) as Row[]).filter((r) => r.id !== selfId);

    const scored: SuggestedProfile[] = candidates.map((c) => {
      const candTokens = normalizeTokens(
        c.skills,
        c.target_roles,
        c.hiring_focus,
        c.departments_hiring,
        c.industries_supported,
        c.roles_supported,
        c.headline,
        c.company_name,
      );
      const { score, shared } = scoreOverlap(interestTokens, candTokens);
      return {
        id: c.id,
        full_name: c.full_name ?? "",
        avatar_url: c.avatar_url ?? null,
        headline: c.headline ?? null,
        role_type: c.role_type ?? "referral_host",
        skills: c.skills ?? [],
        company_name: c.company_name ?? null,
        match_score: score,
        shared_tokens: shared,
      };
    });

    const matched = scored.filter((p) => p.match_score > 0);
    matched.sort((a, b) => b.match_score - a.match_score);
    if (matched.length > 0) return matched.slice(0, limit);

    // Fallback: return same role-typed users with no scoring filter so the
    // section never shows up empty for a fresh account.
    return scored.slice(0, limit);
  }

  // Mock mode: derive a host/recruiter shape from the existing fixture users.
  // The mock fixture doesn't carry role_type/skills, so we map verified+companied
  // users as hosts/recruiters and score on role/company/bio tokens.
  const candidates = users
    .filter((u) => u.id !== selfId && (u.verified || !!u.company))
    .map((u) => {
      const tokens = normalizeTokens(u.role, u.company ?? "", u.bio);
      const { score, shared } = scoreOverlap(interestTokens, tokens);
      const isRecruiter = /recruit|talent/i.test(u.role);
      return {
        id: u.id,
        full_name: u.name,
        avatar_url: null,
        headline: u.role + (u.company ? ` · ${u.company}` : ""),
        role_type: isRecruiter ? "recruiter" : "referral_host",
        skills: [u.role],
        company_name: u.company ?? null,
        match_score: score,
        shared_tokens: shared,
      } as SuggestedProfile;
    });
  candidates.sort((a, b) => b.match_score - a.match_score);
  return candidates.slice(0, limit);
}
