import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/topbar";
import { GroupForm, type GroupFormPayload } from "@/components/admin/group-form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/groups/new")({
  component: NewGroup,
});

function NewGroup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["admin", "courses", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, title").order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = async (payload: GroupFormPayload) => {
    setSaving(true);
    const { data, error } = await supabase
      .from("groups")
      .insert({ ...payload, created_by: user?.id ?? null })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) return toast.error(error?.message ?? "Xatolik");
    toast.success("Guruh yaratildi!");
    navigate({ to: "/admin/groups/$groupId", params: { groupId: data.id } });
  };

  return (
    <>
      <Topbar title="Yangi guruh" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <Link
          to="/admin/groups"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Guruhlarga qaytish
        </Link>

        {courses.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-6 text-sm text-muted-foreground">
            Avval kamida bitta yo'nalish (kurs) yarating, so'ng unga guruh ochasiz.{" "}
            <Link to="/admin/courses/new" className="font-medium text-foreground underline">
              Yo'nalish yaratish
            </Link>
          </div>
        ) : (
          <GroupForm
            courses={courses}
            submitting={saving}
            submitLabel="Guruhni yaratish"
            onSubmit={create}
          />
        )}
      </main>
    </>
  );
}
