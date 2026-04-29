/**
 * Runtime mode helpers.
 *
 * Use these throughout the app to clearly separate:
 *   - Mock/demo behavior (Supabase NOT configured)
 *   - Production behavior (Supabase IS configured — show real data or empty states)
 *
 * Never fall back to mock fixture data when isProductionDataMode is true.
 */

import { isSupabaseConfigured } from "@/lib/supabaseClient";

/** True when Supabase env vars are missing — mock data is appropriate. */
export const isMockMode: boolean = !isSupabaseConfigured;

/** True when Supabase env vars are present — only real data or empty states. */
export const isProductionDataMode: boolean = isSupabaseConfigured;
