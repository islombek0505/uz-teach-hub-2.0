// Admin quiz editor — manages the quiz_questions for a single lesson.
// Admins can write quiz_questions directly through RLS ("Admins manage quiz
// questions"), so this uses the normal supabase client. On save it replaces the
// lesson's question set (delete + insert), then syncs lesson.has_quiz and
// lesson.pass_threshold so the test actually shows up for students.
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ListChecks,
  Plus,
  Trash2,
  Check,
  GripVertical,
  ArrowUp,
  ArrowDown,
  CircleCheck,
  Save,
} from "lucide-react";

type DraftQuestion = {
  question: string;
  options: string[];
  correct_index: number;
};

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

function blankQuestion(): DraftQuestion {
  return { question: "", options: ["", ""], correct_index: 0 };
}

export function QuizQuestionsEditor({
  lessonId,
  initialThreshold = 80,
  onSaved,
}: {
  lessonId: string;
  initialThreshold?: number;
  onSaved?: () => void;
}) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "quiz-questions", lessonId],
    queryFn: async (): Promise<DraftQuestion[]> => {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("question, options, correct_index, position")
        .eq("lesson_id", lessonId)
        .order("position");
      if (error) throw error;
      return (data ?? []).map((q: any) => ({
        question: q.question ?? "",
        options: Array.isArray(q.options) ? (q.options as string[]) : ["", ""],
        correct_index: q.correct_index ?? 0,
      }));
    },
  });

  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setQuestions(data);
      setDirty(false);
    }
  }, [data]);

  const mutate = (updater: (q: DraftQuestion[]) => DraftQuestion[]) => {
    setQuestions((prev) => updater(prev));
    setDirty(true);
  };

  const addQuestion = () => mutate((q) => [...q, blankQuestion()]);
  const removeQuestion = (i: number) => mutate((q) => q.filter((_, idx) => idx !== i));
  const moveQuestion = (i: number, dir: -1 | 1) =>
    mutate((q) => {
      const j = i + dir;
      if (j < 0 || j >= q.length) return q;
      const next = [...q];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const setQ = (i: number, patch: Partial<DraftQuestion>) =>
    mutate((q) => q.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const setOption = (qi: number, oi: number, value: string) =>
    mutate((q) =>
      q.map((item, idx) =>
        idx === qi
          ? { ...item, options: item.options.map((o, j) => (j === oi ? value : o)) }
          : item,
      ),
    );
  const addOption = (qi: number) =>
    mutate((q) =>
      q.map((item, idx) =>
        idx === qi && item.options.length < MAX_OPTIONS
          ? { ...item, options: [...item.options, ""] }
          : item,
      ),
    );
  const removeOption = (qi: number, oi: number) =>
    mutate((q) =>
      q.map((item, idx) => {
        if (idx !== qi || item.options.length <= MIN_OPTIONS) return item;
        const options = item.options.filter((_, j) => j !== oi);
        let correct = item.correct_index;
        if (oi === correct) correct = 0;
        else if (oi < correct) correct -= 1;
        return { ...item, options, correct_index: correct };
      }),
    );

  const validate = (): string | null => {
    if (questions.length === 0) return null; // empty = no test, allowed
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `${i + 1}-savol matni bo'sh.`;
      const filled = q.options.filter((o) => o.trim());
      if (filled.length < MIN_OPTIONS) return `${i + 1}-savolda kamida 2 ta variant bo'lsin.`;
      if (!q.options[q.correct_index]?.trim()) return `${i + 1}-savolda to'g'ri javobni belgilang.`;
    }
    if (threshold < 1 || threshold > 100) return "O'tish bali 1–100 oralig'ida bo'lsin.";
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) return toast.error(err);
    setSaving(true);
    try {
      // Replace the whole question set for this lesson.
      const { error: delErr } = await supabase
        .from("quiz_questions")
        .delete()
        .eq("lesson_id", lessonId);
      if (delErr) throw delErr;

      if (questions.length > 0) {
        const rows = questions.map((q, i) => ({
          lesson_id: lessonId,
          question: q.question.trim(),
          options: q.options.map((o) => o.trim()).filter(Boolean),
          correct_index: q.correct_index,
          position: i,
        }));
        const { error: insErr } = await supabase.from("quiz_questions").insert(rows);
        if (insErr) throw insErr;
      }

      // Keep the lesson flags in sync so the test shows (or hides) for students.
      const { error: lessErr } = await supabase
        .from("lessons")
        .update({ has_quiz: questions.length > 0, pass_threshold: threshold })
        .eq("id", lessonId);
      if (lessErr) throw lessErr;

      toast.success(questions.length > 0 ? "Test saqlandi" : "Test bo'sh — o'chirildi");
      setDirty(false);
      await refetch();
      onSaved?.();
    } catch (e: any) {
      toast.error(e.message ?? "Testni saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + threshold */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/30 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display font-semibold">Dars yakunidagi test</div>
            <div className="text-xs text-muted-foreground">
              {questions.length > 0 ? `${questions.length} ta savol` : "Hali savol qo'shilmagan"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="pass-threshold" className="whitespace-nowrap text-sm">
            O'tish bali
          </Label>
          <div className="relative w-24">
            <Input
              id="pass-threshold"
              type="number"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => {
                setThreshold(Number(e.target.value));
                setDirty(true);
              }}
              className="pr-7"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <ListChecks className="h-6 w-6" />
          </div>
          <div className="text-sm text-muted-foreground">
            Dars oxiriga test qo'shing. Har savolda kamida 2 ta variant va bitta to'g'ri javob
            bo'ladi.
          </div>
          <Button type="button" onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Birinchi savolni qo'shish
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, qi) => (
            <div key={qi} className="rounded-xl border bg-card shadow-sm">
              {/* Question header */}
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {qi + 1}
                </span>
                <span className="text-sm font-medium text-muted-foreground">savol</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={qi === 0}
                    onClick={() => moveQuestion(qi, -1)}
                    aria-label="Yuqoriga"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={qi === questions.length - 1}
                    onClick={() => moveQuestion(qi, 1)}
                    aria-label="Pastga"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeQuestion(qi)}
                    aria-label="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <Textarea
                  rows={2}
                  value={q.question}
                  onChange={(e) => setQ(qi, { question: e.target.value })}
                  placeholder="Savol matnini kiriting..."
                  className="resize-none font-medium"
                />

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CircleCheck className="h-3.5 w-3.5 text-success" />
                    To'g'ri javobni belgilang
                  </div>
                  {q.options.map((opt, oi) => {
                    const correct = q.correct_index === oi;
                    return (
                      <div key={oi} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQ(qi, { correct_index: oi })}
                          aria-label="To'g'ri javob deb belgilash"
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                            correct
                              ? "border-success bg-success text-success-foreground"
                              : "border-input text-transparent hover:border-success/50"
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <Input
                          value={opt}
                          onChange={(e) => setOption(qi, oi, e.target.value)}
                          placeholder={`${oi + 1}-variant`}
                          className={correct ? "border-success/40 bg-success/5" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground"
                          disabled={q.options.length <= MIN_OPTIONS}
                          onClick={() => removeOption(qi, oi)}
                          aria-label="Variantni o'chirish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                  {q.options.length < MAX_OPTIONS && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                      onClick={() => addOption(qi)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Variant qo'shish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addQuestion}
          >
            <Plus className="mr-2 h-4 w-4" /> Savol qo'shish
          </Button>
        </div>
      )}

      {/* Save bar */}
      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <div className="text-xs text-muted-foreground">
          {dirty ? (
            <span className="inline-flex items-center gap-1 text-warning">
              <GripVertical className="h-3.5 w-3.5" /> Saqlanmagan o'zgarishlar
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-success">
              <Check className="h-3.5 w-3.5" /> Saqlangan
            </span>
          )}
        </div>
        <Button type="button" onClick={save} disabled={saving || !dirty}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saqlanmoqda..." : "Testni saqlash"}
        </Button>
      </div>
    </div>
  );
}
