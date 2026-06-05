export type Tone = 'clay' | 'olive' | 'sand' | 'dark';

export const ME = {
  name: 'Adam Saleh',
  headline: 'Aspiring PM · ex-Growth',
  location: 'Toronto, Canada',
  avatarTone: 'clay' as Tone,
  bio: "Two years in growth marketing, now building toward product. I care about fintech that's actually fair, and teams that ship with taste.",
  lookingFor: ['APM roles', 'Product internships', 'Fintech & AI', 'Mentorship'],
  stats: { rooms: 18, intros: 6, referrals: 3, followers: 214 },
};

export const MAYA = {
  name: 'Maya Nasrallah',
  headline: 'Senior Product Manager · AWS',
  avatarTone: 'clay' as Tone,
  bio: "I broke into product the long way — and I spend my weeks making sure the next person doesn't have to.",
  stats: { followers: '1.2k', intros: 61, roomsHosted: 12 },
};

export interface Room {
  id: string;
  title: string;
  host: string;
  hostRole: string;
  hostTone: Tone;
  time: string;
  attendees: number;
  live: boolean;
  justStarted?: boolean;
}

export const ROOMS: Room[] = [
  { id: 'r04', title: 'Breaking into Product at Big Tech',        host: 'Maya Nasrallah', hostRole: 'AWS',    hostTone: 'clay',  time: 'Tonight 7:00 PM', attendees: 42, live: false },
  { id: 'r01', title: 'Portfolio teardowns, live',               host: 'Layla Park',     hostRole: 'Figma',  hostTone: 'sand',  time: 'Live', attendees: 31, live: true, justStarted: true },
  { id: 'r02', title: 'Cracking the PM case interview',          host: 'Maya Nasrallah', hostRole: 'AWS',    hostTone: 'clay',  time: 'Live', attendees: 42, live: true },
  { id: 'r03', title: 'Bootcamp → backend',                      host: 'Omar Aziz',      hostRole: 'RBC',    hostTone: 'olive', time: 'Live', attendees: 17, live: true },
  { id: 'r05', title: 'Design portfolios that get callbacks',    host: 'Layla Park',     hostRole: 'Figma',  hostTone: 'sand',  time: '8:30 PM', attendees: 28, live: false },
  { id: 'r06', title: 'New grad → first eng role',               host: 'Rashid Khoury',  hostRole: 'Amazon', hostTone: 'dark',  time: 'Tomorrow', attendees: 61, live: false },
  { id: 'r07', title: 'Referrals, honestly: what works',         host: 'Priya Shah',     hostRole: 'Stripe', hostTone: 'olive', time: 'Tomorrow', attendees: 53, live: false },
];

export const LIVE_NOW   = ROOMS.filter(r => r.live);
export const UPCOMING   = ROOMS.filter(r => !r.live);
export const FEATURED   = ROOMS.find(r => r.id === 'r04')!;

export const PEOPLE = [
  { name: 'Rashid Khoury', role: 'Eng Mgr · Amazon',  tone: 'dark'  as Tone },
  { name: 'Layla Park',    role: 'Designer · Figma',   tone: 'sand'  as Tone },
  { name: 'Jenna Sun',     role: 'Talent · Shopify',   tone: 'olive' as Tone },
  { name: 'Hana Yusuf',   role: 'Group PM · Shopify', tone: 'clay'  as Tone },
];
