import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Timer,
  Crown,
  Calendar,
  Activity,
  Wallet,
  PlayCircle,
  TrendingUp,
  Target,
  Layers,
  Briefcase,
  User,
  CalendarDays,
} from "lucide-react";
import { getStudentDetail } from "@/lib/admin-stats.functions";

const fmtSom = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
const fmtDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("uz-UZ") : "—");
const fmtDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" }) : "—";

const fmtDur = (sec: number) => {
  if (!sec) return "0 daq";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h > 0) return `${h} soat${m ? ` ${m} daq` : ""}`;
  return `${m} daq`;
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hozirgina";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} kun oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ");
}

const SUB_STATUS = {
  active: { label: "Faol obuna", cls: "bg-success/15 text-success" },
  expired: { label: "Muddati tugagan", cls: "bg-warning/15 text-warning" },
  none: { label: "Tarifsiz", cls: "bg-muted text-muted-foreground" },
} as const;

const PAY_STATUS: Record<string, { label: string; cls: string }> = {
  approved: { label: "Tasdiqlangan", cls: "bg-success/15 text-success" },
  pending: { label: "Kutilmoqda", cls: "bg-warning/15 text-warning" },
  rejected: { label: "Rad etilgan", cls: "bg-destructive/15 text-destructive" },
};

export function StudentDetailView({ studentId }: { studentId: string }) {
  const fetchDetail = useServerFn(getStudentDetail);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "student-detail", studentId],
    queryFn: () => fetchDetail({ data: { studentId } }),
  });

  if (isError) {
    return (
      <Card className="rounded-2xl border-transparent">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive/15 text-destructive">
            <Activity className="h-6 w-6" />
          </div>
          <div className="text-sm font-medium">Ma'lumotlarni yuklab bo'lmadi</div>
          <p className="max-w-md text-xs text-muted-foreground">
            {(error as Error)?.message ?? "Noma'lum xatolik"}
          </p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Qayta urinish
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const p = data.profile;
  const t = data.totals;
  const sub = data.subscription;
  const initials = (p.full_name ?? "?")
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const kpis = [
    {
      icon: Video,
      label: "Ko'rilgan videolar",
      value: String(t.videos_watched),
      tint: "text-primary",
      chip: "bg-primary/10",
    },
    {
      icon: BookOpen,
      label: "Tugatilgan darslar",
      value: `${t.lessons_completed}/${t.total_lessons}`,
      tint: "text-[oklch(0.55_0.13_220)]",
      chip: "bg-[oklch(0.55_0.13_220/0.12)]",
    },
    {
      icon: Timer,
      label: "Sarflagan vaqt",
      value: fmtDur(t.watch_time_seconds),
      tint: "text-accent-foreground",
      chip: "bg-accent/40",
    },
    {
      icon: Trophy,
      label: "O'rtacha test bali",
      value: t.avg_quiz_score !== null ? `${t.avg_quiz_score}%` : "—",
      tint: "text-success",
      chip: "bg-success/15",
    },
    {
      icon: TrendingUp,
      label: "Umumiy progress",
      value: `${t.overall_percent}%`,
      tint: "text-primary",
      chip: "bg-primary/10",
    },
    {
      icon: Layers,
      label: "Kurslar",
      value: String(t.courses_enrolled),
      tint: "text-[oklch(0.55_0.13_220)]",
      chip: "bg-[oklch(0.55_0.13_220/0.12)]",
    },
    {
      icon: CalendarDays,
      label: "Faol kunlar",
      value: String(t.active_days),
      tint: "text-warning",
      chip: "bg-warning/15",
    },
    {
      icon: Clock,
      label: "Akkaunt yoshi",
      value: `${t.account_age_days} kun`,
      tint: "text-muted-foreground",
      chip: "bg-muted",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Profile hero — always visible */}
      <Card className="overflow-hidden rounded-2xl border-transparent">
        <div
          className="h-20 w-full"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden
        />
        <CardContent className="-mt-12 flex flex-col gap-5 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="h-24 w-24 ring-4 ring-card">
              {p.avatar_url ? <AvatarImage src={p.avatar_url} /> : null}
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {p.full_name ?? "—"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${SUB_STATUS[sub.status].cls}`}
                >
                  <Crown className="h-3.5 w-3.5" /> {SUB_STATUS[sub.status].label}
                </span>
              </div>
              {p.headline && <p className="text-sm text-muted-foreground">{p.headline}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {p.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {p.phone}
                  </span>
                )}
                {p.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {p.email}
                  </span>
                )}
                {p.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {p.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.telegram_url && (
              <a href={p.telegram_url} target="_blank" rel="noreferrer">
                <Badge variant="secondary">Telegram</Badge>
              </a>
            )}
            {p.instagram_url && (
              <a href={p.instagram_url} target="_blank" rel="noreferrer">
                <Badge variant="secondary">Instagram</Badge>
              </a>
            )}
          </div>
        </CardContent>
        <div className="grid gap-px border-t border-border/60 bg-border/40 sm:grid-cols-3">
          <HeroStat icon={Calendar} label="Ro'yxatdan o'tgan" value={fmtDate(p.created_at)} />
          <HeroStat icon={Clock} label="Oxirgi kirish" value={fmtDateTime(p.last_sign_in_at)} />
          <HeroStat
            icon={Activity}
            label="Oxirgi faollik"
            value={t.last_activity_at ? relTime(t.last_activity_at) : "—"}
          />
        </div>
      </Card>

      {/* Organized into tabs */}
      <Tabs defaultValue="umumiy" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="umumiy">Umumiy</TabsTrigger>
          <TabsTrigger value="malumotlar">Ma'lumotlar</TabsTrigger>
          <TabsTrigger value="kurslar">Kurslar</TabsTrigger>
          <TabsTrigger value="faollik">Faollik</TabsTrigger>
          <TabsTrigger value="tolovlar">To'lovlar ({data.payments.length})</TabsTrigger>
        </TabsList>

        {/* ── Umumiy ── */}
        <TabsContent value="umumiy" className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.label} className="rounded-2xl border-transparent">
                <CardContent className="p-5">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${k.chip}`}>
                    <k.icon className={`h-5 w-5 ${k.tint}`} />
                  </div>
                  <div className="mt-4 font-display text-2xl font-bold tracking-tight">
                    {k.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{k.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-primary" /> Umumiy progress
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="font-display text-4xl font-bold tracking-tight">
                    {t.overall_percent}%
                  </span>
                  <span className="pb-1 text-sm text-muted-foreground">
                    {t.lessons_completed}/{t.total_lessons} dars
                  </span>
                </div>
                <Progress value={t.overall_percent} className="mt-3 h-2" />
                <div className="mt-2 text-xs text-muted-foreground">
                  {t.lessons_in_progress} ta boshlangan · {t.videos_watched} video ko'rilgan
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Crown className="h-4 w-4 text-warning" /> Obuna
                </div>
                <div className="mt-3 font-display text-lg font-bold">
                  {sub.plan_title ?? "Tarifsiz"}
                </div>
                <span
                  className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${SUB_STATUS[sub.status].cls}`}
                >
                  {SUB_STATUS[sub.status].label}
                </span>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div>Boshlangan: {fmtDate(sub.started_at)}</div>
                  <div>Tugaydi: {sub.expires_at ? fmtDate(sub.expires_at) : "Muddatsiz"}</div>
                  {sub.is_trial && <div className="text-warning">Sinov muddati</div>}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-success" /> Testlar
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-display text-xl font-bold">{data.quiz.attempts}</div>
                    <div className="text-[11px] text-muted-foreground">Urinish</div>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">
                      {data.quiz.avg_score !== null ? `${data.quiz.avg_score}%` : "—"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">O'rtacha</div>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold text-success">
                      {data.quiz.passed}
                    </div>
                    <div className="text-[11px] text-muted-foreground">O'tgan</div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>
                    Eng yuqori:{" "}
                    <span className="font-semibold text-foreground">
                      {data.quiz.best_score !== null ? `${data.quiz.best_score}%` : "—"}
                    </span>
                  </span>
                  <span>
                    Eng past:{" "}
                    <span className="font-semibold text-foreground">
                      {data.quiz.worst_score !== null ? `${data.quiz.worst_score}%` : "—"}
                    </span>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Layers className="h-4 w-4 text-primary" /> Kurslar bo'yicha progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.courses.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Faol kurslar yo'q.</p>
              ) : (
                <div className="space-y-4">
                  {data.courses.map((c) => (
                    <div key={c.course_id}>
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{c.course_title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {c.completed_lessons}/{c.total_lessons} dars · {c.percent}%
                        </span>
                      </div>
                      <Progress value={c.percent} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Ma'lumotlar ── */}
        <TabsContent value="malumotlar" className="mt-6 space-y-6">
          <Card className="rounded-2xl border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <User className="h-4 w-4 text-primary" /> Shaxsiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-x-8 sm:grid-cols-2">
                <InfoRow label="To'liq ism" value={p.full_name} />
                <InfoRow label="Telefon" value={p.phone} />
                <InfoRow label="Email" value={p.email} />
                <InfoRow label="Shahar" value={p.city} />
                <InfoRow
                  label="Tug'ilgan sana"
                  value={p.birth_date ? fmtDate(p.birth_date) : null}
                />
                <InfoRow label="Kasb / lavozim" value={p.headline} />
                <InfoRow
                  label="Tajriba"
                  value={p.experience_years != null ? `${p.experience_years} yil` : null}
                />
                <InfoRow
                  label="Yo'nalishlar"
                  value={
                    p.expertise && p.expertise.length ? (
                      <span className="flex flex-wrap justify-end gap-1">
                        {p.expertise.map((e) => (
                          <Badge key={e} variant="secondary" className="text-[10px]">
                            {e}
                          </Badge>
                        ))}
                      </span>
                    ) : null
                  }
                />
                <InfoRow
                  label="Telegram"
                  value={
                    p.telegram_url ? (
                      <a
                        className="text-primary hover:underline"
                        href={p.telegram_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ochish
                      </a>
                    ) : null
                  }
                />
                <InfoRow
                  label="Instagram"
                  value={
                    p.instagram_url ? (
                      <a
                        className="text-primary hover:underline"
                        href={p.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ochish
                      </a>
                    ) : null
                  }
                />
                <InfoRow label="Ro'yxatdan o'tgan" value={fmtDateTime(p.created_at)} />
                <InfoRow label="Profil yangilangan" value={fmtDateTime(p.updated_at)} />
                <InfoRow label="Oxirgi kirish" value={fmtDateTime(p.last_sign_in_at)} />
                <InfoRow
                  label="Sinov faollashtirilgan"
                  value={p.trial_activated_at ? fmtDateTime(p.trial_activated_at) : null}
                />
                <InfoRow label="Akkaunt yoshi" value={`${t.account_age_days} kun`} />
                <InfoRow
                  label="Foydalanuvchi ID"
                  value={<span className="font-mono text-xs">{p.id}</span>}
                />
              </div>
              {p.bio && (
                <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <div className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Bio
                  </div>
                  <p className="text-sm">{p.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Kurslar ── */}
        <TabsContent value="kurslar" className="mt-6 space-y-4">
          {data.courses.length === 0 ? (
            <Card className="rounded-2xl border-transparent">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Faol kurslar yo'q.
              </CardContent>
            </Card>
          ) : (
            data.courses.map((course) => (
              <Card key={course.course_id} className="rounded-2xl border-transparent">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="font-display text-base">{course.course_title}</CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" /> {course.watched_videos}/
                        {course.total_videos}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {course.completed_lessons}/
                        {course.total_lessons}
                      </span>
                      <Badge variant="outline">{course.percent}%</Badge>
                    </div>
                  </div>
                  <Progress value={course.percent} className="mt-2 h-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.modules.map((m) => {
                    const done = m.lessons.filter((l) => l.completed).length;
                    return (
                      <div key={m.id} className="rounded-xl border border-border/60 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="flex items-center gap-2 font-display font-semibold">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {m.title}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {done}/{m.lessons.length}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          {m.lessons.map((l) => (
                            <div
                              key={l.id}
                              className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/40"
                            >
                              <div className="flex items-center gap-2.5">
                                {l.completed ? (
                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                                ) : (
                                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                                )}
                                <span className="text-sm">{l.title}</span>
                                <span className="text-[10px] uppercase text-muted-foreground">
                                  {l.type}
                                </span>
                              </div>
                              <span
                                className={`text-xs ${l.completed ? "text-success" : "text-muted-foreground"}`}
                              >
                                {l.completed ? "Tugatildi" : "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ── Faollik ── */}
        <TabsContent value="faollik" className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="rounded-2xl border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Activity className="h-4 w-4 text-primary" /> Faollik tarixi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.activity.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Hozircha faollik yo'q
                </p>
              ) : (
                <ol className="relative max-h-96 space-y-4 overflow-y-auto pr-1 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
                  {data.activity.map((a, i) => (
                    <li key={`${a.lesson_id}-${i}`} className="relative flex gap-3 pl-6">
                      <span
                        className={`absolute left-0 top-1 grid h-3.5 w-3.5 place-items-center rounded-full ring-4 ring-card ${a.completed ? "bg-success" : "bg-warning"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {a.type === "video" ? (
                            <PlayCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          ) : (
                            <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          )}
                          <span className="truncate text-sm font-medium">{a.lesson_title}</span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                          {a.course_title && <span className="truncate">{a.course_title}</span>}
                          <span>· {a.completed ? "Tugatildi" : "Ko'rilmoqda"}</span>
                          <span>· {relTime(a.updated_at)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Trophy className="h-4 w-4 text-warning" /> Test natijalari ({data.quiz.attempts})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.quiz.all.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Hozircha test topshirilmagan
                </p>
              ) : (
                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {data.quiz.all.map((q, i) => (
                    <div
                      key={`${q.lesson_id}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                    >
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-xs font-bold ${q.passed ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                      >
                        {q.score}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{q.lesson_title}</div>
                        <div className="text-xs text-muted-foreground">
                          {q.passed ? "O'tdi" : "O'tmadi"} · {fmtDateTime(q.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── To'lovlar ── */}
        <TabsContent value="tolovlar" className="mt-6">
          <Card className="rounded-2xl border-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Wallet className="h-4 w-4 text-success" /> To'lovlar tarixi ({data.payments.length}
                )
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.payments.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">To'lovlar yo'q</p>
              ) : (
                <div className="space-y-2">
                  {data.payments.map((pay) => {
                    const st = PAY_STATUS[pay.status] ?? {
                      label: pay.status,
                      cls: "bg-muted text-muted-foreground",
                    };
                    return (
                      <div
                        key={pay.id}
                        className="flex items-center gap-3 rounded-xl border border-border/60 p-3"
                      >
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Wallet className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {fmtSom(pay.amount)}
                            {pay.plan_title ? ` · ${pay.plan_title}` : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {fmtDateTime(pay.created_at)}
                          </div>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card/60 p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 py-2.5">
      <span className="shrink-0 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
