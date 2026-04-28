/**
 * Referrals API placeholder.
 *
 * The mock layer uses two distinct shapes today:
 *  - `referralRequests` (lightweight, used by Dashboard)
 *  - `threads` (rich conversation threads, used by Referrals + Thread pages)
 *
 * We keep both available here so pages don't have to refactor mid-flight.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  referralRequests,
  threads,
  type ReferralRequest as MockReferralRequest,
  type ReferralThread,
  type ThreadStatus,
} from "@/data/mockData";

export async function getReferralRequests(_userId?: string): Promise<MockReferralRequest[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as MockReferralRequest[]) ?? [];
  }
  return referralRequests;
}

export async function getReferralThreads(): Promise<ReferralThread[]> {
  // Threads are a UI-shaped view of referral conversations.
  // Backed by a join of referral_requests + referral_messages once Supabase is wired up.
  return threads;
}

export async function getReferralRequestById(referralId: string): Promise<ReferralThread | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("id", referralId)
      .maybeSingle();
    if (error) throw error;
    // Real wiring would hydrate this into a thread shape.
    return (data as unknown as ReferralThread) ?? null;
  }
  return threads.find((t) => t.id === referralId) ?? null;
}

export interface CreateReferralInput {
  requester_id: string;
  host_id: string;
  target_company: string;
  target_role: string;
  request_type: string;
  message: string;
}

export async function createReferralRequest(data: CreateReferralInput) {
  if (isSupabaseConfigured && supabase) {
    return supabase.from("referral_requests").insert(data).select().single();
  }
  return { data: { id: `mock-${Date.now()}`, ...data }, error: null };
}

export async function updateReferralStatus(referralId: string, status: ThreadStatus) {
  if (isSupabaseConfigured && supabase) {
    return supabase
      .from("referral_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", referralId);
  }
  return { data: { referralId, status }, error: null };
}

export async function getIncomingReferralRequests(hostId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("host_id", hostId);
    if (error) throw error;
    return data ?? [];
  }
  return referralRequests.filter((r) => r.hostId === hostId || r.direction === "incoming");
}

export async function getOutgoingReferralRequests(userId: string) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("requester_id", userId);
    if (error) throw error;
    return data ?? [];
  }
  return referralRequests.filter((r) => r.candidateId === userId || r.direction === "outgoing");
}
