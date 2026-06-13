import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, ChevronRight, Video, BookOpen, Clock, ArrowUpDown } from "lucide-react";
import { getStudentsStats, type StudentStatRow } from "@/lib/admin-stats.functions";

export const Route = createFileRoute("/admin/student-stats")({
  component: AdminStudentStats,
});

const PAGE_SIZE = 10;

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
  const [sortBy, setSortBy] = useState<"videos_desc" | "last_login_desc" | "name_asc" | "created_desc">("videos_desc");
  const [page, setPage] = useState(1);

  const allCourses = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of students) for (const c of s.active_courses) map.set(c.id, c.title);
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
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
      case "videos_desc": list = list.sort((a, b) => b.videos_watched - a.videos_watched); break;
      case "last_login_desc": list = list.sort((a, b) => (new Date(b.last_sign_in_at ?? 0).getTime()) - (new Date(a.last_sign_in_at ?? 0).getTime())); break;
      case "name_asc": list = list.sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? "")); break;
      case "created_desc": list = list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    }
    return list;
  }, [students, search, phone, courseId, minVideos, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <Topbar title="O'quvchilar statistikasi" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Statistika va filtrlar</h2>
          <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${filtered.length} ta o'quvchi topildi (jami ${students.length})`}</p>
        </div>

        <Card>
          <CardContent className="grid gap-3 p-4 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Ism familiya bo'yicha..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Telefon raqami..." className="pl-9" value={phone} onChange={(e) => { setPhone(e.target.value); setPage(1); }} />
            </div>
            <Select value={courseId} onValueChange={(v) => { setCourseId(v); setPage(1); }}>
              <SelectTrigger><SelectValue placeholder="Kurs" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kurslar</SelectItem>
                {allCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={minVideos} onValueChange={(v) => { setMinVideos(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Barcha (video soni)</SelectItem>
                <SelectItem value="1">≥ 1 ta video</SelectItem>
                <SelectItem value="5">≥ 5 ta video</SelectItem>
                <SelectItem value="10">≥ 10 ta video</SelectItem>
                <SelectItem value="25">≥ 25 ta video</SelectItem>
                <SelectItem value="50">≥ 50 ta video</SelectItem>
              </SelectContent>
            </Select>
            <div className="lg:col-span-5 flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tartiblash:</span>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="videos_desc">Ko'p video ko'rgan</SelectItem>
                  <SelectItem value="last_login_desc">Oxirgi marta kirgan</SelectItem>
                  <SelectItem value="name_asc">Ism (A-Z)</SelectItem>
                  <SelectItem value="created_desc">Ro'yxatdan o'tgan vaqti</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Faol kurslar</TableHead>
                  <TableHead><span className="inline-flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Videolar</span></TableHead>
                  <TableHead><span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Darslar</span></TableHead>
                  <TableHead><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Oxirgi kirish</span></TableHead>
                  <TableHead className="text-right">Amal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length === 0 && !isLoading && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Topilmadi</TableCell></TableRow>
                )}
                {pageItems.map((s: StudentStatRow) => {
                  const initials = (s.full_name ?? "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {s.avatar_url ? <AvatarImage src={s.avatar_url} /> : null}
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{s.full_name ?? "—"}</div>
                            <div className="text-xs text-muted-foreground">{s.phone ?? "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {s.active_courses.length === 0 ? <span className="text-muted-foreground text-sm">—</span> : (
                          <div className="flex flex-wrap gap-1">
                            {s.active_courses.slice(0, 2).map((c) => <Badge key={c.id} variant="secondary" className="font-normal">{c.title}</Badge>)}
                            {s.active_courses.length > 2 && <Badge variant="outline">+{s.active_courses.length - 2}</Badge>}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">{s.videos_watched}</TableCell>
                      <TableCell>{s.lessons_completed}</TableCell>
                      <TableCell className="text-sm">
                        {s.last_sign_in_at ? new Date(s.last_sign_in_at).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" }) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link to="/admin/student-stats/$studentId" params={{ studentId: s.id }}>Ko'proq <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={(e) => { e.preventDefault(); setPage(Math.max(1, currentPage - 1)); }} href="#" className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink href="#" isActive={p === currentPage} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={(e) => { e.preventDefault(); setPage(Math.min(totalPages, currentPage + 1)); }} href="#" className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </>
  );
}