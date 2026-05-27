/**
 * Referrals — ported from the redesign Referrals (pipeline lanes) and
 * ReferCompose (new request dialog) mocks
 * (frontend-new/hayy/project/components/more-screens.jsx → Referrals,
 *  extra-screens.jsx → ReferCompose).
 *
 * Three status lanes (Pending / In conversation / Referred), plus a
 * "New request" Btn that opens a ReferCompose-styled modal.
 *
 * Real data via getReferralThreads + createReferralRequest. Outgoing /
 * Incoming filter pills mirror the redesign. Empty states honest.
 */

import { useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I, Pill } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getReferralThreads, createReferralRequest } from "@/lib/api/referrals";
import type { ReferralThread, ThreadStatus } from "@/lib/inboxData";
import { users } from "@/data/mockData";

// ---------------------------------------------------------------------------
// Lane buckets — map ThreadStatus to redesign lane labels
// ---------------------------------------------------------------------------

interface Lane {
  title: string;
  tone: string; // CSS color (var or hsl)
  threads: ReferralThread[];
}

function bucket(threads: ReferralThread[]): Lane[] {
  const pending = threads.filter((t) => t.status === "Pending");
  const inConvo = threads.filter((t) => t.status === "Accepted" || t.status === "Waitlisted");
  const referred = threads.filter((t) => t.status === "Completed");
  return [
    { title: "Pending", tone: "var(--ink-mute)", threads: pending },
    { title: "In conversation", tone: "var(--clay)", threads: inConvo },
    { title: "Referred", tone: "var(--olive)", threads: referred },
  ];
}

const sectionLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: ".12em",
  color: "var(--clay)",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: 0,
};

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid var(--line)",
  background: "var(--paper)",
  fontSize: 14,
  color: "var(--ink)",
  width: "100%",
  outline: "none",
  fontFamily: "var(--sans)",
};

const fieldLabelStyle: CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-mute)",
  letterSpacing: ".1em",
  textTransform: "uppercase",
};

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="hy"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "rgba(15,15,20,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        overflow: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 540,
          width: "100%",
          padding: 28,
          boxShadow: "var(--shadow-warm)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Referrals = () => {
  const { userId } = useCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [direction, setDirection] = useState<"outgoing" | "incoming">("outgoing");
  const [open, setOpen] = useState(false);

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["referrals-threads", userId],
    queryFn: () => getReferralThreads(userId ?? undefined),
    staleTime: 30_000,
  });

  const filtered = useMemo(
    () => threads.filter((t) => t.direction === direction),
    [threads, direction],
  );
  const lanes = useMemo(() => bucket(filtered), [filtered]);

  const totalActive = filtered.filter((t) => t.status !== "Declined").length;
  const awaitingMe = filtered.filter(
    (t) => t.status === "Pending" && t.direction === "incoming",
  ).length;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await createReferralRequest({
        requester_id: userId ?? "u1",
        host_id: String(form.get("host") ?? ""),
        target_company: String(form.get("company") ?? ""),
        target_role: String(form.get("role") ?? ""),
        request_type: String(form.get("type") ?? "referral"),
        message: String(form.get("message") ?? ""),
      });
      setOpen(false);
      toast.success("Request sent", {
        description: "Your host will get a warm intro request.",
      });
      queryClient.invalidateQueries({ queryKey: ["referrals-threads"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send request.");
    }
  };

  const tones: ("clay" | "olive" | "sand" | "dark")[] = ["clay", "olive", "sand", "dark"];
  const hosts = users.filter((u) => u.id !== (userId ?? ""));

  return (
    <div
      className="hy"
      style={{
        background: "var(--bg)",
        color: "var(--ink)",
        margin: "-24px -16px",
        padding: "32px 16px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <p style={sectionLabelStyle}>Pipeline</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6, fontFamily: "var(--display)" }}>
            Your <span className="display-italic">warm</span> conversations.
          </h1>
          <p style={{ marginTop: 6, color: "var(--ink-soft)", fontSize: 14 }}>
            {totalActive} active{awaitingMe > 0 ? ` · ${awaitingMe} awaiting your reply` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn
            kind={direction === "outgoing" ? "soft" : "ghost"}
            size="md"
            onClick={() => setDirection("outgoing")}
          >
            Outgoing
          </Btn>
          <Btn
            kind={direction === "incoming" ? "soft" : "ghost"}
            size="md"
            onClick={() => setDirection("incoming")}
          >
            Incoming
          </Btn>
          <Btn kind="primary" size="md" icon={I.plus} onClick={() => setOpen(true)}>
            New request
          </Btn>
        </div>
      </div>

      <div
        className="referrals-lanes"
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {lanes.map((lane) => (
          <div
            key={lane.title}
            style={{
              background: "var(--paper)",
              border: "1px solid var(--line-soft)",
              borderTop: `3px solid ${lane.tone}`,
              borderRadius: "var(--radius-xl)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 200,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <h3 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 500 }}>
                {lane.title}
              </h3>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".06em" }}
              >
                {lane.threads.length}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {isLoading && (
                <p style={{ fontSize: 12, color: "var(--ink-mute)", padding: 12 }}>Loading…</p>
              )}
              {!isLoading && lane.threads.length === 0 && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ink-mute)",
                    padding: 12,
                    fontStyle: "italic",
                  }}
                >
                  Nothing here yet.
                </p>
              )}
              {lane.threads.map((t, i) => (
                <Link
                  key={t.id}
                  to={`/app/referrals/${t.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      background: "var(--cream)",
                      border: "1px solid var(--line-soft)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={t.person.name} size={32} tone={tones[i % tones.length]} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>
                          {t.person.name}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--ink-mute)", margin: 0 }}>
                          {t.roleCompany}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 11,
                      }}
                    >
                      <span
                        className="mono"
                        style={{ color: "var(--ink-soft)", letterSpacing: ".04em" }}
                      >
                        {t.lastUpdated}
                      </span>
                      <span style={{ color: "var(--clay)", fontWeight: 500 }}>Open →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/app/messages" style={{ textDecoration: "none" }}>
          <Btn kind="ghost" size="md" icon={I.msg}>
            Open inbox
          </Btn>
        </Link>
        <Link to="/app/notifications" style={{ textDecoration: "none" }}>
          <Btn kind="ghost" size="md" icon={I.bell}>
            Notifications
          </Btn>
        </Link>
      </div>

      {/* New request modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <p style={sectionLabelStyle}>New referral request</p>
        <h2
          style={{
            fontSize: 28,
            marginTop: 6,
            fontFamily: "var(--display)",
            lineHeight: 1.1,
          }}
        >
          Ask for a <span className="display-italic">warm</span> intro.
        </h2>

        <form onSubmit={onSubmit} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Who would you like to be referred to?</span>
            <select name="host" defaultValue={hosts[0]?.id ?? ""} style={{ ...inputStyle, appearance: "none" }}>
              {hosts.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.role}
                  {h.company ? ` · ${h.company}` : ""}
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Company</span>
              <input
                name="company"
                placeholder="e.g. Stripe"
                required
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={fieldLabelStyle}>Role you're targeting</span>
              <input
                name="role"
                placeholder="e.g. Sr PM, Payments"
                required
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Request type</span>
            <select name="type" defaultValue="referral" style={{ ...inputStyle, appearance: "none" }}>
              <option value="coffee_chat">Coffee chat</option>
              <option value="referral">Referral</option>
              <option value="resume_feedback">Resume feedback</option>
              <option value="interview_prep">Interview prep</option>
              <option value="company_insight">Company insight</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={fieldLabelStyle}>Why this role, in your words</span>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Three lines they could paste straight into a Slack DM."
              style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
            />
          </label>

          <div
            style={{
              padding: 14,
              borderRadius: 12,
              background: "var(--cream)",
              border: "1px solid var(--line-soft)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              fontSize: 12,
              color: "var(--ink-soft)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "var(--olive)", flex: "none", marginTop: 2 }}>{I.lock}</span>
            <span>
              The host gets to decide. They'll see this note and your profile — nothing else
              from your account. You can withdraw the request anytime before they reply.
            </span>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <Btn kind="ghost" size="md" onClick={() => setOpen(false)} type="button">
              Cancel
            </Btn>
            <Btn kind="primary" size="md" type="submit" iconRight={I.shake}>
              Send request
            </Btn>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 880px) {
          .referrals-lanes { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Referrals;
