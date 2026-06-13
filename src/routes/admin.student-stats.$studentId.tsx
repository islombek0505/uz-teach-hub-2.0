import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Video, BookOpen, CheckCircle2, Circle, Clock, Mail, Phone, MapPin, ListChecks } from "lucide-react";
import { getStudentDetail } from "@/lib/admin-stats.functions";

export const Route = createFileRoute("/admin/student-stats/$studentId")({
  component: StudentDetailPage,
});

function StudentDetailPage() {
  const { studentId } = Route.useParams();
  const fetchDetail = useServerFn(getStudentDetail);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "student-detail", studentId],
    queryFn: () => fetchDetail({ data: { studentId } }),
  });

  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const activeCourse = useMemo(() => {
    if (!data) return null;
    return data.courses.find((c) => c.course_id === selectedCourse) ?? data.courses[0] ?? null;
  }, [data, selectedCourse]);

  if (isLoading || !data) return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;

  const p = data.profile;
  const initials = (p.full_name ?? "?").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Topbar title="O'quvchi tafsilotlari" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link to="/admin/student-stats" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Statistikaga qaytish
        </Link>

        <Card>
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center">
            <Avatar className="h-20 w-20">
              {p.avatar_url ? <AvatarImage src={p.avatar_url} /> : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h2 className="font-display text-2xl font-semibold">{p.full_name ?? "—"}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {p.phone}</span>}
                {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {p.email}</span>}
                {p.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {p.city}</span>}
                {p.birth_date && <span>🎂 {new Date(p.birth_date).toLocaleDateString("uz-UZ")}</span>}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Ro'yxatdan: {new Date(p.created_at).toLocaleDateString("uz-UZ")}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Oxirgi kirish: {p.last_sign_in_at ? new Date(p.last_sign_in_at).toLocaleString("uz-UZ") : "—"}</span>
              </div>
              {p.bio && <p className="text-sm">{p.bio}</p>}
              <div className="flex flex-wrap gap-2">
                {p.telegram_url && <a href={p.telegram_url} target="_blank" rel="noreferrer"><Badge variant="secondary">Telegram</Badge></a>}
                {p.instagram_url && <a href={p.instagram_url} target="_blank" rel="noreferrer"><Badge variant="secondary">Instagram</Badge></a>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Video className="h-5 w-5" />} label="Ko'rilgan videolar" value={data.totals.videos_watched} />
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Tugatilgan darslar" value={data.totals.lessons_completed} />
          <StatCard icon={<ListChecks className="h-5 w-5" />} label="Faol kurslar" value={data.totals.active_courses} />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Test urinishlari" value={data.totals.quiz_attempts} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-lg">Kurs statistikasi</CardTitle>
            {data.courses.length > 0 && (
              <Select value={activeCourse?.course_id ?? ""} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Kursni tanlang" /></SelectTrigger>
                <SelectContent>
                  {data.courses.map((c) => <SelectItem key={c.course_id} value={c.course_id}>{c.course_title}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </CardHeader>
          <CardContent>
            {!activeCourse && <p className="text-sm text-muted-foreground">Faol kurslar yo'q.</p>}
            {activeCourse && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Umumiy progress" value={`${activeCourse.percent}%`} sub={`${activeCourse.completed_lessons} / ${activeCourse.total_lessons} dars`} />
                  <MiniStat label="Videolar" value={`${activeCourse.watched_videos} / ${activeCourse.total_videos}`} sub="Ko'rilgan / jami" />
                  <MiniStat label="Holati" value={activeCourse.percent === 100 ? "Tugatilgan" : activeCourse.percent > 0 ? "Davom etmoqda" : "Boshlanmagan"} sub="" />
                </div>
                <Progress value={activeCourse.percent} className="h-2" />

                <Separator />

                <div className="space-y-4">
                  {activeCourse.modules.map((m) => (
                    <div key={m.id}>
                      <h4 className="mb-2 font-display font-semibold">{m.title}</h4>
                      <div className="space-y-1">
                        {m.lessons.map((l) => (
                          <div key={l.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="flex items-center gap-3">
                              {l.completed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                              <div>
                                <div className="text-sm font-medium">{l.title}</div>
                                <div className="text-xs text-muted-foreground capitalize">{l.type}</div>
                              </div>
                            </div>
                            <Badge variant={l.completed ? "default" : "outline"} className={l.completed ? "bg-success text-success-foreground" : ""}>
                              {l.completed ? "Tugatildi" : "Ko'rilmagan"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}