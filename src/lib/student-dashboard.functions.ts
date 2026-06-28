import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Server-side data for the student dashboard (`/app`). Everything the page
// needs is fetched here in ONE authenticated round-trip instead of the old
// client-side waterfall (auth -> 5 queries -> lessons -> courses -> N signed
// URLs, each a separate browser->Supabase hop). The queries run server-side,
// close to the database, parallelised where possible.
//
// Uses `context.supabase` (the RLS client built from the user's bearer token
// by requireSupabaseAuth), so it sees exactly the same rows the user could
// read before — no privilege change.

export type DashboardSubscription = {
  is_trial: boolean;
  expires_at: string | null;
  plans: { title: string | null; duration_days: number | null } | null;
} | null;

export type DashboardData = {
  profile: { full_name: string | null; avatar_url: string | null } | null;
  activeSub: DashboardSubscription;
  progress: { lesson_id: string }[];
  recent: {
    lesson_id: string;
    updated_at: string | null;
    lessons: { title: string | null; type: string | null } | null;
  }[];
  avgScore: number | null;
  // Course rows keep the original `courses(*, modules(*, lessons(id)))` shape
  // (cover_url already signed) so the component can render them unchanged.
  courses: any[];
};

export const getStudentDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    const supabase = context.supabase;
    const userId = context.userId;

    // 1) Independent queries — all in parallel.
    const [{ data: prof }, { data: planRow }, { data: prog }, { data: attempts }, { data: rec }] =
      await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url").eq("id", userId).maybeSingle(),
        supabase
          .from("user_plan")
          .select("expires_at, is_trial, plans(title, duration_days)")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .eq("completed", true),
        supabase.from("quiz_attempts").select("score").eq("user_id", userId),
        supabase
          .from("lesson_progress")
          .select("lesson_id, updated_at, lessons(title, type)")
          .eq("user_id", userId)
          .eq("completed", true)
          .order("updated_at", { ascending: false })
          .limit(6),
      ]);

    const active =
      planRow && (!planRow.expires_at || new Date(planRow.expires_at) > new Date());
    const activeSub = active ? (planRow as DashboardSubscription) : null;

    const avgScore =
      attempts && attempts.length
        ? Math.round(
            attempts.reduce((s: number, a: any) => s + (a.score || 0), 0) / attempts.length,
          )
        : null;

    // 2) Resolve the user's active courses from their completed lessons.
    let courses: any[] = [];
    const recentLessonIds = (prog ?? []).slice(0, 50).map((p: any) => p.lesson_id);
    if (recentLessonIds.length) {
      const { data: ls } = await supabase
        .from("lessons")
        .select("module_id, modules(course_id)")
        .in("id", recentLessonIds);
      const cIds = Array.from(
        new Set(((ls ?? []) as any[]).map((l: any) => l.modules?.course_id).filter(Boolean)),
      );
      if (cIds.length) {
        const { data: cs } = await supabase
          .from("courses")
          .select("*, modules(*, lessons(id))")
          .in("id", cIds);
        courses = cs ?? [];
        // Sign private cover images server-side, in parallel.
        await Promise.all(
          courses.map(async (c: any) => {
            if (c.cover_url && !c.cover_url.startsWith("http")) {
              const { data: s } = await supabase.storage
                .from("course-covers")
                .createSignedUrl(c.cover_url, 60 * 60);
              c.cover_url = s?.signedUrl ?? null;
            }
          }),
        );
      }
    }

    return {
      profile: (prof as DashboardData["profile"]) ?? null,
      activeSub,
      progress: (prog as DashboardData["progress"]) ?? [],
      recent: (rec as DashboardData["recent"]) ?? [],
      avgScore,
      courses,
    };
  });
