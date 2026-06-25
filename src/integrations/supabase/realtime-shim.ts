import type { SupabaseClientOptions } from "@supabase/supabase-js";

// This app does NOT use Supabase Realtime (no .channel()/.subscribe() anywhere).
//
// On Node.js < 22 there is no global `WebSocket`, and supabase-js v2 resolves a
// WebSocket transport eagerly when the client is constructed — throwing
// "Node.js 20 detected without native WebSocket support". That breaks every
// server function that builds a Supabase client (video playback, quiz, admin
// stats, password reset).
//
// Since we never open a realtime connection, we hand the client a harmless
// placeholder transport on environments that lack a native WebSocket. It
// satisfies construction and is never instantiated. Browsers (and Node 22+)
// keep using their native WebSocket, so nothing else changes.

class UnusedRealtimeTransport {
  constructor() {
    // Only reached if realtime is ever actually used (it isn't). Fail loudly
    // rather than silently, so a future regression is obvious.
    throw new Error("Supabase Realtime is not configured for server-side use in this app.");
  }
}

/**
 * Returns `realtime` client options that avoid the Node<22 WebSocket throw on
 * the server, or `undefined` where a native WebSocket exists (browser, Node 22+).
 */
export function realtimeShim(): SupabaseClientOptions<"public">["realtime"] {
  if (typeof WebSocket === "undefined") {
    return { transport: UnusedRealtimeTransport as unknown as typeof WebSocket };
  }
  return undefined;
}
