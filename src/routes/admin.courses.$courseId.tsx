import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courses } from "@/lib/mock-data";
import { ChevronLeft, Plus, Edit, Trash2, Video, FileText, ListChecks, GripVertical } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses/$courseId")({
  component: EditCourse,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
  errorComponent: () => <div className="p-10 text-center">Xatolik</div>,
});

function EditCourse() {
  const { courseId } = Route.useParams();
  const course = courses.find((c) => c.id === courseId);
  if (!course) throw notFound();

  return (
    <>
      <Topbar title={`Tahrirlash: ${course.title}`} initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link to="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Kurslarga qaytish</Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="font-display">{course.title}</CardTitle>
              <div className="mt-1 flex gap-2"><Badge variant="secondary">{course.category}</Badge><Badge>{course.mode === "strict" ? "Qat'iy" : "Erkin"}</Badge></div>
            </div>
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Sozlamalar</Button>
          </CardHeader>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Modullar va darslar</h2>
            <Button onClick={() => toast.success("Modul qo'shildi")}><Plus className="mr-2 h-4 w-4" /> Modul</Button>
          </div>

          <Accordion type="multiple" defaultValue={course.modules.map(m => m.id)} className="space-y-2">
            {course.modules.map((m, idx) => (
              <AccordionItem key={m.id} value={m.id} className="overflow-hidden rounded-lg border bg-card">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex w-full items-center gap-3 text-left">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="grid h-8 w-8 place-items-center rounded bg-primary/10 font-display text-sm font-bold text-primary">{idx + 1}</div>
                    <div className="flex-1">
                      <div className="font-display font-semibold">{m.title}</div>
                      <div className="text-xs text-muted-foreground">{m.lessons.length} dars</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t bg-muted/20 px-0 pb-0">
                  <ul className="divide-y">
                    {m.lessons.map((l) => {
                      const Icon = l.type === "presentation" ? FileText : Video;
                      return (
                        <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Icon className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">{l.title}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{l.duration}</span>
                              {l.hasQuiz && <Badge variant="outline" className="h-4 px-1 text-[10px]"><ListChecks className="mr-0.5 h-2.5 w-2.5" /> Test</Badge>}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </li>
                      );
                    })}
                    <li className="bg-muted/20 px-4 py-3">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Dars qo'shildi")}>
                        <Plus className="mr-2 h-3.5 w-3.5" /> Dars qo'shish (Video / Prezentatsiya / Matn / Test)
                      </Button>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </>
  );
}