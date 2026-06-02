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
  { id: "u1", name: "Adam Saleh", role: "Aspiring PM · ex-Growth", company: "Lumen", location: "Toronto, CA", bio: "Two years in growth marketing, now building toward product. I care about fintech that's actually fair, and teams that ship with taste.", avatarColor: "bg-clay", initials: "AS", pronouns: "he/him" },
  { id: "u2", name: "Maya Nasrallah", role: "Senior PM", company: "AWS", location: "Toronto, CA", bio: "I broke into product the long way, with no referral and no network — and I spend my weeks making sure the next person doesn't have to.", avatarColor: "bg-clay", initials: "MN", verified: true },
  { id: "u3", name: "Rashid Khoury", role: "Engineering Manager", company: "Amazon", location: "Toronto, CA", bio: "Co-host and connector. Refers across MENA and beyond.", avatarColor: "bg-olive", initials: "RK", verified: true },
  { id: "u4", name: "Priya Shah", role: "Recruiter", company: "Stripe", location: "Toronto, CA", bio: "Hosts 'Referrals, honestly' — what actually moves the needle in ATS and what doesn't.", avatarColor: "bg-olive", initials: "PS", verified: true },
  { id: "u5", name: "Hana Yusuf", role: "Group PM", company: "Shopify", location: "Toronto, CA", bio: "Toronto hiring manager. Open to warm intros for the right candidates.", avatarColor: "bg-clay", initials: "HY", verified: true },
  { id: "u6", name: "Layla Park", role: "Product Designer", company: "Figma", location: "Toronto, CA", bio: "Hosts design career rooms and facilitates recruiter intros for design candidates.", avatarColor: "bg-sand", initials: "LP", verified: true },
];

export const rooms: Room[] = [
  { id: "r1", title: "Breaking into Product at Big Tech", company: "AWS", category: "Product", status: "live", access: "open", startsAt: new Date().toISOString(), durationMin: 60, hostId: "u2", description: "Maya Nasrallah walks through what it actually takes to break into PM roles at big tech — from the inside.", coverColor: "bg-gradient-clay", attendees: 42, speakers: 4, tags: ["Product", "Big Tech", "PM", "Career"] },
  { id: "r2", title: "Cracking the PM case interview", company: "AWS", category: "Product", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 2 * 86400000).toISOString(), durationMin: 60, hostId: "u2", description: "Recurring every 2nd Thursday. Maya runs through PM case structures, common traps, and what interviewers actually want to hear.", coverColor: "bg-primary", attendees: 42, speakers: 3, tags: ["PM", "Interviews", "Case prep"] },
  { id: "r3", title: "Design portfolios that get callbacks", company: "Figma", category: "Design", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 3 * 86400000).toISOString(), durationMin: 60, hostId: "u6", description: "Layla Park on what hiring managers at Figma and top design orgs actually look for in a portfolio.", coverColor: "bg-olive", attendees: 28, speakers: 3, tags: ["Design", "Portfolio", "Figma"] },
  { id: "r4", title: "Product, Data & Software Career Room", company: "Multiple", category: "Tech", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 4 * 86400000).toISOString(), durationMin: 60, hostId: "u3", description: "PMs, data scientists, and engineers from top product companies host an open Q&A.", coverColor: "bg-clay", attendees: 38, speakers: 5, tags: ["Tech", "Product", "Data"] },
  { id: "r5", title: "Referrals, honestly: what works", company: "Stripe", category: "Operations", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 5 * 86400000).toISOString(), durationMin: 60, hostId: "u4", description: "Priya Shah cuts through the noise — what referrals actually do in ATS, how to ask without being transactional, and what kills a good intro.", coverColor: "bg-accent", attendees: 53, speakers: 4, tags: ["Referrals", "Recruiting", "Stripe"] },
  { id: "r6", title: "Growth → Product, figuring it out together", company: "Lumen", category: "Product", status: "upcoming", access: "open", startsAt: new Date(Date.now() + 7 * 86400000).toISOString(), durationMin: 60, hostId: "u1", description: "Adam hosts an open room for people making the marketing-to-product transition. Share your story, ask the hard questions.", coverColor: "bg-gradient-clay", attendees: 0, speakers: 1, tags: ["Growth", "Product", "Career change"] },
];

export const referralRequests: ReferralRequest[] = [
  { id: "rr1", candidateId: "u1", hostId: "u2", company: "AWS", role: "Product Manager", type: "referral", direction: "outgoing", status: "submitted", message: "We connected in the 'Breaking into Product at Big Tech' room. I'd love a warm intro to the APM program — happy to share my background.", createdAt: new Date(Date.now() - 3600_000).toISOString(), updatedAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: "rr2", candidateId: "u1", hostId: "u6", company: "Figma", role: "Associate PM", type: "coffee chat", direction: "outgoing", status: "accepted", message: "Loved your design room. I'm targeting the APM track at Figma — would you be open to a 20-min chat?", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "rr3", candidateId: "u1", hostId: "u5", company: "Shopify", role: "Group PM", type: "coffee chat", direction: "outgoing", status: "pending", message: "Hi Hana — I came across your profile via the Shopify room. Would love 20 minutes to learn about the team and share my background.", createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "rr4", candidateId: "u1", hostId: "u4", company: "Stripe", role: "Product Manager", type: "resume feedback", direction: "outgoing", status: "declined", message: "Thanks for considering — keeping in touch for future openings.", createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "rr5", candidateId: "u6", hostId: "u1", company: "Lumen", role: "Product Designer", type: "coffee chat", direction: "incoming", status: "pending", message: "Saw your room on growth → product. Would love your take on how design fits into product transitions.", createdAt: new Date(Date.now() - 5 * 3600_000).toISOString(), updatedAt: new Date(Date.now() - 5 * 3600_000).toISOString() },
  { id: "rr6", candidateId: "u4", hostId: "u1", company: "Stripe", role: "Recruiter", type: "interview prep", direction: "incoming", status: "accepted", message: "Priya here — happy to do a mock PM screen with you before your Stripe loop.", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "rr7", candidateId: "u1", hostId: "u2", company: "AWS", role: "Product Manager", type: "referral", direction: "outgoing", status: "completed", message: "Maya submitted my referral and I just got the recruiter screen scheduled 🎉", createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const recruiterCandidates: RecruiterCandidate[] = [
  { id: "rc1", userId: "u1", matchScore: 92, signalRoom: "Breaking into Product at Big Tech", status: "shortlisted" },
  { id: "rc2", userId: "u6", matchScore: 88, signalRoom: "Design portfolios that get callbacks", status: "new" },
  { id: "rc3", userId: "u3", matchScore: 84, signalRoom: "Product, Data & Software Career Room", status: "reviewed" },
];

export const getUser = (id: string) => users.find((u) => u.id === id);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
