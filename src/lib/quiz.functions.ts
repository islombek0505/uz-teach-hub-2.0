import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

type DbClient = SupabaseClient<Database>;

// SECURITY: Quiz questions (and especially `correct_index`) are NOT readable by
// students through RLS — only admins and the service role can read them. These
// server functions verify course access, then read questions with the
// service-role client and grade on the server. The answer key never reaches the
// browser before submission, and a passing score can't be forged.

export type QuizQuestionPublic = {
  id: string;
  question: string;
  options: string[];
  position: number;
};

/** Loads the lesson via the admin client and asserts the user has access. */
async function loadLessonWithAccess(
  admin: DbClient,
  userId: string,
  lessonId: string,
): Promise<{ id: string; group_id: string | null; course_id: string | null; pass_threshold: number }> {
  const { data: lesson, error } = await admin
    .from("lessons")
    .select("id, group_id, course_id, pass_threshold")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!lesson) throw new Error("Dars topilmadi");
  if (!lesson.group_id) throw new Error("Forbidden: dars guruhga biriktirilmagan");

  const { data: access } = await admin.rpc("is_group_member", {
    _user_id: userId,
    _group_id: lesson.group_id,
  });
  if (!access) throw new Error("Forbidden: guruhga a'zo emassiz");
  return lesson;
}

// Public questions (no answer key) for an enrolled user.
export const getQuizQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId: string }) => d)
  .handler(async ({ data, context }): Promise<QuizQuestionPublic[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await loadLessonWithAccess(supabaseAdmin, context.userId, data.lessonId);

    const { data: qs, error } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, question, options, position")
      .eq("lesson_id", data.lessonId)
      .order("position");
    if (error) throw error;

    return (qs ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: (q.options ?? []) as string[],
      position: q.position,
    }));
  });

export type QuizResult = {
  score: number;
  passed: boolean;
  threshold: number;
  // Per-question correct option index — returned only AFTER submission so the
  // UI can highlight right/wrong answers.
  correctById: Record<string, number>;
};

// Grade a quiz attempt on the server and record it.
export const submitQuizAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId: string; answers: Record<string, number> }) => d)
  .handler(async ({ data, context }): Promise<QuizResult> => {
    const { userId, supabase } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const lesson = await loadLessonWithAccess(supabaseAdmin, userId, data.lessonId);
    const threshold = lesson.pass_threshold ?? 80;

    const { data: qs, error } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, correct_index")
      .eq("lesson_id", data.lessonId);
    if (error) throw error;

    const questions = qs ?? [];
    if (questions.length === 0) throw new Error("Test savollari yo'q");

    const answers = data.answers ?? {};
    let correct = 0;
    const correctById: Record<string, number> = {};
    for (const q of questions) {
      correctById[q.id] = q.correct_index;
      if (answers[q.id] === q.correct_index) correct += 1;
    }
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= threshold;

    // Writes go through the user-scoped client so RLS still enforces
    // user_id = auth.uid() on the attempt and progress rows.
    const { error: attemptErr } = await supabase.from("quiz_attempts").insert({
      user_id: userId,
      lesson_id: data.lessonId,
      score,
      passed,
      answers,
    });
    if (attemptErr) throw attemptErr;

    if (passed) {
      const { error: progressErr } = await supabase.from("lesson_progress").upsert(
        {
          user_id: userId,
          lesson_id: data.lessonId,
          group_id: lesson.group_id,
          course_id: lesson.course_id,
          completed: true,
        },
        { onConflict: "user_id,lesson_id" },
      );
      if (progressErr) throw progressErr;
    }

    return { score, passed, threshold, correctById };
  });
