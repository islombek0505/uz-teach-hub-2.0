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
  watch_time_seconds: number;
  quiz_attempts: number;
  avg_quiz_score: number | null;
  last_activity_at: string | null;
};

export const getStudentsStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StudentStatRow[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [
      { data: roles },
      { data: profiles },
      { data: progress },
      { data: plans },
      { data: lessons },
      { data: quizzes },
    ] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role").eq("role", "student"),
      supabaseAdmin.from("profiles").select("id, full_name, phone, avatar_url, created_at, email"),
      supabaseAdmin
        .from("lesson_progress")
        .select("user_id, lesson_id, completed, watched_seconds, updated_at"),
      supabaseAdmin.from("user_plan").select("user_id, expires_at, is_trial, plans(id, title)"),
      supabaseAdmin.from("lessons").select("id, type"),
      supabaseAdmin.from("quiz_attempts").select("user_id, score"),
    ]);

    const studentIds = new Set((roles ?? []).map((r: any) => r.user_id));
    const profMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const videoLessonSet = new Set(
      (lessons ?? []).filter((l: any) => l.type === "video").map((l: any) => l.id),
    );

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
    const watchByUser = new Map<string, number>();
    const lastActivityByUser = new Map<string, string>();
    for (const p of progress ?? []) {
      watchByUser.set(p.user_id, (watchByUser.get(p.user_id) ?? 0) + (p.watched_seconds ?? 0));
      const prev = lastActivityByUser.get(p.user_id);
      if (p.updated_at && (!prev || p.updated_at > prev))
        lastActivityByUser.set(p.user_id, p.updated_at);
      if (!p.completed) continue;
      completedByUser.set(p.user_id, (completedByUser.get(p.user_id) ?? 0) + 1);
      if (videoLessonSet.has(p.lesson_id)) {
        videosByUser.set(p.user_id, (videosByUser.get(p.user_id) ?? 0) + 1);
      }
    }

    // quiz aggregation
    const quizCountByUser = new Map<string, number>();
    const quizScoreSumByUser = new Map<string, number>();
    for (const q of quizzes ?? []) {
      quizCountByUser.set(q.user_id, (quizCountByUser.get(q.user_id) ?? 0) + 1);
      quizScoreSumByUser.set(
        q.user_id,
        (quizScoreSumByUser.get(q.user_id) ?? 0) + Number(q.score ?? 0),
      );
    }

    // active subs
    const coursesByUser = new Map<string, { id: string; title: string }[]>();
    const now = Date.now();
    for (const s of (plans as any[]) ?? []) {
      if (s.expires_at && new Date(s.expires_at).getTime() < now) continue;
      const plan = s.plans;
      if (!plan) continue;
      const arr = coursesByUser.get(s.user_id) ?? [];
      if (!arr.find((c) => c.id === plan.id)) arr.push({ id: plan.id, title: plan.title });
      coursesByUser.set(s.user_id, arr);
    }

    const rows: StudentStatRow[] = [];
    for (const id of studentIds) {
      const p: any = profMap.get(id) ?? {};
      const qCount = quizCountByUser.get(id) ?? 0;
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
        watch_time_seconds: watchByUser.get(id) ?? 0,
        quiz_attempts: qCount,
        avg_quiz_score: qCount ? Math.round((quizScoreSumByUser.get(id) ?? 0) / qCount) : null,
        last_activity_at: lastActivityByUser.get(id) ?? null,
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

export type StudentActivityItem = {
  lesson_id: string;
  lesson_title: string;
  course_title: string | null;
  type: string | null;
  completed: boolean;
  updated_at: string;
  watched_seconds: number;
};

export type StudentQuizItem = {
  lesson_id: string;
  lesson_title: string;
  score: number;
  passed: boolean;
  created_at: string;
};

export type StudentPaymentItem = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  plan_title: string | null;
};

export type StudentSubscription = {
  plan_title: string | null;
  is_trial: boolean;
  started_at: string | null;
  expires_at: string | null;
  status: "active" | "expired" | "none";
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
    headline: string | null;
    experience_years: number | null;
    expertise: string[];
    telegram_url: string | null;
    instagram_url: string | null;
    bio: string | null;
    created_at: string;
    updated_at: string | null;
    trial_activated_at: string | null;
    last_sign_in_at: string | null;
  };
  totals: {
    videos_watched: number;
    lessons_completed: number;
    total_lessons: number;
    lessons_in_progress: number;
    active_courses: number;
    courses_enrolled: number;
    quiz_attempts: number;
    watch_time_seconds: number;
    avg_quiz_score: number | null;
    quiz_passed: number;
    overall_percent: number;
    active_days: number;
    account_age_days: number;
    last_activity_at: string | null;
  };
  subscription: StudentSubscription;
  quiz: {
    attempts: number;
    avg_score: number | null;
    best_score: number | null;
    worst_score: number | null;
    passed: number;
    all: StudentQuizItem[];
  };
  activity: StudentActivityItem[];
  payments: StudentPaymentItem[];
  courses: StudentCourseDetail[];
};

export const getStudentDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { studentId: string }) => d)
  .handler(async ({ data, context }): Promise<StudentDetail> => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const sid = data.studentId;

    const [
      { data: profile },
      { data: progress },
      { data: userPlan },
      { data: attempts },
      { data: payments },
    ] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("id", sid).maybeSingle(),
      supabaseAdmin
        .from("lesson_progress")
        .select("lesson_id, completed, course_id, watched_seconds, updated_at")
        .eq("user_id", sid),
      supabaseAdmin
        .from("user_plan")
        .select("expires_at, is_trial, started_at, plans(title)")
        .eq("user_id", sid)
        .maybeSingle(),
      supabaseAdmin
        .from("quiz_attempts")
        .select("lesson_id, score, passed, created_at")
        .eq("user_id", sid)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("payments")
        .select("id, amount, status, created_at, plans(title)")
        .eq("user_id", sid)
        .order("created_at", { ascending: false }),
    ]);
    if (!profile) throw new Error("Student topilmadi");

    const { data: au } = await supabaseAdmin.auth.admin.getUserById(sid);
    const lastSignIn = au?.user?.last_sign_in_at ?? null;

    const now = Date.now();
    const activeCourseIds = new Set<string>();
    const up = userPlan as any;
    const hasActivePlan = !!up && (!up.expires_at || new Date(up.expires_at).getTime() > now);
    for (const p of progress ?? []) if (p.course_id) activeCourseIds.add(p.course_id);

    const completedLessons = new Set(
      (progress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id),
    );

    // Lesson + course title maps (for activity feed + quiz feed)
    const lessonIds = new Set<string>();
    for (const p of progress ?? []) lessonIds.add(p.lesson_id);
    for (const q of attempts ?? []) lessonIds.add(q.lesson_id);
    const lessonMap = new Map<string, { title: string; type: string }>();
    if (lessonIds.size > 0) {
      const { data: lessonRows } = await supabaseAdmin
        .from("lessons")
        .select("id, title, type")
        .in("id", Array.from(lessonIds));
      for (const l of lessonRows ?? [])
        lessonMap.set((l as any).id, { title: (l as any).title, type: (l as any).type });
    }

    const courseTitleMap = new Map<string, string>();
    const courses: StudentCourseDetail[] = [];
    if (activeCourseIds.size > 0) {
      const { data: cs } = await supabaseAdmin
        .from("courses")
        .select("id, title, modules(id, title, position, lessons(id, title, type, position))")
        .in("id", Array.from(activeCourseIds));
      for (const c of cs ?? []) {
        courseTitleMap.set((c as any).id, (c as any).title);
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
              return {
                id: l.id,
                title: l.title,
                type: l.type,
                position: l.position,
                completed: done,
              };
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
    courses.sort((a, b) => b.percent - a.percent);

    // Activity timeline — most recent progress touches
    const activity: StudentActivityItem[] = (progress ?? [])
      .filter((p: any) => p.updated_at)
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 30)
      .map((p: any) => ({
        lesson_id: p.lesson_id,
        lesson_title: lessonMap.get(p.lesson_id)?.title ?? "Noma'lum dars",
        course_title: p.course_id ? (courseTitleMap.get(p.course_id) ?? null) : null,
        type: lessonMap.get(p.lesson_id)?.type ?? null,
        completed: !!p.completed,
        updated_at: p.updated_at,
        watched_seconds: p.watched_seconds ?? 0,
      }));

    // Quiz performance
    const quizScores = (attempts ?? []).map((q: any) => Number(q.score ?? 0));
    const quizAvg = quizScores.length
      ? Math.round(quizScores.reduce((s: number, v: number) => s + v, 0) / quizScores.length)
      : null;
    const quizBest = quizScores.length ? Math.max(...quizScores) : null;
    const quizWorst = quizScores.length ? Math.min(...quizScores) : null;
    const quizPassed = (attempts ?? []).filter((q: any) => q.passed).length;
    const quizAll: StudentQuizItem[] = (attempts ?? []).slice(0, 100).map((q: any) => ({
      lesson_id: q.lesson_id,
      lesson_title: lessonMap.get(q.lesson_id)?.title ?? "Noma'lum test",
      score: Number(q.score ?? 0),
      passed: !!q.passed,
      created_at: q.created_at,
    }));

    const watchTime = (progress ?? []).reduce(
      (s: number, p: any) => s + (p.watched_seconds ?? 0),
      0,
    );
    const lessonsInProgress = (progress ?? []).filter(
      (p: any) => !p.completed && (p.watched_seconds ?? 0) > 0,
    ).length;
    const lastActivity = activity.length ? activity[0].updated_at : null;

    // distinct active days
    const activeDaySet = new Set<string>();
    for (const p of progress ?? [])
      if (p.updated_at) activeDaySet.add(new Date(p.updated_at).toISOString().slice(0, 10));

    const videosWatched = courses.reduce((s, c) => s + c.watched_videos, 0);
    const lessonsCompleted = courses.reduce((s, c) => s + c.completed_lessons, 0);
    const totalLessons = courses.reduce((s, c) => s + c.total_lessons, 0);
    const overallPercent = totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
    const accountAgeDays = profile.created_at
      ? Math.max(0, Math.floor((now - new Date(profile.created_at).getTime()) / 86400000))
      : 0;

    const subscription: StudentSubscription = up
      ? {
          plan_title: up.plans?.title ?? (up.is_trial ? "Sinov muddati" : null),
          is_trial: !!up.is_trial,
          started_at: up.started_at ?? null,
          expires_at: up.expires_at ?? null,
          status: hasActivePlan ? "active" : "expired",
        }
      : { plan_title: null, is_trial: false, started_at: null, expires_at: null, status: "none" };

    const paymentsOut: StudentPaymentItem[] = (payments ?? []).map((p: any) => ({
      id: p.id,
      amount: Number(p.amount ?? 0),
      status: p.status,
      created_at: p.created_at,
      plan_title: p.plans?.title ?? null,
    }));

    return {
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        avatar_url: profile.avatar_url,
        city: profile.city,
        birth_date: profile.birth_date,
        headline: profile.headline ?? null,
        experience_years: profile.experience_years ?? null,
        expertise: profile.expertise ?? [],
        telegram_url: profile.telegram_url,
        instagram_url: profile.instagram_url,
        bio: profile.bio,
        created_at: profile.created_at,
        updated_at: profile.updated_at ?? null,
        trial_activated_at: profile.trial_activated_at ?? null,
        last_sign_in_at: lastSignIn,
      },
      totals: {
        videos_watched: videosWatched,
        lessons_completed: lessonsCompleted,
        total_lessons: totalLessons,
        lessons_in_progress: lessonsInProgress,
        active_courses: hasActivePlan ? Array.from(activeCourseIds).length : 0,
        courses_enrolled: activeCourseIds.size,
        quiz_attempts: (attempts ?? []).length,
        watch_time_seconds: watchTime,
        avg_quiz_score: quizAvg,
        quiz_passed: quizPassed,
        overall_percent: overallPercent,
        active_days: activeDaySet.size,
        account_age_days: accountAgeDays,
        last_activity_at: lastActivity,
      },
      subscription,
      quiz: {
        attempts: (attempts ?? []).length,
        avg_score: quizAvg,
        best_score: quizBest,
        worst_score: quizWorst,
        passed: quizPassed,
        all: quizAll,
      },
      activity,
      payments: paymentsOut,
      courses,
    };
  });
