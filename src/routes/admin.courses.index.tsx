import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/mock-data";
import { Plus, Edit, Eye, Trash2, BookOpen, Users } from "lucide-react";

export const Route = createFileRoute("/admin/courses/")({
  component: AdminCourses,
});

function AdminCourses() {
  return (
    <>
      <Topbar title="Kurslar boshqaruvi" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Barcha kurslar</h2>
            <p className="text-sm text-muted-foreground">{courses.length} ta kurs mavjud</p>
          </div>
          <Button asChild><Link to="/admin/courses/new"><Plus className="mr-2 h-4 w-4" /> Yangi kurs</Link></Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url(${c.cover})` }} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{c.category}</Badge>
                    <Badge variant={c.mode === "strict" ? "default" : "outline"}>{c.mode === "strict" ? "Qat'iy" : "Erkin"}</Badge>
                  </div>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold line-clamp-1">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {c.totalLessons} dars</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 142 o'quvchi</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link to="/admin/courses/$courseId" params={{ courseId: c.id }}><Edit className="mr-1 h-3.5 w-3.5" /> Tahrirlash</Link></Button>
                  <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}