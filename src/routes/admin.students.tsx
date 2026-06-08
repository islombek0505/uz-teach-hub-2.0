import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const [q, setQ] = useState("");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const { data: roles, error } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      if (error) throw error;
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const [{ data: profs }, { data: subs }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, created_at").in("id", ids),
        supabase.from("subscriptions").select("user_id, active, expires_at, tariff, mentor_id, courses(title)").in("user_id", ids),
      ]);
      const mentorIds = Array.from(new Set((subs ?? []).map((s: any) => s.mentor_id).filter(Boolean)));
      const { data: mentorProfs } = mentorIds.length
        ? await supabase.from("profiles").select("id, full_name").in("id", mentorIds)
        : { data: [] as any[] };
      const mMap = new Map((mentorProfs ?? []).map((p: any) => [p.id, p.full_name]));
      const sMap = new Map<string, any[]>();
      for (const s of subs ?? []) {
        const arr = sMap.get(s.user_id) ?? [];
        arr.push({ ...s, mentor_name: s.mentor_id ? mMap.get(s.mentor_id) : null });
        sMap.set(s.user_id, arr);
      }
      return (profs ?? []).map((p: any) => ({ ...p, subs: sMap.get(p.id) ?? [] }));
    },
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return students;
    return students.filter((s: any) => (s.full_name ?? "").toLowerCase().includes(t) || (s.phone ?? "").includes(t));
  }, [students, q]);

  return (
    <>
      <Topbar title="O'quvchilar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Barcha o'quvchilar</h2>
            <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${students.length} ta ro'yxatdan o'tgan`}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Ism yoki telefon bo'yicha..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Faol kurslar</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Ro'yxatdan</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Topilmadi</TableCell></TableRow>}
                {filtered.map((s: any) => {
                  const activeSubs = s.subs.filter((x: any) => x.active && (!x.expires_at || new Date(x.expires_at) > new Date()));
                  const initials = (s.full_name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  const mentors = Array.from(new Set(activeSubs.map((a: any) => a.mentor_name).filter(Boolean)));
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback></Avatar>
                          <div>
                            <div className="font-medium">{s.full_name || "—"}</div>
                            <div className="text-xs text-muted-foreground">{s.phone ?? "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{activeSubs.map((a: any) => a.courses?.title).filter(Boolean).join(", ") || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{mentors.length ? mentors.join(", ") : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{new Date(s.created_at).toLocaleDateString("uz-UZ")}</TableCell>
                      <TableCell>{activeSubs.length > 0 ? <Badge className="bg-success text-success-foreground">Faol</Badge> : <Badge variant="outline">Obunasiz</Badge>}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}