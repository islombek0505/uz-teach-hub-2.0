import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createHash } from "node:crypto";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r: any) => r.role === "admin")) {
    throw new Error("Forbidden: admin only");
  }
}

export const createBunnyVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
    const apiKey = process.env.BUNNY_STREAM_API_KEY!;
    const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: { AccessKey: apiKey, "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({ title: data.title }),
    });
    if (!res.ok) throw new Error(`Bunny create video failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { guid: string };
    const videoId = json.guid;
    const expireSec = Math.floor(Date.now() / 1000) + 60 * 60 * 6; // 6h
    const signature = createHash("sha256")
      .update(`${libraryId}${apiKey}${expireSec}${videoId}`)
      .digest("hex");
    return {
      videoId,
      libraryId,
      signature,
      expire: expireSec,
      endpoint: "https://video.bunnycdn.com/tusupload",
    };
  });

export const deleteBunnyVideo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { videoId: string }) => d)
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
    const apiKey = process.env.BUNNY_STREAM_API_KEY!;
    await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${data.videoId}`, {
      method: "DELETE",
      headers: { AccessKey: apiKey },
    });
    return { ok: true };
  });