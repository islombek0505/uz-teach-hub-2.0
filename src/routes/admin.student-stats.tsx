import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StudentDetailDialog } from "@/components/admin/student-detail-dialog";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  ChevronRight,
  Video,
  BookOpen,
  Clock,
  ArrowUpDown,
  Users,
  Timer,
  Trophy,
  Inbox,
} from "lucide-react";
import { getStudentsStats, type StudentStatRow } from "@/lib/admin-stats.functions";

export const Route = createFileRoute("/admin/student-stats")({
  component: AdminStudentStats,
});

const PAGE_SIZE = 10;

const fmtDur = (sec: number) => {
  if (!sec) return "0 daq";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h > 0) return `${h} soat${m ? ` ${m} daq` : ""}`;
  return `${m} daq`;
};

function relTime(iso: string | null): string {
  if (!iso) return "—";
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

function AdminStudentStats() {
  const fetchStats = useServerFn(getStudentsStats);
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin", "student-stats"],
    queryFn: () => fetchStats(),
  });

  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [courseId, setCourseId] = useState<string>("all");
  const [minVideos, setMinVideos] = useState<string>("0");
  const [sortBy, setSortBy] = useState<
    "videos_desc" | "watch_desc" | "quiz_desc" | "last_activity_desc" | "name_asc" | "created_desc"
  >("videos_desc");
  const [page, setPage] = useState(1);

  const allCourses = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of students) for (const c of s.active_courses) map.set(c.id, c.title);
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [students]);

  const summary = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: students.length,
      activeWeek: students.filter(
        (s) => s.last_activity_at && new Date(s.last_activity_at).getTime() > weekAgo,
      ).length,
      videos: students.reduce((a, s) => a + s.videos_watched, 0),
      watch: students.reduce((a, s) => a + s.watch_time_seconds, 0),
    };
  }, [students]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const ph = phone.replace(/\D/g, "");
    const mv = Number(minVideos) || 0;
    let list = students.filter((s) => {
      if (term && !(s.full_name ?? "").toLowerCase().includes(term)) return false;
      if (ph && !(s.phone ?? "").replace(/\D/g, "").includes(ph)) return false;
      if (courseId !== "all" && !s.active_courses.some((c) => c.id === courseId)) return false;
      if (s.videos_watched < mv) return false;
      return true;
    });
    switch (sortBy) {
      case "videos_desc":
        list = list.sort((a, b) => b.videos_watched - a.videos_watched);
        break;
      case "watch_desc":
        list = list.sort((a, b) => b.watch_time_seconds - a.watch_time_seconds);
        break;
      case "quiz_desc":
        list = list.sort((a, b) => (b.avg_quiz_score ?? -1) - (a.avg_quiz_score ?? -1));
        break;
      case "last_activity_desc":
        list = list.sort(
          (a, b) =>
            new Date(b.last_activity_at ?? 0).getTime() -
            new Date(a.last_activity_at ?? 0).getTime(),
        );
        break;
      case "name_asc":
        list = list.sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? ""));
        break;
      case "created_desc":
        list = list.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }
    return list;
  }, [students, search, phone, courseId, minVideos, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const cards = [
    {
      label: "Jami o'quvchilar",
      value: String(summary.total),
      icon: Users,
      tint: "text-primary",
      chip: "bg-primary/10",
    },
    {
      label: "So'nggi 7 kunda faol",
      value: String(summary.activeWeek),
      icon: Clock,
      tint: "text-success",
      chip: "bg-success/15",
    },
    {
      label: "Ko'rilgan videolar",
      value: new Intl.NumberFormat("uz-UZ").format(summary.videos),
      icon: Video,
      tint: "text-[oklch(0.55_0.13_220)]",
      chip: "bg-[oklch(0.55_0.13_220/0.12)]",
    },
    {
      label: "Umumiy o'qish vaqti",
      value: fmtDur(summary.watch),
      icon: Timer,
      tint: "text-warning",
      chip: "bg-warning/15",
    },
  ];

  return (
    <>
      <Topbar title="O'quvchilar statistikasi" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.chip}`}>
                  <c.icon className={`h-5 w-5 ${c.tint}`} />
                </div>
                <div className="mt-4 font-display text-2xl font-bold tracking-tight">{c.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="rounded-2xl border-transparent">
          <CardContent className="grid gap-3 p-4 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ism familiya bo'yicha..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Telefon raqami..."
                className="pl-9"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={courseId}
              onValueChange={(v) => {
                setCourseId(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kurslar</SelectItem>
                {allCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={minVideos}
              onValueChange={(v) => {
                setMinVideos(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Barcha (video soni)</SelectItem>
                <SelectItem value="1">≥ 1 ta video</SelectItem>
                <SelectItem value="5">≥ 5 ta video</SelectItem>
                <SelectItem value="10">≥ 10 ta video</SelectItem>
                <SelectItem value="25">≥ 25 ta video</SelectItem>
                <SelectItem value="50">≥ 50 ta video</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 lg:col-span-5">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tartiblash:</span>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="videos_desc">Ko'p video ko'rgan</SelectItem>
                  <SelectItem value="watch_desc">Ko'p vaqt sarflagan</SelectItem>
                  <SelectItem value="quiz_desc">Yuqori test bali</SelectItem>
                  <SelectItem value="last_activity_desc">Oxirgi faollik</SelectItem>
                  <SelectItem value="name_asc">Ism (A-Z)</SelectItem>
                  <SelectItem value="created_desc">Ro'yxatdan o'tgan vaqti</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-auto text-sm text-muted-foreground">
                {isLoading ? "Yuklanmoqda..." : `${filtered.length} / ${students.length}`}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden rounded-2xl border-transparent">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    O'quvchi
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Faol kurslar
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Video className="h-3.5 w-3.5" /> Video
                    </span>
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Dars
                    </span>
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5" /> Vaqt
                    </span>
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="h-3.5 w-3.5" /> Test
                    </span>
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Faollik
                    </span>
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                    Amal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      Yuklanmoqda...
                    </TableCell>
                  </TableRow>
                )}
                {pageItems.length === 0 && !isLoading && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="py-12">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                          <Inbox className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">O'quvchi topilmadi</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {pageItems.map((s: StudentStatRow) => {
                  const initials = (s.full_name ?? "?")
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <TableRow key={s.id} className="border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {s.avatar_url ? <AvatarImage src={s.avatar_url} /> : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{s.full_name ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{s.phone ?? "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {s.active_courses.length === 0 ? (
                          <span className="text-sm text-muted-foreground">—</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {s.active_courses.slice(0, 2).map((c) => (
                              <Badge key={c.id} variant="secondary" className="font-normal">
                                {c.title}
                              </Badge>
                            ))}
                            {s.active_courses.length > 2 && (
                              <Badge variant="outline">+{s.active_courses.length - 2}</Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold tabular-nums">
                        {s.videos_watched}
                      </TableCell>
                      <TableCell className="tabular-nums">{s.lessons_completed}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {fmtDur(s.watch_time_seconds)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {s.avg_quiz_score !== null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-semibold">{s.avg_quiz_score}%</span>
                            <span className="text-xs text-muted-foreground">
                              ({s.quiz_attempts})
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {relTime(s.last_activity_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <StudentDetailDialog
                          studentId={s.id}
                          name={s.full_name}
                          trigger={
                            <Button size="sm" variant="outline">
                              Ko'proq <ChevronRight className="ml-1 h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.max(1, currentPage - 1));
                  }}
                  href="#"
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
                .map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.min(totalPages, currentPage + 1));
                  }}
                  href="#"
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </>
  );
}
