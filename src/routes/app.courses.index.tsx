import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/courses/")({
  component: CoursesList,
});

function CoursesList() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "courses", user?.id],
    queryFn: async () => {
      const [{ data: cs, error }, { data: plan }] = await Promise.all([
        supabase
          .from("courses")
          .select("id, title, description, cover_url, category, lessons(count)")
          .eq("published", true)
          .order("created_at", { ascending: false }),
        supabase.from("user_plan").select("expires_at").eq("user_id", user!.id).maybeSingle(),
      ]);
      if (error) throw error;
      const hasPlan = !!plan && (!plan.expires_at || new Date(plan.expires_at) > new Date());
      const mapped = (cs ?? []).map((c: any) => ({ ...c, enrolled: hasPlan }));
      await Promise.all(mapped.map(async (c: any) => {
        if (c.cover_url && !c.cover_url.startsWith("http")) {
          const { data: s } = await supabase.storage.from("course-covers").createSignedUrl(c.cover_url, 60 * 60);
          c.cover_url = s?.signedUrl ?? null;
        }
      }));
      return mapped;
    },
  });

  return (
    <>
      <Topbar title="Kurslar" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <p className="text-muted-foreground">Barcha mavjud kurslar — faol tarif bilan barchasini ko'rishingiz mumkin</p>
        {isLoading && <div className="text-sm text-muted-foreground">Yuklanmoqda...</div>}
        {!isLoading && (data ?? []).length === 0 && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">Hozircha nashr etilgan kurslar yo'q.</CardContent></Card>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((c: any) => (
            <Card key={c.id} className="group overflow-hidden transition-all hover:shadow-[var(--shadow-elegant)]">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {c.cover_url && <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: `url(${c.cover_url})` }} />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {c.category && <Badge variant="secondary" className="backdrop-blur-sm">{c.category}</Badge>}
                </div>
                {c.enrolled && (
                  <div className="absolute right-3 top-3"><Badge className="bg-success text-success-foreground"><CheckCircle2 className="mr-1 h-3 w-3" /> Faol</Badge></div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="font-display text-lg font-semibold leading-snug line-clamp-2">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description ?? "—"}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.lessons?.[0]?.count ?? 0} dars</span>
                </div>
                <Button asChild className="mt-4 w-full" variant={c.enrolled ? "default" : "outline"}>
                  <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>{c.enrolled ? "Davom etish" : <><Lock className="mr-1 h-3.5 w-3.5" /> Tarif kerak</>}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}