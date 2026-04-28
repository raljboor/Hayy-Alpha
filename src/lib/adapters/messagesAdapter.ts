/**
 * Converts DB-shaped referral_messages rows into the ThreadMessage UI shape.
 *
 * Re-exports the message adapter from referralsAdapter for convenience so
 * the messages API module has a single import point.
 */

export { adaptMessageFromDb } from "./referralsAdapter";

import type { DbReferralMessage } from "./referralsAdapter";
import type { ThreadMessage } from "@/lib/inboxData";

/**
 * Adapt a list of DB messages for a referral thread.
 *
 * @param rows        Raw Supabase referral_messages rows
 * @param currentUserId  The logged-in user's ID (determines "me" vs "them")
 * @param participants  Map of user_id → { name, initials, avatarColor } for display
 */
export function adaptMessagesFromDb(
  rows: DbReferralMessage[],
  currentUserId: string,
  participants: Record<string, { name: string; initials: string; avatarColor: string }>,
): ThreadMessage[] {
  return rows.map((row) => {
    const isMe = row.sender_id === currentUserId;
    const sender = participants[row.sender_id];
    const diff = Date.now() - new Date(row.created_at).getTime();
    const minutes = Math.floor(diff / 60_000);
    let time: string;
    if (minutes < 60) time = `${minutes}m ago`;
    else if (minutes < 1440) time = `${Math.floor(minutes / 60)}h ago`;
    else if (minutes < 2880) time = "Yesterday";
    else time = new Date(row.created_at).toLocaleDateString();

    return {
      id: row.id,
      sender: isMe ? "me" : "them",
      senderName: isMe ? "You" : (sender?.name ?? "Unknown"),
      initials: sender?.initials ?? "??",
      avatarColor: sender?.avatarColor ?? "bg-primary",
      time,
      body: row.body,
    };
  });
}
