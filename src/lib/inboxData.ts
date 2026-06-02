// Local mock data for referral threads, messages, notifications.
// All data is static; no backend.

export type ThreadStatus = "Pending" | "Accepted" | "Waitlisted" | "Declined" | "Completed";

export interface ThreadMessage {
  id: string;
  sender: "me" | "them";
  senderName: string;
  initials: string;
  avatarColor: string;
  time: string; // display string
  body: string;
}

export interface ReferralThread {
  id: string;
  person: { name: string; initials: string; avatarColor: string };
  roleCompany: string; // "Product Manager @ Google"
  requestType: string;
  targetRole: string;
  targetCompany: string;
  status: ThreadStatus;
  lastPreview: string;
  lastUpdated: string;
  unread: boolean;
  direction: "incoming" | "outgoing";
  readiness: number; // 0-100
  messages: ThreadMessage[];
  hostMeta: {
    title: string;
    capacity: string;
    responseTime: string;
  };
  files: { name: string; action: "View" | "Add" }[];
  nextSteps: { label: string; done: boolean }[];
  inboxContext: string; // shown in messages inbox
}

export const threads: ReferralThread[] = [
  {
    id: "t1",
    person: { name: "Maya Nasrallah", initials: "MN", avatarColor: "bg-clay" },
    roleCompany: "Senior PM @ AWS",
    requestType: "Referral + PM prep",
    targetRole: "Product Manager",
    targetCompany: "AWS",
    status: "Pending",
    lastPreview: "Send me the job link and your resume. I want to see how your growth background maps before I refer.",
    lastUpdated: "8m ago",
    unread: true,
    direction: "outgoing",
    readiness: 72,
    inboxContext: "Referral request · Breaking into Product at Big Tech",
    nextSteps: [
      { label: "Send updated resume", done: false },
      { label: "Add target job link", done: false },
      { label: "Schedule 20-minute prep call", done: false },
      { label: "Confirm referral decision", done: false },
    ],
    files: [
      { name: "Resume_Adam_2026.pdf", action: "View" },
      { name: "Target role link", action: "Add" },
    ],
    hostMeta: {
      title: "Senior PM @ AWS",
      capacity: "Open to 3 referrals/month",
      responseTime: "Usually within 24h",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AS",
        avatarColor: "bg-clay",
        time: "Monday, 6:42 PM",
        body: "Hi Maya — I really valued your room on breaking into big tech PM. I'm targeting Product Manager roles and would love a coffee chat or referral guidance if you see alignment.",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Maya Nasrallah",
        initials: "MN",
        avatarColor: "bg-clay",
        time: "Monday, 7:10 PM",
        body: "Thanks for joining. Happy to help, but I want to understand the role you're targeting and how your growth background maps before I refer.",
      },
      {
        id: "m3",
        sender: "me",
        senderName: "You",
        initials: "AS",
        avatarColor: "bg-clay",
        time: "Monday, 7:18 PM",
        body: "Makes sense. The role is PM on the AWS growth team. I have two years leading cross-functional growth campaigns with strong SQL and analytics work that I think translates.",
      },
      {
        id: "m4",
        sender: "them",
        senderName: "Maya Nasrallah",
        initials: "MN",
        avatarColor: "bg-clay",
        time: "Today, 9:04 AM",
        body: "That sounds promising. Send me the job link and your resume. I'll review first, then decide whether a referral makes sense.",
      },
    ],
  },
  {
    id: "t2",
    person: { name: "Priya Shah", initials: "PS", avatarColor: "bg-olive" },
    roleCompany: "Recruiter @ Stripe",
    requestType: "Resume feedback",
    targetRole: "Product Manager",
    targetCompany: "Stripe",
    status: "Accepted",
    lastPreview: "Your positioning is clear. I'd tighten the second bullet — one sentence, with the impact number.",
    lastUpdated: "1h ago",
    unread: true,
    direction: "outgoing",
    readiness: 84,
    inboxContext: "Resume feedback · Referrals, honestly: what works",
    nextSteps: [
      { label: "Apply Priya's edits", done: false },
      { label: "Resend resume v2", done: false },
    ],
    files: [{ name: "Resume_Adam_2026.pdf", action: "View" }],
    hostMeta: {
      title: "Recruiter @ Stripe",
      capacity: "Open to 2 reviews/month",
      responseTime: "Usually within 48h",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AS",
        avatarColor: "bg-clay",
        time: "Sunday, 5:00 PM",
        body: "Hi Priya — would you be open to giving feedback on my PM resume? Targeting roles at Stripe and similar fintech companies.",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Priya Shah",
        initials: "PS",
        avatarColor: "bg-olive",
        time: "Today, 10:11 AM",
        body: "Your positioning is clear. I'd tighten the second bullet — one sentence, with the impact number. Recruiters spend 8 seconds on a resume.",
      },
    ],
  },
  {
    id: "t3",
    person: { name: "Rashid Khoury", initials: "RK", avatarColor: "bg-olive" },
    roleCompany: "Engineering Manager @ Amazon",
    requestType: "Coffee chat",
    targetRole: "Technical Program Manager",
    targetCompany: "Amazon",
    status: "Waitlisted",
    lastPreview: "My schedule is full this month, but I added you to the list for June.",
    lastUpdated: "Yesterday",
    unread: false,
    direction: "outgoing",
    readiness: 50,
    inboxContext: "Room follow-up · Product, Data & Software Career Room",
    nextSteps: [{ label: "Wait for Rashid's June availability", done: false }],
    files: [],
    hostMeta: {
      title: "Engineering Manager @ Amazon",
      capacity: "2 coffee chats/month",
      responseTime: "Usually within a week",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AS",
        avatarColor: "bg-clay",
        time: "Sat, 3:00 PM",
        body: "Hi Rashid — really appreciated your perspective in the room. Would love to grab a coffee chat when you have capacity.",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Rashid Khoury",
        initials: "RK",
        avatarColor: "bg-olive",
        time: "Yesterday",
        body: "My schedule is full this month, but I added you to the list for June. I'll reach out when a slot opens.",
      },
    ],
  },
  {
    id: "t4",
    person: { name: "Hana Yusuf", initials: "HY", avatarColor: "bg-clay" },
    roleCompany: "Group PM @ Shopify",
    requestType: "Referral",
    targetRole: "Senior PM",
    targetCompany: "Shopify",
    status: "Completed",
    lastPreview: "Referral submitted. Good luck — you made a strong case.",
    lastUpdated: "2d ago",
    unread: false,
    direction: "outgoing",
    readiness: 100,
    inboxContext: "Referral · Shopify PM track",
    nextSteps: [{ label: "Follow up after recruiter screen", done: true }],
    files: [{ name: "Resume_Adam_2026.pdf", action: "View" }],
    hostMeta: {
      title: "Group PM @ Shopify",
      capacity: "Open to 2 referrals/month",
      responseTime: "Usually within 24h",
    },
    messages: [
      {
        id: "m1",
        sender: "them",
        senderName: "Hana Yusuf",
        initials: "HY",
        avatarColor: "bg-clay",
        time: "2 days ago",
        body: "Referral submitted. Good luck — you made a strong case. Let me know how the recruiter screen goes.",
      },
    ],
  },
];

export const getThread = (id: string) => threads.find((t) => t.id === id);

// Notifications
export type NotificationType =
  | "Referral accepted"
  | "New message"
  | "Room reminder"
  | "Referral update"
  | "Host joined";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  group: "Today" | "Earlier";
}

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "Referral accepted",
    title: "Maya accepted your referral request",
    body: "She wants to review your resume first — send the job link and she'll decide.",
    time: "8m ago",
    unread: true,
    group: "Today",
  },
  {
    id: "n2",
    type: "New message",
    title: "Priya replied in your referral thread",
    body: "Your positioning is clear — tighten the second bullet with a number.",
    time: "24m ago",
    unread: true,
    group: "Today",
  },
  {
    id: "n3",
    type: "Room reminder",
    title: "Breaking into Product at Big Tech starts in 1 hour",
    body: "You are registered as a listener. Bring one specific question.",
    time: "1h ago",
    unread: false,
    group: "Today",
  },
  {
    id: "n4",
    type: "Referral update",
    title: "Your AWS referral request moved to pending review",
    body: "Maya asked for your target job link and updated resume.",
    time: "Yesterday",
    unread: false,
    group: "Earlier",
  },
  {
    id: "n5",
    type: "Host joined",
    title: "Hana Yusuf joined a room you follow",
    body: "Group PM at Shopify — open to warm intros for PM candidates in Toronto.",
    time: "2d ago",
    unread: false,
    group: "Earlier",
  },
];

// Counts (for sidebar badges)
export const counts = {
  referralsPending: threads.filter((t) => t.status === "Pending" || t.unread).length, // 4 in spec
  messagesUnread: threads.filter((t) => t.unread).length, // 2
  notificationsUnread: notifications.filter((n) => n.unread).length, // 3
};
