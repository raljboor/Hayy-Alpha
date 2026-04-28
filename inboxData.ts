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
    person: { name: "Khalid A.", initials: "KA", avatarColor: "bg-primary" },
    roleCompany: "Product Manager @ Google",
    requestType: "Coffee chat + referral review",
    targetRole: "Product Manager, Growth",
    targetCompany: "Google",
    status: "Pending",
    lastPreview: "Send me the job link and updated resume. I can review first.",
    lastUpdated: "8m ago",
    unread: true,
    direction: "outgoing",
    readiness: 72,
    inboxContext: "Referral request · Product Manager @ Google",
    nextSteps: [
      { label: "Send updated resume", done: false },
      { label: "Add target job link", done: false },
      { label: "Schedule 20-minute chat", done: false },
      { label: "Confirm referral decision", done: false },
    ],
    files: [
      { name: "Resume_Rakan.pdf", action: "View" },
      { name: "Target role link", action: "Add" },
    ],
    hostMeta: {
      title: "Product Manager @ Google",
      capacity: "Open to 2 referrals/month",
      responseTime: "Usually within 24h",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AK",
        avatarColor: "bg-clay",
        time: "Monday, 6:42 PM",
        body: "Hi Khalid — I enjoyed your room on product teams. I'm targeting Product Manager roles and would appreciate a short coffee chat or referral guidance if you think there's alignment.",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Khalid A.",
        initials: "KA",
        avatarColor: "bg-primary",
        time: "Monday, 7:10 PM",
        body: "Thanks for joining the room. Happy to help, but before I refer I'd want to understand the exact role and how your experience maps to it.",
      },
      {
        id: "m3",
        sender: "me",
        senderName: "You",
        initials: "AK",
        avatarColor: "bg-clay",
        time: "Monday, 7:18 PM",
        body: "That makes sense. The role is Product Manager, Growth. I have operations launch experience and analytics projects that connect to cross-functional execution.",
      },
      {
        id: "m4",
        sender: "them",
        senderName: "Khalid A.",
        initials: "KA",
        avatarColor: "bg-primary",
        time: "Today, 9:04 AM",
        body: "Good. Send the job link and your updated resume. I can review first, then decide whether a referral makes sense.",
      },
    ],
  },
  {
    id: "t2",
    person: { name: "Aisha K.", initials: "AK", avatarColor: "bg-olive" },
    roleCompany: "Director of Product @ Stripe",
    requestType: "Resume feedback",
    targetRole: "Product Marketing Manager",
    targetCompany: "Stripe",
    status: "Accepted",
    lastPreview: "Your intro is strong. I'd tighten the second bullet.",
    lastUpdated: "1h ago",
    unread: true,
    direction: "outgoing",
    readiness: 84,
    inboxContext: "Resume feedback · Product Leaders in Tech",
    nextSteps: [
      { label: "Apply Aisha's edits", done: false },
      { label: "Resend resume v2", done: false },
    ],
    files: [{ name: "Resume_v1.pdf", action: "View" }],
    hostMeta: {
      title: "Director of Product @ Stripe",
      capacity: "Open to 1 review/month",
      responseTime: "Usually within 48h",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AK",
        avatarColor: "bg-clay",
        time: "Sunday, 5:00 PM",
        body: "Hi Aisha — would you be open to giving feedback on my PMM resume?",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Aisha K.",
        initials: "AK",
        avatarColor: "bg-olive",
        time: "Today, 10:11 AM",
        body: "Your intro is strong. I'd tighten the second bullet — quantify the launch impact in one short sentence.",
      },
    ],
  },
  {
    id: "t3",
    person: { name: "Omar H.", initials: "OH", avatarColor: "bg-clay" },
    roleCompany: "Engineering Manager @ Meta",
    requestType: "Coffee chat",
    targetRole: "Engineering Program Manager",
    targetCompany: "Meta",
    status: "Waitlisted",
    lastPreview: "The room is full, but I added you to the waitlist.",
    lastUpdated: "Yesterday",
    unread: false,
    direction: "outgoing",
    readiness: 50,
    inboxContext: "Room follow-up · Engineering Managers Circle",
    nextSteps: [{ label: "Wait for waitlist response", done: false }],
    files: [],
    hostMeta: {
      title: "Engineering Manager @ Meta",
      capacity: "Capacity full this month",
      responseTime: "Usually within a week",
    },
    messages: [
      {
        id: "m1",
        sender: "me",
        senderName: "You",
        initials: "AK",
        avatarColor: "bg-clay",
        time: "Sat, 3:00 PM",
        body: "Hi Omar — would love to join your next coffee chat slot.",
      },
      {
        id: "m2",
        sender: "them",
        senderName: "Omar H.",
        initials: "OH",
        avatarColor: "bg-clay",
        time: "Yesterday",
        body: "The room is full, but I added you to the waitlist.",
      },
    ],
  },
  {
    id: "t4",
    person: { name: "Leila M.", initials: "LM", avatarColor: "bg-primary" },
    roleCompany: "Design Lead @ Airbnb",
    requestType: "Referral",
    targetRole: "Growth Designer",
    targetCompany: "Airbnb",
    status: "Completed",
    lastPreview: "Portfolio note: lead with the problem, not the artifact.",
    lastUpdated: "2d ago",
    unread: false,
    direction: "outgoing",
    readiness: 100,
    inboxContext: "Coffee chat · Design Leaders Collective",
    nextSteps: [{ label: "Update portfolio per feedback", done: true }],
    files: [{ name: "Portfolio_v3.pdf", action: "View" }],
    hostMeta: {
      title: "Design Lead @ Airbnb",
      capacity: "Open to 3 referrals/month",
      responseTime: "Usually within 24h",
    },
    messages: [
      {
        id: "m1",
        sender: "them",
        senderName: "Leila M.",
        initials: "LM",
        avatarColor: "bg-primary",
        time: "2 days ago",
        body: "Portfolio note: lead with the problem, not the artifact. Otherwise, you're good to be referred.",
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
    title: "Khalid accepted your coffee chat request",
    body: "He suggested Tuesday or Wednesday evening for a 20-minute intro call.",
    time: "8m ago",
    unread: true,
    group: "Today",
  },
  {
    id: "n2",
    type: "New message",
    title: "Maha replied in your referral thread",
    body: "Thanks for the context — I can review your resume before the room.",
    time: "24m ago",
    unread: true,
    group: "Today",
  },
  {
    id: "n3",
    type: "Room reminder",
    title: "Product Leaders in Tech starts in 1 hour",
    body: "You are registered as a listener. Bring one specific question.",
    time: "1h ago",
    unread: false,
    group: "Today",
  },
  {
    id: "n4",
    type: "Referral update",
    title: "Your Amazon referral request moved to pending review",
    body: "The host asked for your target job ID and updated resume.",
    time: "Yesterday",
    unread: false,
    group: "Earlier",
  },
  {
    id: "n5",
    type: "Host joined",
    title: "A referral host from Shopify joined a room you follow",
    body: "They support operations, product, and analytics roles.",
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
