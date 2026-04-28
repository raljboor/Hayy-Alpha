/**
 * Notifications API placeholder.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { notifications, type Notification as MockNotification } from "@/data/mockData";

export async function getNotifications(_userId?: string): Promise<MockNotification[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as MockNotification[]) ?? [];
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
