import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, CreditCard, UserX, Shield, Inbox, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

const isActivePlan = (plan: any) =>
  plan && (!plan.expires_at || new Date(plan.expires_at) > new Date());

function AdminStudents() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["student", "admin"] as any);
      if (error) throw error;
      const adminSet = new Set(
        (roles ?? []).filter((r: any) => r.role === "admin").map((r: any) => r.user_id),
      );
      const ids = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
      if (!ids.length) return [];
      const [{ data: profs }, { data: plans }] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, phone, avatar_url, created_at")
          .in("id", ids),
        supabase
          .from("user_plan")
          .select("user_id, expires_at, is_trial, plans(title)")
          .in("user_id", ids),
      ]);
      const pMap = new Map<string, any>();
      for (const p of (plans ?? []) as any[]) pMap.set(p.user_id, p);
      return (profs ?? []).map((p: any) => ({
        ...p,
        plan: pMap.get(p.id) ?? null,
        is_admin: adminSet.has(p.id),
      }));
    },
  });

  const summary = useMemo(() => {
    const active = students.filter((s: any) => isActivePlan(s.plan)).length;
    const admins = students.filter((s: any) => s.is_admin).length;
    return { total: students.length, active, inactive: students.length - active, admins };
  }, [students]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return students.filter((s: any) => {
      if (
        term &&
        !((s.full_name ?? "").toLowerCase().includes(term) || (s.phone ?? "").includes(term))
      )
        return false;
      const active = isActivePlan(s.plan);
      if (tab === "active" && !active) return false;
      if (tab === "inactive" && active) return false;
      if (tab === "admins" && !s.is_admin) return false;
      return true;
    });
  }, [students, q, tab]);

  const cards = [
    {
      label: "Jami foydalanuvchilar",
      value: String(summary.total),
      icon: Users,
      tint: "text-primary",
      chip: "bg-primary/10",
    },
    {
      label: "Faol obunalar",
      value: String(summary.active),
      icon: CreditCard,
      tint: "text-success",
      chip: "bg-success/15",
    },
    {
      label: "Tarifsiz",
      value: String(summary.inactive),
      icon: UserX,
      tint: "text-warning",
      chip: "bg-warning/15",
    },
    {
      label: "Adminlar",
      value: String(summary.admins),
      icon: Shield,
      tint: "text-accent-foreground",
      chip: "bg-accent/40",
    },
  ];

  const tabs = [
    { value: "all", label: "Hammasi", count: summary.total },
    { value: "active", label: "Faol", count: summary.active },
    { value: "inactive", label: "Tarifsiz", count: summary.inactive },
    { value: "admins", label: "Adminlar", count: summary.admins },
  ];

  return (
    <>
      <Topbar title="O'quvchilar" initials="AD" />
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

        {/* Table */}
        <Card className="overflow-hidden rounded-2xl border-transparent">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap">
                {tabs.map((tt) => (
                  <TabsTrigger key={tt.value} value={tt.value} className="gap-1.5">
                    {tt.label}
                    <span className="rounded-full bg-foreground/10 px-1.5 text-[11px] font-semibold leading-5">
                      {tt.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ism yoki telefon bo'yicha..."
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    O'quvchi
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tarif
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tugash sanasi
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Ro'yxatdan
                  </TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">
                    Holat
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      Yuklanmoqda...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-12">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                          <Inbox className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">O'quvchi topilmadi</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((s: any) => {
                  const initials = (s.full_name ?? "?")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const active = isActivePlan(s.plan);
                  const planLabel = s.plan?.is_trial ? "Sinov" : (s.plan?.plans?.title ?? null);
                  return (
                    <TableRow key={s.id} className="border-border/60">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {s.avatar_url ? (
                              <AvatarImage src={s.avatar_url} alt={s.full_name ?? ""} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 font-medium">
                              <span className="truncate">{s.full_name || "—"}</span>
                              {s.is_admin && (
                                <Badge className="h-5 bg-primary px-1.5 text-[10px] text-primary-foreground">
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{s.phone ?? "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {active && planLabel ? (
                          <Badge variant="secondary" className="font-normal">
                            {planLabel}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {s.plan?.expires_at
                          ? new Date(s.plan.expires_at).toLocaleDateString("uz-UZ")
                          : "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(s.created_at).toLocaleDateString("uz-UZ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Faol
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />{" "}
                            Tarifsiz
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Footer count */}
          <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            {isLoading
              ? "Yuklanmoqda..."
              : `${filtered.length} / ${students.length} ko'rsatilmoqda`}
          </div>
        </Card>
      </main>
    </>
  );
}
