/**
 * Recruiter candidates API.
 *
 * Manages the recruiter_candidates table — the pipeline of candidates a
 * recruiter is tracking from Hayy rooms.
 *
 * Mock mode: returns mock pipeline data.
 * Supabase mode: reads/writes recruiter_candidates with profile + referral joins.
 */
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import {
  adaptCandidatesFromDb,
  adaptCandidateFromDb,
  type DbRecruiterCandidate,
  type PipelineCandidate,
  type CandidateStatus,
} from "@/lib/adapters/recruiterCandidatesAdapter";
import { users, getUser } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Mock pipeline — used when Supabase is not configured
// ---------------------------------------------------------------------------

const mockPipeline: PipelineCandidate[] = [
  {
    id: "pc1", userId: "u1",
    candidateName: "Amira Khan", candidateInitials: "AK", candidateAvatarColor: "bg-clay",
    targetRole: "Product Marketing Manager", skills: ["PMM", "B2C", "Analytics"],
    referralSource: "Yusuf Rahman · Amazon", fitScore: 92, status: "Shortlisted",
  },
  {
    id: "pc2", userId: "u5",
    candidateName: "Sara Nguyen", candidateInitials: "SN", candidateAvatarColor: "bg-clay",
    targetRole: "Product Designer", skills: ["UX", "Figma", "Research"],
    referralSource: "Sara — Design room", fitScore: 88, status: "Referred",
  },
  {
    id: "pc3", userId: "u3",
    candidateName: "Lina Haddad", candidateInitials: "LH", candidateAvatarColor: "bg-olive",
    targetRole: "Senior Software Engineer", skills: ["Backend", "TypeScript", "Distributed"],
    referralSource: "Lina Haddad · Shopify", fitScore: 84, status: "Interviewed",
  },
  {
    id: "pc4", userId: "u6",
    candidateName: "Omar Saleh", candidateInitials: "OS", candidateAvatarColor: "bg-primary",
    targetRole: "Operations Lead", skills: ["Operations", "Lean", "Logistics"],
    referralSource: "Ops referral night", fitScore: 79, status: "Applied",
  },
  {
    id: "pc5", userId: "u4",
    candidateName: "Daniel Okonkwo", candidateInitials: "DO", candidateAvatarColor: "bg-accent",
    targetRole: "Talent Partner", skills: ["Recruiting", "Sourcing"],
    referralSource: "Recruiter exchange", fitScore: 71, status: "Archived",
  },
];

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getRecruiterCandidates(
  recruiterId: string,
): Promise<PipelineCandidate[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("recruiter_candidates")
      .select(`
        *,
        candidate:user_profiles!recruiter_candidates_candidate_id_fkey ( id, full_name, headline, skills, avatar_url ),
        referral_request:referral_requests!recruiter_candidates_referral_request_id_fkey ( target_role, target_company, request_type )
      `)
      .eq("recruiter_id", recruiterId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return adaptCandidatesFromDb((data ?? []) as DbRecruiterCandidate[]);
  }
  return mockPipeline;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export interface AddCandidateInput {
  recruiter_id: string;
  candidate_id: string;
  referral_request_id?: string | null;
  status?: string;
  fit_score?: string | null;
  notes?: string | null;
}

export async function addRecruiterCandidate(
  input: AddCandidateInput,
): Promise<PipelineCandidate> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("recruiter_candidates")
      .insert(input)
      .select(`
        *,
        candidate:user_profiles!recruiter_candidates_candidate_id_fkey ( id, full_name, headline, skills, avatar_url ),
        referral_request:referral_requests!recruiter_candidates_referral_request_id_fkey ( target_role, target_company, request_type )
      `)
      .single();
    if (error) throw error;
    return adaptCandidateFromDb(data as DbRecruiterCandidate);
  }
  // Mock: return a minimal candidate
  const u = getUser(input.candidate_id) ?? users[0];
  return {
    id: `mock-${Date.now()}`,
    userId: input.candidate_id,
    candidateName: u.name,
    candidateInitials: u.initials,
    candidateAvatarColor: u.avatarColor,
    targetRole: "Role TBD",
    skills: [],
    referralSource: "Hayy room",
    fitScore: 0,
    status: "Referred",
  };
}

export async function updateRecruiterCandidateStatus(
  candidateId: string,
  status: CandidateStatus,
) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("recruiter_candidates")
      .update({ status: status.toLowerCase() })
      .eq("id", candidateId);
    if (error) throw error;
  }
  return { data: { candidateId, status }, error: null };
}

export async function archiveRecruiterCandidate(candidateId: string) {
  return updateRecruiterCandidateStatus(candidateId, "Archived");
}

// Re-export types so consumers don't need to import from adapter directly
export type { PipelineCandidate, CandidateStatus };
