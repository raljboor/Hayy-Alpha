import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { UnreadDot } from "@/components/hayy/InboxPrimitives";
import { EmptyState } from "@/components/hayy/EmptyState";
import { ErrorState } from "@/components/hayy/ErrorState";
import type { ReferralThread } from "@/data/mockData";
import { getReferralThreads } from "@/lib/api/referrals";
import { sendReferralMessage } from "@/lib/api/messages";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const Messages = () => {
  const { userId } = useCurrentUser();
  const { data, loading, error, refetch } = useAsync(
    () => getReferralThreads(userId ?? undefined),
    [userId],
  );
  const threads = data ?? [];
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const list = threads.filter(
    (t) =>
      t.person.name.toLowerCase().includes(query.toLowerCase()) ||
      t.lastPreview.toLowerCase().includes(query.toLowerCase()),
  );

  // Default selected to first in list when data arrives
  const selected = threads.find((t) => t.id === selectedId) ?? threads[0] ?? null;

  const handleSend = async () => {
    if (!reply.trim() || !selected || !userId) return;
    setSending(true);
    try {
      await sendReferralMessage(selected.id, userId, reply.trim());
      setReply("");
      await refetch();
      toast.success("Reply sent");
    } catch {
      toast.error("Couldn't send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-full space-y-6">
        <header>
          <p className="text-xs uppercase tracking-widest text-clay font-medium">Inbox</p>
          <h1 className="font-display text-[30px] sm:text-4xl text-foreground leading-tight mt-1">Referral inbox</h1>
        </header>
        <ErrorState description="We couldn't load your messages." onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-clay font-medium">Inbox</p>
        <h1 className="font-display text-[30px] sm:text-4xl text-foreground leading-tight mt-1">
          Referral inbox
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          All your warm intros, host replies, and referral conversations in one place.
        </p>
      </header>

      {threads.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description="Your referral conversations will appear here once you send or receive a request."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Thread list */}
          <div className="lg:col-span-2 space-y-3 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages..."
                className="pl-9 bg-card"
              />
            </div>

            <ul className="rounded-3xl bg-card border border-border divide-y divide-border overflow-hidden">
              {list.map((t) => (
                <li key={t.id}>
                  {/* Mobile: navigate to thread page */}
                  <Link
                    to={`/app/referrals/${t.id}`}
                    className={cn(
                      "lg:hidden flex items-start gap-3 p-4 transition-colors",
                      t.unread ? "bg-clay/5" : "",
                    )}
                  >
                    <InboxRowContent t={t} />
                  </Link>
                  {/* Desktop: select preview */}
                  <button
                    onClick={() => setSelectedId(t.id)}
                    className={cn(
                      "hidden lg:flex w-full text-left items-start gap-3 p-4 transition-colors",
                      selectedId === t.id ? "bg-cream" : t.unread ? "bg-clay/5 hover:bg-cream/60" : "hover:bg-cream/60",
                    )}
                  >
                    <InboxRowContent t={t} />
                  </button>
                </li>
              ))}
              {list.length === 0 && (
                <li className="p-6 text-sm text-muted-foreground text-center">
                  No messages match your search.
                </li>
              )}
            </ul>
          </div>

          {/* Preview panel — desktop only */}
          {selected ? (
            <section className="hidden lg:flex lg:col-span-3 flex-col rounded-3xl bg-card border border-border shadow-soft min-w-0 overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <UserAvatar user={selected.person} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{selected.person.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{selected.inboxContext}</p>
                </div>
                <Button asChild variant="soft" size="sm">
                  <Link to={`/app/referrals/${selected.id}`}>Open thread</Link>
                </Button>
              </div>

              <div className="p-5 space-y-4 flex-1 overflow-y-auto max-h-[480px]">
                {selected.messages.slice(-3).map((m) => {
                  const mine = m.sender === "me";
                  return (
                    <div key={m.id} className={cn("flex gap-3", mine ? "flex-row-reverse" : "flex-row")}>
                      <UserAvatar
                        user={{ name: m.senderName, initials: m.initials, avatarColor: m.avatarColor }}
                        size="sm"
                      />
                      <div className={cn("max-w-[75%] min-w-0", mine && "text-right")}>
                        <p className="text-[11px] text-muted-foreground mb-1">
                          <span className="font-medium text-foreground">{m.senderName}</span> · {m.time}
                        </p>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed border inline-block text-left",
                            mine
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-cream text-foreground border-border",
                          )}
                        >
                          {m.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border bg-cream/40">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={`Reply to ${selected.person.name.split(" ")[0]}...`}
                  rows={2}
                  className="bg-card resize-none"
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      void handleSend();
                    }
                  }}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handleSend}
                    disabled={sending || !reply.trim()}
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending…" : "Send"}
                  </Button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
};

const InboxRowContent = ({ t }: { t: ReferralThread }) => (
  <>
    <UserAvatar user={t.person} size="md" />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="font-medium text-foreground truncate">{t.person.name}</p>
        {t.unread && <UnreadDot />}
        <span className="ml-auto text-[11px] text-muted-foreground shrink-0">{t.lastUpdated}</span>
      </div>
      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{t.inboxContext}</p>
      <p className={cn("text-sm truncate mt-1", t.unread ? "text-foreground font-medium" : "text-muted-foreground")}>
        {t.lastPreview}
      </p>
    </div>
  </>
);

export default Messages;
