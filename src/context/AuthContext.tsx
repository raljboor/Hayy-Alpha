/**
 * AuthContext — single source of truth for auth state across the app.
 *
 * Two modes:
 *  - Supabase mode (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set):
 *      Subscribes to supabase.auth.onAuthStateChange, loads the user profile
 *      from the `profiles` table, and exposes the live session.
 *
 *  - Mock mode (env vars missing):
 *      Reads the existing hayy.authed localStorage flag and uses the seeded
 *      mock user (Amira, u1) as the current user. All other context values
 *      are derived from mock fixtures so the app works identically to before.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { isAuthed, signIn as mockSignIn, signOut as mockSignOut } from "@/lib/auth";
import { getProfile } from "@/lib/api/profiles";
import type { UserProfile, RoleType } from "@/types/models";
import { users } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthContextValue {
  /** Raw Supabase session (null in mock mode) */
  session: Session | null;
  /** Raw Supabase user object (null in mock mode) */
  user: User | null;
  /** Convenience: user.id in Supabase mode, mock user id in mock mode */
  userId: string | null;
  /** Full profile row from the `profiles` table (or mock equivalent) */
  profile: UserProfile | null;
  /** Role from the profile (null until profile loads) */
  role: RoleType | null;
  /** True while the initial auth check is in flight */
  loading: boolean;
  /** True if there is an active session / mock auth flag */
  isAuthenticated: boolean;
  /** Signs the user out (Supabase or mock) */
  signOut: () => Promise<void>;
  /** Re-fetches the user profile — call after profile updates */
  refreshProfile: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Mock user (Amira) used as the seeded current user in mock mode
// ---------------------------------------------------------------------------

const MOCK_USER_ID = users[0].id; // "u1"

function buildMockProfile(): UserProfile {
  const u = users[0];
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

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -------------------------------------------------------------------------
  // Profile loader
  // -------------------------------------------------------------------------

  const loadProfile = useCallback(async (uid: string) => {
    try {
      const p = await getProfile(uid);
      setProfile(p);
      setRole(p?.role_type ?? null);
    } catch {
      setProfile(null);
      setRole(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (userId) await loadProfile(userId);
  }, [userId, loadProfile]);

  // -------------------------------------------------------------------------
  // Supabase mode
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Load existing session immediately on mount.
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      setUserId(s?.user?.id ?? null);
      setIsAuthenticated(!!s?.user);
      if (s?.user) {
        loadProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Subscribe to future auth events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setUserId(newSession?.user?.id ?? null);
        setIsAuthenticated(!!newSession?.user);
        if (newSession?.user) {
          // Use void — we're inside the Supabase callback which must be synchronous.
          void loadProfile(newSession.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // -------------------------------------------------------------------------
  // Mock mode
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (isSupabaseConfigured) return;

    const EVT = "hayy:auth-change";

    const sync = () => {
      const authed = isAuthed();
      setIsAuthenticated(authed);
      if (authed) {
        setUserId(MOCK_USER_ID);
        setProfile(buildMockProfile());
        setRole("candidate");
      } else {
        setUserId(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    };

    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Sign out
  // -------------------------------------------------------------------------

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      mockSignOut();
    }
    setSession(null);
    setUser(null);
    setUserId(null);
    setProfile(null);
    setRole(null);
    setIsAuthenticated(false);
  }, []);

  // -------------------------------------------------------------------------
  // Expose nothing until the initial check completes (prevents flash)
  // -------------------------------------------------------------------------

  const value: AuthContextValue = {
    session,
    user,
    userId,
    profile,
    role,
    loading,
    isAuthenticated,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}

// Re-export mockSignIn so Login/Signup can trigger mock mode manually.
export { mockSignIn };
