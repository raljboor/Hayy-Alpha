// Mock data for Hayy frontend prototype

export type RoomCategory =
  | "Founding"
  | "Operations"
  | "Tech"
  | "Engineering"
  | "Newcomers"
  | "Product"
  | "Design"
  | "Finance"
  | "Consulting"
  | "Canada"
  | "MENA community";
export type RoomStatus = "live" | "upcoming" | "ended";
export type RoomAccess = "open" | "waitlist" | "invite-only";

export interface Room {
  id: string;
  title: string;
  company: string;
  category: RoomCategory;
  status: RoomStatus;
  access: RoomAccess;
  startsAt: string; // ISO
  durationMin: number;
  hostId: string;
  description: string;
  coverColor: string; // tailwind bg
  attendees: number;
  speakers: number;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  company?: string;
  location: string;
  bio: string;
  avatarColor: string;
  initials: string;
  verified?: boolean;
  pronouns?: string;
}

export type ReferralStatus = "pending" | "accepted" | "declined" | "submitted" | "completed";
export type ReferralType = "coffee chat" | "referral" | "resume feedback" | "interview prep" | "company insight";

export interface ReferralRequest {
  id: string;
  candidateId: string;
  hostId: string;
  company: string;
  role: string;
  type: ReferralType;
  direction: "incoming" | "outgoing";
  status: ReferralStatus;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecruiterCandidate {
  id: string;
  userId: string;
  matchScore: number;
  signalRoom: string;
  status: "new" | "reviewed" | "shortlisted" | "passed";
}

export const users: User[] = [
  { id: "u1", name: "Amira Khan", role: "Product Marketing", location: "Toronto, CA", bio: "Newcomer to Canada, ex-Careem. Building my first PM role here.", avatarColor: "bg-clay", initials: "AK", pronouns: "she/her" },
  { id: "u2", name: "Yusuf Rahman", role: "Senior PM", company: "Amazon", location: "Vancouver, CA", bio: "I host warm referral chats for Operations + PM roles.", avatarColor: "bg-primary", initials: "YR", verified: true },
  { id: "u3", name: "Lina Haddad", role: "Software Engineer", company: "Shopify", location: "Remote", bio: "Backend eng. Happy to refer thoughtful applicants.", avatarColor: "bg-olive", initials: "LH", verified: true },
  { id: "u4", name: "Daniel Okonkwo", role: "Talent Partner", company: "Notion", location: "NYC", bio: "Recruiter — I scout from live rooms.", avatarColor: "bg-accent", initials: "DO", verified: true },
  { id: "u5", name: "Sara Nguyen", role: "UX Designer", location: "Berlin, DE", bio: "International grad looking for warm intros into design teams.", avatarColor: "bg-clay", initials: "SN" },
  { id: "u6", name: "Omar Saleh", role: "Operations Lead", company: "Uber", location: "London, UK", bio: "Host of the Operations career room.", avatarColor: "bg-primary", initials: "OS", verified: true },
];

export const rooms: Room[] = [
  { id: "r1", title: "How to Get Referred Into Corporate Roles in Canada", company: "Multiple", category: "Canada", status: "live", access: "open", startsAt: new Date().toISOString(), durationMin: 60, hostId: "u2", description: "Insiders walk through how warm referrals actually move through ATS systems at Canadian corporates.", coverColor: "bg-gradient-clay", attendees: 184, speakers: 4, tags: ["Canada", "Referrals", "Corporate"] },
  { id: "r2", title: "Breaking Into Amazon, Logistics & Program Management", company: "Amazon", category: "Operations", status: "upcoming", access: "waitlist", startsAt: new Date(Date.now() + 86400000).toISOString(), durationMin: 60, hostId: "u2", description: "Senior PMs and Ops leaders share the real path into Amazon — interviews, loops, and warm intros.", coverColor: "bg-primary", attendees: 142, speakers: 5, tags: ["Operations", "Amazon", "PM"] },
  { id: "r3", title: "Career Access for International Professionals", company: "Multiple", category: "Newcomers", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 2 * 86400000).toISOString(), durationMin: 75, hostId: "u3", description: "For newcomers and international grads — how to get noticed without local experience.", coverColor: "bg-olive", attendees: 96, speakers: 5, tags: ["Newcomers", "Immigration"] },
  { id: "r4", title: "Product, Data & Software Career Room", company: "Multiple", category: "Tech", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 3 * 86400000).toISOString(), durationMin: 60, hostId: "u3", description: "PMs, data scientists, and engineers from top product companies host an open Q&A.", coverColor: "bg-clay", attendees: 73, speakers: 6, tags: ["Tech", "Product", "Data"] },
  { id: "r5", title: "Finance & Banking Referral Night", company: "Multiple", category: "Finance", status: "upcoming", access: "invite-only", startsAt: new Date(Date.now() + 4 * 86400000).toISOString(), durationMin: 60, hostId: "u6", description: "An intimate room for IB, corporate banking, and finance professionals to swap referrals.", coverColor: "bg-accent", attendees: 41, speakers: 4, tags: ["Finance", "Banking", "Referrals"] },
  { id: "r6", title: "Consulting Coffee Chat Room", company: "Multiple", category: "Consulting", status: "upcoming", access: "waitlist", startsAt: new Date(Date.now() + 5 * 86400000).toISOString(), durationMin: 50, hostId: "u5", description: "Casual coffee chats with consultants from MBB and Big 4. Bring your questions.", coverColor: "bg-gradient-clay", attendees: 58, speakers: 3, tags: ["Consulting", "MBB"] },
];

export const referralRequests: ReferralRequest[] = [
  { id: "rr1", candidateId: "u1", hostId: "u2", company: "Amazon", role: "Product Marketing Manager", type: "referral", direction: "outgoing", status: "pending", message: "We connected in the Amazon Canada room. Would love a warm intro to the PMM team.", createdAt: new Date(Date.now() - 3600_000).toISOString(), updatedAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "rr2", candidateId: "u1", hostId: "u3", company: "Shopify", role: "Product Marketing Manager", type: "coffee chat", direction: "outgoing", status: "accepted", message: "Loved the Engineering open house — would love 20 min to learn about the merchant team.", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "rr3", candidateId: "u1", hostId: "u6", company: "Uber", role: "Operations Associate", type: "referral", direction: "outgoing", status: "submitted", message: "Following up from our chat — referral submitted to ATS.", createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "rr4", candidateId: "u1", hostId: "u2", company: "Amazon", role: "UX Researcher", type: "resume feedback", direction: "outgoing", status: "declined", message: "Thanks for considering — keeping in touch for future roles.", createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "rr5", candidateId: "u5", hostId: "u1", company: "Notion", role: "Product Designer", type: "coffee chat", direction: "incoming", status: "pending", message: "Saw your profile in the Design room — would love your perspective on PMM × design partnerships.", createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(), updatedAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
  { id: "rr6", candidateId: "u4", hostId: "u1", company: "Stripe", role: "Talent Partner", type: "interview prep", direction: "incoming", status: "accepted", message: "Recruiter here — happy to mock-interview you for PMM loops.", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "rr7", candidateId: "u1", hostId: "u3", company: "Shopify", role: "Senior PMM", type: "referral", direction: "outgoing", status: "completed", message: "Lina submitted my referral and I just got a recruiter screen 🎉", createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const recruiterCandidates: RecruiterCandidate[] = [
  { id: "rc1", userId: "u1", matchScore: 92, signalRoom: "Amazon Canada Career Room", status: "shortlisted" },
  { id: "rc2", userId: "u5", matchScore: 88, signalRoom: "Design Portfolios that Get Replies", status: "new" },
  { id: "rc3", userId: "u3", matchScore: 84, signalRoom: "Shopify Engineering Open House", status: "reviewed" },
];

export const getUser = (id: string) => users.find((u) => u.id === id);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
