import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  AlertCircle,
  LayoutDashboard,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
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
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const [studentsRes, plansRes, coursesRes, lessonsRes, payRes, pendingRes] = await Promise.all(
        [
          supabase
            .from("user_roles")
            .select("user_id", { count: "exact", head: true })
            .eq("role", "student"),
          supabase
            .from("user_plan")
            .select("user_id", { count: "exact", head: true })
            .gt("expires_at", new Date().toISOString()),
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("lessons").select("id", { count: "exact", head: true }),
          supabase
            .from("payments")
            .select("amount")
            .eq("status", "approved")
            .gte("created_at", monthStart.toISOString()),
          supabase
            .from("payments")
            .select("id, amount, payer_name, user_id, plans(title)")
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(5),
        ],
      );
      const revenue = (payRes.data ?? []).reduce((s, p: any) => s + Number(p.amount ?? 0), 0);
      return {
        students: studentsRes.count ?? 0,
        active: plansRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        lessons: lessonsRes.count ?? 0,
        revenue,
        pending: pendingRes.data ?? [],
      };
    },
  });

  const stats = [
    {
      label: "Jami o'quvchilar",
      value: data?.students ?? "—",
      icon: Users,
      color: "text-primary bg-primary/10",
      hint: "Faol foydalanuvchilar",
    },
    {
      label: "Faol obunalar",
      value: data?.active ?? "—",
      icon: CreditCard,
      color: "text-success bg-success/15",
      hint: "To'lov qilganlar",
    },
    {
      label: "Oylik daromad",
      value: data ? fmt(data.revenue) : "—",
      icon: DollarSign,
      color: "text-warning bg-warning/15",
      hint: "Shu oy uchun",
    },
    {
      label: "Kurslar",
      value: data?.courses ?? "—",
      icon: BookOpen,
      color: "text-accent-foreground bg-accent/40",
      trend: data ? `${data.lessons} dars` : undefined,
      hint: "Jami kurslar",
    },
  ];

  return (
    <>
      <Topbar title="Admin Dashboard" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 text-primary-foreground lg:p-7"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 right-28 h-32 w-32 rounded-full bg-[oklch(0.78_0.1_195/0.25)] blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
                  Boshqaruv paneli
                </h2>
                <p className="mt-0.5 text-sm text-white/75">
                  Platformani boshqaring va asosiy ko'rsatkichlarni kuzating
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/admin/courses">
                  <BookOpen className="mr-1 h-4 w-4" /> Kurslar
                </Link>
              </Button>
              <Button asChild className="bg-white text-primary shadow-lg hover:bg-white/90">
                <Link to="/admin/payments">
                  To'lovlar <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="admin-card-hover rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  {s.trend ? (
                    <Badge variant="outline" className="text-xs">
                      {s.trend}
                    </Badge>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <ArrowUpRight className="h-3.5 w-3.5" /> {s.hint}
                    </span>
                  )}
                </div>
                <div className="mt-4 font-display text-3xl font-bold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending approvals */}
        <Card className="rounded-2xl border-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/15 text-warning">
                <AlertCircle className="h-4 w-4" />
              </div>
              <CardTitle className="font-display text-base">Tasdiqlash kutilmoqda</CardTitle>
            </div>
            <Badge variant={data?.pending.length ? "destructive" : "outline"}>
              {data?.pending.length ?? 0}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.pending ?? []).length === 0 && (
              <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                Yangi to'lovlar yo'q
              </div>
            )}
            {(data?.pending ?? []).map((p: any) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:bg-muted/40"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {p.payer_name ?? "—"} — {p.plans?.title ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">{fmt(Number(p.amount))}</div>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/admin/payments">
                Hammasini ko'rish <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
