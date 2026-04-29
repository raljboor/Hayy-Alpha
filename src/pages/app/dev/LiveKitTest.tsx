/**
 * TEMPORARY QA TOOL — remove before production launch.
 *
 * Route: /app/dev/livekit-test
 * Guard: only rendered when import.meta.env.DEV === true
 *        OR import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true'
 *
 * Tests the /api/livekit-token endpoint using the real logged-in
 * Supabase session. Never displays the access token or any secrets.
 */

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  FlaskConical,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getRooms } from "@/lib/api/rooms";
import { supabase } from "@/lib/supabaseClient";
import { useAsync } from "@/lib/useAsync";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TestId = "t401" | "t400" | "t403" | "t200";
type ResultStatus = "idle" | "running" | "pass" | "fail";

interface TestResult {
  status: ResultStatus;
  httpStatus?: number;
  message?: string;
  livekitUrl?: string;
  tokenExists?: boolean;
}

const INITIAL: Record<TestId, TestResult> = {
  t401: { status: "idle" },
  t400: { status: "idle" },
  t403: { status: "idle" },
  t200: { status: "idle" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Calls the endpoint and returns status + parsed body. Never throws. */
async function callEndpoint(opts: {
  authHeader?: string;
  body: Record<string, unknown>;
}): Promise<{ httpStatus: number; body: Record<string, unknown> }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.authHeader) headers["Authorization"] = opts.authHeader;

  try {
    const res = await fetch("/api/livekit-token", {
      method: "POST",
      headers,
      body: JSON.stringify(opts.body),
    });
    let body: Record<string, unknown> = {};
    try { body = await res.json(); } catch { /* ignore parse error */ }
    return { httpStatus: res.status, body };
  } catch {
    return { httpStatus: 0, body: { error: "Network error — is the endpoint reachable?" } };
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const LiveKitTest = () => {
  const { userId, profile, user } = useCurrentUser();
  const { data: rooms, loading: roomsLoading } = useAsync(() => getRooms(), []);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [results, setResults] = useState<Record<TestId, TestResult>>(INITIAL);

  const set = (id: TestId, r: TestResult) =>
    setResults((prev) => ({ ...prev, [id]: r }));

  /** Gets the current session's access_token — used internally, never displayed. */
  const getAccessToken = async (): Promise<string | null> => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  };

  // ── Test 1: No Authorization header → 401 ────────────────────────────────
  const runT401 = async () => {
    set("t401", { status: "running" });
    const { httpStatus, body } = await callEndpoint({ body: { roomId: "test" } });
    const pass = httpStatus === 401;
    set("t401", {
      status: pass ? "pass" : "fail",
      httpStatus,
      message: pass
        ? "Correctly rejected unauthenticated request"
        : `Expected 401 — got ${httpStatus}: ${String(body.error ?? "")}`,
    });
  };

  // ── Test 2: Auth present, body missing roomId → 400 ───────────────────────
  const runT400 = async () => {
    set("t400", { status: "running" });
    const tok = await getAccessToken();
    if (!tok) { set("t400", { status: "fail", message: "No active session." }); return; }
    const { httpStatus, body } = await callEndpoint({
      authHeader: `Bearer ${tok}`,
      body: {},
    });
    const pass = httpStatus === 400;
    set("t400", {
      status: pass ? "pass" : "fail",
      httpStatus,
      message: pass
        ? "Correctly rejected request with missing roomId"
        : `Expected 400 — got ${httpStatus}: ${String(body.error ?? "")}`,
    });
  };

  // ── Test 3: Auth present, nil UUID (never joined) → 403 ───────────────────
  const runT403 = async () => {
    set("t403", { status: "running" });
    const tok = await getAccessToken();
    if (!tok) { set("t403", { status: "fail", message: "No active session." }); return; }
    const { httpStatus, body } = await callEndpoint({
      authHeader: `Bearer ${tok}`,
      body: { roomId: "00000000-0000-0000-0000-000000000000" },
    });
    const pass = httpStatus === 403;
    set("t403", {
      status: pass ? "pass" : "fail",
      httpStatus,
      message: pass
        ? "Correctly rejected unauthorized room access"
        : `Expected 403 — got ${httpStatus}: ${String(body.error ?? "")}`,
    });
  };

  // ── Test 4: Registered participant, selected room → 200 ───────────────────
  const runT200 = async () => {
    if (!selectedRoomId) return;
    set("t200", { status: "running" });
    const tok = await getAccessToken();
    if (!tok) { set("t200", { status: "fail", message: "No active session." }); return; }
    const { httpStatus, body } = await callEndpoint({
      authHeader: `Bearer ${tok}`,
      body: { roomId: selectedRoomId },
    });
    if (httpStatus === 200) {
      const tokenExists = typeof body.token === "string" && body.token.length > 0;
      const livekitUrl = typeof body.livekitUrl === "string" ? body.livekitUrl : undefined;
      const pass = tokenExists && !!livekitUrl;
      set("t200", {
        status: pass ? "pass" : "fail",
        httpStatus,
        tokenExists,
        livekitUrl,
        message: pass
          ? "Token issued successfully"
          : "Got 200 but token or livekitUrl is missing — check server logs",
      });
    } else {
      set("t200", {
        status: "fail",
        httpStatus,
        message: httpStatus === 403
          ? "403 — you are not registered for this room. Go to the room detail page and click Join first."
          : httpStatus === 500
          ? "500 — a server env var is likely missing in Vercel (LIVEKIT_API_KEY, LIVEKIT_API_SECRET, SUPABASE_URL, or SUPABASE_ANON_KEY)."
          : `Expected 200 — got ${httpStatus}: ${String(body.error ?? "")}`,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">

      {/* Warning banner */}
      <div className="rounded-2xl border border-yellow-400/60 bg-yellow-50 px-5 py-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-yellow-800">
          Temporary QA tool — remove before production launch.
        </p>
      </div>

      {/* Header */}
      <header>
        <div className="flex items-center gap-2.5">
          <FlaskConical className="h-5 w-5 text-clay" />
          <h1 className="font-display text-3xl text-foreground">LiveKit endpoint tester</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Calls <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">/api/livekit-token</code> using your
          current logged-in session. Access token is used in requests but never displayed.
        </p>
      </header>

      {/* Current session */}
      <section className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-clay">Current session</p>
        <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-mono text-foreground">{user?.email ?? "—"}</dd>

          <dt className="text-muted-foreground">User ID</dt>
          <dd className="font-mono text-xs text-foreground break-all">{userId ?? "—"}</dd>

          <dt className="text-muted-foreground">Role</dt>
          <dd className="text-foreground">{profile?.role_type ?? "loading…"}</dd>

          <dt className="text-muted-foreground">Access token</dt>
          <dd className="text-muted-foreground italic text-xs">hidden — used in requests only</dd>
        </dl>
      </section>

      {/* Room selector */}
      <section className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-clay">Room selector (Test 4)</p>
        <p className="text-sm text-muted-foreground">
          Select a room you have already joined with <em>registered</em> status, or a room you host.
          If none appear, visit any room detail page and click "Join room" first.
        </p>
        {roomsLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading rooms…
          </div>
        ) : (rooms ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No rooms found in the database. Create one from the Recruiter Dashboard.
          </p>
        ) : (
          <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
            <SelectTrigger className="bg-cream">
              <SelectValue placeholder="Select a room…" />
            </SelectTrigger>
            <SelectContent>
              {(rooms ?? []).map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title}
                  <span className="ml-2 text-muted-foreground text-[11px]">({r.status})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedRoomId && (
          <p className="text-[11px] text-muted-foreground font-mono break-all">
            ID: {selectedRoomId}
          </p>
        )}
      </section>

      {/* Test cards */}
      <div className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-clay">Tests</p>

        <ResultCard
          id="t401"
          label="Test 1 — Missing Authorization header"
          description="No Bearer token sent → should return 401"
          expectedStatus={401}
          result={results.t401}
          onRun={runT401}
        />
        <ResultCard
          id="t400"
          label="Test 2 — Missing roomId"
          description="Authenticated request, empty body → should return 400"
          expectedStatus={400}
          result={results.t400}
          onRun={runT400}
        />
        <ResultCard
          id="t403"
          label="Test 3 — Unauthorized room"
          description="Nil UUID (never joined, not host) → should return 403"
          expectedStatus={403}
          result={results.t403}
          onRun={runT403}
        />
        <ResultCard
          id="t200"
          label="Test 4 — Registered participant"
          description={
            selectedRoomId
              ? `Room ${selectedRoomId.slice(0, 8)}… → should return 200 with token + livekitUrl`
              : "Select a room above to enable this test"
          }
          expectedStatus={200}
          result={results.t200}
          onRun={runT200}
          disabled={!selectedRoomId}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ResultCard
// ---------------------------------------------------------------------------

interface ResultCardProps {
  id: TestId;
  label: string;
  description: string;
  expectedStatus: number;
  result: TestResult;
  onRun: () => void;
  disabled?: boolean;
}

const ResultCard = ({
  label,
  description,
  expectedStatus,
  result,
  onRun,
  disabled = false,
}: ResultCardProps) => {
  const running = result.status === "running";
  const pass = result.status === "pass";
  const fail = result.status === "fail";

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors",
        pass && "border-olive/40 bg-olive/5",
        fail && "border-destructive/30 bg-destructive/5",
        !pass && !fail && "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Status icon */}
          <span className="mt-0.5 shrink-0">
            {pass    && <CheckCircle2 className="h-4 w-4 text-olive" />}
            {fail    && <XCircle      className="h-4 w-4 text-destructive" />}
            {running && <Loader2      className="h-4 w-4 animate-spin text-muted-foreground" />}
            {result.status === "idle" && (
              <CircleDot className="h-4 w-4 text-border" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground leading-snug">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>

        <Button
          size="sm"
          variant="soft"
          onClick={onRun}
          disabled={running || disabled}
          className="shrink-0"
        >
          {running ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Running…</>
          ) : (
            "Run"
          )}
        </Button>
      </div>

      {/* Result details */}
      {(pass || fail) && (
        <dl className="mt-3 ml-7 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1 text-xs">
          {result.httpStatus !== undefined && (
            <>
              <dt className="text-muted-foreground">HTTP status</dt>
              <dd>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    pass ? "text-olive" : "text-destructive",
                  )}
                >
                  {result.httpStatus}
                </span>
                {pass && (
                  <span className="text-muted-foreground ml-1.5">
                    (expected {expectedStatus} ✓)
                  </span>
                )}
              </dd>
            </>
          )}
          {result.message && (
            <>
              <dt className="text-muted-foreground">Detail</dt>
              <dd className={cn(pass ? "text-foreground/80" : "text-destructive/90")}>
                {result.message}
              </dd>
            </>
          )}
          {result.livekitUrl && (
            <>
              <dt className="text-muted-foreground">livekitUrl</dt>
              <dd className="font-mono break-all">{result.livekitUrl}</dd>
            </>
          )}
          {result.tokenExists !== undefined && (
            <>
              <dt className="text-muted-foreground">token exists</dt>
              <dd className={cn("font-semibold", result.tokenExists ? "text-olive" : "text-destructive")}>
                {String(result.tokenExists)}
                {result.tokenExists && (
                  <span className="text-muted-foreground font-normal ml-1.5">(not displayed)</span>
                )}
              </dd>
            </>
          )}
        </dl>
      )}
    </div>
  );
};

export default LiveKitTest;
