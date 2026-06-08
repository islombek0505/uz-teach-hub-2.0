import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, TrendingUp, PlayCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [subs, setSubs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [avgScore, setAvgScore] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: prof }, { data: subsData }, { data: prog }, { data: attempts }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("subscriptions").select("*, course:courses(*)").eq("user_id", user.id).eq("active", true),
        supabase.from("lesson_progress").select("*").eq("user_id", user.id).eq("completed", true),
        supabase.from("quiz_attempts").select("score").eq("user_id", user.id),
      ]);
      setProfile(prof);
      setSubs(subsData ?? []);
      setProgress(prog ?? []);
      const courseIds = (subsData ?? []).map((s: any) => s.course_id);
      if (courseIds.length) {
        const { data: cs } = await supabase.from("courses").select("*, modules(*, lessons(id))").in("id", courseIds);
        const list = cs ?? [];
        await Promise.all(list.map(async (c: any) => {
          if (c.cover_url && !c.cover_url.startsWith("http")) {
            const { data: s } = await supabase.storage.from("course-covers").createSignedUrl(c.cover_url, 60 * 60);
            c.cover_url = s?.signedUrl ?? null;
          }
        }));
        setCourses(list);
      }
      if (attempts && attempts.length) {
        setAvgScore(Math.round(attempts.reduce((s: number, a: any) => s + (a.score || 0), 0) / attempts.length));
      }
    })();
  }, [user?.id]);

  const firstName = (profile?.full_name || "Foydalanuvchi").split(" ")[0];
  const activeSub = subs[0];
  const stats = [
    { label: "Tugatilgan darslar", value: String(progress.length), icon: PlayCircle, color: "text-primary bg-primary/10" },
    { label: "Faol kurslar", value: String(subs.length), icon: BookOpen, color: "text-accent-foreground bg-accent/40" },
    { label: "Obunalar", value: String(subs.length), icon: Clock, color: "text-warning bg-warning/15" },
    { label: "O'rtacha ball", value: avgScore !== null ? `${avgScore}%` : "—", icon: Trophy, color: "text-success bg-success/15" },
  ];

  return (
    <>
      <Topbar title="Bosh sahifa" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="overflow-hidden rounded-2xl p-6 text-primary-foreground lg:p-8" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold lg:text-3xl">Assalomu alaykum, {firstName}! 👋</h2>
              <p className="mt-2 text-white/80">Bugun ham yangi bilim olishga tayyormisiz?</p>
              {activeSub && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="text-white/80">Obuna faol — {activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString() : "muddatsiz"}</span>
                </div>
              )}
            </div>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/app/courses">Kurslarga o'tish</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`grid h-12 w-12 place-items-center rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Davom etayotgan kurslar</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/courses">Hammasi <TrendingUp className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          {courses.length === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Hozircha faol kurslaringiz yo'q. <Link to="/app/courses" className="text-primary underline">Kurs tanlash</Link></CardContent></Card>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {courses.slice(0, 2).map((c: any) => {
              const total = (c.modules ?? []).reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0);
              const courseLessonIds = new Set((c.modules ?? []).flatMap((m: any) => (m.lessons ?? []).map((l: any) => l.id)));
              const done = progress.filter((p) => courseLessonIds.has(p.lesson_id)).length;
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <Card key={c.id} className="overflow-hidden">
                  {c.cover_url && <div className="aspect-[16/7] bg-cover bg-center" style={{ backgroundImage: `url(${c.cover_url})` }} />}
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{c.category}</Badge>
                      <Badge variant={c.mode === "strict" ? "default" : "outline"}>
                        {c.mode === "strict" ? "Qat'iy rejim" : "Erkin rejim"}
                      </Badge>
                    </div>
                    <h4 className="mt-3 font-display text-lg font-semibold leading-snug">{c.title}</h4>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{done}/{total} dars</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>Taraqqiyot</span><span>{pct}%</span></div>
                      <Progress value={pct} className="mt-1" />
                    </div>
                    <Button asChild className="mt-4 w-full">
                      <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>Davom etish</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {activeSub && (
          <Card>
            <CardHeader><CardTitle className="font-display">Obuna ma'lumotlari</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Faol kurslar</div>
                <div className="mt-1 font-display text-lg font-semibold">{subs.length} ta</div>
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Eng yaqin tugash</div>
                <div className="mt-1 font-display text-lg font-semibold text-success">{activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString() : "Muddatsiz"}</div>
              </div>
              <div className="sm:col-span-2 flex items-center justify-end">
                <Button asChild variant="outline"><Link to="/app/subscription">Batafsil</Link></Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}