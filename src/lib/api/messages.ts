/**
 * Messages API.
 *
 * Mock mode: returns messages embedded in thread fixtures.
 * Supabase mode: fetches from `referral_messages` and adapts rows into the
 * UI-shaped ThreadMessage type via messagesAdapter.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { threads, type ThreadMessage } from "@/data/mockData";
import { adaptMessagesFromDb, type DbReferralMessage } from "@/lib/adapters/messagesAdapter";

export async function getMessagesForReferral(
  referralRequestId: string,
  currentUserId = "me",
  participants: Record<string, { name: string; initials: string; avatarColor: string }> = {},
): Promise<ThreadMessage[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_messages")
      .select("*")
      .eq("referral_request_id", referralRequestId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return adaptMessagesFromDb(
      (data ?? []) as DbReferralMessage[],
      currentUserId,
      participants,
    );
  }
  const thread = threads.find((t) => t.id === referralRequestId);
  return thread?.messages ?? [];
}

export async function sendReferralMessage(
  referralRequestId: string,
  senderId: string,
  body: string,
  attachmentUrl?: string | null,
) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("referral_messages")
      .insert({
        referral_request_id: referralRequestId,
        sender_id: senderId,
        body,
        attachment_url: attachmentUrl ?? null,
      })
      .select()
      .single();
  }
  return {
    data: {
      id: `mock-${Date.now()}`,
      referral_request_id: referralRequestId,
      sender_id: senderId,
      body,
      attachment_url: attachmentUrl ?? null,
      created_at: new Date().toISOString(),
      read_at: null,
    },
    error: null,
  };
}

export async function markMessageAsRead(messageId: string) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("referral_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId);
  }
  return { data: { messageId }, error: null };
}
