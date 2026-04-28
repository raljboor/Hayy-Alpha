/**
 * Referrals API.
 *
 * Two UI shapes are maintained:
 *  - MockReferralRequest  lightweight rows (Dashboard, HostDashboard)
 *  - ReferralThread       rich conversation threads (Referrals, Thread pages)
 *
 * Mock mode: returns fixtures from src/data/mockData.ts.
 * Supabase mode: fetches rows and passes them through adapter functions so
 * pages always receive the same UI-shaped types.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  referralRequests,
  threads,
  type ReferralRequest as MockReferralRequest,
  type ReferralThread,
  type ThreadStatus,
} from "@/data/mockData";
import {
  adaptReferralRequestsFromDb,
  adaptReferralRequestFromDb,
  type DbReferralRequest,
} from "@/lib/adapters/referralsAdapter";

export async function getReferralRequests(_userId?: string): Promise<MockReferralRequest[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return adaptReferralRequestsFromDb((data ?? []) as DbReferralRequest[]);
  }
  return referralRequests;
}

export async function getReferralThreads(): Promise<ReferralThread[]> {
  if (isSupabaseConfigured && supabase) {
    // TODO (Phase 6): replace with the full join query once the schema exists:
    //
    //   const { data, error } = await supabase
    //     .from("referral_requests")
    //     .select(`
    //       *,
    //       referral_messages(*),
    //       requester:profiles!requester_id(id, full_name, avatar_url, headline),
    //       host:profiles!host_id(id, full_name, avatar_url, headline)
    //     `)
    //     .order("updated_at", { ascending: false });
    //
    //   Then pass each row + currentUserId through adaptThreadFromDb().
    //
    // For now, fall back to mock data so the UI keeps working.
    return threads;
  }
  return threads;
}

export async function getReferralRequestById(referralId: string): Promise<ReferralThread | null> {
  if (isSupabaseConfigured && supabase) {
    // TODO (Phase 6): fetch with messages + profiles join, then adaptThreadFromDb().
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("id", referralId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    // Lightweight fallback: build a minimal thread from the request row alone.
    // Full thread hydration (with messages) requires the join query in Phase 6.
    const req = adaptReferralRequestFromDb(data as DbReferralRequest);
    return (
      threads.find((t) => t.id === referralId) ??
      ({
        id: req.id,
        person: { name: "Unknown", initials: "?", avatarColor: "bg-primary" },
        roleCompany: `${req.role} @ ${req.company}`,
        requestType: req.type,
        targetRole: req.role,
        targetCompany: req.company,
        status: (req.status.charAt(0).toUpperCase() + req.status.slice(1)) as ThreadStatus,
        lastPreview: req.message,
        lastUpdated: req.updatedAt,
        unread: false,
        direction: req.direction,
        readiness: 0,
        inboxContext: `${req.type} · ${req.company}`,
        messages: [],
        hostMeta: { title: "", capacity: "", responseTime: "" },
        files: [],
        nextSteps: [],
      } satisfies ReferralThread)
    );
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
      .update({ status: status.toLowerCase(), updated_at: new Date().toISOString() })
      .eq("id", referralId);
  }
  return { data: { referralId, status }, error: null };
}

export async function getIncomingReferralRequests(hostId: string): Promise<MockReferralRequest[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("host_id", hostId);
    if (error) throw error;
    return adaptReferralRequestsFromDb((data ?? []) as DbReferralRequest[]);
  }
  return referralRequests.filter((r) => r.hostId === hostId || r.direction === "incoming");
}

export async function getOutgoingReferralRequests(userId: string): Promise<MockReferralRequest[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select("*")
      .eq("requester_id", userId);
    if (error) throw error;
    return adaptReferralRequestsFromDb((data ?? []) as DbReferralRequest[]);
  }
  return referralRequests.filter((r) => r.candidateId === userId || r.direction === "outgoing");
}
