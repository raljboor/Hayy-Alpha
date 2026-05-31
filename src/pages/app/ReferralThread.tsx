/**
 * ReferralThread — ported from the redesign ReferralDetail mock
 * (frontend-new/hayy/project/components/workflow-screens.jsx → ReferralDetail).
 *
 * Editorial detail view: candidate header, "the ask" quote card, "what's
 * happened" timeline (built from the existing thread.messages), next-step
 * CTA strip, and a side rail with recipient + visibility + danger panels.
 *
 * Real data via getReferralRequestById + getMessagesForReferral; reply via
 * sendReferralMessage. Wiring contracts preserved verbatim.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, Pill } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getReferralRequestById } from "@/lib/api/referrals";
import { getMessagesForReferral, sendReferralMessage } from "@/lib/api/messages";
import type { ThreadMessage } from "@/lib/inboxData";

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-xl)",
  padding: 18,
  boxShadow: "var(--shadow-soft)",
};

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={cardStyle}>
    <p style={{ ...sectionLabelStyle, fontSize: 10 }}>{title}</p>
    <div style={{ marginTop: 10 }}>{children}</div>
  </section>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ReferralThread = () => {
  const { userId } = useCurrentUser();
  const { id = "" } = useParams();
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const { data: thread, isLoading: loadingThread, error } = useQuery({
    queryKey: ["referral-thread", id, userId],
    queryFn: () => getReferralRequestById(id, userId ?? undefined),
    enabled: !!id,
  });

  const { data: liveMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["referral-messages", id, userId],
    queryFn: () => getMessagesForReferral(id, userId ?? "me"),
    enabled: !!id,
  });

  const messages = useMemo<ThreadMessage[]>(
    () => liveMessages ?? thread?.messages ?? [],
    [liveMessages, thread],
  );

  useEffect(() => {
    if (params.get("focus") === "composer") {
      setTimeout(() => composerRef.current?.focus(), 200);
    }
  }, [params]);

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await sendReferralMessage(id, userId ?? "u1", reply.trim());
      setReply("");
      await refetchMessages();
      queryClient.invalidateQueries({ queryKey: ["referrals-threads"] });
      toast.success("Reply sent");
    } catch {
      toast.error("Couldn't send reply");
    } finally {
      setSending(false);
    }
  };

  if (loadingThread) {
    return (
      <div className="hy" style={{ padding: 32 }}>
        <p
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--ink-mute)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          Loading thread…
        </p>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="hy" style={{ padding: 32 }}>
        <Link to="/app/referrals" style={{ textDecoration: "none" }}>
          <Btn kind="ghost" size="md">
            ← Back to referrals
          </Btn>
        </Link>
        <p style={{ marginTop: 14, color: "var(--ink-soft)" }}>
          Thread not found.
        </p>
      </div>
    );
  }

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "32px 16px",
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          paddingBottom: 18,
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        <Link to="/app/referrals" style={{ textDecoration: "none" }}>
          <Btn kind="ghost" size="md">
            ← Pipeline
          </Btn>
        </Link>
        <span style={{ color: "var(--ink-mute)", fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          {thread.person.name} · {thread.targetCompany}
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <Pill
            kind={thread.status === "Accepted" ? "clay" : undefined}
            style={
              thread.status === "Completed"
                ? {
                    background: "var(--olive)",
                    color: "var(--paper)",
                    borderColor: "transparent",
                  }
                : undefined
            }
          >
            {thread.status}
          </Pill>
          <span
            className="mono"
            style={{
              alignSelf: "center",
              fontSize: 11,
              color: "var(--ink-mute)",
              letterSpacing: ".06em",
            }}
          >
            UPDATED {thread.lastUpdated.toUpperCase()}
          </span>
        </span>
      </div>

      <div
        className="referral-detail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 36,
          paddingTop: 24,
        }}
      >
        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          {/* Header */}
          <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Avatar name={thread.person.name} size={72} tone="olive" />
            <div>
              <p style={sectionLabelStyle}>{thread.direction === "incoming" ? "Candidate" : "Recipient"}</p>
              <h1
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 32,
                  fontWeight: 500,
                  lineHeight: 1.05,
                  marginTop: 4,
                }}
              >
                {thread.person.name}
              </h1>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
                {thread.roleCompany}
              </p>
            </div>
          </header>

          {/* The ask */}
          <div style={{ ...cardStyle, background: "var(--cream)" }}>
            <p style={{ ...sectionLabelStyle, fontSize: 10 }}>The ask</p>
            <p
              style={{
                fontFamily: "var(--display)",
                fontStyle: "italic",
                fontSize: 18,
                lineHeight: 1.5,
                marginTop: 10,
                color: "var(--ink-soft)",
              }}
            >
              "{thread.requestType} — {thread.targetRole} at {thread.targetCompany}"
            </p>
          </div>

          {/* Conversation */}
          <section style={cardStyle}>
            <h2
              style={{
                fontFamily: "var(--display)",
                fontSize: 22,
                fontWeight: 500,
                margin: 0,
              }}
            >
              What's happened
            </h2>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
              {messages.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--ink-mute)", padding: "12px 0" }}>
                  No messages yet — be the first to write one.
                </p>
              ) : (
                messages.map((m, i) => {
                  const mine = m.sender === "me";
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr",
                        gap: 18,
                        padding: "16px 0",
                        borderTop:
                          i === 0
                            ? "1px solid var(--line-soft)"
                            : "1px dashed var(--line-soft)",
                      }}
                    >
                      <p
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: "var(--ink-mute)",
                          letterSpacing: ".06em",
                          paddingTop: 2,
                          margin: 0,
                        }}
                      >
                        {m.time?.toUpperCase() ?? ""}
                      </p>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 99,
                              background: mine ? "var(--ink)" : "var(--olive)",
                            }}
                          />
                          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                            {m.senderName}
                          </p>
                        </div>
                        <p
                          style={{
                            fontSize: 14,
                            color: "var(--ink-soft)",
                            marginTop: 6,
                            lineHeight: 1.55,
                          }}
                        >
                          {m.body}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Composer */}
          <section
            style={{
              ...cardStyle,
              background: "var(--cream)",
              position: "sticky",
              bottom: 8,
            }}
          >
            <textarea
              ref={composerRef}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Write a reply to ${thread.person.name.split(" ")[0]}…`}
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "var(--paper)",
                fontSize: 14,
                color: "var(--ink)",
                outline: "none",
                fontFamily: "var(--sans)",
                resize: "none",
                lineHeight: 1.5,
              }}
            />
            <div
              style={{
                marginTop: 10,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Btn kind="ghost" size="md" onClick={() => toast("Resume attached")}>
                Attach resume
              </Btn>
              <Btn kind="ghost" size="md" onClick={() => toast("Job link added")}>
                Add link
              </Btn>
              <Btn
                kind="primary"
                size="md"
                style={{ marginLeft: "auto" }}
                onClick={send}
                disabled={sending || !reply.trim()}
                iconRight={I.arrow}
              >
                {sending ? "Sending…" : "Send reply"}
              </Btn>
            </div>
          </section>

          {/* Next step strip */}
          <div
            style={{
              padding: 18,
              borderRadius: 14,
              border: "1px solid var(--clay)",
              background: "var(--paper)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ ...sectionLabelStyle, fontSize: 10 }}>Next step</p>
              <p style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>
                {thread.status === "Pending"
                  ? "Waiting on a reply — gentle nudge if it's been > 5 days."
                  : thread.status === "Accepted"
                    ? "Send your resume + a one-line summary."
                    : thread.status === "Completed"
                      ? "Send a thank-you note. Close the loop."
                      : "Decide if you'd like to follow up."}
              </p>
            </div>
            <Btn kind="primary" size="md" icon={I.msg}>
              Message {thread.person.name.split(" ")[0]}
            </Btn>
          </div>
        </div>

        {/* Side rail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <Panel title={thread.direction === "incoming" ? "Requester" : "Recipient"}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={thread.person.name} size={42} tone="clay" />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                  {thread.person.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--ink-mute)", margin: 0 }}>
                  {thread.hostMeta?.title ?? thread.roleCompany}
                </p>
              </div>
            </div>
            {thread.hostMeta && (
              <ul
                style={{
                  marginTop: 14,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-mute)" }}>Replies in</span>
                  <span style={{ fontWeight: 500 }}>{thread.hostMeta.responseTime}</span>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--ink-mute)" }}>Capacity</span>
                  <span style={{ fontWeight: 500 }}>{thread.hostMeta.capacity}</span>
                </li>
              </ul>
            )}
          </Panel>

          <Panel title="Readiness">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 99,
                  background: "var(--line)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${thread.readiness}%`,
                    height: "100%",
                    background: "var(--clay)",
                  }}
                />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--clay)" }}>
                {thread.readiness}%
              </span>
            </div>
            <p
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              Complete the missing context before asking for the actual referral.
            </p>
          </Panel>

          <Panel title="Files">
            {thread.files.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-mute)", margin: 0 }}>
                No files yet.
              </p>
            ) : (
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {thread.files.map((f) => (
                  <li
                    key={f.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      borderRadius: 12,
                      background: "var(--cream)",
                      border: "1px solid var(--line-soft)",
                      padding: "8px 12px",
                    }}
                  >
                    <span style={{ color: "var(--clay)" }}>{I.reactN}</span>
                    <span
                      style={{
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toast(f.action === "View" ? "Opening file" : "Add link")}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--clay)",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "var(--sans)",
                      }}
                    >
                      {f.action}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Visibility">
            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              The other side sees that you opened a referral and the host replied — but not
              the body of host messages until you forward them.
            </p>
          </Panel>

          <Panel title="Danger">
            <Btn kind="ghost" size="md">
              Withdraw referral
            </Btn>
          </Panel>
        </aside>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .referral-detail-grid { grid-template-columns: 1fr !important; gap: 22px !important; }
        }
      `}</style>
    </div>
  );
};

export default ReferralThread;
