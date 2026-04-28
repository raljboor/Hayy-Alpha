/**
 * Converts DB-shaped referral rows (snake_case from Supabase) into the
 * UI-shaped types used by the frontend.
 *
 * Two UI shapes exist today:
 *  - MockReferralRequest (lightweight, used by Dashboard + HostDashboard)
 *  - ReferralThread     (rich conversation thread, used by Referrals + Thread pages)
 *
 * The thread shape requires a join of referral_requests + referral_messages +
 * profiles. That join is not yet available, so adaptThreadFromDb has a clear
 * TODO marking where the real implementation goes.
 */

import type {
  ReferralRequest as MockReferralRequest,
  ReferralThread,
  ThreadMessage,
  ThreadStatus,
} from "@/lib/inboxData";

/**
 * Raw Supabase `referral_requests` row.
 */
export interface DbReferralRequest {
  id: string;
  requester_id: string;
  host_id: string;
  target_company: string;
  target_role: string;
  request_type: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
}

/**
 * Raw Supabase `referral_messages` row.
 */
export interface DbReferralMessage {
  id: string;
  referral_request_id: string;
  sender_id: string;
  body: string;
  attachment_url: string | null;
  created_at: string;
  read_at: string | null;
}

/**
 * Shape returned by the Supabase join query for threads.
 * requester and host are embedded profile rows from the join.
 */
export interface DbReferralThread {
  referral: DbReferralRequest;
  messages: DbReferralMessage[];
  requester: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
  };
  host: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    headline: string | null;
  };
  /** The current user's ID — determines "me" vs "them" in message rendering. */
  currentUserId: string;
}

function mapStatus(raw: string): ThreadStatus {
  const map: Record<string, ThreadStatus> = {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    submitted: "Accepted",
    completed: "Completed",
    waitlisted: "Waitlisted",
  };
  return map[raw.toLowerCase()] ?? "Pending";
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function adaptReferralRequestFromDb(row: DbReferralRequest): MockReferralRequest {
  return {
    id: row.id,
    candidateId: row.requester_id,
    hostId: row.host_id,
    company: row.target_company,
    role: row.target_role,
    type: row.request_type as MockReferralRequest["type"],
    direction: "outgoing",
    status: row.status as MockReferralRequest["status"],
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function adaptReferralRequestsFromDb(rows: DbReferralRequest[]): MockReferralRequest[] {
  return rows.map(adaptReferralRequestFromDb);
}

export function adaptMessageFromDb(
  msg: DbReferralMessage,
  currentUserId: string,
  senderName: string,
  senderInitials: string,
  senderAvatarColor: string,
): ThreadMessage {
  return {
    id: msg.id,
    sender: msg.sender_id === currentUserId ? "me" : "them",
    senderName: msg.sender_id === currentUserId ? "You" : senderName,
    initials: senderInitials,
    avatarColor: senderAvatarColor,
    time: relativeTime(msg.created_at),
    body: msg.body,
  };
}

/**
 * Converts a DB join result into the ReferralThread UI shape.
 *
 * TODO (Phase 6): implement the Supabase query that produces DbReferralThread,
 * then remove the fallback in getReferralThreads(). The query will be:
 *   supabase
 *     .from("referral_requests")
 *     .select(`*, referral_messages(*), requester:profiles!requester_id(*), host:profiles!host_id(*)`)
 *     .order("updated_at", { ascending: false })
 */
export function adaptThreadFromDb(db: DbReferralThread): ReferralThread {
  const { referral, messages, requester, host, currentUserId } = db;

  const isOutgoing = referral.requester_id === currentUserId;
  const otherPerson = isOutgoing ? host : requester;
  const otherName = otherPerson.full_name;
  const otherInitials = otherName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const lastMsg = messages[messages.length - 1];
  const lastUpdated = lastMsg ? relativeTime(lastMsg.created_at) : relativeTime(referral.updated_at);

  const adaptedMessages: ThreadMessage[] = messages.map((m) => {
    const isMe = m.sender_id === currentUserId;
    const senderName = isMe ? "You" : otherName;
    const senderInitials = isMe
      ? requester.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : otherInitials;
    return {
      id: m.id,
      sender: isMe ? "me" : "them",
      senderName,
      initials: senderInitials,
      avatarColor: isMe ? "bg-clay" : "bg-primary",
      time: relativeTime(m.created_at),
      body: m.body,
    };
  });

  const hasUnread = messages.some(
    (m) => m.sender_id !== currentUserId && m.read_at === null,
  );

  return {
    id: referral.id,
    person: {
      name: otherName,
      initials: otherInitials,
      avatarColor: "bg-primary",
    },
    roleCompany: otherPerson.headline ?? otherName,
    requestType: referral.request_type,
    targetRole: referral.target_role,
    targetCompany: referral.target_company,
    status: mapStatus(referral.status),
    lastPreview: lastMsg?.body ?? referral.message,
    lastUpdated,
    unread: hasUnread,
    direction: isOutgoing ? "outgoing" : "incoming",
    readiness: 0,
    inboxContext: `${referral.request_type} · ${otherPerson.headline ?? otherName}`,
    messages: adaptedMessages,
    hostMeta: {
      title: host.headline ?? host.full_name,
      capacity: "Open",
      responseTime: "Usually within 24h",
    },
    files: [],
    nextSteps: [],
  };
}

export function adaptThreadsFromDb(rows: DbReferralThread[]): ReferralThread[] {
  return rows.map(adaptThreadFromDb);
}
