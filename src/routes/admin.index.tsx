import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CreditCard, DollarSign, BookOpen, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
      const [studentsRes, subsRes, coursesRes, lessonsRes, payRes, pendingRes] = await Promise.all([
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "approved").gte("created_at", monthStart.toISOString()),
        supabase.from("payments").select("id, amount, payer_name, user_id, courses(title)").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
      ]);
      const revenue = (payRes.data ?? []).reduce((s, p: any) => s + Number(p.amount ?? 0), 0);
      return {
        students: studentsRes.count ?? 0,
        active: subsRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        lessons: lessonsRes.count ?? 0,
        revenue,
        pending: pendingRes.data ?? [],
      };
    },
  });

  const stats = [
    { label: "Jami o'quvchilar", value: data?.students ?? "—", icon: Users, color: "text-primary bg-primary/10" },
    { label: "Faol obunalar", value: data?.active ?? "—", icon: CreditCard, color: "text-success bg-success/15" },
    { label: "Oylik daromad", value: data ? fmt(data.revenue) : "—", icon: DollarSign, color: "text-warning bg-warning/15" },
    { label: "Kurslar", value: data?.courses ?? "—", icon: BookOpen, color: "text-accent-foreground bg-accent/40", trend: data ? `${data.lessons} dars` : undefined },
  ];

  return (
    <>
      <Topbar title="Admin Dashboard" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
                  {s.trend && <Badge variant="outline" className="text-xs">{s.trend}</Badge>}
                </div>
                <div className="mt-4 font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-display text-base">Tasdiqlash kutilmoqda</CardTitle>
            <Badge variant={data?.pending.length ? "destructive" : "outline"}>{data?.pending.length ?? 0}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.pending ?? []).length === 0 && <div className="text-sm text-muted-foreground">Yangi to'lovlar yo'q</div>}
            {(data?.pending ?? []).map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                <AlertCircle className="h-4 w-4 text-warning" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{p.payer_name ?? "—"} — {p.courses?.title ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{fmt(Number(p.amount))}</div>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="w-full"><Link to="/admin/payments">Hammasi</Link></Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}