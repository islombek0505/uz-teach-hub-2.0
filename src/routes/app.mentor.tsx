import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Users, BookOpen, ChevronRight, BarChart3, CheckCircle2, PlayCircle, Clock, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export const Route = createFileRoute("/app/mentor")({ component: MentorPortal });

function MentorPortal() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<any>(null);

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["mentor-portal", user?.id],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      const isMentor = (roles ?? []).some((r: any) => r.role === "mentor");
      if (!isMentor) return { isMentor: false, students: [] };

      const { data: subs } = await supabase
        .from("subscriptions")
        .select("user_id, course_id, active, expires_at, courses(title)")
        .eq("mentor_id", user!.id);
      const userIds = Array.from(new Set((subs ?? []).map((s: any) => s.user_id)));
      const profiles = userIds.length
        ? (await supabase
            .from("profiles")
            .select("id, full_name, phone, avatar_url")
            .in("id", userIds)).data ?? []
        : [];
      const pmap = new Map(profiles.map((p: any) => [p.id, p]));
      const students = (subs ?? []).map((s: any) => ({ ...s, profile: pmap.get(s.user_id) }));
      return { isMentor: true, students };
    },
  });

  if (isLoading || !data) {
    return (
      <>
        <Topbar title="Mentor paneli" />
        <main className="p-6 text-muted-foreground">Yuklanmoqda...</main>
      </>
    );
  }

  if (!data.isMentor) {
    return (
      <>
        <Topbar title="Mentor paneli" />
        <main className="p-6">
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Bu sahifa faqat mentorlar uchun.
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const active = data.students.filter((s: any) => s.active);
  const courses = new Set(data.students.map((s: any) => s.course_id));

  return (
    <>
      <Topbar title="Mentor paneli" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Faol o'quvchilar</div>
                <div className="font-display text-2xl font-bold">{active.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Kurslar</div>
                <div className="font-display text-2xl font-bold">{courses.size}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl font-semibold">Mening o'quvchilarim</h2>
          {data.students.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                Sizga hali o'quvchi biriktirilmagan
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {data.students.map((s: any) => (
                <Card key={`${s.user_id}-${s.course_id}`}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Avatar className="h-10 w-10">
                      {s.profile?.avatar_url ? <AvatarImage src={s.profile.avatar_url} alt={s.profile.full_name ?? ""} /> : null}
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {(s.profile?.full_name || "U").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{s.profile?.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {s.profile?.phone || "—"} • {s.courses?.title || "—"}
                      </div>
                    </div>
                    {s.active ? (
                      <Badge className="bg-success text-success-foreground">Faol</Badge>
                    ) : (
                      <Badge variant="outline">Yopiq</Badge>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelected(s)}>
                      <Eye className="mr-1 h-3.5 w-3.5" /> Ko'proq
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/app/courses/$courseId" params={{ courseId: s.course_id }}>
                        Kurs <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <StudentDetailDialog student={selected} onClose={() => setSelected(null)} />
      </main>
    </>
  );
}

function StudentDetailDialog({ student, onClose }: { student: any; onClose: () => void }) {
  const open = !!student;
  const { data } = useQuery({
    enabled: open,
    queryKey: ["mentor-student-detail", student?.user_id, student?.course_id],
    queryFn: async () => {
      const [modulesRes, lessonsRes, progressRes] = await Promise.all([
        supabase.from("modules").select("id, title, position").eq("course_id", student.course_id).order("position"),
        supabase
          .from("lessons")
          .select("id, module_id, title, position, duration_seconds, type")
          .eq("course_id", student.course_id)
          .order("position"),
        supabase
          .from("lesson_progress")
          .select("lesson_id, watched_seconds, completed, last_position, updated_at")
          .eq("user_id", student.user_id)
          .eq("course_id", student.course_id),
      ]);
      const modules = modulesRes.data ?? [];
      const lessons = lessonsRes.data ?? [];
      const progress = progressRes.data ?? [];
      const pmap = new Map(progress.map((p: any) => [p.lesson_id, p]));
      const lessonsWithP = lessons.map((l: any) => ({ ...l, progress: pmap.get(l.id) }));
      const total = lessons.length;
      const completed = progress.filter((p: any) => p.completed).length;
      const started = progress.length;
      const totalDuration = lessons.reduce((acc: number, l: any) => acc + (l.duration_seconds || 0), 0);
      const watched = progress.reduce((acc: number, p: any) => acc + (p.watched_seconds || 0), 0);
      const lastActivity = progress
        .map((p: any) => p.updated_at)
        .sort()
        .at(-1);
      const currentLesson = lessonsWithP.find((l: any) => l.progress && !l.progress.completed) ||
        lessonsWithP.find((l: any) => !l.progress);
      return { modules, lessonsWithP, total, completed, started, totalDuration, watched, lastActivity, currentLesson };
    },
  });

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}s ${m}d` : `${m}d`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {student?.profile?.avatar_url ? <AvatarImage src={student.profile.avatar_url} /> : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(student?.profile?.full_name || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="font-display">{student?.profile?.full_name || "—"}</DialogTitle>
              <DialogDescription>
                {student?.profile?.phone || "—"} • {student?.courses?.title || "—"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!data ? (
          <div className="py-10 text-center text-muted-foreground">Yuklanmoqda...</div>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-4">
              <StatCard icon={BookOpen} label="Jami darslar" value={String(data.total)} />
              <StatCard icon={CheckCircle2} label="Tugatilgan" value={String(data.completed)} accent="success" />
              <StatCard icon={PlayCircle} label="Boshlangan" value={String(data.started)} />
              <StatCard icon={Clock} label="Ko'rilgan" value={fmtTime(data.watched)} />
            </div>

            {/* Progress bar */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Umumiy taraqqiyot</span>
                <span className="text-muted-foreground">
                  {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%
                </span>
              </div>
              <Progress value={data.total > 0 ? (data.completed / data.total) * 100 : 0} />
              <div className="mt-2 text-xs text-muted-foreground">
                Oxirgi faollik: {data.lastActivity ? new Date(data.lastActivity).toLocaleString("uz-UZ") : "—"}
              </div>
            </div>

            {/* Current lesson */}
            {data.currentLesson && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                    <PlayCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Hozir o'qiyotgan dars</div>
                    <div className="font-semibold">{data.currentLesson.title}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-display text-base font-semibold">Darslar ketma-ketligi</h3>
              </div>
              <div className="space-y-5">
                {data.modules.map((m: any, mi: number) => {
                  const mLessons = data.lessonsWithP.filter((l: any) => l.module_id === m.id);
                  const mDone = mLessons.filter((l: any) => l.progress?.completed).length;
                  return (
                    <div key={m.id}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          Modul {mi + 1}: {m.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {mDone}/{mLessons.length}
                        </Badge>
                      </div>
                      <ol className="relative space-y-2 border-l-2 border-border pl-5">
                        {mLessons.map((l: any, li: number) => {
                          const done = l.progress?.completed;
                          const started = !!l.progress && !done;
                          const pct = l.duration_seconds
                            ? Math.min(100, Math.round(((l.progress?.watched_seconds || 0) / l.duration_seconds) * 100))
                            : done ? 100 : 0;
                          return (
                            <li key={l.id} className="relative">
                              <span
                                className={`absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border-2 ${
                                  done
                                    ? "border-success bg-success text-success-foreground"
                                    : started
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-muted-foreground"
                                }`}
                              >
                                {done ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <span className="text-[10px]">{li + 1}</span>
                                )}
                              </span>
                              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3">
                                <div className="flex-1 min-w-0">
                                  <div className="truncate text-sm font-medium">{l.title}</div>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    {done ? (
                                      <Badge className="bg-success text-success-foreground text-[10px]">Tugatildi</Badge>
                                    ) : started ? (
                                      <Badge className="bg-primary text-primary-foreground text-[10px]">Davom etmoqda</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-[10px]">Boshlanmagan</Badge>
                                    )}
                                    {l.duration_seconds ? <span>{fmtTime(l.duration_seconds)}</span> : null}
                                  </div>
                                  {(started || done) && l.duration_seconds ? (
                                    <div className="mt-2">
                                      <Progress value={pct} className="h-1" />
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                        {mLessons.length === 0 ? (
                          <li className="text-xs text-muted-foreground">Darslar yo'q</li>
                        ) : null}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: "success" }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className={`grid h-8 w-8 place-items-center rounded-md ${accent === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
        <div className="mt-2 font-display text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}