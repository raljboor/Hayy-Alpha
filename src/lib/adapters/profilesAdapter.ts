/**
 * Converts DB-shaped profile rows (snake_case from Supabase) into the
 * UI-shaped User type used by most frontend components (camelCase, from lib/mockData.ts).
 *
 * Also provides the reverse direction (UI → partial DB) for profile updates.
 */

import type { User as MockUser } from "@/lib/mockData";
import type { UserProfile as DbProfile } from "@/types/models";

/** Derives two-letter initials from a full name. */
function initials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Cycle through a small palette so each new user gets a consistent avatar color
 * based on their ID (deterministic, no randomness).
 */
const AVATAR_COLORS = [
  "bg-primary",
  "bg-clay",
  "bg-olive",
  "bg-accent",
] as const;

function avatarColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function adaptProfileFromDb(row: DbProfile): MockUser {
  return {
    id: row.id,
    name: row.full_name,
    role: row.headline ?? "",
    company: undefined,
    location: row.location ?? "",
    bio: row.bio ?? "",
    avatarColor: avatarColorForId(row.id),
    initials: initials(row.full_name),
    verified: false,
    pronouns: row.pronouns ?? undefined,
  };
}

export function adaptProfilesFromDb(rows: DbProfile[]): MockUser[] {
  return rows.map(adaptProfileFromDb);
}

/**
 * Converts a UI-shaped partial update back into DB column names.
 * Used by updateProfile() when Supabase is configured.
 */
export function adaptProfileUpdateToDb(
  update: Partial<MockUser>,
): Partial<DbProfile> {
  const db: Partial<DbProfile> = {};
  if (update.name !== undefined) db.full_name = update.name;
  if (update.role !== undefined) db.headline = update.role;
  if (update.location !== undefined) db.location = update.location;
  if (update.bio !== undefined) db.bio = update.bio;
  if (update.pronouns !== undefined) db.pronouns = update.pronouns;
  return db;
}
