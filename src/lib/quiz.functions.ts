import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

type DbClient = SupabaseClient<Database>;

// SECURITY: Quiz questions are served WITHOUT `correct_index`, and grading
// happens on the server. The browser never receives the answer key before
// submitting, so a student cannot read the correct answers from devtools or
// fake a passing score by calling the DB directly.

export type QuizQuestionPublic = {
  id: string;
  question: string;
  options: string[];
  position: number;
};

async function loadLessonWithAccess(
  supabase: DbClient,
  userId: string,
  lessonId: string,
): Promise<{ id: string; course_id: string; pass_threshold: number }> {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, course_id, pass_threshold")
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!lesson) throw new Error("Dars topilmadi");

  const { data: access } = await supabase.rpc("has_course_access", {
    _user_id: userId,
    _course_id: lesson.course_id,
  });
  if (!access) throw new Error("Forbidden: kursga obuna yo'q");
  return lesson;
}

// Public questions (no answer key) for an enrolled user.
export const getQuizQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { lessonId: string }) => d)
  .handler(async ({ data, context }): Promise<QuizQuestionPublic[]> => {
    const { supabase, userId } = context;
    await loadLessonWithAccess(supabase, userId, data.lessonId);

    const { data: qs, error } = await supabase
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
    const { supabase, userId } = context;
    const lesson = await loadLessonWithAccess(supabase, userId, data.lessonId);
    const threshold = lesson.pass_threshold ?? 80;

    const { data: qs, error } = await supabase
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
          course_id: lesson.course_id,
          completed: true,
        },
        { onConflict: "user_id,lesson_id" },
      );
      if (progressErr) throw progressErr;
    }

    return { score, passed, threshold, correctById };
  });
