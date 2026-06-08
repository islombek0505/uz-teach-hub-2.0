import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, Plus, Trash2, Video, FileText, ListChecks, Save, Upload, Pencil, Image as ImageIcon, Paperclip, Download } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { createBunnyVideo, deleteBunnyVideo } from "@/lib/bunny.functions";

export const Route = createFileRoute("/admin/courses/$courseId")({
  component: EditCourse,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
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
      for (const m of data.modules) m.lessons = (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position);
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "course", courseId] });

  // Course settings form
  const [savingCourse, setSavingCourse] = useState(false);
  const saveCourse = async (patch: any) => {
    setSavingCourse(true);
    const { error } = await supabase.from("courses").update(patch).eq("id", courseId);
    setSavingCourse(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
    invalidate();
  };

  const addModule = useMutation({
    mutationFn: async () => {
      const pos = (course?.modules?.length ?? 0);
      const { error } = await supabase.from("modules").insert({ course_id: courseId, title: `Modul ${pos + 1}`, position: pos });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Modul qo'shildi"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delModule = async (id: string) => {
    if (!confirm("Modulni va undagi barcha darslarni o'chirishni tasdiqlaysizmi?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("O'chirildi"); invalidate();
  };

  const renameModule = async (id: string, title: string) => {
    const { error } = await supabase.from("modules").update({ title }).eq("id", id);
    if (error) toast.error(error.message); else invalidate();
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
        <Link to="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Kurslarga qaytish</Link>

        <Card>
          <CardHeader><CardTitle className="font-display">Kurs sozlamalari</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><CoverUploader courseId={courseId} coverUrl={course.cover_url} onChange={invalidate} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Nomi</Label><Input defaultValue={course.title} onBlur={(e) => e.target.value !== course.title && saveCourse({ title: e.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Tavsif</Label><Textarea rows={3} defaultValue={course.description ?? ""} onBlur={(e) => e.target.value !== (course.description ?? "") && saveCourse({ description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Kategoriya</Label><Input defaultValue={course.category ?? ""} onBlur={(e) => e.target.value !== (course.category ?? "") && saveCourse({ category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Narx (so'm)</Label><Input type="number" defaultValue={course.price} onBlur={(e) => Number(e.target.value) !== Number(course.price) && saveCourse({ price: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Rejim</Label>
              <Select value={course.mode} onValueChange={(v) => saveCourse({ mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Qat'iy</SelectItem>
                  <SelectItem value="free">Erkin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">Nashr etilgan</div>
                <div className="text-xs text-muted-foreground">O'quvchilar ko'rishi mumkin</div>
              </div>
              <Switch checked={course.published} onCheckedChange={(v) => saveCourse({ published: v })} />
            </div>
            <div className="sm:col-span-2 flex justify-between">
              <Button variant="destructive" onClick={delCourse}><Trash2 className="mr-2 h-4 w-4" /> Kursni o'chirish</Button>
              {savingCourse && <span className="text-xs text-muted-foreground self-center">Saqlanmoqda...</span>}
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Modullar va darslar</h2>
            <Button onClick={() => addModule.mutate()} disabled={addModule.isPending}><Plus className="mr-2 h-4 w-4" /> Modul</Button>
          </div>

          {course.modules.length === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Hozircha modullar yo'q. Birinchi modulni qo'shing.</CardContent></Card>
          )}

          <Accordion type="multiple" defaultValue={course.modules.map((m: any) => m.id)} className="space-y-2">
            {course.modules.map((m: any, idx: number) => (
              <AccordionItem key={m.id} value={m.id} className="overflow-hidden rounded-lg border bg-card">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex w-full items-center gap-3 text-left">
                    <div className="grid h-8 w-8 place-items-center rounded bg-primary/10 font-display text-sm font-bold text-primary">{idx + 1}</div>
                    <Input
                      defaultValue={m.title}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => e.target.value !== m.title && renameModule(m.id, e.target.value)}
                      className="h-8 flex-1 max-w-md border-none bg-transparent font-display font-semibold shadow-none focus-visible:ring-1"
                    />
                    <Badge variant="outline">{m.lessons.length} dars</Badge>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); delModule(m.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t bg-muted/20 px-0 pb-0">
                  <ul className="divide-y">
                    {m.lessons.map((l: any) => <LessonRow key={l.id} lesson={l} onChange={invalidate} />)}
                    <li className="bg-muted/20 px-4 py-3">
                      <AddLessonDialog moduleId={m.id} courseId={courseId} position={m.lessons.length} onAdded={invalidate} />
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

function LessonRow({ lesson, onChange }: { lesson: any; onChange: () => void }) {
  const Icon = lesson.type === "presentation" ? FileText : lesson.type === "text" ? FileText : Video;
  const deleteVideo = useServerFn(deleteBunnyVideo);
  const del = async () => {
    if (!confirm(`"${lesson.title}" darsi o'chirilsinmi?`)) return;
    if (lesson.bunny_video_id) {
      try { await deleteVideo({ data: { videoId: lesson.bunny_video_id } }); } catch {}
    }
    const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
    if (error) return toast.error(error.message);
    toast.success("Dars o'chirildi"); onChange();
  };
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex-1">
        <div className="text-sm font-medium">{lesson.title}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{lesson.type}</span>
          {lesson.bunny_video_id && <Badge variant="outline" className="h-4 px-1 text-[10px]">Video yuklangan</Badge>}
          {lesson.has_quiz && <Badge variant="outline" className="h-4 px-1 text-[10px]"><ListChecks className="mr-0.5 h-2.5 w-2.5" /> Test</Badge>}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-destructive" onClick={del}><Trash2 className="h-4 w-4" /></Button>
    </li>
  );
}

function AddLessonDialog({ moduleId, courseId, position, onAdded }: { moduleId: string; courseId: string; position: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "presentation" | "text">("video");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const createVideo = useServerFn(createBunnyVideo);

  const reset = () => { setTitle(""); setType("video"); setFile(null); setProgress(0); setBusy(false); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    if (type === "video" && !file) return toast.error("Video fayl tanlang");
    setBusy(true);

    let bunnyVideoId: string | null = null;
    let bunnyLibraryId: string | null = null;

    try {
      if (type === "video" && file) {
        const sig = await createVideo({ data: { title } });
        bunnyVideoId = sig.videoId;
        bunnyLibraryId = sig.libraryId;
        const tus = await import("tus-js-client");
        await new Promise<void>((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: sig.endpoint,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
              AuthorizationSignature: sig.signature,
              AuthorizationExpire: String(sig.expire),
              VideoId: sig.videoId,
              LibraryId: sig.libraryId,
            },
            metadata: { filetype: file.type, title, filename: file.name },
            onError: (e: Error) => reject(e),
            onProgress: (sent: number, total: number) => setProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
          });
          upload.start();
        });
      }

      const { error } = await supabase.from("lessons").insert({
        module_id: moduleId,
        course_id: courseId,
        title,
        type,
        position,
        bunny_video_id: bunnyVideoId,
        bunny_library_id: bunnyLibraryId,
      });
      if (error) throw error;
      toast.success("Dars qo'shildi");
      setOpen(false);
      reset();
      onAdded();
    } catch (err: any) {
      toast.error(err.message ?? "Xatolik");
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full"><Plus className="mr-2 h-3.5 w-3.5" /> Dars qo'shish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Yangi dars</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>Sarlavha</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-2">
            <Label>Tur</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="presentation">Prezentatsiya</SelectItem>
                <SelectItem value="text">Matn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {type === "video" && (
            <div className="space-y-2">
              <Label>Video fayl</Label>
              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center text-muted-foreground transition-colors hover:bg-muted/50">
                <Upload className="h-7 w-7" />
                <div className="text-sm">{file ? file.name : "Video tanlang yoki tashlang"}</div>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              {busy && progress > 0 && (
                <div className="space-y-1"><Progress value={progress} /><div className="text-xs text-muted-foreground">{progress}% yuklandi</div></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={busy}><Save className="mr-2 h-4 w-4" /> {busy ? "Yuklanmoqda..." : "Saqlash"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}