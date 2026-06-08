import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/mock-data";
import { Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/courses/")({
  component: CoursesList,
});

function CoursesList() {
  return (
    <>
      <Topbar title="Kurslarim" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <p className="text-muted-foreground">Barcha mavjud kurslar va sizning taraqqiyotingiz</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
            const done = c.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <Card key={c.id} className="group overflow-hidden transition-all hover:shadow-[var(--shadow-elegant)]">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: `url(${c.cover})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur-sm">{c.category}</Badge>
                    <Badge variant={c.mode === "strict" ? "default" : "outline"} className="backdrop-blur-sm">
                      {c.mode === "strict" ? "Qat'iy" : "Erkin"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug line-clamp-2">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.totalLessons} dars</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.totalDuration}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{done}/{total}</span><span>{pct}%</span></div>
                    <Progress value={pct} className="mt-1" />
                  </div>
                  <Button asChild className="mt-4 w-full">
                    <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>{pct > 0 ? "Davom etish" : "Boshlash"}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}