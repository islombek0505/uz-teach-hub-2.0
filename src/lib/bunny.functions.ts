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

export const getLessonPlayback = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: lesson, error } = await supabase
      .from("lessons")
      .select("id, course_id, bunny_video_id, bunny_library_id, type")
      .eq("id", data.lessonId)
      .maybeSingle();
    if (error) throw error;
    if (!lesson) throw new Error("Lesson topilmadi");

    // Access check: admin OR has_course_access
    const { data: access } = await supabase.rpc("has_course_access", {
      _user_id: userId,
      _course_id: lesson.course_id,
    });
    if (!access) throw new Error("Forbidden: kursga obuna yo'q");

    if (lesson.type !== "video" || !lesson.bunny_video_id) {
      return { embedUrl: null as string | null };
    }
    const libraryId = lesson.bunny_library_id ?? process.env.BUNNY_STREAM_LIBRARY_ID!;
    const videoId = lesson.bunny_video_id;
    const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
    const expires = Math.floor(Date.now() / 1000) + 60 * 15; // 15 min
    let url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`;
    if (tokenKey) {
      const token = createHash("sha256").update(`${tokenKey}${videoId}${expires}`).digest("hex");
      url += `&token=${token}&expires=${expires}`;
    }
    // Fetch user phone for watermark
    const { data: profile } = await supabase.from("profiles").select("phone, full_name").eq("id", userId).maybeSingle();
    return { embedUrl: url, watermark: profile?.phone ?? profile?.full_name ?? "user" };
  });