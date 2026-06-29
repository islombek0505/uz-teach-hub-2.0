import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  PlayCircle,
  FileText,
  Presentation,
  CheckCircle2,
  BookOpen,
  Send,
  Clock,
  CalendarDays,
  Lock,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { LeaveRequestDialog } from "@/components/student/leave-request-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  GROUP_STATUS,
  formatSchedule,
  type GroupStatus,
  type MembershipStatus,
} from "@/lib/groups";

export const Route = createFileRoute("/app/groups/$groupId/")({
  component: GroupDetail,
  notFoundComponent: () => <div className="p-10 text-center">Guruh topilmadi</div>,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

type LessonLite = {
  id: string;
  title: string;
  type: "video" | "presentation" | "text";
  position: number;
  has_quiz: boolean;
};
type ModuleLite = { id: string; title: string; position: number; lessons: LessonLite[] };

function GroupDetail() {
  const { groupId } = Route.useParams();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "group-detail", groupId, user?.id],
    queryFn: async () => {
      const { data: group, error } = await supabase
        .from("groups")
        .select(
          "id, name, status, telegram_link, schedule_days, start_time, end_time, courses(title)",
        )
        .eq("id", groupId)
        .maybeSingle();
      if (error) throw error;
      if (!group) throw notFound();

      const { data: membership } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .eq("user_id", user!.id)
        .maybeSingle();

      const { data: mods } = await supabase
        .from("modules")
        .select("id, title, position, lessons(id, title, type, position, has_quiz)")
        .eq("group_id", groupId)
        .order("position");
      const modules = ((mods ?? []) as unknown as ModuleLite[]).map((m) => ({
        ...m,
        lessons: (m.lessons ?? []).slice().sort((a, b) => a.position - b.position),
      }));

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user!.id)
        .eq("group_id", groupId);
      const completedSet = new Set(
        (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id),
      );

      const c = group.courses as { title: string } | { title: string }[] | null;
      const courseTitle = Array.isArray(c) ? (c[0]?.title ?? "—") : (c?.title ?? "—");

      return {
        group: { ...group, courseTitle },
        isMember: membership?.status === ("approved" as MembershipStatus),
        membershipId: membership?.id ?? null,
        leaveRequestedAt: membership?.leave_requested_at ?? null,
        modules,
        completedSet,
      };
    },
  });

  if (isLoading || !data) {
    return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  }

  const { group, isMember, membershipId, leaveRequestedAt, modules, completedSet } = data;
  const status = group.status as GroupStatus;
  const allLessons = modules.flatMap((m) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l) => completedSet.has(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <Topbar title={group.name} />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <Link
          to="/app/groups"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Guruhlarim
        </Link>

        {/* Header */}
        <Card className="glass border-transparent">
          <CardContent className="space-y-3 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{group.courseTitle}</Badge>
              <Badge variant={GROUP_STATUS[status].variant}>{GROUP_STATUS[status].label}</Badge>
            </div>
            <h1 className="font-display text-2xl font-bold lg:text-3xl">{group.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatSchedule(group.schedule_days, group.start_time, group.end_time)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> {total} dars
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.telegram_link && (
                <Button asChild variant="outline" size="sm">
                  <a href={group.telegram_link} target="_blank" rel="noreferrer">
                    <Send className="mr-2 h-4 w-4" /> Telegram guruhga qo'shilish
                  </a>
                </Button>
              )}
              {isMember && status === "active" && membershipId && (
                <LeaveRequestDialog
                  membershipId={membershipId}
                  groupName={group.name}
                  leaveRequested={!!leaveRequestedAt}
                  invalidateKeys={[["app", "group-detail", groupId]]}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {!isMember ? (
          <Card className="glass border-warning/40">
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <Lock className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Siz bu guruhning a'zosi emassiz. Darsliklarni ochish uchun guruhga qabul
                qilinishingiz kerak.
              </p>
              <Button asChild variant="outline">
                <Link to="/app/admissions">
                  <CalendarDays className="mr-2 h-4 w-4" /> Ochiq guruhlar
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {total > 0 && (
              <Card className="glass border-transparent">
                <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm font-medium">
                    O'zlashtirish: {done}/{total} dars
                  </div>
                  <div className="w-full sm:w-1/2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="mb-3 font-display text-xl font-semibold">Modullar va darslar</h2>
              {modules.length === 0 ? (
                <Card className="glass border-transparent">
                  <CardContent className="p-10 text-center text-muted-foreground">
                    Bu guruhda hali darsliklar qo'shilmagan.
                  </CardContent>
                </Card>
              ) : (
                <Accordion
                  type="multiple"
                  defaultValue={modules.map((m) => m.id)}
                  className="space-y-2"
                >
                  {modules.map((m, idx) => (
                    <AccordionItem
                      key={m.id}
                      value={m.id}
                      className="overflow-hidden rounded-xl border bg-card"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <span className="font-display font-semibold">
                          {idx + 1}-modul · {m.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="border-t">
                        {m.lessons.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                            Darslar yo'q.
                          </div>
                        ) : (
                          <ul className="divide-y">
                            {m.lessons.map((l, li) => {
                              const lessonDone = completedSet.has(l.id);
                              const TypeIcon =
                                l.type === "presentation"
                                  ? Presentation
                                  : l.type === "text"
                                    ? FileText
                                    : PlayCircle;
                              return (
                                <li key={l.id}>
                                  <Link
                                    to="/app/groups/$groupId/lessons/$lessonId"
                                    params={{ groupId: group.id, lessonId: l.id }}
                                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted"
                                  >
                                    <div
                                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                                        lessonDone
                                          ? "bg-success text-success-foreground"
                                          : "bg-muted text-foreground"
                                      }`}
                                    >
                                      {lessonDone ? <CheckCircle2 className="h-4 w-4" /> : li + 1}
                                    </div>
                                    <span className="min-w-0 flex-1 truncate font-medium">
                                      {l.title}
                                    </span>
                                    <TypeIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
