import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ModulesEditor, AddModuleDialog } from "@/components/admin/course-content";

// Group-scoped content editor. Reuses the shared ModulesEditor/AddModuleDialog,
// but loads and creates modules/lessons under group_id so each group has its
// own darsliklar (isolated from other groups of the same yo'nalish).
export function GroupContentManager({ groupId, courseId }: { groupId: string; courseId: string }) {
  const qc = useQueryClient();
  const key = ["admin", "group", groupId, "content"];

  const { data: modules = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("group_id", groupId)
        .order("position");
      if (error) throw error;
      const list = data ?? [];
      for (const m of list) {
        m.lessons = (m.lessons ?? []).slice().sort((a, b) => a.position - b.position);
      }
      return list;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const updateModule = async (
    id: string,
    patch: { title?: string; description?: string | null },
  ) => {
    const { error } = await supabase.from("modules").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else invalidate();
  };

  const delModule = async (id: string) => {
    if (!confirm("Modulni va undagi barcha darslarni o'chirishni tasdiqlaysizmi?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("O'chirildi");
    invalidate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">Modullar va darslar</h3>
          <p className="text-sm text-muted-foreground">
            Bu darsliklar faqat shu guruh o'quvchilariga ko'rinadi.
          </p>
        </div>
        <AddModuleDialog
          courseId={courseId}
          groupId={groupId}
          nextPosition={modules.length}
          onAdded={invalidate}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>}

      {!isLoading && modules.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Hozircha modullar yo'q. Birinchi modulni qo'shing.
          </CardContent>
        </Card>
      )}

      <ModulesEditor
        modules={modules}
        courseId={courseId}
        groupId={groupId}
        onChange={invalidate}
        onUpdateModule={updateModule}
        onDeleteModule={delModule}
      />
    </div>
  );
}
