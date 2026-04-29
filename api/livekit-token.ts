/**
 * Vercel serverless function: POST /api/livekit-token
 *
 * Issues a signed LiveKit access token to an authenticated Hayy user
 * who is registered for the requested room.
 *
 * Server-only env vars required (no VITE_ prefix — never exposed to browser):
 *   SUPABASE_URL, SUPABASE_ANON_KEY, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
 *
 * Frontend env var (VITE_ prefix — also readable here on the server):
 *   VITE_LIVEKIT_URL
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { AccessToken } from "livekit-server-sdk";

// ---------------------------------------------------------------------------
// Env — resolved once at cold-start; Vercel injects these at deploy time.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY ?? "";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET ?? "";
// VITE_ vars are available to Vercel functions even though the browser only
// receives them via Vite's build-time substitution.
const LIVEKIT_URL = process.env.VITE_LIVEKIT_URL ?? "";

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // POST only
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Guard: all server-side env vars must be present
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    console.error("[livekit-token] Missing required environment variables");
    res.status(500).json({ error: "Server is not configured for live rooms" });
    return;
  }

  // ---------------------------------------------------------------------------
  // 1. Extract + validate Authorization header
  // ---------------------------------------------------------------------------

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header" });
    return;
  }
  const accessToken = authHeader.slice(7);

  // ---------------------------------------------------------------------------
  // 2. Validate roomId from request body
  // ---------------------------------------------------------------------------

  const body = req.body as Record<string, unknown> | null;
  const roomId = body?.roomId;
  if (!roomId || typeof roomId !== "string" || roomId.trim() === "") {
    res.status(400).json({ error: "Request body must include a non-empty roomId string" });
    return;
  }

  // ---------------------------------------------------------------------------
  // 3. Verify the Supabase JWT — validates server-side via Supabase Auth API
  //    Uses anon key so no service role key is needed.
  // ---------------------------------------------------------------------------

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error: authError } = await anonClient.auth.getUser(accessToken);

  if (authError || !user) {
    res.status(401).json({ error: "Invalid or expired session token" });
    return;
  }

  // ---------------------------------------------------------------------------
  // 4. Check room membership — query as the authenticated user (RLS applies)
  //    User is allowed if:
  //      a) They have a room_participants row with attendance_status = 'registered'
  //      b) They are the host of the room (rooms.host_id = user.id)
  // ---------------------------------------------------------------------------

  // Create a client that makes requests as the authenticated user
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  // Check participant row
  const { data: participant } = await userClient
    .from("room_participants")
    .select("attendance_status")
    .eq("room_id", roomId)
    .eq("user_id", user.id)
    .maybeSingle();

  const isRegisteredParticipant = participant?.attendance_status === "registered";

  // Check host
  const { data: room } = await userClient
    .from("rooms")
    .select("host_id")
    .eq("id", roomId)
    .maybeSingle();

  const isHost = room?.host_id === user.id;

  if (!isRegisteredParticipant && !isHost) {
    res.status(403).json({ error: "You are not registered for this room" });
    return;
  }

  // ---------------------------------------------------------------------------
  // 5. Fetch display name from user_profiles (best-effort — falls back to email)
  // ---------------------------------------------------------------------------

  const { data: profile } = await userClient
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    (profile?.full_name as string | null | undefined) ||
    user.email ||
    user.id;

  // ---------------------------------------------------------------------------
  // 6. Issue LiveKit token
  //    - identity: Supabase user UUID (stable, unique)
  //    - name: display name shown to other participants
  //    - room: Supabase room UUID used as LiveKit room name (not guessable)
  //    - TTL: 2 hours — short enough to limit blast radius if leaked
  //    - grants: join room, publish audio (no video for Phase 10), subscribe
  // ---------------------------------------------------------------------------

  const livekitToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: user.id,
    name: displayName,
    ttl: "2h",
  });

  livekitToken.addGrant({
    roomJoin: true,
    room: roomId,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true, // needed for raise-hand data messages in a later phase
  });

  const jwt = await livekitToken.toJwt();

  res.status(200).json({ token: jwt, livekitUrl: LIVEKIT_URL });
}
