import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, Users, Send, X, Check, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/topbar";
import { LeaveRequestDialog } from "@/components/student/leave-request-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  WEEKDAYS,
  GROUP_STATUS,
  GROUP_STATUS_COLOR,
  formatPrice,
  pricePeriodLabel,
  formatScheduleTime,
  schedulesConflict,
  type GroupStatus,
  type MembershipStatus,
} from "@/lib/groups";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admissions")({
  component: Admissions,
});

type OpenGroup = {
  id: string;
  name: string;
  status: GroupStatus;
  capacity: number;
  price: number;
  price_period: string;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
  starts_on: string | null;
  description: string | null;
  course_id: string;
  courseTitle: string;
  approved: number;
};

type MyMembership = { id: string; status: MembershipStatus; leaveRequestedAt: string | null };

type ScheduleRow = {
  id: string;
  name: string;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
};

function Admissions() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const dataKey = ["app", "admissions", user?.id];

  const { data, isLoading } = useQuery({
    queryKey: dataKey,
    enabled: !!user,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("groups")
        .select(
          "id, name, status, capacity, price, price_period, schedule_days, start_time, end_time, starts_on, description, course_id, courses(title)",
        )
        .in("status", ["recruiting", "active"])
        .order("starts_on", { ascending: true });
      if (error) throw error;

      const counts = await Promise.all(
        (rows ?? []).map((g) => supabase.rpc("group_approved_count", { _group_id: g.id })),
      );

      const groups: OpenGroup[] = (rows ?? []).map((g, i) => {
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
          schedule_days: g.schedule_days,
          start_time: g.start_time,
          end_time: g.end_time,
          starts_on: g.starts_on,
          description: g.description,
          course_id: g.course_id,
          courseTitle,
          approved: (counts[i]?.data as number) ?? 0,
        };
      });

      const mineRows =
        (await supabase.from("group_members").select("*").eq("user_id", user!.id)).data ?? [];
      const myByGroup = new Map<string, MyMembership>();
      for (const m of mineRows)
        myByGroup.set(m.group_id, {
          id: m.id,
          status: m.status,
          leaveRequestedAt: m.leave_requested_at ?? null,
        });

      // O'quvchi allaqachon a'zo/kutilayotgan guruhlari jadvali — vaqt
      // to'qnashuvini ishonchli tekshirish uchun (ro'yxatdan mustaqil).
      const activeIds = mineRows
        .filter((m) => m.status === "pending" || m.status === "approved")
        .map((m) => m.group_id);
      let mySchedules: ScheduleRow[] = [];
      if (activeIds.length) {
        const { data: sched } = await supabase
          .from("groups")
          .select("id, name, schedule_days, start_time, end_time")
          .in("id", activeIds);
        mySchedules = sched ?? [];
      }

      return { groups, myByGroup, mySchedules };
    },
  });

  const groups = data?.groups ?? [];
  const myByGroup = data?.myByGroup ?? new Map<string, MyMembership>();
  const mySchedules = data?.mySchedules ?? [];

  // Tanlanmoqchi bo'lgan guruh o'quvchining mavjud guruhlari bilan vaqt jihatdan to'qnashadimi
  const conflictFor = (g: OpenGroup): ScheduleRow | null =>
    mySchedules.find((x) => x.id !== g.id && schedulesConflict(x, g)) ?? null;

  const requestJoin = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase.from("group_members").upsert(
        {
          group_id: groupId,
          user_id: user!.id,
          status: "pending",
          requested_at: new Date().toISOString(),
          decided_at: null,
          decided_by: null,
        },
        { onConflict: "group_id,user_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("So'rov yuborildi! Admin tasdig'ini kuting.");
      qc.invalidateQueries({ queryKey: dataKey });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancel = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from("group_members")
        .update({ status: "cancelled" })
        .eq("id", membershipId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bekor qilindi");
      qc.invalidateQueries({ queryKey: dataKey });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Dars vaqti to'qnashuvini tekshirib so'rov yuborish (qo'shimcha himoya)
  const tryJoin = (g: OpenGroup) => {
    const clash = conflictFor(g);
    if (clash) {
      toast.error(
        `Dars vaqti "${clash.name}" guruhi bilan to'qnashadi. Avval o'zingiz uchun muhimrog'ini tanlang.`,
      );
      return;
    }
    requestJoin.mutate(g.id);
  };

  const groupsByDay = useMemo(() => {
    const map = new Map<number, OpenGroup[]>();
    for (const g of data?.groups ?? []) {
      for (const d of g.schedule_days ?? []) {
        if (!map.has(d)) map.set(d, []);
        map.get(d)!.push(g);
      }
    }
    return map;
  }, [data]);

  return (
    <>
      <Topbar title="Ochiq guruhlar" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Qabul ketayotgan guruhlar</h2>
          <p className="text-sm text-muted-foreground">
            Sizga mos guruhga qo'shilish uchun so'rov yuboring. Admin tasdiqlagach, darslar
            ochiladi.
          </p>
        </div>

        {/* Haftalik jadval */}
        {groups.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-4 w-4 text-muted-foreground" /> Haftalik jadval
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {WEEKDAYS.map((w) => (
                  <div key={w.value} className="rounded-lg border bg-muted/20 p-2">
                    <div className="mb-1.5 text-xs font-semibold text-muted-foreground">
                      {w.long}
                    </div>
                    <div className="space-y-1">
                      {(groupsByDay.get(w.value) ?? []).map((g) => (
                        <div
                          key={g.id}
                          className={cn(
                            "rounded-md border px-2 py-1.5 text-xs",
                            GROUP_STATUS_COLOR[g.status].chip,
                          )}
                        >
                          <div className="font-medium leading-tight">{g.name}</div>
                          <div className="text-[11px] opacity-80">
                            {formatScheduleTime(g.start_time, g.end_time) || "—"}
                          </div>
                        </div>
                      ))}
                      {!(groupsByDay.get(w.value) ?? []).length && (
                        <div className="text-[11px] text-muted-foreground/50">—</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>}

        {!isLoading && groups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-10 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 opacity-40" />
              <p>Hozircha qabul ketayotgan guruhlar yo'q. Keyinroq qaytib tekshiring.</p>
            </CardContent>
          </Card>
        )}

        {/* Guruh kartalari */}
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((g) => {
            const mine = myByGroup.get(g.id);
            const full = g.approved >= g.capacity;
            const recruiting = g.status === "recruiting";
            const clash = mine ? null : conflictFor(g);
            return (
              <Card key={g.id} className="overflow-hidden">
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{g.courseTitle}</Badge>
                    <Badge variant={GROUP_STATUS[g.status].variant}>
                      {GROUP_STATUS[g.status].label}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold">{g.name}</h3>
                    {g.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                    )}
                  </div>

                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {g.schedule_days && g.schedule_days.length
                        ? g.schedule_days
                            .slice()
                            .sort((a, b) => a - b)
                            .map((d) => WEEKDAYS.find((w) => w.value === d)?.short)
                            .join(", ")
                        : "—"}
                      {formatScheduleTime(g.start_time, g.end_time)
                        ? ` · ${formatScheduleTime(g.start_time, g.end_time)}`
                        : ""}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" /> {g.approved} / {g.capacity} o'quvchi
                    </div>
                    {g.starts_on && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />{" "}
                        {new Date(g.starts_on).toLocaleDateString("uz-UZ")} dan
                      </div>
                    )}
                    <div className="font-semibold text-foreground">
                      {formatPrice(g.price)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {pricePeriodLabel(g.price_period)}
                      </span>
                    </div>
                  </div>

                  {/* Holat + amal */}
                  <div className="border-t pt-3">
                    {mine?.status === "approved" ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                          <Check className="h-4 w-4" /> Siz bu guruh a'zosisiz
                        </span>
                        {g.status === "active" ? (
                          <LeaveRequestDialog
                            membershipId={mine.id}
                            groupName={g.name}
                            leaveRequested={!!mine.leaveRequestedAt}
                            invalidateKeys={[dataKey]}
                          />
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            disabled={cancel.isPending}
                            onClick={() =>
                              confirm(`"${g.name}" guruhidan chiqasizmi?`) && cancel.mutate(mine.id)
                            }
                          >
                            Chiqish
                          </Button>
                        )}
                      </div>
                    ) : mine?.status === "pending" ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                          <Clock className="h-4 w-4" /> So'rovingiz tasdiqlanishi kutilmoqda
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          disabled={cancel.isPending}
                          onClick={() => cancel.mutate(mine.id)}
                        >
                          <X className="mr-1 h-4 w-4" /> So'rovni bekor qilish
                        </Button>
                      </div>
                    ) : !recruiting ? (
                      <Button size="sm" className="w-full" disabled variant="secondary">
                        Qabul yopilgan
                      </Button>
                    ) : full ? (
                      <Button size="sm" className="w-full" disabled variant="secondary">
                        Joylar to'lgan
                      </Button>
                    ) : clash ? (
                      <div className="space-y-1.5">
                        <Button size="sm" className="w-full" disabled variant="secondary">
                          <X className="mr-1 h-4 w-4" /> Dars vaqti band
                        </Button>
                        <p className="text-center text-[11px] text-destructive">
                          "{clash.name}" guruhi bilan vaqti to'qnashadi
                        </p>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={requestJoin.isPending}
                        onClick={() => tryJoin(g)}
                      >
                        <Send className="mr-1 h-4 w-4" /> Qo'shilish uchun so'rov yuborish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
