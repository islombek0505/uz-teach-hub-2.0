import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { courses } from "@/lib/mock-data";
import {
  PlayCircle,
  Pause,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Maximize2,
  Settings as SettingsIcon,
  Volume2,
  ShieldCheck,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/courses/$courseId/lessons/$lessonId")({
  component: LessonPlayer,
  notFoundComponent: () => <div className="p-10 text-center">Dars topilmadi</div>,
  errorComponent: () => <div className="p-10 text-center">Xatolik</div>,
});

const sampleQuiz = [
  { id: "q1", question: "JavaScript-da o'zgaruvchini e'lon qilish uchun qaysi kalit so'z ishlatiladi?", options: ["var, let, const", "int, string", "define, declare", "make, set"], correctIndex: 0 },
  { id: "q2", question: "HTML qaysi tilning qisqartmasi?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Markup Language"], correctIndex: 0 },
  { id: "q3", question: "CSS asosan nima uchun ishlatiladi?", options: ["Serverdagi ma'lumotlarni saqlash", "Sahifani dizayn qilish", "Database boshqaruvi", "API yaratish"], correctIndex: 1 },
];

function LessonPlayer() {
  const { courseId, lessonId } = Route.useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw notFound();

  const allLessons = course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[idx];
  if (!lesson) throw notFound();

  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const [tab, setTab] = useState("content");
  const [playing, setPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const score = (() => {
    if (!quizSubmitted) return 0;
    const correct = sampleQuiz.filter((q) => answers[q.id] === q.correctIndex).length;
    return Math.round((correct / sampleQuiz.length) * 100);
  })();

  const submitQuiz = () => {
    if (Object.keys(answers).length < sampleQuiz.length) return toast.error("Barcha savollarga javob bering");
    setQuizSubmitted(true);
    const correct = sampleQuiz.filter((q) => answers[q.id] === q.correctIndex).length;
    const pct = Math.round((correct / sampleQuiz.length) * 100);
    if (pct >= 80) toast.success(`Ajoyib! Siz ${pct}% to'pladingiz, keyingi darsga o'tishingiz mumkin`);
    else toast.error(`Siz ${pct}% to'pladingiz. Kamida 80% kerak, qaytadan urinib ko'ring`);
  };

  const goNext = () => {
    if (next) navigate({ to: "/app/courses/$courseId/lessons/$lessonId", params: { courseId, lessonId: next.id } });
    else navigate({ to: "/app/courses/$courseId", params: { courseId } });
  };

  return (
    <>
      <Topbar title={course.title} />
      <main className="flex-1 p-4 lg:p-6">
        <Link to="/app/courses/$courseId" params={{ courseId }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Kursga qaytish
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {/* Video player */}
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${course.cover})` }} />
              <div className="absolute inset-0 grid place-items-center">
                <button onClick={() => setPlaying(!playing)} className="grid h-20 w-20 place-items-center rounded-full bg-white/90 text-primary shadow-2xl transition-transform hover:scale-110">
                  {playing ? <Pause className="h-8 w-8 fill-current" /> : <PlayCircle className="h-12 w-12 fill-current" />}
                </button>
              </div>
              {/* Watermark — download protection */}
              <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-black/40 px-2 py-1 text-xs text-white/70 backdrop-blur-sm">
                +998 90 *** ** 67
              </div>
              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="h-1 rounded-full bg-white/20">
                  <div className="h-full w-1/3 rounded-full bg-primary-glow" />
                </div>
                <div className="mt-2 flex items-center gap-3 text-white">
                  <button onClick={() => setPlaying(!playing)}>{playing ? <Pause className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}</button>
                  <span className="text-xs">04:12 / {lesson.duration}</span>
                  <div className="ml-auto flex items-center gap-3">
                    <Volume2 className="h-4 w-4" />
                    <SettingsIcon className="h-4 w-4" />
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{lesson.moduleTitle}</Badge>
                <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" /> Himoyalangan</Badge>
              </div>
              <h1 className="mt-2 font-display text-2xl font-bold lg:text-3xl">{lesson.title}</h1>
              <p className="mt-2 text-muted-foreground">{lesson.description}</p>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="content">Tavsif</TabsTrigger>
                <TabsTrigger value="materials">Materiallar</TabsTrigger>
                {lesson.hasQuiz && <TabsTrigger value="quiz">Test</TabsTrigger>}
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <Card><CardContent className="prose prose-sm max-w-none p-6">
                  <p>Bu darsda biz <strong>{lesson.title}</strong> mavzusini batafsil ko'rib chiqamiz. Quyidagi mavzular qamrab olinadi:</p>
                  <ul>
                    <li>Asosiy tushunchalar va terminologiya</li>
                    <li>Amaliy misollar bilan tushuntirish</li>
                    <li>Eng ko'p uchraydigan xatolar</li>
                    <li>Best practices va tavsiyalar</li>
                  </ul>
                  <p>Darsdan keyin {lesson.hasQuiz ? "amaliy test bor, 80% va undan yuqori ball kerak" : "keyingi darsga o'tishingiz mumkin"}.</p>
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="materials" className="mt-4">
                <Card><CardContent className="space-y-2 p-6">
                  {[
                    { name: "Dars slaydlari.pdf", type: "Prezentatsiya" },
                    { name: "Manba kodlari.zip", type: "Kod" },
                    { name: "Qo'shimcha o'qish.pdf", type: "Material" },
                  ].map((f) => (
                    <div key={f.name} className="flex items-center gap-3 rounded-lg border p-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1"><div className="text-sm font-medium">{f.name}</div><div className="text-xs text-muted-foreground">{f.type}</div></div>
                      <Button size="sm" variant="outline" onClick={() => toast.info("Material onlayn ko'rinadi, yuklab olish o'chirilgan")}>Ko'rish</Button>
                    </div>
                  ))}
                  <div className="rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="mr-1 inline h-3.5 w-3.5" /> Materiallarni yuklab olish texnik jihatdan to'sib qo'yilgan
                  </div>
                </CardContent></Card>
              </TabsContent>
              {lesson.hasQuiz && (
                <TabsContent value="quiz" className="mt-4">
                  <Card>
                    <CardContent className="space-y-6 p-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><ListChecks className="h-6 w-6" /></div>
                        <div>
                          <h3 className="font-display text-lg font-semibold">Dars yakunidagi test</h3>
                          <p className="text-sm text-muted-foreground">Keyingi darsga o'tish uchun 80%+ ball to'plang</p>
                        </div>
                      </div>
                      {quizSubmitted && (
                        <div className={`rounded-lg p-4 ${score >= 80 ? "bg-success/10 text-success-foreground border border-success/30" : "bg-destructive/10 text-destructive border border-destructive/30"}`}>
                          <div className="font-display text-2xl font-bold">{score}%</div>
                          <div className="text-sm">{score >= 80 ? "Ajoyib! Keyingi darsga o'tishingiz mumkin" : "Kamida 80% kerak. Qaytadan urinib ko'ring."}</div>
                        </div>
                      )}
                      {sampleQuiz.map((q, qi) => (
                        <div key={q.id} className="space-y-3">
                          <div className="font-medium">{qi + 1}. {q.question}</div>
                          <RadioGroup value={answers[q.id]?.toString()} onValueChange={(v) => setAnswers({ ...answers, [q.id]: Number(v) })} disabled={quizSubmitted}>
                            {q.options.map((opt, oi) => {
                              const selected = answers[q.id] === oi;
                              const correct = quizSubmitted && oi === q.correctIndex;
                              const wrong = quizSubmitted && selected && oi !== q.correctIndex;
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
                      <div className="flex gap-3">
                        {!quizSubmitted ? (
                          <Button onClick={submitQuiz} size="lg">Testni topshirish</Button>
                        ) : score >= 80 ? (
                          <Button onClick={goNext} size="lg">Keyingi darsga o'tish <ChevronRight className="ml-1 h-4 w-4" /></Button>
                        ) : (
                          <Button onClick={() => { setQuizSubmitted(false); setAnswers({}); }} size="lg" variant="outline">Qaytadan urinish</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>

            {/* Bottom nav */}
            <div className="flex items-center justify-between border-t pt-4">
              <Button variant="outline" disabled={!prev} onClick={() => prev && navigate({ to: "/app/courses/$courseId/lessons/$lessonId", params: { courseId, lessonId: prev.id } })}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Oldingi
              </Button>
              {lesson.hasQuiz && !lesson.completed ? (
                <Button onClick={() => setTab("quiz")}>Test ishlash</Button>
              ) : (
                <Button onClick={goNext} disabled={!next}>Keyingi <ChevronRight className="ml-1 h-4 w-4" /></Button>
              )}
            </div>
          </div>

          {/* Sidebar: course outline */}
          <aside className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-3 font-display font-semibold">Kurs darslari</h3>
                <div className="space-y-4">
                  {course.modules.map((m) => (
                    <div key={m.id}>
                      <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">{m.title}</div>
                      <ul className="space-y-1">
                        {m.lessons.map((l) => {
                          const active = l.id === lessonId;
                          return (
                            <li key={l.id}>
                              <Link
                                to="/app/courses/$courseId/lessons/$lessonId"
                                params={{ courseId, lessonId: l.id }}
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                              >
                                {l.completed ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" /> : <PlayCircle className="h-4 w-4 flex-shrink-0 opacity-60" />}
                                <span className="flex-1 truncate">{l.title}</span>
                                <span className="text-xs opacity-70">{l.duration}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </>
  );
}