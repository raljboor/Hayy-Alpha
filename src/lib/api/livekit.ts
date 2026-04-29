/**
 * LiveKit client API.
 *
 * Supabase mode: calls /api/livekit-token to obtain a signed token from the
 *   Vercel serverless function, then returns it along with the LiveKit URL.
 *
 * Mock mode: throws immediately — live audio is not available without
 *   a real Supabase session and a configured LiveKit project.
 *
 * This file must NEVER import livekit-server-sdk — that package is server-only.
 * Token generation lives exclusively in api/livekit-token.ts.
 */

import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LiveKitTokenResult {
  /** Signed JWT to pass to LiveKit room.connect() */
  token: string;
  /** wss:// URL of the LiveKit server */
  livekitUrl: string;
}

// ---------------------------------------------------------------------------
// getLiveKitToken
// ---------------------------------------------------------------------------

/**
 * Fetches a short-lived LiveKit access token for the given room.
 *
 * Throws with a human-readable message on any failure so callers can
 * show it directly in a toast.
 */
export async function getLiveKitToken(roomId: string): Promise<LiveKitTokenResult> {
  // Guard: no live audio in mock/demo mode
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Live audio rooms require a Supabase connection — running in mock mode.");
  }

  // Guard: VITE_LIVEKIT_URL must be set in the frontend env
  const livekitUrl = import.meta.env.VITE_LIVEKIT_URL as string | undefined;
  if (!livekitUrl) {
    throw new Error(
      "VITE_LIVEKIT_URL is not configured. Add it to your .env file and Vercel environment variables.",
    );
  }

  // Retrieve the current Supabase session access token
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    throw new Error("Not signed in — please sign in before joining a live room.");
  }

  // Call the Vercel serverless token endpoint
  let res: Response;
  try {
    res = await fetch("/api/livekit-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ roomId }),
    });
  } catch {
    throw new Error("Could not reach the live room service — check your connection and try again.");
  }

  // Handle error status codes with specific messages
  if (res.status === 401) {
    throw new Error("Your session has expired — please sign in again before joining.");
  }
  if (res.status === 403) {
    throw new Error("You are not registered for this room. Join from the room detail page first.");
  }
  if (res.status === 400) {
    throw new Error("Invalid request — roomId is missing or malformed.");
  }
  if (!res.ok) {
    let serverMessage = `Token request failed (HTTP ${res.status})`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) serverMessage = body.error;
    } catch {
      // ignore parse error
    }
    throw new Error(serverMessage);
  }

  // Parse and return the token payload
  const data = await res.json() as LiveKitTokenResult;

  if (!data.token || !data.livekitUrl) {
    throw new Error("Received an incomplete token response from the server.");
  }

  return data;
}
