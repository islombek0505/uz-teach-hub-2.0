import { c as createServerRpc } from "./createServerRpc-DkUaG_nY.mjs";
import { a as createServerFn } from "./server-B51iIGrX.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BCSfl_Vl.mjs";
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
const getStudentsStats_createServerFn_handler = createServerRpc({
  id: "b015bb2731f1868381610b6fbd12897e996bd035169b632d203eebda96727b7d",
  name: "getStudentsStats",
  filename: "src/lib/admin-stats.functions.ts"
}, (opts) => getStudentsStats.__executeServer(opts));
const getStudentsStats = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getStudentsStats_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const [{
    data: roles
  }, {
    data: profiles
  }, {
    data: progress
  }, {
    data: plans
  }, {
    data: lessons
  }] = await Promise.all([supabaseAdmin.from("user_roles").select("user_id, role").eq("role", "student"), supabaseAdmin.from("profiles").select("id, full_name, phone, avatar_url, created_at, email"), supabaseAdmin.from("lesson_progress").select("user_id, lesson_id, completed"), supabaseAdmin.from("user_plan").select("user_id, expires_at, is_trial, plans(id, title)"), supabaseAdmin.from("lessons").select("id, type")]);
  const studentIds = new Set((roles ?? []).map((r) => r.user_id));
  const profMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const videoLessonSet = new Set((lessons ?? []).filter((l) => l.type === "video").map((l) => l.id));
  const signInMap = /* @__PURE__ */ new Map();
  let page = 1;
  while (true) {
    const {
      data,
      error
    } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1e3
    });
    if (error) break;
    for (const u of data.users) signInMap.set(u.id, u.last_sign_in_at ?? null);
    if (data.users.length < 1e3) break;
    page++;
    if (page > 10) break;
  }
  const videosByUser = /* @__PURE__ */ new Map();
  const completedByUser = /* @__PURE__ */ new Map();
  for (const p of progress ?? []) {
    if (!p.completed) continue;
    completedByUser.set(p.user_id, (completedByUser.get(p.user_id) ?? 0) + 1);
    if (videoLessonSet.has(p.lesson_id)) {
      videosByUser.set(p.user_id, (videosByUser.get(p.user_id) ?? 0) + 1);
    }
  }
  const coursesByUser = /* @__PURE__ */ new Map();
  const now = Date.now();
  for (const s of plans ?? []) {
    if (s.expires_at && new Date(s.expires_at).getTime() < now) continue;
    const plan = s.plans;
    if (!plan) continue;
    const arr = coursesByUser.get(s.user_id) ?? [];
    if (!arr.find((c) => c.id === plan.id)) arr.push({
      id: plan.id,
      title: plan.title
    });
    coursesByUser.set(s.user_id, arr);
  }
  const rows = [];
  for (const id of studentIds) {
    const p = profMap.get(id) ?? {};
    rows.push({
      id,
      full_name: p.full_name ?? null,
      phone: p.phone ?? null,
      email: p.email ?? null,
      avatar_url: p.avatar_url ?? null,
      created_at: p.created_at ?? (/* @__PURE__ */ new Date(0)).toISOString(),
      last_sign_in_at: signInMap.get(id) ?? null,
      videos_watched: videosByUser.get(id) ?? 0,
      lessons_completed: completedByUser.get(id) ?? 0,
      active_courses: coursesByUser.get(id) ?? []
    });
  }
  return rows;
});
const getStudentDetail_createServerFn_handler = createServerRpc({
  id: "4efd53305823dc2db639567b5dcc33cdcb94a75c0f2464be2ce62e976f8016b7",
  name: "getStudentDetail",
  filename: "src/lib/admin-stats.functions.ts"
}, (opts) => getStudentDetail.__executeServer(opts));
const getStudentDetail = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(getStudentDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.supabase, context.userId);
  const {
    supabaseAdmin
  } = await import("./client.server-D5ro3rAQ.mjs");
  const sid = data.studentId;
  const [{
    data: profile
  }, {
    data: progress
  }, {
    data: userPlan
  }, {
    data: attempts
  }] = await Promise.all([supabaseAdmin.from("profiles").select("*").eq("id", sid).maybeSingle(), supabaseAdmin.from("lesson_progress").select("lesson_id, completed, course_id").eq("user_id", sid), supabaseAdmin.from("user_plan").select("expires_at, is_trial").eq("user_id", sid).maybeSingle(), supabaseAdmin.from("quiz_attempts").select("id").eq("user_id", sid)]);
  if (!profile) throw new Error("Student topilmadi");
  const {
    data: au
  } = await supabaseAdmin.auth.admin.getUserById(sid);
  const lastSignIn = au?.user?.last_sign_in_at ?? null;
  const now = Date.now();
  const activeCourseIds = /* @__PURE__ */ new Set();
  const hasActivePlan = !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at).getTime() > now);
  for (const p of progress ?? []) activeCourseIds.add(p.course_id);
  const completedLessons = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
  const courses = [];
  if (activeCourseIds.size > 0) {
    const {
      data: cs
    } = await supabaseAdmin.from("courses").select("id, title, modules(id, title, position, lessons(id, title, type, position))").in("id", Array.from(activeCourseIds));
    for (const c of cs ?? []) {
      const mods = (c.modules ?? []).sort((a, b) => a.position - b.position);
      let total = 0;
      let completed = 0;
      let totalVideos = 0;
      let watchedVideos = 0;
      const modulesOut = mods.map((m) => {
        const lessonsOut = (m.lessons ?? []).sort((a, b) => a.position - b.position).map((l) => {
          const done = completedLessons.has(l.id);
          total += 1;
          if (done) completed += 1;
          if (l.type === "video") {
            totalVideos += 1;
            if (done) watchedVideos += 1;
          }
          return {
            id: l.id,
            title: l.title,
            type: l.type,
            position: l.position,
            completed: done
          };
        });
        return {
          id: m.id,
          title: m.title,
          lessons: lessonsOut
        };
      });
      courses.push({
        course_id: c.id,
        course_title: c.title,
        total_lessons: total,
        completed_lessons: completed,
        total_videos: totalVideos,
        watched_videos: watchedVideos,
        percent: total ? Math.round(completed / total * 100) : 0,
        modules: modulesOut
      });
    }
  }
  const videosWatched = courses.reduce((s, c) => s + c.watched_videos, 0);
  const lessonsCompleted = courses.reduce((s, c) => s + c.completed_lessons, 0);
  return {
    profile: {
      id: profile.id,
      full_name: profile.full_name,
      phone: profile.phone,
      email: profile.email,
      avatar_url: profile.avatar_url,
      city: profile.city,
      birth_date: profile.birth_date,
      telegram_url: profile.telegram_url,
      instagram_url: profile.instagram_url,
      bio: profile.bio,
      created_at: profile.created_at,
      last_sign_in_at: lastSignIn
    },
    totals: {
      videos_watched: videosWatched,
      lessons_completed: lessonsCompleted,
      active_courses: hasActivePlan ? Array.from(activeCourseIds).length : 0,
      quiz_attempts: (attempts ?? []).length
    },
    courses
  };
});
export {
  getStudentDetail_createServerFn_handler,
  getStudentsStats_createServerFn_handler
};
