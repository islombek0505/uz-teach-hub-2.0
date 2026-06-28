import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Lock, CheckCircle2, Search, ArrowRight, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { CoursesGridSkeleton } from "@/components/student/loaders";

export const Route = createFileRoute("/app/courses/")({
  component: CoursesList,
});

function CoursesList() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("all");

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
      await Promise.all(
        mapped.map(async (c: any) => {
          if (c.cover_url && !c.cover_url.startsWith("http")) {
            const { data: s } = await supabase.storage
              .from("course-covers")
              .createSignedUrl(c.cover_url, 60 * 60);
            c.cover_url = s?.signedUrl ?? null;
          }
        }),
      );
      return mapped;
    },
  });

  const courses = data ?? [];
  const categories = useMemo(
    () => Array.from(new Set(courses.map((c: any) => c.category).filter(Boolean))) as string[],
    [courses],
  );
  const filtered = courses.filter((c: any) => {
    const matchesCat = cat === "all" || c.category === cat;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || c.title?.toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
  const enrolledCount = courses.filter((c: any) => c.enrolled).length;

  if (isLoading) return <CoursesGridSkeleton />;

  return (
    <>
      <Topbar title="Kurslar" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          // icon={GraduationCap}
          title="Kurslar"
          subtitle={
            enrolledCount > 0
              ? "Faol tarifingiz bilan barcha kurslarni o'rganishingiz mumkin"
              : "Barcha kurslar - to'liq kirish uchun tarif oling"
          }
          action={
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-full pl-9"
              />
            </div>
          }
        />

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <CategoryChip active={cat === "all"} onClick={() => setCat("all")}>
              Hammasi
            </CategoryChip>
            {categories.map((c) => (
              <CategoryChip key={c} active={cat === c} onClick={() => setCat(c)}>
                {c}
              </CategoryChip>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {courses.length === 0
                  ? "Hozircha nashr etilgan kurslar yo'q."
                  : "Qidiruvga mos kurs topilmadi."}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c: any) => (
            <Card
              key={c.id}
              className="glass glass-hover group overflow-hidden rounded-2xl border-transparent"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {c.cover_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${c.cover_url})` }}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-accent)" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {c.category && (
                    <Badge variant="secondary" className="backdrop-blur-sm">
                      {c.category}
                    </Badge>
                  )}
                </div>
                {c.enrolled && (
                  <div className="absolute right-3 top-3">
                    <Badge className="bg-success text-success-foreground shadow-sm">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Faol
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {c.description ?? "—"}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5" /> {c.lessons?.[0]?.count ?? 0} dars
                </div>
                <Button
                  asChild
                  className="mt-4 w-full"
                  variant={c.enrolled ? "default" : "outline"}
                >
                  <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>
                    {c.enrolled ? (
                      <>
                        Davom etish <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1 h-3.5 w-3.5" /> Tarif kerak
                      </>
                    )}
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

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "glass border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
