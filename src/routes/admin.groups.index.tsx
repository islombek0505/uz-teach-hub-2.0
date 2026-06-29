import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Users,
  Clock,
  CalendarDays,
  Inbox,
  LayoutGrid,
  CalendarRange,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { GroupsCalendar } from "@/components/admin/groups-calendar";
import { GroupRequestsInbox } from "@/components/admin/group-requests-inbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  GROUP_STATUS,
  GROUP_STATUS_ORDER,
  formatPrice,
  pricePeriodLabel,
  formatScheduleDays,
  formatScheduleTime,
  type GroupStatus,
} from "@/lib/groups";

export const Route = createFileRoute("/admin/groups/")({
  component: AdminGroups,
});

type GroupRow = {
  id: string;
  name: string;
  status: GroupStatus;
  capacity: number;
  price: number;
  price_period: string;
  starts_on: string | null;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
  course_id: string;
  courseTitle: string;
  approved: number;
  pending: number;
};

function AdminGroups() {
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  const { data: groups = [], isLoading } = useQuery<GroupRow[]>({
    queryKey: ["admin", "groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(
          "id, name, status, capacity, price, price_period, starts_on, schedule_days, start_time, end_time, course_id, courses(title)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;

      const { data: members } = await supabase.from("group_members").select("group_id, status");
      const approved = new Map<string, number>();
      const pending = new Map<string, number>();
      for (const m of members ?? []) {
        if (m.status === "approved") approved.set(m.group_id, (approved.get(m.group_id) ?? 0) + 1);
        if (m.status === "pending") pending.set(m.group_id, (pending.get(m.group_id) ?? 0) + 1);
      }

      return (data ?? []).map((g) => {
        const course = g.courses as { title: string } | { title: string }[] | null;
        const courseTitle = Array.isArray(course)
          ? (course[0]?.title ?? "—")
          : (course?.title ?? "—");
        return {
          id: g.id,
          name: g.name,
          status: g.status,
          capacity: g.capacity,
          price: g.price,
          price_period: g.price_period,
          starts_on: g.starts_on,
          schedule_days: g.schedule_days,
          start_time: g.start_time,
          end_time: g.end_time,
          course_id: g.course_id,
          courseTitle,
          approved: approved.get(g.id) ?? 0,
          pending: pending.get(g.id) ?? 0,
        };
      });
    },
  });

  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of groups) map.set(g.course_id, g.courseTitle);
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [groups]);

  const filtered = groups.filter(
    (g) =>
      (courseFilter === "all" || g.course_id === courseFilter) &&
      (statusFilter === "all" || g.status === statusFilter),
  );

  return (
    <>
      <Topbar title="Guruhlar boshqaruvi" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Barcha guruhlar</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Yuklanmoqda..." : `${groups.length} ta guruh`}
            </p>
          </div>
          <Button asChild>
            <Link to="/admin/groups/new">
              <Plus className="mr-2 h-4 w-4" /> Yangi guruh
            </Link>
          </Button>
        </div>

        <GroupRequestsInbox />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Yo'nalish" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha yo'nalishlar</SelectItem>
                {courseOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Holat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha holatlar</SelectItem>
                {GROUP_STATUS_ORDER.map((s) => (
                  <SelectItem key={s} value={s}>
                    {GROUP_STATUS[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="inline-flex rounded-lg border p-0.5">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5"
              onClick={() => setView("list")}
            >
              <LayoutGrid className="h-4 w-4" /> Ro'yxat
            </Button>
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5"
              onClick={() => setView("calendar")}
            >
              <CalendarRange className="h-4 w-4" /> Kalendar
            </Button>
          </div>
        </div>

        {view === "calendar" ? (
          <Card>
            <CardContent className="p-4">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Guruh topilmadi.</p>
              ) : (
                <GroupsCalendar groups={filtered} />
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {filtered.length === 0 && !isLoading && (
              <Card>
                <CardContent className="p-10 text-center text-muted-foreground">
                  {groups.length === 0
                    ? "Hozircha guruhlar yo'q. Yangi guruh oching."
                    : "Filtr bo'yicha guruh topilmadi."}
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g) => {
                const pct =
                  g.capacity > 0 ? Math.min(100, Math.round((g.approved / g.capacity) * 100)) : 0;
                const days = formatScheduleDays(g.schedule_days);
                const time = formatScheduleTime(g.start_time, g.end_time);
                return (
                  <Card key={g.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{g.courseTitle}</Badge>
                        <Badge variant={GROUP_STATUS[g.status].variant}>
                          {GROUP_STATUS[g.status].label}
                        </Badge>
                        {g.pending > 0 && (
                          <Badge variant="outline" className="ml-auto gap-1 text-amber-600">
                            <Inbox className="h-3 w-3" /> {g.pending} so'rov
                          </Badge>
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-lg font-semibold">{g.name}</h3>

                      <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                        {(days || time) && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />{" "}
                            {[days, time].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {g.starts_on && (
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />{" "}
                            {new Date(g.starts_on).toLocaleDateString("uz-UZ")} dan
                          </div>
                        )}
                        <div className="font-medium text-foreground">
                          {formatPrice(g.price)}{" "}
                          <span className="font-normal text-muted-foreground">
                            / {pricePeriodLabel(g.price_period)}
                          </span>
                        </div>
                      </div>

                      {/* Sig'im bari */}
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-3.5 w-3.5" /> O'quvchilar
                          </span>
                          <span className="font-medium">
                            {g.approved} / {g.capacity}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                        <Link to="/admin/groups/$groupId" params={{ groupId: g.id }}>
                          <Edit className="mr-1 h-3.5 w-3.5" /> Boshqarish
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </>
  );
}
