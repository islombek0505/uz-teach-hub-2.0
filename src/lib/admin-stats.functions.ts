import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!(data ?? []).some((r: any) => r.role === "admin")) {
    throw new Error("Forbidden: admin only");
  }
}

export type StudentStatRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  videos_watched: number;
  lessons_completed: number;
  active_courses: { id: string; title: string }[];
};

export const getStudentsStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudentStatRow[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: roles }, { data: profiles }, { data: progress }, { data: subs }, { data: lessons }] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role").eq("role", "student"),
      supabaseAdmin.from("profiles").select("id, full_name, phone, avatar_url, created_at, email"),
      supabaseAdmin.from("lesson_progress").select("user_id, lesson_id, completed"),
      supabaseAdmin.from("subscriptions").select("user_id, course_id, active, expires_at, courses(id, title)"),
      supabaseAdmin.from("lessons").select("id, type"),
    ]);

    const studentIds = new Set((roles ?? []).map((r: any) => r.user_id));
    const profMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const videoLessonSet = new Set((lessons ?? []).filter((l: any) => l.type === "video").map((l: any) => l.id));

    // last_sign_in_at via auth admin
    const signInMap = new Map<string, string | null>();
    let page = 1;
    while (true) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) break;
      for (const u of data.users) signInMap.set(u.id, u.last_sign_in_at ?? null);
      if (data.users.length < 1000) break;
      page++;
      if (page > 10) break;
    }

    // progress aggregation
    const videosByUser = new Map<string, number>();
    const completedByUser = new Map<string, number>();
    for (const p of progress ?? []) {
      if (!p.completed) continue;
      completedByUser.set(p.user_id, (completedByUser.get(p.user_id) ?? 0) + 1);
      if (videoLessonSet.has(p.lesson_id)) {
        videosByUser.set(p.user_id, (videosByUser.get(p.user_id) ?? 0) + 1);
      }
    }

    // active subs
    const coursesByUser = new Map<string, { id: string; title: string }[]>();
    const now = Date.now();
    for (const s of subs ?? []) {
      if (!s.active) continue;
      if (s.expires_at && new Date(s.expires_at).getTime() < now) continue;
      const course = (s as any).courses;
      if (!course) continue;
      const arr = coursesByUser.get(s.user_id) ?? [];
      if (!arr.find((c) => c.id === course.id)) arr.push({ id: course.id, title: course.title });
      coursesByUser.set(s.user_id, arr);
    }

    const rows: StudentStatRow[] = [];
    for (const id of studentIds) {
      const p: any = profMap.get(id) ?? {};
      rows.push({
        id,
        full_name: p.full_name ?? null,
        phone: p.phone ?? null,
        email: p.email ?? null,
        avatar_url: p.avatar_url ?? null,
        created_at: p.created_at ?? new Date(0).toISOString(),
        last_sign_in_at: signInMap.get(id) ?? null,
        videos_watched: videosByUser.get(id) ?? 0,
        lessons_completed: completedByUser.get(id) ?? 0,
        active_courses: coursesByUser.get(id) ?? [],
      });
    }
    return rows;
  });

export type StudentCourseDetail = {
  course_id: string;
  course_title: string;
  total_lessons: number;
  completed_lessons: number;
  total_videos: number;
  watched_videos: number;
  percent: number;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: string;
      position: number;
      completed: boolean;
    }[];
  }[];
};

export type StudentDetail = {
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
    avatar_url: string | null;
    city: string | null;
    birth_date: string | null;
    telegram_url: string | null;
    instagram_url: string | null;
    bio: string | null;
    created_at: string;
    last_sign_in_at: string | null;
  };
  totals: {
    videos_watched: number;
    lessons_completed: number;
    active_courses: number;
    quiz_attempts: number;
  };
  courses: StudentCourseDetail[];
};

export const getStudentDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { studentId: string }) => d)
  .handler(async ({ data, context }): Promise<StudentDetail> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sid = data.studentId;

    const [{ data: profile }, { data: progress }, { data: subs }, { data: attempts }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", sid).maybeSingle(),
      supabaseAdmin.from("lesson_progress").select("lesson_id, completed, course_id").eq("user_id", sid),
      supabaseAdmin.from("subscriptions").select("course_id, active, expires_at").eq("user_id", sid),
      supabaseAdmin.from("quiz_attempts").select("id").eq("user_id", sid),
    ]);
    if (!profile) throw new Error("Student topilmadi");

    const { data: au } = await supabaseAdmin.auth.admin.getUserById(sid);
    const lastSignIn = au?.user?.last_sign_in_at ?? null;

    const now = Date.now();
    const activeCourseIds = new Set(
      (subs ?? [])
        .filter((s: any) => s.active && (!s.expires_at || new Date(s.expires_at).getTime() > now))
        .map((s: any) => s.course_id),
    );
    // Include any course they have progress in even if not currently active
    for (const p of progress ?? []) activeCourseIds.add(p.course_id);

    const completedLessons = new Set((progress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));

    const courses: StudentCourseDetail[] = [];
    if (activeCourseIds.size > 0) {
      const { data: cs } = await supabaseAdmin
        .from("courses")
        .select("id, title, modules(id, title, position, lessons(id, title, type, position))")
        .in("id", Array.from(activeCourseIds));
      for (const c of cs ?? []) {
        const mods = ((c as any).modules ?? []).sort((a: any, b: any) => a.position - b.position);
        let total = 0;
        let completed = 0;
        let totalVideos = 0;
        let watchedVideos = 0;
        const modulesOut = mods.map((m: any) => {
          const lessonsOut = (m.lessons ?? [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((l: any) => {
              const done = completedLessons.has(l.id);
              total += 1;
              if (done) completed += 1;
              if (l.type === "video") {
                totalVideos += 1;
                if (done) watchedVideos += 1;
              }
              return { id: l.id, title: l.title, type: l.type, position: l.position, completed: done };
            });
          return { id: m.id, title: m.title, lessons: lessonsOut };
        });
        courses.push({
          course_id: c.id,
          course_title: c.title,
          total_lessons: total,
          completed_lessons: completed,
          total_videos: totalVideos,
          watched_videos: watchedVideos,
          percent: total ? Math.round((completed / total) * 100) : 0,
          modules: modulesOut,
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
        last_sign_in_at: lastSignIn,
      },
      totals: {
        videos_watched: videosWatched,
        lessons_completed: lessonsCompleted,
        active_courses: Array.from(activeCourseIds).length,
        quiz_attempts: (attempts ?? []).length,
      },
      courses,
    };
  });