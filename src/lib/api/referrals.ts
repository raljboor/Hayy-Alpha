/**
 * Referrals API.
 *
 * Mock mode: returns fixtures from src/data/mockData.ts.
 * Supabase mode: fetches rows and adapts them to UI shapes.
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
  adaptThreadFromDb,
  type DbReferralRequest,
  type DbReferralThread,
} from "@/lib/adapters/referralsAdapter";

// ---------------------------------------------------------------------------
// getReferralRequests
// ---------------------------------------------------------------------------

export async function getReferralRequests(userId?: string): Promise<MockReferralRequest[]> {
  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("referral_requests").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.or(`requester_id.eq.${userId},host_id.eq.${userId}`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return adaptReferralRequestsFromDb((data ?? []) as DbReferralRequest[]);
  }
  return referralRequests;
}

// ---------------------------------------------------------------------------
// getReferralThreads — the key Phase 6 implementation
// ---------------------------------------------------------------------------

export async function getReferralThreads(userId?: string): Promise<ReferralThread[]> {
  if (isSupabaseConfigured && supabase) {
    const uid = userId;
    if (!uid) return threads; // no auth yet — return mock

    const { data, error } = await supabase
      .from("referral_requests")
      .select(`
        *,
        referral_messages ( id, sender_id, body, attachment_url, read_at, created_at ),
        requester:user_profiles!referral_requests_requester_id_fkey ( id, full_name, avatar_url, headline ),
        host:user_profiles!referral_requests_host_id_fkey ( id, full_name, avatar_url, headline )
      `)
      .or(`requester_id.eq.${uid},host_id.eq.${uid}`)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((row) => {
      // Sort messages chronologically
      const msgs = ((row.referral_messages as unknown[]) ?? []).sort(
        (a, b) =>
          new Date((a as { created_at: string }).created_at).getTime() -
          new Date((b as { created_at: string }).created_at).getTime(),
      );

      const dbThread: DbReferralThread = {
        referral: row as unknown as DbReferralRequest,
        messages: msgs as DbReferralThread["messages"],
        requester: row.requester as DbReferralThread["requester"],
        host: row.host as DbReferralThread["host"],
        currentUserId: uid,
      };
      return adaptThreadFromDb(dbThread);
    });
  }

  // Mock fallback
  return threads;
}

// ---------------------------------------------------------------------------
// getReferralRequestById
// ---------------------------------------------------------------------------

export async function getReferralRequestById(
  referralId: string,
  userId?: string,
): Promise<ReferralThread | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("referral_requests")
      .select(`
        *,
        referral_messages ( id, sender_id, body, attachment_url, read_at, created_at ),
        requester:user_profiles!referral_requests_requester_id_fkey ( id, full_name, avatar_url, headline ),
        host:user_profiles!referral_requests_host_id_fkey ( id, full_name, avatar_url, headline )
      `)
      .eq("id", referralId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const msgs = ((data.referral_messages as unknown[]) ?? []).sort(
      (a, b) =>
        new Date((a as { created_at: string }).created_at).getTime() -
        new Date((b as { created_at: string }).created_at).getTime(),
    );

    const dbThread: DbReferralThread = {
      referral: data as unknown as DbReferralRequest,
      messages: msgs as DbReferralThread["messages"],
      requester: data.requester as DbReferralThread["requester"],
      host: data.host as DbReferralThread["host"],
      currentUserId: userId ?? "",
    };
    return adaptThreadFromDb(dbThread);
  }

  return threads.find((t) => t.id === referralId) ?? null;
}

// ---------------------------------------------------------------------------
// createReferralRequest
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// updateReferralStatus — notifies requester when host changes status
// ---------------------------------------------------------------------------

export async function updateReferralStatus(referralId: string, status: ThreadStatus) {
  if (isSupabaseConfigured && supabase) {
    const dbStatus = status.toLowerCase();

    // Update the row
    const { error: updateError } = await supabase
      .from("referral_requests")
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq("id", referralId);

    if (updateError) throw updateError;

    // Fetch the referral so we can notify the requester
    const { data: req } = await supabase
      .from("referral_requests")
      .select("requester_id, host_id")
      .eq("id", referralId)
      .maybeSingle();

    if (req?.requester_id) {
      const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      await supabase.from("notifications").insert({
        user_id: req.requester_id,
        type: "Referral update",
        title: "Referral request updated",
        body: `Your referral request was marked as ${statusLabel}.`,
        related_entity_type: "referral_request",
        related_entity_id: referralId,
      });
    }

    return { data: { referralId, status }, error: null };
  }

  return { data: { referralId, status }, error: null };
}

// ---------------------------------------------------------------------------
// getIncomingReferralRequests / getOutgoingReferralRequests
// ---------------------------------------------------------------------------

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
