/**
 * Converts DB-shaped recruiter_candidates + profile rows into the
 * PipelineCandidate UI shape used by RecruiterDashboard.
 */

export type CandidateStatus = "Referred" | "Applied" | "Shortlisted" | "Interviewed" | "Archived";

export interface PipelineCandidate {
  id: string;
  userId: string;
  candidateName: string;
  candidateInitials: string;
  candidateAvatarColor: string;
  targetRole: string;
  skills: string[];
  referralSource: string;
  fitScore: number;
  status: CandidateStatus;
}

export interface DbRecruiterCandidate {
  id: string;
  recruiter_id: string;
  candidate_id: string;
  referral_request_id: string | null;
  status: string;
  fit_score: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined candidate profile
  candidate?: {
    id: string;
    full_name: string;
    headline: string | null;
    skills: string[] | null;
    avatar_url: string | null;
  } | null;
  // Joined referral request
  referral_request?: {
    target_role: string | null;
    target_company: string | null;
    request_type: string | null;
  } | null;
}

const AVATAR_COLORS = ["bg-primary", "bg-clay", "bg-olive", "bg-accent"];

function avatarColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function mapStatus(raw: string): CandidateStatus {
  const map: Record<string, CandidateStatus> = {
    referred: "Referred",
    applied: "Applied",
    shortlisted: "Shortlisted",
    interviewed: "Interviewed",
    archived: "Archived",
  };
  return map[raw.toLowerCase()] ?? "Referred";
}

export function adaptCandidateFromDb(row: DbRecruiterCandidate): PipelineCandidate {
  const name = row.candidate?.full_name ?? "Unknown candidate";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const fitScoreRaw = row.fit_score ? parseInt(row.fit_score, 10) : 0;

  return {
    id: row.id,
    userId: row.candidate_id,
    candidateName: name,
    candidateInitials: initials,
    candidateAvatarColor: avatarColor(row.candidate_id),
    targetRole: row.referral_request?.target_role ?? row.candidate?.headline ?? "Role TBD",
    skills: row.candidate?.skills ?? [],
    referralSource: row.referral_request?.target_company
      ? `${row.referral_request.target_company} referral`
      : "Hayy room",
    fitScore: isNaN(fitScoreRaw) ? 0 : fitScoreRaw,
    status: mapStatus(row.status),
  };
}

export function adaptCandidatesFromDb(rows: DbRecruiterCandidate[]): PipelineCandidate[] {
  return rows.map(adaptCandidateFromDb);
}
