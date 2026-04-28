/**
 * Notifications API.
 *
 * Mock mode: returns UI-shaped fixtures from inboxData.ts directly.
 * Supabase mode: fetches DB-shaped rows and converts them to the UI shape
 * via notificationsAdapter — bridging read_at → unread and created_at → time.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { notifications, type Notification as UiNotification } from "@/data/mockData";
import {
  adaptNotificationsFromDb,
  type DbNotification,
} from "@/lib/adapters/notificationsAdapter";

export async function getNotifications(_userId?: string): Promise<UiNotification[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return adaptNotificationsFromDb((data ?? []) as DbNotification[]);
  }
  return notifications;
}

export async function markNotificationRead(notificationId: string) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);
  }
  return { data: { notificationId }, error: null };
}

export async function markAllNotificationsRead(userId: string) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("read_at", null);
  }
  return { data: { userId }, error: null };
}
