import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, ShieldCheck, ListChecks, Paperclip, Eye, Presentation } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { getLessonPlayback } from "@/lib/bunny.functions";
import { PresentationSlidesViewer } from "@/components/presentation-viewer";

export const Route = createFileRoute("/app/courses/$courseId/lessons/$lessonId")({
  component: LessonPlayer,
  notFoundComponent: () => <div className="p-10 text-center">Dars topilmadi</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

function LessonPlayer() {
  const { courseId, lessonId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const fetchPlayback = useServerFn(getLessonPlayback);

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "lesson", lessonId, user?.id],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
          .select("id, title, modules(id, title, position, lessons(id, title, type, position, has_quiz, pass_threshold, description, content, presentation_slides))")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      if (!course) throw notFound();
      course.modules = (course.modules ?? []).sort((a: any, b: any) => a.position - b.position);
      for (const m of course.modules) m.lessons = (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position);
      const allLessons = course.modules.flatMap((m: any) => m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })));
      const lesson = allLessons.find((l: any) => l.id === lessonId);
      if (!lesson) throw notFound();

      const [{ data: progress }, { data: questions }, { data: attempts }, { data: materials }] = await Promise.all([
        supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user!.id).eq("course_id", courseId),
        lesson.has_quiz ? supabase.from("quiz_questions").select("*").eq("lesson_id", lessonId).order("position") : Promise.resolve({ data: [] as any[] }),
        lesson.has_quiz ? supabase.from("quiz_attempts").select("score, passed").eq("user_id", user!.id).eq("lesson_id", lessonId).order("created_at", { ascending: false }).limit(1) : Promise.resolve({ data: [] as any[] }),
        supabase.from("lesson_materials").select("*").eq("lesson_id", lessonId).order("created_at"),
      ]);
      const completedSet = new Set((progress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));
      return { course, allLessons, lesson, completedSet, questions: questions ?? [], lastAttempt: attempts?.[0] ?? null, materials: materials ?? [] };
    },
  });

  // Fetch signed playback URL only for video lessons
  const { data: playback, error: playbackError, isLoading: playbackLoading } = useQuery({
    enabled: !!data && data.lesson.type === "video",
    queryKey: ["playback", lessonId, user?.id],
    queryFn: async () => fetchPlayback({ data: { lessonId } }),
    retry: false,
  });

  const [tab, setTab] = useState("content");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => { setTab("content"); setAnswers({}); setSubmitted(false); setScore(0); }, [lessonId]);

  if (isLoading || !data) return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  const { course, allLessons, lesson, completedSet, questions, lastAttempt, materials } = data;
  const idx = allLessons.findIndex((l: any) => l.id === lessonId);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const threshold = lesson.pass_threshold ?? 80;

  const markCompleted = async () => {
    if (completedSet.has(lesson.id)) return;
    const { error } = await supabase.from("lesson_progress").upsert(
      { user_id: user!.id, lesson_id: lesson.id, course_id: courseId, completed: true },
      { onConflict: "user_id,lesson_id" },
    );
    if (error) toast.error(error.message);
    else { toast.success("Dars yakunlandi"); qc.invalidateQueries({ queryKey: ["app", "lesson", lessonId] }); qc.invalidateQueries({ queryKey: ["app", "course", courseId] }); }
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) return toast.error("Barcha savollarga javob bering");
    const correct = questions.filter((q: any) => answers[q.id] === q.correct_index).length;
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= threshold;
    setScore(pct); setSubmitted(true);
    await supabase.from("quiz_attempts").insert({ user_id: user!.id, lesson_id: lesson.id, score: pct, passed, answers });
    if (passed) {
      await supabase.from("lesson_progress").upsert(
        { user_id: user!.id, lesson_id: lesson.id, course_id: courseId, completed: true },
        { onConflict: "user_id,lesson_id" },
      );
      qc.invalidateQueries({ queryKey: ["app", "course", courseId] });
      toast.success(`Ajoyib! ${pct}% — keyingi darsga o'tishingiz mumkin`);
    } else toast.error(`Siz ${pct}% to'pladingiz. Kamida ${threshold}% kerak.`);
  };

  const goNext = () => {
    if (next) navigate({ to: "/app/courses/$courseId/lessons/$lessonId", params: { courseId, lessonId: next.id } });
    else navigate({ to: "/app/courses/$courseId", params: { courseId } });
  };

  const watermark = playback?.watermark ? maskPhone(playback.watermark) : "";
  const lessonDone = completedSet.has(lesson.id);

  return (
    <>
      <Topbar title={course.title} />
      <main className="flex-1 p-4 lg:p-6">
        <Link to="/app/courses/$courseId" params={{ courseId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Kursga qaytish
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {lesson.type === "video" && (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                {playback?.embedUrl ? (
                  <iframe
                    src={playback.embedUrl}
                    title={lesson.title}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                ) : playbackError ? (
                  <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-red-300">
                    Video yuklab bo'lmadi: {(playbackError as Error).message}
                  </div>
                ) : playbackLoading ? (
                  <div className="absolute inset-0 grid place-items-center text-white/60">Video yuklanmoqda...</div>
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-white/60">Video mavjud emas</div>
                )}
                {watermark && (
                  <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs text-white/80 backdrop-blur-sm">
                    {watermark}
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{lesson.moduleTitle}</Badge>
                {lesson.type === "video" && <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" /> Himoyalangan</Badge>}
                {lessonDone && <Badge className="bg-success text-success-foreground"><CheckCircle2 className="mr-1 h-3 w-3" /> Yakunlangan</Badge>}
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold lg:text-3xl">{lesson.title}</h1>
              {lesson.description && <p className="mt-2 text-muted-foreground">{lesson.description}</p>}
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="content">Tavsif</TabsTrigger>
                {(lesson.content || lesson.type === "presentation" || lesson.type === "text") && <TabsTrigger value="presentation">Materiallar</TabsTrigger>}
                {materials.length > 0 && <TabsTrigger value="files">Fayllar ({materials.length})</TabsTrigger>}
                {lesson.has_quiz && <TabsTrigger value="quiz">Test</TabsTrigger>}
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <Card><CardContent className="prose prose-sm max-w-none p-6">
                  <p>{lesson.description || `Bu darsda "${lesson.title}" mavzusi ko'rib chiqiladi.`}</p>
                  <p>{lesson.has_quiz ? `Darsdan keyin test bor — kamida ${threshold}% kerak.` : "Darsni yakunlagach keyingi darsga o'ting."}</p>
                  {!lesson.has_quiz && !lessonDone && (
                    <Button onClick={markCompleted} className="mt-2"><CheckCircle2 className="mr-2 h-4 w-4" /> Yakunlandi deb belgilash</Button>
                  )}
                </CardContent></Card>
              </TabsContent>

              {(lesson.content || lesson.type === "presentation" || lesson.type === "text") && (
                <TabsContent value="presentation" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {lesson.content ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                      ) : (
                        <div className="text-sm text-muted-foreground">Bu dars uchun qo'shimcha mazmun qo'shilmagan.</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {materials.length > 0 && (
                <TabsContent value="files" className="mt-4">
                  <Card>
                    <CardContent className="space-y-2 p-4">
                      {materials.map((m: any) => <MaterialItem key={m.id} material={m} />)}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {lesson.has_quiz && (
                <TabsContent value="quiz" className="mt-4">
                  <Card>
                    <CardContent className="space-y-6 p-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><ListChecks className="h-6 w-6" /></div>
                        <div>
                          <h3 className="font-display text-lg font-semibold">Dars yakunidagi test</h3>
                          <p className="text-sm text-muted-foreground">Keyingi darsga o'tish uchun {threshold}%+ ball to'plang</p>
                        </div>
                      </div>

                      {questions.length === 0 && (
                        <div className="rounded-lg border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">Test savollari hali qo'shilmagan.</div>
                      )}

                      {submitted && (
                        <div className={`rounded-lg p-4 ${score >= threshold ? "bg-success/10 border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"}`}>
                          <div className="font-display text-2xl font-bold">{score}%</div>
                          <div className="text-sm">{score >= threshold ? "Ajoyib! Keyingi darsga o'ting." : `Kamida ${threshold}% kerak.`}</div>
                        </div>
                      )}
                      {!submitted && lastAttempt && (
                        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                          Oxirgi urinish: <strong>{lastAttempt.score}%</strong> {lastAttempt.passed ? "✅" : "❌"}
                        </div>
                      )}

                      {questions.map((q: any, qi: number) => (
                        <div key={q.id} className="space-y-3">
                          <div className="font-medium">{qi + 1}. {q.question}</div>
                          <RadioGroup value={answers[q.id]?.toString()} onValueChange={(v) => setAnswers({ ...answers, [q.id]: Number(v) })} disabled={submitted}>
                            {(q.options as string[]).map((opt: string, oi: number) => {
                              const selected = answers[q.id] === oi;
                              const correct = submitted && oi === q.correct_index;
                              const wrong = submitted && selected && oi !== q.correct_index;
                              return (
                                <div key={oi} className={`flex items-center gap-3 rounded-lg border p-3 ${correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : ""}`}>
                                  <RadioGroupItem value={oi.toString()} id={`${q.id}-${oi}`} />
                                  <Label htmlFor={`${q.id}-${oi}`} className="flex-1 cursor-pointer">{opt}</Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </div>
                      ))}

                      {questions.length > 0 && (
                        <div className="flex gap-3">
                          {!submitted ? (
                            <Button onClick={submitQuiz} size="lg">Testni topshirish</Button>
                          ) : score >= threshold ? (
                            <Button onClick={goNext} size="lg">Keyingi darsga o'tish <ChevronRight className="ml-1 h-4 w-4" /></Button>
                          ) : (
                            <Button onClick={() => { setSubmitted(false); setAnswers({}); }} size="lg" variant="outline">Qaytadan urinish</Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {Array.isArray(lesson.presentation_slides) && lesson.presentation_slides.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Presentation className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Dars prezentatsiyasi</h2>
                </div>
                <p className="text-sm text-muted-foreground">Slaydlarni keyingi/oldingi tugmalari bilan ko'rib chiqing. Yuklab olish imkoni yo'q.</p>
                <PresentationSlidesViewer
                  slides={lesson.presentation_slides as string[]}
                  title={lesson.title}
                />
              </section>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <Button variant="outline" disabled={!prev} onClick={() => prev && navigate({ to: "/app/courses/$courseId/lessons/$lessonId", params: { courseId, lessonId: prev.id } })}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Oldingi
              </Button>
              {lesson.has_quiz && !lessonDone ? (
                <Button onClick={() => setTab("quiz")}>Test ishlash</Button>
              ) : (
                <Button onClick={goNext} disabled={!next}>Keyingi <ChevronRight className="ml-1 h-4 w-4" /></Button>
              )}
            </div>
          </div>

          <aside className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3 font-display font-semibold">Kurs darslari</h3>
                <LessonSidebarAccordion
                  modules={course.modules}
                  courseId={courseId}
                  currentLessonId={lessonId}
                  currentModuleId={lesson.module_id ?? course.modules.find((m: any) => m.lessons.some((l: any) => l.id === lessonId))?.id}
                  completedSet={completedSet}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}

function maskPhone(s: string) {
  const digits = s.replace(/\D+/g, "");
  if (digits.length < 7) return s;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} *** ** ${digits.slice(-2)}`;
}

function MaterialItem({ material }: { material: any }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!open || url) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.storage.from("materials").createSignedUrl(material.storage_path, 60 * 60);
      if (!cancelled) setUrl(data?.signedUrl ?? null);
    })();
    return () => { cancelled = true; };
  }, [open, url, material.storage_path]);

  const mime = (material.mime_type ?? "").toLowerCase();
  const isImage = mime.startsWith("image/");
  const isPdf = mime.includes("pdf");

  return (
    <div className="rounded-md border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50"
      >
        <Paperclip className="h-4 w-4 text-primary" />
        <div className="flex-1">
          <div className="text-sm font-medium">{material.name}</div>
          <div className="text-xs text-muted-foreground">
            {material.mime_type ?? ""} {material.size_bytes ? `• ${Math.round(material.size_bytes / 1024)} KB` : ""}
          </div>
        </div>
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{open ? "Yopish" : "Ko'rish"}</span>
      </button>
      {open && (
        <div className="border-t p-3" onContextMenu={(e) => e.preventDefault()}>
          {!url ? (
            <div className="grid aspect-video place-items-center text-sm text-muted-foreground">Yuklanmoqda...</div>
          ) : isImage ? (
            <img src={url} alt={material.name} draggable={false} className="mx-auto max-h-[70vh] w-full select-none object-contain" />
          ) : isPdf ? (
            <iframe src={`${url}#toolbar=0&navpanes=0`} title={material.name} className="block h-[70vh] w-full bg-white" />
          ) : (
            <div className="rounded-md border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              Bu fayl turi sahifada ko'rsatilmaydi. Yuklab olish ham yopilgan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LessonSidebarAccordion({
  modules, courseId, currentLessonId, currentModuleId, completedSet,
}: {
  modules: any[]; courseId: string; currentLessonId: string; currentModuleId: string | undefined; completedSet: Set<string>;
}) {
  const [openIds, setOpenIds] = useState<string[]>(currentModuleId ? [currentModuleId] : []);
  useEffect(() => {
    if (currentModuleId && !openIds.includes(currentModuleId)) setOpenIds((v) => [...v, currentModuleId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModuleId]);
  return (
    <Accordion type="multiple" value={openIds} onValueChange={setOpenIds} className="space-y-2">
      {modules.map((m: any) => {
        const isCurrent = m.id === currentModuleId;
        const total = m.lessons.length;
        const done = m.lessons.filter((l: any) => completedSet.has(l.id)).length;
        return (
          <AccordionItem
            key={m.id}
            value={m.id}
            className={`overflow-hidden rounded-lg border ${isCurrent ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30" : "bg-card"}`}
          >
            <AccordionTrigger className="px-3 py-2 hover:no-underline">
              <div className="flex w-full min-w-0 items-center gap-2 text-left">
                {isCurrent && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                <span className={`truncate text-sm font-medium ${isCurrent ? "text-primary" : ""}`}>{m.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{done}/{total}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-2 pb-2">
              <ul className="space-y-1">
                {m.lessons.map((l: any) => {
                  const active = l.id === currentLessonId;
                  const lDone = completedSet.has(l.id);
                  return (
                    <li key={l.id}>
                      <Link
                        to="/app/courses/$courseId/lessons/$lessonId"
                        params={{ courseId, lessonId: l.id }}
                        className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      >
                        {lDone ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" /> : <PlayCircle className="h-4 w-4 flex-shrink-0 opacity-60" />}
                        <span className="flex-1 truncate">{l.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}