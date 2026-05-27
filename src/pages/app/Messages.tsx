/**
 * Messages — ported from the redesign Messages mock
 * (frontend-new/hayy/project/components/extra-screens.jsx → Messages).
 *
 * Two-pane layout: conversation list (320px sidebar) + open thread (right).
 * On mobile, only the open thread is shown; tapping a list item navigates
 * to the thread page (existing pattern).
 *
 * Real data via getReferralThreads + sendReferralMessage. The currently
 * selected thread renders its full message history; reply via the composer
 * uses the same Supabase mutation as ReferralThread.
 */

import { useMemo, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getReferralThreads } from "@/lib/api/referrals";
import { sendReferralMessage } from "@/lib/api/messages";

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const Messages = () => {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const { data: threads = [], isLoading, error } = useQuery({
    queryKey: ["messages-threads", userId],
    queryFn: () => getReferralThreads(userId ?? undefined),
    staleTime: 30_000,
  });

  const filtered = useMemo(
    () =>
      threads.filter(
        (t) =>
          t.person.name.toLowerCase().includes(query.toLowerCase()) ||
          t.lastPreview.toLowerCase().includes(query.toLowerCase()),
      ),
    [threads, query],
  );

  const selected = threads.find((t) => t.id === selectedId) ?? threads[0] ?? null;
  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];

  const handleSend = async () => {
    if (!reply.trim() || !selected || !userId) return;
    setSending(true);
    try {
      await sendReferralMessage(selected.id, userId, reply.trim());
      setReply("");
      queryClient.invalidateQueries({ queryKey: ["messages-threads"] });
      queryClient.invalidateQueries({
        queryKey: ["referral-messages", selected.id],
      });
      toast.success("Reply sent");
    } catch {
      toast.error("Couldn't send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: 0,
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Conversation list */}
      <aside
        className="messages-list"
        style={{
          width: 320,
          borderRight: "1px solid var(--line)",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 18px 14px", borderBottom: "1px solid var(--line-soft)" }}>
          <p style={sectionLabelStyle}>Conversations</p>
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "var(--cream)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "var(--ink-mute)" }}>{I.search}</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search messages"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "var(--ink)",
                fontFamily: "var(--sans)",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto" }}>
          {isLoading && (
            <p style={{ padding: 24, fontSize: 13, color: "var(--ink-mute)" }}>Loading…</p>
          )}
          {!isLoading && filtered.length === 0 && (
            <p style={{ padding: 24, fontSize: 13, color: "var(--ink-mute)" }}>
              {query ? "No matches." : "No conversations yet."}
            </p>
          )}
          {filtered.map((c, i) => {
            const active = (selected?.id ?? "") === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 18px",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  background: active ? "var(--cream)" : "transparent",
                  borderLeft: active ? "2px solid var(--clay)" : "2px solid transparent",
                  border: "none",
                  borderBottom: "1px solid var(--line-soft)",
                  cursor: "pointer",
                  fontFamily: "var(--sans)",
                  color: "var(--ink)",
                }}
              >
                <Avatar name={c.person.name} size={40} tone={tones[i % tones.length]} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 6,
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>
                      {c.person.name}
                    </p>
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: "var(--ink-mute)", flex: "none" }}
                    >
                      {c.lastUpdated}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--ink-mute)",
                      marginTop: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.roleCompany}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: c.unread ? "var(--ink)" : "var(--ink-soft)",
                      fontWeight: c.unread ? 500 : 400,
                      marginTop: 4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.lastPreview}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Open thread */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        {error && (
          <div style={{ padding: 32 }}>
            <p style={{ color: "var(--ink-soft)" }}>Couldn't load messages.</p>
          </div>
        )}
        {!error && !selected && !isLoading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            <div style={{ textAlign: "center", maxWidth: 360 }}>
              <p style={sectionLabelStyle}>Inbox</p>
              <h2
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 26,
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                Pick a thread to read.
              </h2>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>
                Your warm intros, host replies, and follow-ups all live here.
              </p>
            </div>
          </div>
        )}

        {selected && (
          <>
            {/* Thread header */}
            <div
              style={{
                padding: "20px 28px",
                borderBottom: "1px solid var(--line-soft)",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "var(--paper)",
              }}
            >
              <Avatar name={selected.person.name} size={42} tone="clay" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 20,
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {selected.person.name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--ink-mute)",
                    marginTop: 2,
                  }}
                >
                  {selected.roleCompany}
                </p>
              </div>
              <Link to={`/app/referrals/${selected.id}`} style={{ textDecoration: "none" }}>
                <Btn kind="soft" size="md" icon={I.cal}>
                  Open thread
                </Btn>
              </Link>
            </div>

            {/* Context strip */}
            <div
              style={{
                padding: "10px 28px",
                background: "var(--cream)",
                borderBottom: "1px solid var(--line-soft)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 12,
                color: "var(--ink-soft)",
              }}
            >
              <span style={{ color: "var(--clay)" }}>{I.shake}</span>
              <span>
                This thread is about{" "}
                <strong style={{ color: "var(--ink)" }}>
                  {selected.targetCompany} · {selected.targetRole}
                </strong>
              </span>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "20px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {selected.messages.slice(-12).map((m) => {
                const mine = m.sender === "me";
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: mine ? "flex-end" : "flex-start",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "12px 16px",
                        borderRadius: 18,
                        background: mine ? "var(--clay)" : "var(--paper)",
                        color: mine ? "var(--paper)" : "var(--ink)",
                        border: mine ? "none" : "1px solid var(--line-soft)",
                        borderBottomRightRadius: mine ? 6 : 18,
                        borderBottomLeftRadius: mine ? 18 : 6,
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.body}
                    </div>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--ink-mute)",
                        padding: "0 6px",
                      }}
                    >
                      {m.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Composer */}
            <div
              style={{
                padding: "16px 28px 22px",
                borderTop: "1px solid var(--line-soft)",
                background: "var(--paper)",
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
                placeholder={`Reply to ${selected.person.name.split(" ")[0]}…`}
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    void handleSend();
                  }
                }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 18,
                  background: "var(--cream)",
                  border: "1px solid var(--line)",
                  fontSize: 14,
                  color: "var(--ink)",
                  outline: "none",
                  fontFamily: "var(--sans)",
                  resize: "none",
                  lineHeight: 1.5,
                }}
              />
              <Btn
                kind="primary"
                size="md"
                onClick={handleSend}
                disabled={sending || !reply.trim()}
                iconRight={I.arrow}
              >
                {sending ? "…" : "Send"}
              </Btn>
            </div>
          </>
        )}
      </main>

      <style>{`
        @media (max-width: 880px) {
          .messages-list { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Messages;
