/**
 * Converts DB-shaped notification rows (snake_case, read_at timestamp) into
 * the UI-shaped Notification type used by the Notifications page.
 *
 * DB shape (src/types/models.ts):
 *   { id, user_id, type, title, body, read_at, created_at, ... }
 *
 * UI shape (src/lib/inboxData.ts):
 *   { id, type, title, body, time, unread, group }
 */

import type { Notification as UiNotification, NotificationType } from "@/lib/inboxData";

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  read_at: string | null;
  created_at: string;
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

function toGroup(iso: string): "Today" | "Earlier" {
  const diff = Date.now() - new Date(iso).getTime();
  return diff < 86_400_000 ? "Today" : "Earlier";
}

const KNOWN_TYPES: NotificationType[] = [
  "Referral accepted",
  "New message",
  "Room reminder",
  "Referral update",
  "Host joined",
];

function coerceType(raw: string): NotificationType {
  const match = KNOWN_TYPES.find(
    (t) => t.toLowerCase() === raw.toLowerCase(),
  );
  // Fall back to "Referral update" so the icon map always has a valid key.
  return match ?? "Referral update";
}

export function adaptNotificationFromDb(row: DbNotification): UiNotification {
  return {
    id: row.id,
    type: coerceType(row.type),
    title: row.title,
    body: row.body,
    time: relativeTime(row.created_at),
    unread: row.read_at === null,
    group: toGroup(row.created_at),
  };
}

export function adaptNotificationsFromDb(rows: DbNotification[]): UiNotification[] {
  return rows.map(adaptNotificationFromDb);
}
