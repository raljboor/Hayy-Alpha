/**
 * Settings — ported from the redesign Settings mock
 * (frontend-new/hayy/project/components/extra-screens.jsx → Settings).
 *
 * Left rail tabs (Account, Notifications, Privacy, Danger zone), right
 * pane content. Preserves the existing delete-account wiring (deleteAccount
 * → signOut → navigate("/")) with a redesign-skinned confirm modal.
 */

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, Btn, I } from "@/components/ui/primitives";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import { deleteAccount } from "@/lib/api/account";

type Tab = "Account" | "Notifications" | "Privacy" | "Danger zone";

const TABS: { l: Tab; icon: ReactNode }[] = [
  { l: "Account", icon: I.users },
  { l: "Notifications", icon: I.bell },
  { l: "Privacy", icon: I.lock },
  { l: "Danger zone", icon: I.closed },
];

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

const cardStyle: CSSProperties = {
  background: "var(--paper)",
  border: "1px solid var(--line-soft)",
  borderRadius: "var(--radius-xl)",
  boxShadow: "var(--shadow-soft)",
};

// ---------------------------------------------------------------------------
// Toggle row
// ---------------------------------------------------------------------------

const Toggle = ({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    style={{
      width: 36,
      height: 22,
      borderRadius: 99,
      padding: 2,
      flex: "none",
      background: on ? "var(--clay)" : "var(--line)",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: on ? "flex-end" : "flex-start",
      cursor: "pointer",
      transition: "background .2s",
    }}
  >
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 99,
        background: "var(--paper)",
        boxShadow: "0 1px 3px rgba(0,0,0,.15)",
      }}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Modal (delete confirm)
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
        zIndex: 80,
        background: "rgba(15,15,20,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--paper)",
          borderRadius: "var(--radius-xl)",
          maxWidth: 480,
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

const Settings = () => {
  const navigate = useNavigate();
  const { userId, signOut } = useCurrentUser();
  const { data: profile, isLoading } = useQuery({
    queryKey: ["settings-profile", userId],
    queryFn: () => (userId ? getProfile(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });

  const [tab, setTab] = useState<Tab>("Account");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notification toggles (UI-only for now — wiring to backend lives in a future phase)
  const [notifPrefs, setNotifPrefs] = useState({
    roomReminders: true,
    referralUpdates: true,
    weeklyDigest: false,
  });
  const [privacyPrefs, setPrivacyPrefs] = useState({
    discoverableByRecruiters: true,
    showRoomActivity: false,
  });

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      await updateProfile(userId, { full_name: name });
      toast.success("Settings saved");
    } catch {
      toast.error("Couldn't save settings");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Your account has been deleted.");
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't delete your account.";
      toast.error("Account deletion failed", { description: message });
      setDeleting(false);
    }
  };

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
      <div style={{ paddingBottom: 18, borderBottom: "1px solid var(--line-soft)" }}>
        <p style={sectionLabelStyle}>Settings</p>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", marginTop: 6, fontFamily: "var(--display)" }}>
          How Hayy <span className="display-italic">behaves</span> for you.
        </h1>
      </div>

      <div
        className="settings-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 40,
          paddingTop: 24,
        }}
      >
        {/* Tabs */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="settings-tabs"
        >
          {TABS.map((t) => {
            const active = tab === t.l;
            return (
              <button
                key={t.l}
                type="button"
                onClick={() => setTab(t.l)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 500,
                  background: active ? "var(--clay)" : "transparent",
                  color: active ? "var(--paper)" : "var(--ink-soft)",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--sans)",
                  whiteSpace: "nowrap",
                  flex: "none",
                }}
              >
                {t.icon}
                <span>{t.l}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          {tab === "Account" && (
            <>
              <div>
                <h2 style={{ fontSize: 22, fontFamily: "var(--display)", margin: 0 }}>
                  Account
                </h2>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    maxWidth: 540,
                    lineHeight: 1.55,
                  }}
                >
                  Your name and email — what other members see and how Hayy reaches you.
                </p>
              </div>

              {isLoading ? (
                <p style={{ fontSize: 13, color: "var(--ink-mute)" }}>Loading…</p>
              ) : (
                <form
                  onSubmit={handleSave}
                  style={{
                    ...cardStyle,
                    padding: 22,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={fieldLabelStyle}>Display name</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      style={inputStyle}
                      disabled={saving}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={fieldLabelStyle}>Email</span>
                    <input
                      type="email"
                      value=""
                      placeholder="you@hayy.community"
                      disabled
                      style={{ ...inputStyle, opacity: 0.7 }}
                    />
                    <span style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                      Email changes require re-authentication.
                    </span>
                  </label>
                  <Btn
                    kind="primary"
                    size="md"
                    type="submit"
                    disabled={saving || !userId}
                    style={{ alignSelf: "flex-start" }}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </Btn>
                </form>
              )}
            </>
          )}

          {tab === "Notifications" && (
            <>
              <div>
                <h2 style={{ fontSize: 22, fontFamily: "var(--display)", margin: 0 }}>
                  Notifications
                </h2>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    maxWidth: 540,
                    lineHeight: 1.55,
                  }}
                >
                  The only Hayy rule about notifications: never push something you didn't ask
                  to hear about.
                </p>
              </div>

              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                {(
                  [
                    {
                      key: "roomReminders" as const,
                      l: "Live room reminders",
                      d: "Ping me 10 min before a saved room starts",
                    },
                    {
                      key: "referralUpdates" as const,
                      l: "Referral updates",
                      d: "Email me when a host responds",
                    },
                    {
                      key: "weeklyDigest" as const,
                      l: "Weekly digest",
                      d: "A warm summary of next week's rooms",
                    },
                  ]
                ).map((c, i) => (
                  <div
                    key={c.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      padding: "16px 20px",
                      alignItems: "center",
                      gap: 12,
                      borderTop: i === 0 ? "0" : "1px solid var(--line-soft)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{c.l}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
                        {c.d}
                      </p>
                    </div>
                    <Toggle
                      on={notifPrefs[c.key]}
                      onChange={(v) => setNotifPrefs({ ...notifPrefs, [c.key]: v })}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "Privacy" && (
            <>
              <div>
                <h2 style={{ fontSize: 22, fontFamily: "var(--display)", margin: 0 }}>
                  Privacy &amp; visibility
                </h2>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    maxWidth: 540,
                    lineHeight: 1.55,
                  }}
                >
                  Decide who can find you and what they see.
                </p>
              </div>
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                {(
                  [
                    {
                      key: "discoverableByRecruiters" as const,
                      l: "Show my profile to recruiters",
                      d: "Allow recruiters in rooms to discover you",
                    },
                    {
                      key: "showRoomActivity" as const,
                      l: "Public referral activity",
                      d: "Show stats like rooms joined on your profile",
                    },
                  ]
                ).map((c, i) => (
                  <div
                    key={c.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      padding: "16px 20px",
                      alignItems: "center",
                      gap: 12,
                      borderTop: i === 0 ? "0" : "1px solid var(--line-soft)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{c.l}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-mute)", marginTop: 2 }}>
                        {c.d}
                      </p>
                    </div>
                    <Toggle
                      on={privacyPrefs[c.key]}
                      onChange={(v) =>
                        setPrivacyPrefs({ ...privacyPrefs, [c.key]: v })
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "Danger zone" && (
            <>
              <div>
                <h2 style={{ fontSize: 22, fontFamily: "var(--display)", margin: 0 }}>
                  Danger zone
                </h2>
                <p
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "var(--ink-soft)",
                    maxWidth: 540,
                    lineHeight: 1.55,
                  }}
                >
                  Deleting your account removes your profile, rooms you joined, intros,
                  messages, and follow-ups. This can't be undone.
                </p>
              </div>
              <div
                style={{
                  ...cardStyle,
                  padding: 22,
                  border: "1px solid var(--live)",
                  background: "rgba(220,60,60,.05)",
                }}
              >
                <p
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--live)",
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Permanent
                </p>
                <p
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 22,
                    marginTop: 6,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  }}
                >
                  Delete your Hayy account
                </p>
                <Btn
                  kind="ghost"
                  size="md"
                  onClick={() => setDeleteOpen(true)}
                  disabled={deleting || !userId}
                  style={{
                    marginTop: 14,
                    color: "var(--live)",
                    border: "1px solid var(--live)",
                  }}
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </Btn>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)}>
        <p
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--live)",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Confirm
        </p>
        <h2
          style={{
            fontFamily: "var(--display)",
            fontSize: 26,
            marginTop: 6,
            lineHeight: 1.15,
            fontWeight: 500,
          }}
        >
          Delete your Hayy account?
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--ink-soft)",
            marginTop: 12,
            lineHeight: 1.55,
          }}
        >
          This permanently removes your profile, host settings, referral requests, messages,
          notifications, and uploaded files. Rooms you hosted will stay visible to other
          participants but will no longer be linked to you.
          <br />
          <br />
          <strong style={{ color: "var(--ink)" }}>This can't be undone.</strong>
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
          <Btn
            kind="ghost"
            size="md"
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
          >
            Keep my account
          </Btn>
          <Btn
            kind="primary"
            size="md"
            onClick={onDeleteAccount}
            disabled={deleting}
            style={{ background: "var(--live)" }}
          >
            {deleting ? "Deleting…" : "Yes, delete forever"}
          </Btn>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 720px) {
          .settings-grid { grid-template-columns: 1fr !important; gap: 18px !important; }
          .settings-tabs { flex-direction: row !important; overflow-x: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
