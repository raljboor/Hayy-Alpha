import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Paperclip,
  Link2,
  Send,
  CheckCircle2,
  Circle,
  FileText,
  Plus,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { StatusPill, BackLink } from "@/components/hayy/InboxPrimitives";
import { ErrorState } from "@/components/hayy/ErrorState";
import { type ThreadMessage } from "@/lib/inboxData";
import { getReferralRequestById } from "@/lib/api/referrals";
import { getMessagesForReferral, sendReferralMessage } from "@/lib/api/messages";
import { useAsync } from "@/lib/useAsync";
import { cn } from "@/lib/utils";

const ME_ID = "u1";

const Bubble = ({ msg }: { msg: ThreadMessage }) => {
  const mine = msg.sender === "me";
  return (
    <div className={cn("flex gap-3 max-w-full", mine ? "flex-row-reverse" : "flex-row")}>
      <UserAvatar user={{ name: msg.senderName, initials: msg.initials, avatarColor: msg.avatarColor }} size="sm" />
      <div className={cn("max-w-[80%] min-w-0", mine ? "items-end" : "items-start")}>
        <div className={cn("flex items-center gap-2 text-[11px] text-muted-foreground mb-1", mine && "justify-end")}>
          <span className="font-medium text-foreground">{msg.senderName}</span>
          <span>·</span>
          <span>{msg.time}</span>
        </div>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed border",
            mine
              ? "bg-primary text-primary-foreground border-primary rounded-tr-sm"
              : "bg-cream border-border text-foreground rounded-tl-sm",
          )}
        >
          {msg.body}
        </div>
      </div>
    </div>
  );
};

const ReferralThread = () => {
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const { data: thread, loading, error, refetch } = useAsync(
    () => getReferralRequestById(id),
    [id],
  );
  const { data: liveMessages, refetch: refetchMessages } = useAsync(
    () => getMessagesForReferral(id),
    [id],
  );
  const messages = useMemo<ThreadMessage[]>(
    () => liveMessages ?? thread?.messages ?? [],
    [liveMessages, thread],
  );

  useEffect(() => {
    if (params.get("focus") === "composer") {
      setTimeout(() => composerRef.current?.focus(), 200);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-4">
        <BackLink to="/app/referrals">Back to Referrals</BackLink>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-24 w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink to="/app/referrals">Back to Referrals</BackLink>
        <ErrorState description="We couldn't load this conversation." onRetry={refetch} />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="space-y-4">
        <BackLink to="/app/referrals">Back to Referrals</BackLink>
        <p className="text-muted-foreground">Thread not found.</p>
      </div>
    );
  }

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await sendReferralMessage(id, ME_ID, reply.trim());
      setReply("");
      await refetchMessages();
      toast.success("Reply sent");
    } catch (e) {
      toast.error("Couldn't send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-full space-y-5">
      {/* Header */}
      <div className="space-y-3">
        <BackLink to="/app/referrals">Back to Referrals</BackLink>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-clay/15 text-clay border border-clay/30 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider">
            Referral thread
          </span>
          <StatusPill status={thread.status} />
        </div>
        <h1 className="font-display text-[26px] sm:text-3xl text-foreground leading-tight">
          {thread.person.name} · {thread.roleCompany}
        </h1>
        <p className="text-sm text-muted-foreground">{thread.requestType}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard label="Target role" value={thread.targetRole} />
        <SummaryCard label="Target company" value={thread.targetCompany} />
        <SummaryCard label="Last update" value="Today, 9:04 AM" />
        <SummaryCard label="Referral readiness" value={`${thread.readiness}%`} accent />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Conversation */}
        <div className="lg:col-span-2 space-y-4 min-w-0">
          <section className="w-full max-w-full box-border rounded-3xl bg-card border border-border p-5 shadow-soft">
            <h2 className="font-display text-xl text-foreground mb-4">Conversation</h2>
            <div className="space-y-5">
              {messages.map((m) => (
                <Bubble key={m.id} msg={m} />
              ))}
            </div>
          </section>

          {/* Composer */}
          <section className="w-full max-w-full box-border rounded-3xl bg-cream border border-border p-4 shadow-soft sticky bottom-2">
            <Textarea
              ref={composerRef}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Write a reply to ${thread.person.name.split(" ")[0]}...`}
              rows={3}
              className="bg-card resize-none"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button variant="soft" size="sm" onClick={() => toast("Resume attached")}>
                <Paperclip className="h-4 w-4" />
                Attach resume
              </Button>
              <Button variant="soft" size="sm" onClick={() => toast("Job link added")}>
                <Link2 className="h-4 w-4" />
                Add job link
              </Button>
              <Button variant="hero" size="sm" className="ml-auto" onClick={send} disabled={sending || !reply.trim()}>
                <Send className="h-4 w-4" />
                Send reply
              </Button>
            </div>
          </section>
        </div>

        {/* Side panel */}
        <aside className="space-y-4 min-w-0">
          {/* Next steps */}
          <Panel title="Next steps">
            <ul className="space-y-2.5">
              {thread.nextSteps.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5 text-sm">
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 text-olive shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={s.done ? "line-through text-muted-foreground" : "text-foreground/85"}>
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Readiness */}
          <Panel title="Referral readiness">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-clay" style={{ width: `${thread.readiness}%` }} />
              </div>
              <span className="text-sm font-medium text-clay">{thread.readiness}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Complete the missing context before asking for the actual referral.
            </p>
          </Panel>

          {/* Files */}
          <Panel title="Files">
            <ul className="space-y-2">
              {thread.files.length === 0 && (
                <li className="text-sm text-muted-foreground">No files yet.</li>
              )}
              {thread.files.map((f) => (
                <li
                  key={f.name}
                  className="flex items-center gap-2 text-sm rounded-xl bg-cream/60 border border-border/70 px-3 py-2"
                >
                  <FileText className="h-4 w-4 text-clay shrink-0" />
                  <span className="truncate flex-1">{f.name}</span>
                  <button
                    onClick={() => toast(f.action === "View" ? "Opening file" : "Add link")}
                    className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    {f.action === "Add" && <Plus className="h-3 w-3" />}
                    {f.action}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Host profile */}
          <Panel title="Host">
            <div className="flex items-center gap-3">
              <UserAvatar user={thread.person} size="md" />
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate flex items-center gap-1">
                  {thread.person.name}
                  <Sparkles className="h-3 w-3 text-clay" />
                </p>
                <p className="text-xs text-muted-foreground truncate">{thread.hostMeta.title}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-foreground/80">
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-olive" />
                {thread.hostMeta.capacity}
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-clay" />
                {thread.hostMeta.responseTime}
              </li>
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div
    className={cn(
      "rounded-2xl border p-3.5 box-border",
      accent ? "bg-clay/10 border-clay/30" : "bg-card border-border",
    )}
  >
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className={cn("font-display text-lg leading-tight mt-1", accent ? "text-clay" : "text-foreground")}>
      {value}
    </p>
  </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="w-full max-w-full box-border rounded-2xl bg-card border border-border p-5 shadow-soft">
    <h3 className="font-display text-lg text-foreground mb-3">{title}</h3>
    {children}
  </section>
);

export default ReferralThread;
