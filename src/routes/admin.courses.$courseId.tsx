import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import {
  CourseSettingsCard,
  ModulesEditor,
  AddModuleDialog,
  CoursePresentationsManager,
} from "@/components/admin/course-content";

export const Route = createFileRoute("/admin/courses/$courseId")({
  component: EditCourse,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
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
        .select("*, modules(*, lessons(*))")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      data.modules = (data.modules ?? []).sort((a: any, b: any) => a.position - b.position);
      for (const m of data.modules)
        m.lessons = (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position);
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "course", courseId] });

  const delModule = async (id: string) => {
    if (!confirm("Modulni va undagi barcha darslarni o'chirishni tasdiqlaysizmi?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("O'chirildi");
    invalidate();
  };

  const updateModule = async (
    id: string,
    patch: { title?: string; description?: string | null },
  ) => {
    const { error } = await supabase.from("modules").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else invalidate();
  };

  const delCourse = async () => {
    if (!confirm("Kurs butunlay o'chiriladi. Davom etamizmi?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return toast.error(error.message);
    toast.success("Kurs o'chirildi");
    navigate({ to: "/admin/courses" });
  };

  if (isLoading || !course) {
    return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  }

  return (
    <>
      <Topbar title={`Tahrirlash: ${course.title}`} initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link
          to="/admin/courses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Kurslarga qaytish
        </Link>

        <CourseSettingsCard course={course} onSaved={invalidate} onDelete={delCourse} />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Modullar va darslar</h2>
            <AddModuleDialog
              courseId={courseId}
              nextPosition={course.modules.length}
              onAdded={invalidate}
            />
          </div>

          {course.modules.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Hozircha modullar yo'q. Birinchi modulni qo'shing.
              </CardContent>
            </Card>
          )}

          <ModulesEditor
            modules={course.modules}
            courseId={courseId}
            onChange={invalidate}
            onUpdateModule={updateModule}
            onDeleteModule={delModule}
          />
        </div>

        <CoursePresentationsManager courseId={courseId} />
      </main>
    </>
  );
}
