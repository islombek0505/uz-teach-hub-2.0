import { c as createServerRpc } from "./createServerRpc-DkUaG_nY.mjs";
import { a as createServerFn } from "./server-B51iIGrX.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BCSfl_Vl.mjs";
import { createHash } from "node:crypto";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function assertAdmin(supabase, userId) {
  const {
    data
  } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r) => r.role === "admin")) {
    throw new Error("Forbidden: admin only");
  }
}
const createBunnyVideo_createServerFn_handler = createServerRpc({
  id: "ec9f329ac6e2e6c860af70d32e72fbfd4ae44cdabbad18e6c8db716354c63001",
  name: "createBunnyVideo",
  filename: "src/lib/bunny.functions.ts"
}, (opts) => createBunnyVideo.__executeServer(opts));
const createBunnyVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createBunnyVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
    method: "POST",
    headers: {
      AccessKey: apiKey,
      "Content-Type": "application/json",
      accept: "application/json"
    },
    body: JSON.stringify({
      title: data.title
    })
  });
  if (!res.ok) throw new Error(`Bunny create video failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  const videoId = json.guid;
  const expireSec = Math.floor(Date.now() / 1e3) + 60 * 60 * 6;
  const signature = createHash("sha256").update(`${libraryId}${apiKey}${expireSec}${videoId}`).digest("hex");
  return {
    videoId,
    libraryId,
    signature,
    expire: expireSec,
    endpoint: "https://video.bunnycdn.com/tusupload"
  };
});
const deleteBunnyVideo_createServerFn_handler = createServerRpc({
  id: "b3a80860006869225425b5ff89af690e952f1ccd3f2a97f6d4e93119514822d3",
  name: "deleteBunnyVideo",
  filename: "src/lib/bunny.functions.ts"
}, (opts) => deleteBunnyVideo.__executeServer(opts));
const deleteBunnyVideo = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(deleteBunnyVideo_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;
  await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${data.videoId}`, {
    method: "DELETE",
    headers: {
      AccessKey: apiKey
    }
  });
  return {
    ok: true
  };
});
const getLessonPlayback_createServerFn_handler = createServerRpc({
  id: "5200432ce61ed2538961e1da440348eb4c6650f2370fa718d8e8991994daa9ec",
  name: "getLessonPlayback",
  filename: "src/lib/bunny.functions.ts"
}, (opts) => getLessonPlayback.__executeServer(opts));
const getLessonPlayback = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getLessonPlayback_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: lesson,
    error
  } = await supabase.from("lessons").select("id, course_id, bunny_video_id, bunny_library_id, type").eq("id", data.lessonId).maybeSingle();
  if (error) throw error;
  if (!lesson) throw new Error("Lesson topilmadi");
  const {
    data: access
  } = await supabase.rpc("has_course_access", {
    _user_id: userId,
    _course_id: lesson.course_id
  });
  if (!access) throw new Error("Forbidden: kursga obuna yo'q");
  if (lesson.type !== "video" || !lesson.bunny_video_id) {
    return {
      embedUrl: null
    };
  }
  const libraryId = lesson.bunny_library_id ?? process.env.BUNNY_STREAM_LIBRARY_ID;
  const videoId = lesson.bunny_video_id;
  const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
  const expires = Math.floor(Date.now() / 1e3) + 60 * 15;
  let url = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=false&preload=true`;
  if (tokenKey) {
    const token = createHash("sha256").update(`${tokenKey}${videoId}${expires}`).digest("hex");
    url += `&token=${token}&expires=${expires}`;
  }
  const {
    data: profile
  } = await supabase.from("profiles").select("phone, full_name").eq("id", userId).maybeSingle();
  return {
    embedUrl: url,
    watermark: profile?.phone ?? profile?.full_name ?? "user"
  };
});
export {
  createBunnyVideo_createServerFn_handler,
  deleteBunnyVideo_createServerFn_handler,
  getLessonPlayback_createServerFn_handler
};
