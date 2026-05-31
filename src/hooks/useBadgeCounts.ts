import { useAsync } from "@/lib/useAsync";
import { getReferralThreads, getReferralRequests } from "@/lib/api/referrals";
import { getNotifications } from "@/lib/api/notifications";

export function useBadgeCounts(userId: string | null) {
  const { data: threads } = useAsync(
    () => getReferralThreads(userId ?? undefined),
    [userId],
  );
  const { data: referrals } = useAsync(
    () => getReferralRequests(userId ?? undefined),
    [userId],
  );
  const { data: notifications } = useAsync(
    () => getNotifications(userId ?? undefined),
    [userId],
  );

  const unreadMessages = (threads ?? []).filter((t) => t.unread).length;
  const unreadNotifications = (notifications ?? []).filter((n) => n.unread).length;
  const pendingReferrals = (referrals ?? []).filter((r) => r.status === "pending").length;

  return { unreadMessages, unreadNotifications, pendingReferrals };
}
