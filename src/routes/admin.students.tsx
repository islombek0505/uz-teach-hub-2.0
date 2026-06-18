import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      const { data: roles, error } = await supabase.from("user_roles").select("user_id, role").in("role", ["student", "admin"] as any);
      if (error) throw error;
      const adminSet = new Set((roles ?? []).filter((r: any) => r.role === "admin").map((r: any) => r.user_id));
      const ids = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
      if (!ids.length) return [];
      const [{ data: profs }, { data: plans }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone, avatar_url, created_at").in("id", ids),
        supabase.from("user_plan").select("user_id, expires_at, is_trial, plans(title)").in("user_id", ids),
      ]);
      const pMap = new Map<string, any>();
      for (const p of (plans ?? []) as any[]) pMap.set(p.user_id, p);
      return (profs ?? []).map((p: any) => ({ ...p, plan: pMap.get(p.id) ?? null, is_admin: adminSet.has(p.id) }));
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
                  <TableHead>Tarif</TableHead>
                  <TableHead>Tugash</TableHead>
                  <TableHead>Ro'yxatdan</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && !isLoading && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Topilmadi</TableCell></TableRow>}
                {filtered.map((s: any) => {
                  const initials = (s.full_name ?? "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  const active = s.plan && (!s.plan.expires_at || new Date(s.plan.expires_at) > new Date());
                  const planLabel = s.plan?.is_trial ? "Sinov" : (s.plan?.plans?.title ?? "—");
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {s.avatar_url ? <AvatarImage src={s.avatar_url} alt={s.full_name ?? ""} /> : null}
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 font-medium">
                              {s.full_name || "—"}
                              {s.is_admin && <Badge className="bg-primary text-primary-foreground h-5 px-1.5 text-[10px]">Admin</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground">{s.phone ?? "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{active ? planLabel : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{s.plan?.expires_at ? new Date(s.plan.expires_at).toLocaleDateString("uz-UZ") : "—"}</TableCell>
                      <TableCell className="text-sm">{new Date(s.created_at).toLocaleDateString("uz-UZ")}</TableCell>
                      <TableCell>{active ? <Badge className="bg-success text-success-foreground">Faol</Badge> : <Badge variant="outline">Tarifsiz</Badge>}</TableCell>
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
