/**
 * Messages API.
 *
 * Mock mode: returns messages embedded in thread fixtures.
 * Supabase mode: fetches from `referral_messages`, adapts rows, and
 * creates a notification for the other party after each send.
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
    // 1. Insert the message
    const { data: msgData, error: msgError } = await supabase
      .from("referral_messages")
      .insert({
        referral_request_id: referralRequestId,
        sender_id: senderId,
        body,
        attachment_url: attachmentUrl ?? null,
      })
      .select()
      .single();

    if (msgError) return { data: null, error: msgError };

    // 2. Look up the referral request to find the other party
    const { data: req } = await supabase
      .from("referral_requests")
      .select("requester_id, host_id")
      .eq("id", referralRequestId)
      .maybeSingle();

    if (req) {
      const recipientId =
        req.requester_id === senderId ? req.host_id : req.requester_id;

      if (recipientId) {
        // 3. Notify the other party (fire-and-forget; don't fail if this fails)
        await supabase.from("notifications").insert({
          user_id: recipientId,
          type: "New message",
          title: "New referral message",
          body: body.length > 80 ? `${body.slice(0, 77)}…` : body,
          related_entity_type: "referral_request",
          related_entity_id: referralRequestId,
        }).then(() => {}).catch(() => {});
      }
    }

    return { data: msgData, error: null };
  }

  // Mock mode
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
