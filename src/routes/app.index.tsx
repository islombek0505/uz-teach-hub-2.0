import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users2, CalendarDays, CreditCard, Clock, ArrowRight, BookOpen, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { NewsCarousel } from "@/components/news-carousel";
import { DashboardSkeleton } from "@/components/student/loaders";
import {
  GROUP_STATUS,
  GROUP_STATUS_COLOR,
  formatSchedule,
  type GroupStatus,
  type MembershipStatus,
} from "@/lib/groups";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

type MyGroup = {
  id: string;
  name: string;
  status: GroupStatus;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
  telegram_link: string | null;
  courseTitle: string;
};

function currentPeriodMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function Dashboard() {
  const { user } = useAuth();
  const periodMonth = currentPeriodMonth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "dashboard", user?.id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .maybeSingle();

      const { data: memberships } = await supabase
        .from("group_members")
        .select(
          "groups(id, name, status, schedule_days, start_time, end_time, telegram_link, courses(title))",
        )
        .eq("user_id", user!.id)
        .eq("status", "approved" as MembershipStatus);

      const myGroups: MyGroup[] = (memberships ?? [])
        .map((m) => {
          const g = m.groups as {
            id: string;
            name: string;
            status: GroupStatus;
            schedule_days: number[] | null;
            start_time: string | null;
            end_time: string | null;
            telegram_link: string | null;
            courses: { title: string } | { title: string }[] | null;
          } | null;
          if (!g) return null;
          const c = g.courses;
          const courseTitle = Array.isArray(c) ? (c[0]?.title ?? "—") : (c?.title ?? "—");
          return {
            id: g.id,
            name: g.name,
            status: g.status,
            schedule_days: g.schedule_days,
            start_time: g.start_time,
            end_time: g.end_time,
            telegram_link: g.telegram_link,
            courseTitle,
          };
        })
        .filter((g): g is MyGroup => !!g);

      const { count: openCount } = await supabase
        .from("groups")
        .select("id", { count: "exact", head: true })
        .eq("status", "recruiting");

      const activeGroupIds = myGroups.filter((g) => g.status === "active").map((g) => g.id);
      let dueCount = 0;
      if (activeGroupIds.length) {
        const { data: pays } = await supabase
          .from("payments")
          .select("group_id, status, period_month")
          .eq("user_id", user!.id)
          .eq("period_month", periodMonth);
        const paid = new Set(
          (pays ?? []).filter((p) => p.status !== "rejected").map((p) => p.group_id),
        );
        dueCount = activeGroupIds.filter((id) => !paid.has(id)).length;
      }

      return {
        name: profile?.full_name || "Foydalanuvchi",
        myGroups,
        openCount: openCount ?? 0,
        dueCount,
      };
    },
  });

  if (isLoading || !data) return <DashboardSkeleton />;
  const { name, myGroups, openCount, dueCount } = data;
  const activeGroups = myGroups.filter((g) => g.status === "active");

  return (
    <>
      <Topbar title="Bosh sahifa" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Salomlashish */}
        <div>
          <h1 className="font-display text-2xl font-bold lg:text-3xl">Salom, {name}! 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bugun nimani o'rganamiz? Quyida guruhlaringiz va jadvalingiz.
          </p>
        </div>

        {/* Statistika */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Users2 className="h-5 w-5" />}
            label="Guruhlarim"
            value={String(myGroups.length)}
            to="/app/groups"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Ochiq qabul"
            value={String(openCount)}
            to="/app/admissions"
          />
          <StatCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Bu oy to'lov"
            value={dueCount > 0 ? `${dueCount} ta kutilmoqda` : "Hammasi to'langan"}
            to="/app/subscription"
            highlight={dueCount > 0}
          />
        </div>

        {/* To'lov eslatmasi */}
        {dueCount > 0 && (
          <Card className="border-warning/40 bg-warning/5">
            <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-warning" />
                Bu oy uchun {dueCount} ta guruh to'lovi kutilmoqda.
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/app/subscription">To'lash</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <NewsCarousel />

        {/* Guruhlarim */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Guruhlarim</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/groups">
                Barchasi <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {myGroups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <Users2 className="h-8 w-8 text-muted-foreground opacity-40" />
                <p className="text-sm text-muted-foreground">
                  Siz hali biror guruhga biriktirilmagansiz.
                </p>
                <Button asChild size="sm">
                  <Link to="/app/admissions">
                    <CalendarDays className="mr-2 h-4 w-4" /> Ochiq guruhlarni ko'rish
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myGroups.map((g) => (
                <Card key={g.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{g.courseTitle}</Badge>
                      <Badge variant={GROUP_STATUS[g.status].variant}>
                        {GROUP_STATUS[g.status].label}
                      </Badge>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold">{g.name}</h3>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatSchedule(g.schedule_days, g.start_time, g.end_time)}
                    </div>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                      <Link to="/app/groups/$groupId" params={{ groupId: g.id }}>
                        <BookOpen className="mr-1 h-3.5 w-3.5" /> Darsliklar
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Yaqin darslar (jadval) */}
        {activeGroups.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-xl font-semibold">Dars jadvali</h2>
            <Card>
              <CardContent className="divide-y p-0">
                {activeGroups.map((g) => (
                  <div key={g.id} className="flex items-center gap-3 p-4">
                    <div
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-lg border",
                        GROUP_STATUS_COLOR[g.status].chip,
                      )}
                    >
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{g.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatSchedule(g.schedule_days, g.start_time, g.end_time)}
                      </div>
                    </div>
                    {g.telegram_link && (
                      <Button asChild size="sm" variant="ghost">
                        <a href={g.telegram_link} target="_blank" rel="noreferrer">
                          <Send className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  to,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  to: string;
  highlight?: boolean;
}) {
  return (
    <Link to={to}>
      <Card className={highlight ? "border-warning/40" : undefined}>
        <CardContent className="flex items-center gap-3 p-5">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="truncate font-display text-lg font-bold">{value}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
