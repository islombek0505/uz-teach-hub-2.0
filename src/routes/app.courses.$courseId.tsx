import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courses } from "@/lib/mock-data";
import { PlayCircle, FileText, CheckCircle2, Lock, Clock, BookOpen, Award } from "lucide-react";

export const Route = createFileRoute("/app/courses/$courseId")({
  component: CourseDetail,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
  errorComponent: () => <div className="p-10 text-center">Xatolik yuz berdi</div>,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw notFound();

  const total = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const done = course.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);
  const pct = total ? Math.round((done / total) * 100) : 0;

  // Determine which lessons are accessible in strict mode (sequential)
  let firstIncompleteFound = false;
  const lessonAccess: Record<string, "done" | "current" | "locked"> = {};
  course.modules.forEach((m) => {
    m.lessons.forEach((l) => {
      if (l.completed) lessonAccess[l.id] = "done";
      else if (!firstIncompleteFound) {
        lessonAccess[l.id] = "current";
        firstIncompleteFound = true;
      } else lessonAccess[l.id] = course.mode === "strict" ? "locked" : "current";
    });
  });

  return (
    <>
      <Topbar title={course.title} />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/5] bg-cover bg-center" style={{ backgroundImage: `url(${course.cover})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant={course.mode === "strict" ? "default" : "outline"} className="border-white/30 bg-white/10 backdrop-blur-sm text-white">
                  {course.mode === "strict" ? "Qat'iy rejim — ketma-ket" : "Erkin rejim — barcha darslar ochiq"}
                </Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold lg:text-4xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {total} dars</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.totalDuration}</span>
                <span className="flex items-center gap-1.5"><Award className="h-4 w-4" /> Sertifikat</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium">Sizning taraqqiyot</div>
              <div className="mt-1 text-xs text-muted-foreground">{done} ta dars yakunlangan, {total - done} ta qoldi</div>
            </div>
            <div className="w-full sm:w-1/2">
              <div className="flex justify-between text-xs text-muted-foreground"><span>{pct}%</span></div>
              <Progress value={pct} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 font-display text-xl font-semibold">Modullar</h2>
          <Accordion type="multiple" defaultValue={["m1"]} className="space-y-2">
            {course.modules.map((m, idx) => {
              const mDone = m.lessons.filter(l => l.completed).length;
              return (
                <AccordionItem key={m.id} value={m.id} className="overflow-hidden rounded-lg border bg-card">
                  <AccordionTrigger className="px-4 py-4 hover:no-underline">
                    <div className="flex w-full items-center gap-3 text-left">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-primary/10 font-display font-bold text-primary">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-display font-semibold">{m.title}</div>
                        <div className="text-xs text-muted-foreground">{m.lessons.length} dars • {mDone}/{m.lessons.length} yakunlangan</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t bg-muted/20 px-0 pb-0">
                    <ul className="divide-y">
                      {m.lessons.map((l, li) => {
                        const status = lessonAccess[l.id];
                        const locked = status === "locked";
                        const Icon = l.type === "presentation" ? FileText : PlayCircle;
                        return (
                          <li key={l.id}>
                            {locked ? (
                              <div className="flex items-center gap-3 px-4 py-3 opacity-60">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{li + 1}. {l.title}</div>
                                  <div className="text-xs text-muted-foreground">Oldingi darsni yakunlang</div>
                                </div>
                                <span className="text-xs text-muted-foreground">{l.duration}</span>
                              </div>
                            ) : (
                              <Link
                                to="/app/courses/$courseId/lessons/$lessonId"
                                params={{ courseId: course.id, lessonId: l.id }}
                                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                              >
                                {l.completed ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Icon className="h-5 w-5 text-primary" />}
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{li + 1}. {l.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {l.type === "video" && "Video"}
                                    {l.type === "presentation" && "Prezentatsiya"}
                                    {l.type === "text" && "Matn"}
                                    {l.hasQuiz && " • Test bor"}
                                    {l.quizScore && ` • Test: ${l.quizScore}%`}
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{l.duration}</span>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {course.modules.length === 0 && (
            <Card><CardContent className="p-10 text-center text-muted-foreground">Bu kursda hali modullar qo'shilmagan</CardContent></Card>
          )}
        </div>
      </main>
    </>
  );
}