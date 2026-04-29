import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * `isSupabaseConfigured` lets the API layer decide whether to hit Supabase
 * or fall back to local mock data. The frontend MUST keep working even when
 * env vars are not set yet (e.g. before a backend is wired up).
 */
export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

// Development-only diagnostic: confirms which mode the app is running in.
// Does NOT log any key values — only the boolean.
if (import.meta.env.DEV) {
  console.info(
    `[Hayy] Supabase configured: ${isSupabaseConfigured}. ` +
      (isSupabaseConfigured
        ? "Live data will be fetched from Supabase."
        : "Running in mock mode — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect."),
  );
}
