/**
 * Canonical data models for the Hayy backend.
 *
 * These shapes are designed to map 1:1 onto Supabase tables when the
 * backend is wired up. The frontend currently uses local mock data
 * (see `src/data/mockData.ts`) that loosely matches these shapes.
 */

export type RoleType = "job_seeker" | "referral_host" | "recruiter" | "admin";

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  headline: string | null;
  location: string | null;
  pronouns: string | null;
  bio: string | null;
  target_roles: string[];
  skills: string[];
  linkedin_url: string | null;
  resume_url: string | null;
  video_intro_url: string | null;
  role_type: RoleType;
  created_at: string;
}

export type RoomStatus = "live" | "upcoming" | "ended";
export type RoomType = "qa" | "coffee" | "open" | "panel";

export interface Room {
  id: string;
  title: string;
  description: string;
  category: string;
  host_id: string;
  start_time: string;
  status: RoomStatus;
  room_type: RoomType;
  max_speakers: number;
  attendee_count: number;
  created_at: string;
}

export type ParticipantRole = "host" | "speaker" | "attendee";
export type AttendanceStatus = "registered" | "joined" | "left" | "no_show";

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  participant_role: ParticipantRole;
  attendance_status: AttendanceStatus;
  joined_at: string | null;
}

export type ReferralStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "submitted"
  | "completed";

export type ReferralType =
  | "coffee chat"
  | "referral"
  | "resume feedback"
  | "interview prep"
  | "company insight";

export interface ReferralRequest {
  id: string;
  requester_id: string;
  host_id: string;
  target_company: string;
  target_role: string;
  request_type: ReferralType;
  status: ReferralStatus;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralMessage {
  id: string;
  referral_request_id: string;
  sender_id: string;
  body: string;
  attachment_url: string | null;
  created_at: string;
  read_at: string | null;
}

export type NotificationType =
  | "Referral accepted"
  | "Referral update"
  | "New message"
  | "Room reminder"
  | "Host joined";

export type RelatedEntityType =
  | "referral_request"
  | "referral_message"
  | "room"
  | "user";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  related_entity_type: RelatedEntityType | null;
  related_entity_id: string | null;
  read_at: string | null;
  created_at: string;
}
