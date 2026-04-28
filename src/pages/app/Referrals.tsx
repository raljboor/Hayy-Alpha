import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Handshake, Send, MessageSquare, Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { StatusPill, UnreadDot } from "@/components/hayy/InboxPrimitives";
import { ReferralCardSkeleton } from "@/components/hayy/Skeletons";
import { ErrorState } from "@/components/hayy/ErrorState";
import { type ReferralThread, type ThreadStatus } from "@/lib/inboxData";
import { getReferralThreads, createReferralRequest } from "@/lib/api/referrals";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { users } from "@/data/mockData";

const tabs = ["All", "Incoming", "Outgoing", "Pending", "Accepted", "Declined", "Completed"] as const;
type Tab = (typeof tabs)[number];

const filterFn = (t: ReferralThread, tab: Tab) => {
  if (tab === "All") return true;
  if (tab === "Incoming") return t.direction === "incoming";
  if (tab === "Outgoing") return t.direction === "outgoing";
  return t.status === (tab as ThreadStatus);
};

const Referrals = () => {
  const { userId } = useCurrentUser();
  const [tab, setTab] = useState<Tab>("All");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useAsync(() => getReferralThreads(), []);
  const seed = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => seed.filter((t) => filterFn(t, tab)), [seed, tab]);

  const counts = useMemo(
    () => ({
      All: seed.length,
      Incoming: seed.filter((t) => t.direction === "incoming").length,
      Outgoing: seed.filter((t) => t.direction === "outgoing").length,
      Pending: seed.filter((t) => t.status === "Pending").length,
      Accepted: seed.filter((t) => t.status === "Accepted").length,
      Declined: seed.filter((t) => t.status === "Declined").length,
      Completed: seed.filter((t) => t.status === "Completed").length,
    }),
    [seed],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createReferralRequest({
      requester_id: userId ?? "u1",
      host_id: String(form.get("host") ?? ""),
      target_company: String(form.get("company") ?? ""),
      target_role: String(form.get("role") ?? ""),
      request_type: String(form.get("type") ?? "referral"),
      message: String(form.get("message") ?? ""),
    });
    setOpen(false);
    toast.success("Request sent", { description: "Your host will get a warm intro request." });
  };

  return (
    <div className="w-full max-w-full space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-clay font-medium">Warm intros</p>
          <h1 className="font-display text-[30px] sm:text-4xl text-foreground leading-tight mt-1">
            Referral requests
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Track warm intros, coffee chats, referral reviews, and host responses.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <Plus className="h-4 w-4" />
              New request
            </Button>
          </DialogTrigger>
          <NewRequestDialog onSubmit={onSubmit} currentUserId={userId ?? "u1"} />
        </Dialog>
      </header>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="soft" size="sm">
          <Link to="/app/messages">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
        </Button>
        <Button asChild variant="soft" size="sm">
          <Link to="/app/notifications">
            <Bell className="h-4 w-4" />
            Notifications
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground border-primary shadow-soft"
                : "bg-card text-foreground/70 border-border hover:bg-sand"
            }`}
          >
            {t}
            <span
              className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                tab === t ? "bg-primary-foreground/20" : "bg-secondary"
              }`}
            >
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards / states */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ReferralCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load your referrals." onRetry={refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((t) => (
              <article
                key={t.id}
                className="w-full max-w-full box-border rounded-3xl bg-card border border-border p-5 shadow-soft hover:shadow-warm transition-shadow flex flex-col gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <UserAvatar user={t.person} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground truncate">{t.person.name}</p>
                      {t.unread && <UnreadDot />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.roleCompany}</p>
                  </div>
                  <StatusPill status={t.status} />
                </div>

                <div className="space-y-1.5 text-sm">
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Request:</span> {t.requestType}
                  </p>
                  <p className="text-foreground/85">
                    <span className="text-muted-foreground">Target:</span> {t.targetRole} · {t.targetCompany}
                  </p>
                </div>

                <div className="rounded-2xl bg-cream/60 border border-border/70 p-3">
                  <p className="text-sm text-foreground/85 leading-snug">"{t.lastPreview}"</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Updated {t.lastUpdated}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                  <Button asChild variant="hero" size="sm" className="w-full sm:flex-1">
                    <Link to={`/app/referrals/${t.id}`}>Open thread</Link>
                  </Button>
                  <Button
                    variant="soft"
                    size="sm"
                    className="w-full sm:flex-1"
                    onClick={() => navigate(`/app/referrals/${t.id}?focus=composer`)}
                  >
                    Follow up
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-cream/50 p-10 text-center">
              <Handshake className="h-8 w-8 mx-auto text-clay" />
              <p className="font-display text-xl mt-3">Nothing in this tab yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try a different tab or send a new referral request.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const NewRequestDialog = ({
  onSubmit,
  currentUserId,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  currentUserId: string;
}) => {
  const hosts = users.filter((u) => u.id !== currentUserId);
  return (
    <DialogContent className="sm:max-w-lg max-w-[calc(100vw-2rem)]">
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">Send a referral request</DialogTitle>
        <DialogDescription>
          Be specific and kind — it's the difference between a yes and a maybe.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4 mt-2">
        <div className="space-y-2">
          <Label>Select host</Label>
          <Select name="host" defaultValue={hosts[0].id}>
            <SelectTrigger className="bg-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hosts.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name} — {h.role}
                  {h.company ? ` · ${h.company}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Target company</Label>
            <Input id="company" name="company" placeholder="e.g. Shopify" required className="bg-cream" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Target role</Label>
            <Input id="role" name="role" placeholder="e.g. Senior PMM" required className="bg-cream" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Request type</Label>
          <Select name="type" defaultValue="referral">
            <SelectTrigger className="bg-cream">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coffee chat">Coffee chat</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="resume feedback">Resume feedback</SelectItem>
              <SelectItem value="interview prep">Interview prep</SelectItem>
              <SelectItem value="company insight">Company insight</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            required
            placeholder="Hi — really enjoyed your perspective in the Canada Career room..."
            className="bg-cream resize-none"
          />
        </div>

        <Button type="button" variant="soft" size="sm" className="w-full" onClick={() => toast("Resume attached")}>
          Attach resume
        </Button>

        <Button type="submit" variant="hero" className="w-full">
          <Send className="h-4 w-4" />
          Submit request
        </Button>
      </form>
    </DialogContent>
  );
};

export default Referrals;
