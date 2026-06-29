import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users2, Clock, ArrowRight, CalendarDays, Inbox } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { GROUP_STATUS, formatSchedule, type GroupStatus } from "@/lib/groups";

export const Route = createFileRoute("/app/groups/")({
  component: MyGroups,
});

type MyGroup = {
  id: string;
  name: string;
  status: GroupStatus;
  schedule_days: number[] | null;
  start_time: string | null;
  end_time: string | null;
  courseTitle: string;
};

function MyGroups() {
  const { user } = useAuth();

  const { data: groups = [], isLoading } = useQuery<MyGroup[]>({
    queryKey: ["app", "my-groups", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          "group_id, groups(id, name, status, schedule_days, start_time, end_time, courses(title))",
        )
        .eq("user_id", user!.id)
        .eq("status", "approved");
      if (error) throw error;
      const rows = (data ?? []) as unknown as Array<{
        groups: {
          id: string;
          name: string;
          status: GroupStatus;
          schedule_days: number[] | null;
          start_time: string | null;
          end_time: string | null;
          courses: { title: string } | { title: string }[] | null;
        } | null;
      }>;
      return rows
        .map((r) => r.groups)
        .filter((g): g is NonNullable<typeof g> => !!g)
        .map((g) => {
          const c = g.courses;
          const courseTitle = Array.isArray(c) ? (c[0]?.title ?? "—") : (c?.title ?? "—");
          return {
            id: g.id,
            name: g.name,
            status: g.status,
            schedule_days: g.schedule_days,
            start_time: g.start_time,
            end_time: g.end_time,
            courseTitle,
          };
        });
    },
  });

  return (
    <>
      <Topbar title="Guruhlarim" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Mening guruhlarim</h2>
          <p className="text-sm text-muted-foreground">
            Siz biriktirilgan guruhlar va ularning darsliklari.
          </p>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>}

        {!isLoading && groups.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">
                  Siz hali biror guruhga biriktirilmagansiz
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ochiq guruhlarni ko'rib chiqing va qo'shilish uchun so'rov yuboring.
                </p>
              </div>
              <Button asChild>
                <Link to="/app/admissions">
                  <CalendarDays className="mr-2 h-4 w-4" /> Ochiq guruhlar
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <Card key={g.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{g.courseTitle}</Badge>
                  <Badge variant={GROUP_STATUS[g.status].variant}>
                    {GROUP_STATUS[g.status].label}
                  </Badge>
                </div>
                <h3 className="mt-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <Users2 className="h-4 w-4 text-primary" /> {g.name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatSchedule(g.schedule_days, g.start_time, g.end_time)}
                </div>
                <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                  <Link to="/app/groups/$groupId" params={{ groupId: g.id }}>
                    Darsliklarni ochish <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
