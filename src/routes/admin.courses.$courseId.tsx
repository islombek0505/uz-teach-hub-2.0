import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, Edit, Clock } from "lucide-react";
import { CourseSettingsCard } from "@/components/admin/course-content";
import { GROUP_STATUS, formatSchedule, type GroupStatus } from "@/lib/groups";

export const Route = createFileRoute("/admin/courses/$courseId")({
  component: EditCourse,
  notFoundComponent: () => <div className="p-10 text-center">Yo'nalish topilmadi</div>,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function EditCourse() {
  const { courseId } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ["admin", "course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["admin", "course-groups", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("id, name, status, capacity, schedule_days, start_time, end_time")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "course", courseId] });

  const delCourse = async () => {
    if (!confirm("Yo'nalish butunlay o'chiriladi. Davom etamizmi?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return toast.error(error.message);
    toast.success("Yo'nalish o'chirildi");
    navigate({ to: "/admin/courses" });
  };

  if (isLoading || !course) {
    return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  }

  return (
    <>
      <Topbar title={`Yo'nalish: ${course.title}`} initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Yo'nalishlarga qaytish
        </Link>

        <CourseSettingsCard course={course} onSaved={invalidate} onDelete={delCourse} />

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Bu yo'nalish guruhlari</h2>
              <p className="text-sm text-muted-foreground">
                Darsliklar har bir guruh ichida alohida yaratiladi.
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/groups/new">
                <Plus className="mr-2 h-4 w-4" /> Yangi guruh
              </Link>
            </Button>
          </div>

          {groups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Bu yo'nalishda hali guruh ochilmagan.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map((g) => (
                <Card key={g.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{g.name}</span>
                        <Badge variant={GROUP_STATUS[g.status as GroupStatus].variant}>
                          {GROUP_STATUS[g.status as GroupStatus].label}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {formatSchedule(g.schedule_days, g.start_time, g.end_time)}
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link to="/admin/groups/$groupId" params={{ groupId: g.id }}>
                        <Edit className="mr-1 h-3.5 w-3.5" /> Boshqarish
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
