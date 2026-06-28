import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  Trophy,
  PlayCircle,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Presentation,
  FileText,
  Crown,
  Target,
} from "lucide-react";
import { getStudentDashboard } from "@/lib/student-dashboard.functions";
import { NewsCarousel } from "@/components/news-carousel";
import { DashboardSkeleton } from "@/components/student/loaders";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  // One authenticated server round-trip (see student-dashboard.functions.ts)
  // replaces the old client-side waterfall of ~8 sequential Supabase calls.
  const fetchDashboard = useServerFn(getStudentDashboard);
  const { data, isLoading } = useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const profile = data?.profile ?? null;
  const activeSub = data?.activeSub ?? null;
  const courses = data?.courses ?? [];
  const progress = data?.progress ?? [];
  const recent = data?.recent ?? [];
  const avgScore = data?.avgScore ?? null;

  const firstName = (profile?.full_name || "Foydalanuvchi").split(" ")[0];

  // Overall completion across the user's active courses.
  let totalLessons = 0;
  let doneLessons = 0;
  for (const c of courses) {
    const ids = new Set(
      (c.modules ?? []).flatMap((m: any) => (m.lessons ?? []).map((l: any) => l.id)),
    );
    totalLessons += ids.size;
    doneLessons += progress.filter((p) => ids.has(p.lesson_id)).length;
  }
  const overallPct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;
  const inProgress = Math.max(0, totalLessons - doneLessons);

  const stats = [
    {
      label: "Tugatilgan darslar",
      value: String(progress.length),
      hint: progress.length > 0 ? "Zo'r ketyapsiz" : "Boshlang",
      icon: PlayCircle,
      tint: "text-primary",
      chip: "bg-primary/10",
      good: progress.length > 0,
    },
    {
      label: "Faol kurslar",
      value: String(courses.length),
      hint: "Davom etayotgan",
      icon: BookOpen,
      tint: "text-[oklch(0.55_0.13_220)]",
      chip: "bg-[oklch(0.55_0.13_220/0.12)]",
      good: courses.length > 0,
    },
    {
      label: "O'rtacha ball",
      value: avgScore !== null ? `${avgScore}%` : "—",
      hint: avgScore !== null && avgScore >= 80 ? "Ajoyib natija" : "Test ishlang",
      icon: Trophy,
      tint: "text-success",
      chip: "bg-success/15",
      good: avgScore !== null && avgScore >= 80,
    },
    {
      label: "Tarif holati",
      value: activeSub
        ? activeSub.is_trial
          ? "Sinov"
          : (activeSub.plans?.title ?? "Faol")
        : "Yo'q",
      hint: activeSub ? "Faol obuna" : "Tarif oling",
      icon: Clock,
      tint: "text-warning",
      chip: "bg-warning/15",
      good: !!activeSub,
    },
  ];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <>
      <Topbar title="Bosh sahifa" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Hero */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 text-primary-foreground lg:p-8"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[oklch(0.78_0.1_195/0.25)] blur-2xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white/30">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={firstName} />
                ) : null}
                <AvatarFallback className="bg-white/15 text-lg font-semibold text-white">
                  {firstName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-display text-2xl font-bold lg:text-3xl">
                  Xush kelibsiz, {firstName}! 👋
                </h2>
                <p className="mt-1 text-white/75">Bugun ham yangi bilimlar o'rganamiz!</p>
                {activeSub && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-white/85">
                      Tarif faol -{" "}
                      {activeSub.expires_at
                        ? new Date(activeSub.expires_at).toLocaleDateString("uz-UZ")
                        : "muddatsiz"}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-primary shadow-lg hover:bg-white/90">
              <Link to="/app/courses">
                Kurslarga o'tish <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="glass glass-hover rounded-2xl border-transparent"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.chip}`}>
                    <s.icon className={`h-5 w-5 ${s.tint}`} />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${s.good ? "text-success" : "text-muted-foreground"}`}
                  >
                    {s.good && <ArrowUpRight className="h-3.5 w-3.5" />}
                    {s.hint}
                  </span>
                </div>
                <div className="mt-4 font-display text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <NewsCarousel />

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: continue learning */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="glass rounded-2xl border-transparent">
              <CardContent className="p-5 lg:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold">Davom etayotgan kurslar</h3>
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                    <Link to="/app/courses">
                      Hammasi <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                {courses.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Hozircha faol kurslaringiz yo'q.
                    </p>
                    <Button asChild size="sm" className="mt-4">
                      <Link to="/app/courses">Kurs tanlash</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((c: any) => {
                      const total = (c.modules ?? []).reduce(
                        (s: number, m: any) => s + (m.lessons?.length || 0),
                        0,
                      );
                      const ids = new Set(
                        (c.modules ?? []).flatMap((m: any) =>
                          (m.lessons ?? []).map((l: any) => l.id),
                        ),
                      );
                      const done = progress.filter((p) => ids.has(p.lesson_id)).length;
                      const pct = total ? Math.round((done / total) * 100) : 0;
                      return (
                        <div
                          key={c.id}
                          className="group flex flex-col gap-4 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                        >
                          <div
                            className="h-20 w-full shrink-0 rounded-lg bg-cover bg-center sm:w-32"
                            style={{
                              backgroundImage: c.cover_url
                                ? `url(${c.cover_url})`
                                : "var(--gradient-accent)",
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {c.category && (
                                <Badge variant="secondary" className="text-[10px]">
                                  {c.category}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {done}/{total} dars
                              </span>
                            </div>
                            <h4 className="mt-1.5 truncate font-display text-base font-semibold">
                              {c.title}
                            </h4>
                            <div className="mt-2 flex items-center gap-3">
                              <Progress value={pct} className="h-2 flex-1" />
                              <span className="w-9 text-right text-xs font-semibold text-primary">
                                {pct}%
                              </span>
                            </div>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="shrink-0 self-stretch sm:self-center"
                          >
                            <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>
                              Davom etish
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Per-course progress overview */}
            {/* {courses.length > 0 && (
              <Card className="glass rounded-2xl border-transparent">
                <CardContent className="p-5 lg:p-6">
                  <h3 className="mb-4 font-display text-xl font-semibold">
                    Kursning jarayon ko'rsatkichi
                  </h3>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((c: any) => {
                      const total = (c.modules ?? []).reduce(
                        (s: number, m: any) => s + (m.lessons?.length || 0),
                        0,
                      );
                      const ids = new Set(
                        (c.modules ?? []).flatMap((m: any) =>
                          (m.lessons ?? []).map((l: any) => l.id),
                        ),
                      );
                      const done = progress.filter((p) => ids.has(p.lesson_id)).length;
                      const pct = total ? Math.round((done / total) * 100) : 0;
                      return (
                        <div key={c.id}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="truncate pr-2 font-medium">{c.title}</span>
                            <span className="shrink-0 text-muted-foreground">{pct}%</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Right: goal overview + recent activity + plan */}
          <div className="space-y-6">
            {/* Goal overview donut */}
            <Card className="glass rounded-2xl border-transparent">
              <CardContent className="p-5 lg:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-lg font-semibold">Umumiy maqsad</h3>
                </div>
                <div className="flex flex-col items-center py-2">
                  <RingProgress value={overallPct}>
                    <div className="text-center">
                      <div className="font-display text-4xl font-bold tracking-tight">
                        {overallPct}%
                      </div>
                      <div className="text-xs text-muted-foreground">yakunlandi</div>
                    </div>
                  </RingProgress>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-success/10 p-3 text-center">
                    <div className="font-display text-xl font-bold text-success">{doneLessons}</div>
                    <div className="text-xs text-muted-foreground">Yakunlangan</div>
                  </div>
                  <div className="rounded-xl bg-muted p-3 text-center">
                    <div className="font-display text-xl font-bold">{inProgress}</div>
                    <div className="text-xs text-muted-foreground">Qoldi</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent activity */}
            <Card className="glass rounded-2xl border-transparent">
              <CardContent className="p-5 lg:p-6">
                <h3 className="mb-4 font-display text-lg font-semibold">So'nggi faollik</h3>
                {recent.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Hali yakunlangan darslar yo'q.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {recent.map((r: any) => {
                      const meta = activityMeta(r.lessons?.type);
                      return (
                        <li
                          key={r.lesson_id}
                          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40"
                        >
                          <div
                            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.chip}`}
                          >
                            <meta.icon className={`h-4 w-4 ${meta.tint}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {r.lessons?.title ?? "Dars"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {relativeTime(r.updated_at)}
                            </div>
                          </div>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Plan mini-card */}
            <Card
              className="overflow-hidden rounded-2xl border-0 text-primary-foreground shadow-sm"
              style={{ background: "var(--gradient-primary)" }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-white/90" />
                    <span className="font-display font-semibold">Tarifingiz</span>
                  </div>
                  {activeSub && (
                    <Badge className="border-0 bg-white/20 text-white">
                      {activeSub.is_trial ? "Sinov" : "Faol"}
                    </Badge>
                  )}
                </div>
                <div className="mt-3 font-display text-xl font-bold">
                  {activeSub
                    ? activeSub.is_trial
                      ? "Sinov muddati"
                      : (activeSub.plans?.title ?? "Faol tarif")
                    : "Tarif yo'q"}
                </div>
                <div className="mt-1 text-sm text-white/75">
                  {activeSub
                    ? `Tugaydi: ${activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString("uz-UZ") : "muddatsiz"}`
                    : "Barcha kurslar uchun tarif oling"}
                </div>
                <Button
                  asChild
                  size="sm"
                  className="mt-4 w-full bg-white text-primary hover:bg-white/90"
                >
                  <Link to="/app/subscription">
                    {activeSub ? "Batafsil" : "Tarif tanlash"}{" "}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

/** Circular progress ring (SVG, no deps). */
function RingProgress({
  value,
  size = 168,
  stroke = 14,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circ - (clamped / 100) * circ;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary-glow)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function activityMeta(type?: string) {
  switch (type) {
    case "presentation":
      return {
        icon: Presentation,
        tint: "text-[oklch(0.55_0.13_220)]",
        chip: "bg-[oklch(0.55_0.13_220/0.12)]",
      };
    case "text":
      return { icon: FileText, tint: "text-warning", chip: "bg-warning/15" };
    default:
      return { icon: PlayCircle, tint: "text-primary", chip: "bg-primary/10" };
  }
}

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hozirgina";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} kun oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ");
}
