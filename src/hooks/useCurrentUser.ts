/**
 * useCurrentUser — convenience hook that surfaces the most commonly needed
 * auth fields without requiring callers to import AuthContext directly.
 *
 * Usage:
 *   const { userId, profile, role, isAuthenticated, loading } = useCurrentUser();
 */

import { useAuthContext } from "@/context/AuthContext";
import type { RoleType } from "@/types/models";
import type { UserProfile } from "@/types/models";
import type { User } from "@supabase/supabase-js";

export interface CurrentUser {
  user: User | null;
  userId: string | null;
  profile: UserProfile | null;
  role: RoleType | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export function useCurrentUser(): CurrentUser {
  const { user, userId, profile, role, loading, isAuthenticated, signOut, refreshProfile } =
    useAuthContext();
  return { user, userId, profile, role, loading, isAuthenticated, signOut, refreshProfile };
}
