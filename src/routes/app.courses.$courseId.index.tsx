import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlayCircle, FileText, CheckCircle2, Lock, BookOpen, Presentation, Plus, X, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PresentationSlidesViewer } from "@/components/presentation-viewer";

export const Route = createFileRoute("/app/courses/$courseId/")({
  component: CourseDetail,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "course", courseId, user?.id],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*, modules(*, lessons(id, title, type, position, has_quiz))")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      if (!course) throw notFound();
      course.modules = (course.modules ?? []).sort((a: any, b: any) => a.position - b.position);
      for (const m of course.modules) m.lessons = (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position);

      if (course.cover_url && !course.cover_url.startsWith("http")) {
        const { data: signed } = await supabase.storage.from("course-covers").createSignedUrl(course.cover_url, 60 * 60);
        course.cover_url = signed?.signedUrl ?? null;
      }

      const { data: userPlan } = await supabase.from("user_plan").select("expires_at, is_trial").eq("user_id", user!.id).maybeSingle();
      const enrolled = !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at) > new Date());

      const { data: progress } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user!.id).eq("course_id", courseId);
      const completedSet = new Set((progress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));

      const { data: pres } = await supabase
        .from("course_presentations")
        .select("*")
        .eq("course_id", courseId)
        .order("position");
      const presentations: any[] = pres ?? [];

      return { course, enrolled, completedSet, presentations, isTrial: userPlan?.is_trial ?? false };
    },
  });

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  if (isLoading || !data) return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  const { course, enrolled, completedSet, presentations, isTrial } = data;

  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l: any) => completedSet.has(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const activeModule = course.modules.find((m: any) => m.id === activeModuleId) ?? course.modules[0];

  return (
    <>
      <Topbar title={course.title} />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/5] bg-muted bg-cover bg-center" style={course.cover_url ? { backgroundImage: `url(${course.cover_url})` } : undefined}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <div className="flex flex-wrap gap-2">
                {course.category && <Badge variant="secondary">{course.category}</Badge>}
                {enrolled && isTrial && <Badge className="bg-warning text-warning-foreground">Sinov</Badge>}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold lg:text-4xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {total} dars</span>
              </div>
            </div>
          </div>
        </div>

        {!enrolled ? (
          <Card className="border-warning/40 bg-warning/5">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">Akkountingiz aktiv emas</div>
                  <p className="text-sm text-muted-foreground">Video darslarni ko'rish uchun tarif sotib oling yoki 1 haftalik bepul sinovni boshlang.</p>
                </div>
              </div>
              <Button asChild size="lg"><Link to="/app/subscription">Tarif sotib olish</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium">Sizning taraqqiyotingiz</div>
                <div className="mt-1 text-xs text-muted-foreground">{done} ta dars yakunlangan, {total - done} ta qoldi</div>
              </div>
              <div className="w-full sm:w-1/2">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{pct}%</span></div>
                <Progress value={pct} className="mt-1" />
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Modullar</h2>
          {course.modules.length === 0 && (
            <Card><CardContent className="p-10 text-center text-muted-foreground">Bu kursda hali modullar qo'shilmagan</CardContent></Card>
          )}

          {course.modules.length > 0 && (
            <div className="rounded-2xl border bg-card p-4 sm:p-6">
              <div className="-mx-2 mb-2 flex gap-5 overflow-x-auto px-2 pb-2 sm:gap-8">
                {course.modules.map((m: any, idx: number) => {
                  const isActive = activeModule?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setActiveModuleId(m.id); setExpandedLessonId(null); }}
                      className={`shrink-0 font-display text-lg font-bold tracking-tight transition-colors sm:text-2xl ${
                        isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                    >
                      {idx + 1}-modul
                    </button>
                  );
                })}
              </div>

              {activeModule && (
                <div className="border-t">
                  {activeModule.lessons.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground">Bu modulda hali darslar yo'q.</div>
                  )}
                  <ul>
                    {activeModule.lessons.map((l: any, li: number) => {
                      const locked = !enrolled;
                      const done = completedSet.has(l.id);
                      const expanded = expandedLessonId === l.id;
                      const TypeIcon = l.type === "presentation" ? Presentation : l.type === "text" ? FileText : PlayCircle;
                      return (
                        <li key={l.id} className="border-b last:border-b-0">
                          <div className="flex items-center gap-4 py-4">
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors ${
                              done ? "bg-success text-success-foreground" : expanded ? "bg-foreground text-background" : "bg-muted text-foreground"
                            }`}>
                              {done ? <CheckCircle2 className="h-4 w-4" /> : li + 1}
                            </div>
                            <button
                              onClick={() => setExpandedLessonId(expanded ? null : l.id)}
                              className="min-w-0 flex-1 truncate text-left font-display text-base font-semibold sm:text-lg"
                            >
                              {l.title}
                            </button>
                            <button
                              onClick={() => setExpandedLessonId(expanded ? null : l.id)}
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-foreground/70 transition-colors hover:bg-muted"
                              aria-label={expanded ? "Yopish" : "Ochish"}
                            >
                              {expanded ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                          </div>
                          {expanded && (
                            <div className="space-y-3 pb-5 pl-[52px]">
                              <LessonSubRow
                                icon={<TypeIcon className="h-4 w-4" />}
                                label={l.type === "video" ? "Video darslik" : l.type === "presentation" ? "Prezentatsiya" : "Matn darslik"}
                                locked={locked}
                                href={!locked ? { courseId: course.id, lessonId: l.id } : undefined}
                              />
                              {l.has_quiz && (
                                <LessonSubRow
                                  icon={<FileText className="h-4 w-4" />}
                                  label="Yakuniy test"
                                  locked={locked}
                                  href={!locked ? { courseId: course.id, lessonId: l.id } : undefined}
                                />
                              )}
                              {locked && (
                                <p className="text-xs text-muted-foreground">Bu darslikni ochish uchun faol tarif kerak.</p>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {presentations.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Presentation className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Takrorlash prezentatsiyalari</h2>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              {enrolled ? "Bir nechta darsning qisqacha jamlanmasi. Tez takrorlash uchun." : "Faol tarif bilan prezentatsiyalar ochiladi."}
            </p>
            <div className="space-y-4">
              {presentations.map((p: any) => (
                <CoursePresentationCard key={p.id} item={p} locked={!enrolled} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function LessonSubRow({ icon, label, locked, href }: { icon: React.ReactNode; label: string; locked: boolean; href?: { courseId: string; lessonId: string } }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-lg px-3 py-2 transition-colors ${locked ? "opacity-70" : "hover:bg-muted"}`}>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border">
        {locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : icon}
      </div>
      <div className="min-w-0 flex-1 text-sm font-medium">{label}</div>
    </div>
  );
  if (!locked && href) {
    return <Link to="/app/courses/$courseId/lessons/$lessonId" params={href}>{inner}</Link>;
  }
  return inner;
}

function CoursePresentationCard({ item, locked = false }: { item: any; locked?: boolean }) {
  const [open, setOpen] = useState(false);
  const slides: string[] = Array.isArray(item.slides) ? item.slides : [];
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            {locked ? <Lock className="h-5 w-5" /> : <Presentation className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold">{item.title}</div>
            {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
          </div>
          <Badge variant="outline">{slides.length} slayd</Badge>
          <Button size="sm" variant={open ? "outline" : "default"} disabled={!slides.length || locked} onClick={() => setOpen((v) => !v)}>
            {locked ? "Yopiq" : open ? "Yopish" : "Ochish"}
          </Button>
        </div>
        {!locked && open && slides.length > 0 && <PresentationSlidesViewer slides={slides} title={item.title} />}
      </CardContent>
    </Card>
  );
}
