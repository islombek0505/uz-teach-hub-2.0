import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCourses,
});

function AdminCourses() {
  const qc = useQueryClient();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, cover_url, category, mode, published, price, lessons(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const list = data ?? [];
      await Promise.all(list.map(async (c: any) => {
        if (c.cover_url && !c.cover_url.startsWith("http")) {
          const { data: s } = await supabase.storage.from("course-covers").createSignedUrl(c.cover_url, 60 * 60);
          c.cover_url = s?.signedUrl ?? null;
        }
      }));
      return list;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Kurs o'chirildi");
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="Kurslar boshqaruvi" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Barcha kurslar</h2>
            <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${courses.length} ta kurs mavjud`}</p>
          </div>
          <Button asChild><Link to="/admin/courses/new"><Plus className="mr-2 h-4 w-4" /> Yangi kurs</Link></Button>
        </div>

        {courses.length === 0 && !isLoading && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">Hozircha kurslar yo'q. Yangi kurs yarating.</CardContent></Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c: any) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="aspect-video bg-muted bg-cover bg-center" style={c.cover_url ? { backgroundImage: `url(${c.cover_url})` } : undefined} />
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2">
                  {c.category && <Badge variant="secondary">{c.category}</Badge>}
                  <Badge variant={c.mode === "strict" ? "default" : "outline"}>{c.mode === "strict" ? "Qat'iy" : "Erkin"}</Badge>
                  {!c.published && <Badge variant="outline">Qoralama</Badge>}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold line-clamp-1">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description ?? "—"}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.lessons?.[0]?.count ?? 0} dars</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/admin/courses/$courseId" params={{ courseId: c.id }}><Edit className="mr-1 h-3.5 w-3.5" /> Tahrirlash</Link></Button>
                  <Button variant="outline" size="icon" className="text-destructive" onClick={() => confirm(`"${c.title}" kursini o'chirasizmi?`) && del.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}