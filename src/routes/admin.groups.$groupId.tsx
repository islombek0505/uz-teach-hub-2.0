import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Trash2, BookOpen, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupForm, type GroupFormPayload } from "@/components/admin/group-form";
import { GroupMembersManager } from "@/components/admin/group-members-manager";
import { GroupContentManager } from "@/components/admin/group-content-manager";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/groups/$groupId")({
  component: GroupDetail,
});

function trimTime(t: string | null): string | null {
  if (!t) return t;
  return t.length >= 5 ? t.slice(0, 5) : t;
}

function GroupDetail() {
  const { groupId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: group, isLoading } = useQuery({
    queryKey: ["admin", "group", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin", "courses", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, title").order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = async (payload: GroupFormPayload) => {
    setSaving(true);
    const { error } = await supabase.from("groups").update(payload).eq("id", groupId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
    qc.invalidateQueries({ queryKey: ["admin", "group", groupId] });
    qc.invalidateQueries({ queryKey: ["admin", "groups"] });
  };

  const remove = async () => {
    if (
      !confirm(`"${group?.name}" guruhini o'chirasizmi? Barcha a'zolik va darsliklar ham o'chadi.`)
    )
      return;
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) return toast.error(error.message);
    toast.success("Guruh o'chirildi");
    navigate({ to: "/admin/groups" });
  };

  return (
    <>
      <Topbar title={group?.name ?? "Guruh"} initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/admin/groups"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Guruhlarga qaytish
          </Link>
          <Button variant="outline" size="sm" className="text-destructive" onClick={remove}>
            <Trash2 className="mr-1 h-4 w-4" /> O'chirish
          </Button>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>}
        {!isLoading && !group && (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Guruh topilmadi.
            </CardContent>
          </Card>
        )}

        {group && (
          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Ma'lumotlar</TabsTrigger>
              <TabsTrigger value="requests">
                <Inbox className="mr-1 h-4 w-4" /> So'rovlar
              </TabsTrigger>
              <TabsTrigger value="lessons">
                <BookOpen className="mr-1 h-4 w-4" /> Darsliklar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <GroupForm
                courses={courses}
                submitting={saving}
                submitLabel="O'zgarishlarni saqlash"
                onSubmit={update}
                initial={{
                  course_id: group.course_id,
                  name: group.name,
                  description: group.description,
                  status: group.status,
                  capacity: group.capacity,
                  min_capacity: group.min_capacity,
                  price: group.price,
                  price_period: group.price_period,
                  schedule_days: group.schedule_days ?? [],
                  start_time: trimTime(group.start_time),
                  end_time: trimTime(group.end_time),
                  starts_on: group.starts_on,
                  duration_weeks: group.duration_weeks,
                  telegram_link: group.telegram_link,
                }}
              />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <GroupMembersManager groupId={groupId} capacity={group.capacity} />
            </TabsContent>

            <TabsContent value="lessons" className="mt-6">
              <GroupContentManager groupId={groupId} courseId={group.course_id} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </>
  );
}
