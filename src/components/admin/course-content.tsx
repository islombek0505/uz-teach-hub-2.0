// Shared course/group content editor: modules, lessons (video/presentation/text),
// materials, quiz, slides. Extracted from the course route so the SAME editor can
// be reused inside a group (group-scoped content). Pass `groupId` to scope new
// modules/lessons to a group; omit it for legacy course-level content.
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createBunnyVideo, deleteBunnyVideo } from "@/lib/bunny.functions";
import { QuizQuestionsEditor } from "@/components/admin/quiz-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Video,
  FileText,
  ListChecks,
  Save,
  Upload,
  Pencil,
  Image as ImageIcon,
  Paperclip,
  Download,
  Presentation,
  GripVertical,
  X,
  ArrowUp,
  ArrowDown,
  Info,
  Clapperboard,
  Check,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function CourseSettingsCard({
  course,
  onSaved,
  onDelete,
}: {
  course: any;
  onSaved: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: course.title ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    published: !!course.published,
  });

  useEffect(() => {
    setForm({
      title: course.title ?? "",
      description: course.description ?? "",
      category: course.category ?? "",
      published: !!course.published,
    });
  }, [course.id, course.updated_at]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("courses")
      .update({
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        published: form.published,
      })
      .eq("id", course.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Sozlamalar saqlandi");
    onSaved();
    setEditing(false);
  };

  if (!editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="font-display">Kurs sozlamalari</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5" /> Tahrirlash
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <CoverPreview coverUrl={course.cover_url} />
          </div>
          <div className="space-y-3 sm:col-span-2">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Nomi</div>
              <div className="font-display text-lg font-semibold">{course.title}</div>
            </div>
            {course.description && (
              <div>
                <div className="text-xs uppercase text-muted-foreground">Tavsif</div>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Kategoriya</div>
                <div className="text-sm">{course.category || "—"}</div>
              </div>
            </div>
            <div>
              <Badge variant={course.published ? "default" : "secondary"}>
                {course.published ? "Nashr etilgan" : "Qoralama"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="font-display">Kurs sozlamalari</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={busy}>
            <X className="mr-1 h-3.5 w-3.5" /> Bekor
          </Button>
          <Button size="sm" onClick={save} disabled={busy}>
            <Save className="mr-2 h-3.5 w-3.5" /> {busy ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <CoverUploader courseId={course.id} coverUrl={course.cover_url} onChange={onSaved} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Nomi</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Tavsif</Label>
          <Textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Kategoriya</Label>
          <Input
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="text-sm font-medium">Nashr etilgan</div>
            <div className="text-xs text-muted-foreground">O'quvchilar ko'rishi mumkin</div>
          </div>
          <Switch
            checked={form.published}
            onCheckedChange={(v) => setForm((s) => ({ ...s, published: v }))}
          />
        </div>
        <div className="sm:col-span-2 flex justify-between border-t pt-4">
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Kursni o'chirish
          </Button>
          <Button onClick={save} disabled={busy}>
            <Save className="mr-2 h-4 w-4" /> {busy ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CoverPreview({ coverUrl }: { coverUrl: string | null }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let off = false;
    (async () => {
      if (!coverUrl) {
        setUrl(null);
        return;
      }
      if (coverUrl.startsWith("http")) {
        setUrl(coverUrl);
        return;
      }
      const { data } = await supabase.storage
        .from("course-covers")
        .createSignedUrl(coverUrl, 60 * 60);
      if (!off) setUrl(data?.signedUrl ?? null);
    })();
    return () => {
      off = true;
    };
  }, [coverUrl]);
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full place-items-center text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
    </div>
  );
}

export function ModulesEditor({
  modules,
  courseId,
  groupId,
  onChange,
  onUpdateModule,
  onDeleteModule,
}: {
  modules: any[];
  courseId: string;
  groupId?: string;
  onChange: () => void;
  onUpdateModule: (id: string, patch: { title?: string; description?: string | null }) => void;
  onDeleteModule: (id: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = modules.map((m) => m.id);

  const handleEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    const ordered = arrayMove(modules, oldIdx, newIdx);
    // 2-phase: temp negative, then final
    await Promise.all(
      ordered.map((m, i) =>
        supabase
          .from("modules")
          .update({ position: -(i + 1) })
          .eq("id", m.id),
      ),
    );
    await Promise.all(
      ordered.map((m, i) => supabase.from("modules").update({ position: i }).eq("id", m.id)),
    );
    onChange();
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Accordion type="multiple" defaultValue={ids} className="space-y-2">
          {modules.map((m, idx) => (
            <SortableModule
              key={m.id}
              m={m}
              idx={idx}
              courseId={courseId}
              groupId={groupId}
              onChange={onChange}
              onUpdateModule={onUpdateModule}
              onDeleteModule={onDeleteModule}
            />
          ))}
        </Accordion>
      </SortableContext>
    </DndContext>
  );
}

function SortableModule({
  m,
  idx,
  courseId,
  groupId,
  onChange,
  onUpdateModule,
  onDeleteModule,
}: {
  m: any;
  idx: number;
  courseId: string;
  groupId?: string;
  onChange: () => void;
  onUpdateModule: (id: string, patch: { title?: string; description?: string | null }) => void;
  onDeleteModule: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: m.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={m.id} className="overflow-hidden rounded-lg border bg-card">
        <AccordionTrigger className="px-2 py-3 hover:no-underline">
          <div className="flex w-full items-center gap-2 text-left">
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
              aria-label="Tartiblash"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="grid h-8 w-8 place-items-center rounded bg-primary/10 font-display text-sm font-bold text-primary">
              {idx + 1}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-display text-sm font-semibold">{m.title}</span>
              {m.description && (
                <span className="truncate text-xs text-muted-foreground">{m.description}</span>
              )}
            </div>
            <Badge variant="outline">{m.lessons.length} dars</Badge>
            <EditModuleDialog
              m={m}
              onSaved={(p: { title?: string; description?: string | null }) =>
                onUpdateModule(m.id, p)
              }
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteModule(m.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t bg-muted/20 px-0 pb-0">
          <SortableLessons lessons={m.lessons} onChange={onChange} />
          <div className="bg-muted/20 px-4 py-3">
            <AddLessonDialog
              moduleId={m.id}
              courseId={courseId}
              groupId={groupId}
              onAdded={onChange}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function SortableLessons({ lessons, onChange }: { lessons: any[]; onChange: () => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = lessons.map((l) => l.id);
  const handleEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(active.id as string);
    const newIdx = ids.indexOf(over.id as string);
    const ordered = arrayMove(lessons, oldIdx, newIdx);
    await Promise.all(
      ordered.map((l, i) =>
        supabase
          .from("lessons")
          .update({ position: -(i + 1) })
          .eq("id", l.id),
      ),
    );
    await Promise.all(
      ordered.map((l, i) => supabase.from("lessons").update({ position: i }).eq("id", l.id)),
    );
    onChange();
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="divide-y">
          {lessons.map((l, li) => (
            <LessonRow key={l.id} lesson={l} index={li} onChange={onChange} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function LessonRow({
  lesson,
  index,
  onChange,
}: {
  lesson: any;
  index: number;
  onChange: () => void;
}) {
  const typeMeta =
    lesson.type === "presentation"
      ? {
          Icon: Presentation,
          chip: "bg-[oklch(0.55_0.13_220/0.12)] text-[oklch(0.45_0.13_240)]",
          label: "Prezentatsiya",
        }
      : lesson.type === "text"
        ? { Icon: FileText, chip: "bg-warning/15 text-warning", label: "Matn" }
        : { Icon: Video, chip: "bg-primary/10 text-primary", label: "Video" };
  const { Icon } = typeMeta;
  const deleteVideo = useServerFn(deleteBunnyVideo);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  const del = async () => {
    if (!confirm(`"${lesson.title}" darsi o'chirilsinmi?`)) return;
    if (lesson.bunny_video_id) {
      try {
        await deleteVideo({ data: { videoId: lesson.bunny_video_id } });
      } catch {}
    }
    const { error } = await supabase.from("lessons").delete().eq("id", lesson.id);
    if (error) return toast.error(error.message);
    toast.success("Dars o'chirildi");
    onChange();
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-card px-3 py-2.5 transition-colors hover:bg-muted/40"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 text-muted-foreground/60 hover:text-foreground active:cursor-grabbing"
        aria-label="Tartiblash"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="w-5 shrink-0 text-center text-xs font-semibold text-muted-foreground">
        {index + 1}
      </span>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${typeMeta.chip}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{lesson.title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{typeMeta.label}</span>
          {lesson.bunny_video_id && (
            <Badge variant="outline" className="h-4 gap-0.5 px-1 text-[10px]">
              <Check className="h-2.5 w-2.5 text-success" /> Video
            </Badge>
          )}
          {lesson.has_quiz && (
            <Badge variant="outline" className="h-4 gap-0.5 px-1 text-[10px]">
              <ListChecks className="h-2.5 w-2.5" /> Test
            </Badge>
          )}
        </div>
      </div>
      <LessonEditDialog lesson={lesson} onChange={onChange} />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={del}
        aria-label="Darsni o'chirish"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}

function CoverUploader({
  courseId,
  coverUrl,
  onChange,
}: {
  courseId: string;
  coverUrl: string | null;
  onChange: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!coverUrl) {
        setPreviewUrl(null);
        return;
      }
      if (coverUrl.startsWith("http")) {
        setPreviewUrl(coverUrl);
        return;
      }
      const { data } = await supabase.storage
        .from("course-covers")
        .createSignedUrl(coverUrl, 60 * 60);
      if (!cancelled) setPreviewUrl(data?.signedUrl ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [coverUrl]);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${courseId}/cover-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("course-covers")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error } = await supabase
        .from("courses")
        .update({ cover_url: path })
        .eq("id", courseId);
      if (error) throw error;
      toast.success("Kurs rasmi yangilandi");
      onChange();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!coverUrl) return;
    if (!confirm("Kurs rasmi o'chirilsinmi?")) return;
    if (!coverUrl.startsWith("http")) {
      await supabase.storage.from("course-covers").remove([coverUrl]);
    }
    await supabase.from("courses").update({ cover_url: null }).eq("id", courseId);
    onChange();
  };

  return (
    <div className="space-y-2">
      <Label>Kurs muqovasi</Label>
      <div className="flex items-start gap-4">
        <div className="relative aspect-[16/9] w-64 overflow-hidden rounded-lg border bg-muted">
          {previewUrl ? (
            <img src={previewUrl} alt="Kurs muqovasi" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" />{" "}
            {busy ? "Yuklanmoqda..." : coverUrl ? "Rasmni almashtirish" : "Rasm yuklash"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          {coverUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={remove}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" /> O'chirish
            </Button>
          )}
          <p className="text-xs text-muted-foreground">16:9 nisbatda JPG/PNG tavsiya etiladi.</p>
        </div>
      </div>
    </div>
  );
}

function LessonEditDialog({ lesson, onChange }: { lesson: any; onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [content, setContent] = useState(lesson.content ?? "");
  const [type, setType] = useState<"video" | "presentation" | "text">(lesson.type);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const createVideo = useServerFn(createBunnyVideo);
  const deleteVideo = useServerFn(deleteBunnyVideo);

  useEffect(() => {
    if (!open) return;
    setTitle(lesson.title);
    setDescription(lesson.description ?? "");
    setContent(lesson.content ?? "");
    setType(lesson.type);
    setFile(null);
    setProgress(0);
  }, [open, lesson]);

  const save = async () => {
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    setBusy(true);
    try {
      const patch: any = {
        title,
        description: description || null,
        content: content || null,
        type,
      };

      if (type === "video" && file) {
        // If a previous video exists, replace it
        if (lesson.bunny_video_id) {
          try {
            await deleteVideo({ data: { videoId: lesson.bunny_video_id } });
          } catch {}
        }
        const sig = await createVideo({ data: { title } });
        patch.bunny_video_id = sig.videoId;
        patch.bunny_library_id = sig.libraryId;
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
            onProgress: (sent: number, total: number) =>
              setProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
          });
          upload.start();
        });
      }

      if (type !== "video" && lesson.bunny_video_id) {
        try {
          await deleteVideo({ data: { videoId: lesson.bunny_video_id } });
        } catch {}
        patch.bunny_video_id = null;
        patch.bunny_library_id = null;
      }

      const { error } = await supabase.from("lessons").update(patch).eq("id", lesson.id);
      if (error) throw error;
      toast.success("Saqlandi");
      onChange();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 font-display">
            <Pencil className="h-4 w-4 text-primary" /> Darsni tahrirlash
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b px-6 pt-2">
            <TabsList className="h-auto w-full justify-start gap-1 bg-transparent p-0">
              <TabsTrigger value="basic" className="gap-1.5 data-[state=active]:bg-muted">
                <Info className="h-4 w-4" /> Asosiy
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1.5 data-[state=active]:bg-muted">
                <FileText className="h-4 w-4" /> Mazmun
              </TabsTrigger>
              <TabsTrigger value="materials" className="gap-1.5 data-[state=active]:bg-muted">
                <Paperclip className="h-4 w-4" /> Materiallar
              </TabsTrigger>
              <TabsTrigger value="quiz" className="gap-1.5 data-[state=active]:bg-muted">
                <ListChecks className="h-4 w-4" /> Test
                {lesson.has_quiz && (
                  <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {/* ---- Tab: Asosiy ---- */}
            <TabsContent value="basic" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Sarlavha</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Qisqa tavsif</Label>
                <Textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Dars haqida bir-ikki gap"
                />
              </div>
              <div className="space-y-2">
                <Label>Dars turi</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">🎬 Video</SelectItem>
                    <SelectItem value="presentation">📊 Prezentatsiya</SelectItem>
                    <SelectItem value="text">📝 Matn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === "video" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Clapperboard className="h-4 w-4 text-primary" /> Video{" "}
                    {lesson.bunny_video_id ? "(almashtirish)" : ""}
                  </Label>
                  {lesson.bunny_video_id && !file && (
                    <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2 text-sm text-success">
                      <Check className="h-4 w-4" /> Video allaqachon yuklangan
                    </div>
                  )}
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50">
                    <Upload className="h-7 w-7" />
                    <div className="text-sm">
                      {file
                        ? file.name
                        : lesson.bunny_video_id
                          ? "Yangi video tanlang (ixtiyoriy)"
                          : "Video tanlang"}
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  {busy && progress > 0 && (
                    <div className="space-y-1">
                      <Progress value={progress} />
                      <div className="text-xs text-muted-foreground">{progress}% yuklandi</div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* ---- Tab: Mazmun ---- */}
            <TabsContent value="content" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>
                  {type === "presentation"
                    ? "Prezentatsiya mazmuni"
                    : type === "text"
                      ? "Matn mazmuni"
                      : "Qo'shimcha matn (ixtiyoriy)"}
                </Label>
                <Textarea
                  rows={9}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    "HTML qo'llab-quvvatlanadi. Masalan: <h2>Mavzu</h2><p>...</p><ul><li>...</li></ul>"
                  }
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Mazmun darslik sahifasida to'g'ridan-to'g'ri ko'rsatiladi (yuklanmaydi).
                </p>
              </div>
              <LessonPresentationUploader lesson={lesson} />
            </TabsContent>

            {/* ---- Tab: Materiallar ---- */}
            <TabsContent value="materials" className="mt-0">
              <MaterialsManager lessonId={lesson.id} />
            </TabsContent>

            {/* ---- Tab: Test ---- */}
            <TabsContent value="quiz" className="mt-0">
              <QuizQuestionsEditor
                lessonId={lesson.id}
                initialThreshold={lesson.pass_threshold ?? 80}
                onSaved={onChange}
              />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
            Yopish
          </Button>
          <Button onClick={save} disabled={busy}>
            <Save className="mr-2 h-4 w-4" /> {busy ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddModuleDialog({
  courseId,
  groupId,
  nextPosition,
  onAdded,
}: {
  courseId: string;
  groupId?: string;
  nextPosition: number;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("modules").insert({
      course_id: groupId ? null : courseId,
      group_id: groupId ?? null,
      title: title.trim(),
      description: description.trim() || null,
      position: nextPosition,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Modul qo'shildi");
    setTitle("");
    setDescription("");
    setOpen(false);
    onAdded();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Modul
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi modul</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Modul nomi</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: ReactJS asoslari"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tavsif</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu modulda nimalar o'rganiladi?"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saqlanmoqda..." : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditModuleDialog({
  m,
  onSaved,
}: {
  m: any;
  onSaved: (patch: { title?: string; description?: string | null }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(m.title ?? "");
  const [description, setDescription] = useState(m.description ?? "");
  useEffect(() => {
    setTitle(m.title ?? "");
    setDescription(m.description ?? "");
  }, [m.title, m.description]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaved({ title: title.trim(), description: description.trim() || null });
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          aria-label="Modulni tahrirlash"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Modulni tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Modul nomi</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Tavsif</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bu modulda nimalar o'rganiladi?"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Saqlash</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MaterialsManager({ lessonId }: { lessonId: string }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: materials = [] } = useQuery({
    queryKey: ["admin", "lesson-materials", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_materials")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "lesson-materials", lessonId] });

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${lessonId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("materials")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { error } = await supabase.from("lesson_materials").insert({
        lesson_id: lessonId,
        name: file.name,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (error) throw error;
      toast.success("Material qo'shildi");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  const del = async (m: any) => {
    if (!confirm(`"${m.name}" o'chirilsinmi?`)) return;
    await supabase.storage.from("materials").remove([m.storage_path]);
    await supabase.from("lesson_materials").delete().eq("id", m.id);
    refresh();
  };

  return (
    <div className="space-y-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">
          <Paperclip className="mr-1 inline h-3.5 w-3.5" /> Qo'shimcha materiallar
        </Label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted">
          <Upload className="h-3.5 w-3.5" /> {busy ? "Yuklanmoqda..." : "Fayl qo'shish"}
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                upload(f);
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {materials.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          PDF, rasm, slayd va boshqa fayllarni shu yerda qo'shing.
        </p>
      ) : (
        <ul className="divide-y">
          {materials.map((m: any) => (
            <li key={m.id} className="flex items-center gap-2 py-2 text-sm">
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1 truncate">{m.name}</span>
              <span className="text-xs text-muted-foreground">
                {m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : ""}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => del(m)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddLessonDialog({
  moduleId,
  courseId,
  groupId,
  onAdded,
}: {
  moduleId: string;
  courseId: string;
  groupId?: string;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"video" | "presentation" | "text">("video");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const createVideo = useServerFn(createBunnyVideo);

  const reset = () => {
    setTitle("");
    setType("video");
    setFile(null);
    setProgress(0);
    setBusy(false);
  };

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
            onProgress: (sent: number, total: number) =>
              setProgress(Math.round((sent / total) * 100)),
            onSuccess: () => resolve(),
          });
          upload.start();
        });
      }

      // Compute next position from DB to avoid race conditions when adding quickly
      const { data: last } = await supabase
        .from("lessons")
        .select("position")
        .eq("module_id", moduleId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextPosition = ((last?.position ?? -1) as number) + 1;

      const { error } = await supabase.from("lessons").insert({
        module_id: moduleId,
        course_id: groupId ? null : courseId,
        group_id: groupId ?? null,
        title,
        type,
        position: nextPosition,
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
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="mr-2 h-3.5 w-3.5" /> Dars qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Yangi dars</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Dars sarlavhasi</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Kirish — React nima?"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Dars turini tanlang</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "video", label: "Video", Icon: Video },
                { value: "presentation", label: "Prezentatsiya", Icon: Presentation },
                { value: "text", label: "Matn", Icon: FileText },
              ].map((opt) => {
                const active = type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value as any)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                      active
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/40"
                    }`}
                  >
                    <opt.Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {type === "video" && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Clapperboard className="h-4 w-4 text-primary" /> Video fayl
              </Label>
              <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50">
                <Upload className="h-7 w-7" />
                <div className="text-sm">{file ? file.name : "Video tanlang yoki tashlang"}</div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {busy && progress > 0 && (
                <div className="space-y-1">
                  <Progress value={progress} />
                  <div className="text-xs text-muted-foreground">{progress}% yuklandi</div>
                </div>
              )}
            </div>
          )}
          {type !== "video" && (
            <p className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
              Darsni qo'shgandan so'ng "Tahrirlash" orqali mazmun, materiallar va test qo'shasiz.
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              <Save className="mr-2 h-4 w-4" /> {busy ? "Yuklanmoqda..." : "Dars qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Reusable slides editor. Manages an ordered list of image storage paths in
 * the "presentations" bucket. Calls onChange whenever the array is updated
 * and the caller is expected to persist it.
 */
function SlidesEditor({
  pathPrefix,
  slides,
  onChange,
}: {
  pathPrefix: string;
  slides: string[];
  onChange: (next: string[]) => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const paths = slides.filter((s) => !s.startsWith("http") && !previews[s]);
      if (!paths.length) return;
      const { data } = await supabase.storage
        .from("presentations")
        .createSignedUrls(paths, 60 * 60);
      if (cancelled || !data) return;
      setPreviews((prev) => {
        const next = { ...prev };
        for (const it of data) if (it.path && it.signedUrl) next[it.path] = it.signedUrl;
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.join("|")]);

  const upload = async (files: FileList) => {
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: faqat rasm fayllari qabul qilinadi`);
          continue;
        }
        const ext = file.name.split(".").pop() || "png";
        const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from("presentations")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          toast.error(error.message);
          continue;
        }
        uploaded.push(path);
      }
      if (uploaded.length) await onChange([...slides, ...uploaded]);
    } finally {
      setBusy(false);
    }
  };

  const removeAt = async (i: number) => {
    const path = slides[i];
    if (!confirm(`Slayd ${i + 1} o'chirilsinmi?`)) return;
    if (path && !path.startsWith("http")) {
      await supabase.storage.from("presentations").remove([path]);
    }
    await onChange(slides.filter((_, idx) => idx !== i));
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    await onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{slides.length} ta slayd</div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted">
          <Upload className="h-3.5 w-3.5" /> {busy ? "Yuklanmoqda..." : "Slayd rasm(lar) qo'shish"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              if (e.target.files?.length) {
                upload(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </label>
      </div>
      {slides.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          PowerPoint yoki PDF dan slaydlarni rasm (PNG/JPG) qilib eksport qilib, ketma-ket yuklang.
          O'quvchilar ularni karusel ko'rinishida ko'radi va yuklab ololmaydi.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {slides.map((path, i) => (
            <li
              key={path + i}
              className="group relative overflow-hidden rounded-md border bg-muted"
            >
              <div className="aspect-video w-full bg-black">
                {previews[path] || path.startsWith("http") ? (
                  <img
                    src={path.startsWith("http") ? path : previews[path]}
                    alt={`Slayd ${i + 1}`}
                    className="h-full w-full object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-white/60">
                    ...
                  </div>
                )}
              </div>
              <div className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                #{i + 1}
              </div>
              <div className="absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6"
                    disabled={i === slides.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-6 w-6"
                  onClick={() => removeAt(i)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LessonPresentationUploader({ lesson }: { lesson: any }) {
  const qc = useQueryClient();
  const [slides, setSlides] = useState<string[]>(lesson.presentation_slides ?? []);
  const [htmlPath, setHtmlPath] = useState<string | null>(lesson.presentation_html_path ?? null);
  const [mode, setMode] = useState<"images" | "html">(
    lesson.presentation_html_path ? "html" : "images",
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSlides(lesson.presentation_slides ?? []);
    setHtmlPath(lesson.presentation_html_path ?? null);
    setMode(lesson.presentation_html_path ? "html" : "images");
  }, [lesson.id, lesson.presentation_slides, lesson.presentation_html_path]);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "course"] });

  // Saving image slides also clears any HTML deck (one format per lesson).
  const persistSlides = async (next: string[]) => {
    setSlides(next);
    const patch: any = { presentation_slides: next };
    if (htmlPath && next.length > 0) {
      await supabase.storage
        .from("presentations")
        .remove([htmlPath])
        .catch(() => {});
      patch.presentation_html_path = null;
      setHtmlPath(null);
    }
    const { error } = await supabase.from("lessons").update(patch).eq("id", lesson.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  };

  const uploadHtml = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".html") && file.type !== "text/html") {
      toast.error("Faqat .html fayl yuklang");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fayl 5MB dan kichik bo'lsin");
      return;
    }
    setBusy(true);
    try {
      if (htmlPath)
        await supabase.storage
          .from("presentations")
          .remove([htmlPath])
          .catch(() => {});
      const path = `lessons/${lesson.id}/deck-${Date.now()}.html`;
      const { error: upErr } = await supabase.storage
        .from("presentations")
        .upload(path, file, { contentType: "text/html", upsert: false });
      if (upErr) throw upErr;
      // Switch the lesson to HTML and clear image slides.
      if (slides.length) {
        const oldImgs = slides.filter((s) => !s.startsWith("http"));
        if (oldImgs.length)
          await supabase.storage
            .from("presentations")
            .remove(oldImgs)
            .catch(() => {});
      }
      const { error } = await supabase
        .from("lessons")
        .update({ presentation_html_path: path, presentation_slides: [] } as any)
        .eq("id", lesson.id);
      if (error) throw error;
      setHtmlPath(path);
      setSlides([]);
      toast.success("HTML prezentatsiya yuklandi");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  const removeHtml = async () => {
    if (!confirm("HTML prezentatsiya o'chirilsinmi?")) return;
    setBusy(true);
    try {
      if (htmlPath)
        await supabase.storage
          .from("presentations")
          .remove([htmlPath])
          .catch(() => {});
      const { error } = await supabase
        .from("lessons")
        .update({ presentation_html_path: null } as any)
        .eq("id", lesson.id);
      if (error) throw error;
      setHtmlPath(null);
      toast.success("O'chirildi");
      refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  const tabCls = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:bg-muted/70"
    }`;

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <Label className="text-sm font-semibold">
        <Presentation className="mr-1 inline h-3.5 w-3.5" /> Dars prezentatsiyasi
      </Label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("images")}
          className={tabCls(mode === "images")}
        >
          Rasm slaydlar
        </button>
        <button type="button" onClick={() => setMode("html")} className={tabCls(mode === "html")}>
          HTML fayl
        </button>
      </div>

      {mode === "images" ? (
        <>
          {htmlPath && (
            <p className="text-xs text-warning">
              Bu darsda HTML prezentatsiya bor. Rasm slayd qo'shsangiz, HTML o'chiriladi.
            </p>
          )}
          <SlidesEditor
            pathPrefix={`lessons/${lesson.id}`}
            slides={slides}
            onChange={persistSlides}
          />
        </>
      ) : (
        <div className="space-y-2">
          {slides.length > 0 && (
            <p className="text-xs text-warning">
              Bu darsda rasm slaydlar bor. HTML yuklasangiz, slaydlar o'chiriladi.
            </p>
          )}
          {htmlPath ? (
            <div className="flex items-center justify-between rounded-md border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-primary" /> HTML prezentatsiya yuklangan
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-destructive"
                onClick={removeHtml}
                disabled={busy}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> O'chirish
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground hover:bg-muted/50">
              <Upload className="h-5 w-5" />
              <span>{busy ? "Yuklanmoqda..." : "HTML fayl tanlang (.html, ≤5MB)"}</span>
              <input
                type="file"
                accept=".html,text/html"
                className="hidden"
                disabled={busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.currentTarget.value = "";
                  if (f) uploadHtml(f);
                }}
              />
            </label>
          )}
          <p className="text-xs text-muted-foreground">
            Mustaqil (bitta) HTML fayl yuklang — tashqi skript/havolalarsiz ishlaydigan slayd.
          </p>
        </div>
      )}
    </div>
  );
}

export function CoursePresentationsManager({ courseId }: { courseId: string }) {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["admin", "course-presentations", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_presentations")
        .select("*")
        .eq("course_id", courseId)
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });
  const refresh = () =>
    qc.invalidateQueries({ queryKey: ["admin", "course-presentations", courseId] });

  const del = async (item: any) => {
    if (!confirm(`"${item.title}" o'chirilsinmi?`)) return;
    const paths: string[] = (item.slides ?? []).filter((s: string) => s && !s.startsWith("http"));
    if (paths.length) {
      await supabase.storage.from("presentations").remove(paths);
    }
    const { error } = await supabase.from("course_presentations").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const move = async (item: any, dir: -1 | 1) => {
    const idx = items.findIndex((i: any) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase
      .from("course_presentations")
      .update({ position: swap.position })
      .eq("id", item.id);
    await supabase
      .from("course_presentations")
      .update({ position: item.position })
      .eq("id", swap.id);
    refresh();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Takrorlash prezentatsiyalari</h2>
        <AddCoursePresentationDialog
          courseId={courseId}
          position={items.length}
          onAdded={refresh}
        />
      </div>
      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Hozircha alohida prezentatsiyalar yo'q. 5-6 darsni bir prezentatsiyada jamlash uchun
            yangisini qo'shing.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <CoursePresentationCardAdmin
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              onMoveUp={() => move(item, -1)}
              onMoveDown={() => move(item, 1)}
              onDelete={() => del(item)}
              onChanged={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CoursePresentationCardAdmin({
  item,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onChanged,
}: {
  item: any;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [title, setTitle] = useState<string>(item.title);
  const [description, setDescription] = useState<string>(item.description ?? "");
  const [slides, setSlides] = useState<string[]>(item.slides ?? []);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setSlides(item.slides ?? []);
  }, [item.id, item.title, item.description, item.slides]);

  const saveField = async (patch: any) => {
    const { error } = await supabase.from("course_presentations").update(patch).eq("id", item.id);
    if (error) toast.error(error.message);
    else onChanged();
  };

  const persistSlides = async (next: string[]) => {
    setSlides(next);
    const { error } = await supabase
      .from("course_presentations")
      .update({ slides: next })
      .eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onChanged();
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== item.title && saveField({ title })}
            className="h-9 flex-1"
          />
          <Badge variant="outline">{slides.length} slayd</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={index === total - 1}
            onClick={onMoveDown}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Yopish" : "Tahrirlash"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        {expanded && (
          <div className="space-y-3 border-t pt-3">
            <div className="space-y-1">
              <Label className="text-xs">Tavsif</Label>
              <Textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() =>
                  description !== (item.description ?? "") &&
                  saveField({ description: description || null })
                }
                placeholder="Masalan: 1-5 darslar takrori"
              />
            </div>
            <SlidesEditor
              pathPrefix={`courses/${item.course_id}/${item.id}`}
              slides={slides}
              onChange={persistSlides}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddCoursePresentationDialog({
  courseId,
  position,
  onAdded,
}: {
  courseId: string;
  position: number;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    setBusy(true);
    try {
      const { error } = await supabase.from("course_presentations").insert({
        course_id: courseId,
        title,
        description: description || null,
        slides: [],
        position,
      });
      if (error) throw error;
      toast.success("Qo'shildi. Endi slayd rasmlarni yuklang.");
      setOpen(false);
      setTitle("");
      setDescription("");
      onAdded();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Yangi prezentatsiya
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Yangi takrorlash prezentatsiyasi</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Sarlavha</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Tavsif (ixtiyoriy)</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: 1-5 darslar takrori"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Sarlavhani saqlagandan keyin slayd rasmlarini "Tahrirlash" tugmasi orqali yuklaysiz.
          </p>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              {busy ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
