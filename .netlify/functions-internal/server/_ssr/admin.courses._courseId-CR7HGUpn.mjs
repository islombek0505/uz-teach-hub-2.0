import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { P as Progress } from "./progress-D3GtpSk9.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-sifHCTRo.mjs";
import { A as Accordion, a as AccordionItem, b as AccordionTrigger, c as AccordionContent } from "./accordion-jnLYA7X7.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-Cbl1egtb.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { c as createBunnyVideo, d as deleteBunnyVideo } from "./bunny.functions-B7NW5dwe.mjs";
import { f as useSensors, h as useSensor, D as DndContext, i as closestCenter, j as KeyboardSensor, P as PointerSensor } from "../_libs/dnd-kit__core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, s as sortableKeyboardCoordinates, u as useSortable } from "../_libs/dnd-kit__sortable.mjs";
import { C as CSS } from "../_libs/dnd-kit__utilities.mjs";
import { a as Route$2 } from "./router-DajYyTeL.mjs";
import "../_libs/seroval.mjs";
import { W as ChevronLeft, a0 as Pencil, a5 as X, af as Save, a1 as Trash2, Z as Plus, a6 as Image, w as Upload, ag as GripVertical, ah as ArrowUp, ai as ArrowDown, aj as Presentation, ak as FileText, V as Video, ad as ListChecks, al as Paperclip, am as Download } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-accordion.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-B51iIGrX.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./auth-middleware-BCSfl_Vl.mjs";
import "../_libs/dnd-kit__accessibility.mjs";
function EditCourse() {
  const {
    courseId
  } = Route$2.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const {
    data: course,
    isLoading
  } = useQuery({
    queryKey: ["admin", "course", courseId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("courses").select("*, modules(*, lessons(*))").eq("id", courseId).maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      data.modules = (data.modules ?? []).sort((a, b) => a.position - b.position);
      for (const m of data.modules) m.lessons = (m.lessons ?? []).sort((a, b) => a.position - b.position);
      return data;
    }
  });
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["admin", "course", courseId]
  });
  const delModule = async (id) => {
    if (!confirm("Modulni va undagi barcha darslarni o'chirishni tasdiqlaysizmi?")) return;
    const {
      error
    } = await supabase.from("modules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("O'chirildi");
    invalidate();
  };
  const updateModule = async (id, patch) => {
    const {
      error
    } = await supabase.from("modules").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else invalidate();
  };
  const delCourse = async () => {
    if (!confirm("Kurs butunlay o'chiriladi. Davom etamizmi?")) return;
    const {
      error
    } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return toast.error(error.message);
    toast.success("Kurs o'chirildi");
    navigate({
      to: "/admin/courses"
    });
  };
  if (isLoading || !course) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6 text-muted-foreground", children: "Yuklanmoqda..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: `Tahrirlash: ${course.title}`, initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/courses", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
        " Kurslarga qaytish"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CourseSettingsCard, { course, onSaved: invalidate, onDelete: delCourse }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Modullar va darslar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AddModuleDialog, { courseId, nextPosition: course.modules.length, onAdded: invalidate })
        ] }),
        course.modules.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8 text-center text-muted-foreground", children: "Hozircha modullar yo'q. Birinchi modulni qo'shing." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ModulesEditor, { modules: course.modules, courseId, onChange: invalidate, onUpdateModule: updateModule, onDeleteModule: delModule })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CoursePresentationsManager, { courseId })
    ] })
  ] });
}
function CourseSettingsCard({
  course,
  onSaved,
  onDelete
}) {
  const [editing, setEditing] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    title: course.title ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    published: !!course.published
  });
  reactExports.useEffect(() => {
    setForm({
      title: course.title ?? "",
      description: course.description ?? "",
      category: course.category ?? "",
      published: !!course.published
    });
  }, [course.id, course.updated_at]);
  const save = async () => {
    setBusy(true);
    const {
      error
    } = await supabase.from("courses").update({
      title: form.title,
      description: form.description || null,
      category: form.category || null,
      published: form.published
    }).eq("id", course.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Sozlamalar saqlandi");
    onSaved();
    setEditing(false);
  };
  if (!editing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-3 space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Kurs sozlamalari" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setEditing(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-2 h-3.5 w-3.5" }),
          " Tahrirlash"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoverPreview, { coverUrl: course.cover_url }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Nomi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: course.title })
          ] }),
          course.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Tavsif" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: course.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Kategoriya" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: course.category || "—" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: course.published ? "default" : "secondary", children: course.published ? "Nashr etilgan" : "Qoralama" }) })
        ] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between gap-3 space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Kurs sozlamalari" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setEditing(false), disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-3.5 w-3.5" }),
          " Bekor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: save, disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-3.5 w-3.5" }),
          " ",
          busy ? "Saqlanmoqda..." : "Saqlash"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CoverUploader, { courseId: course.id, coverUrl: course.cover_url, onChange: onSaved }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nomi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title, onChange: (e) => setForm((s) => ({
          ...s,
          title: e.target.value
        })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tavsif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: form.description, onChange: (e) => setForm((s) => ({
          ...s,
          description: e.target.value
        })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kategoriya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.category, onChange: (e) => setForm((s) => ({
          ...s,
          category: e.target.value
        })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Nashr etilgan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "O'quvchilar ko'rishi mumkin" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: form.published, onCheckedChange: (v) => setForm((s) => ({
          ...s,
          published: v
        })) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 flex justify-between border-t pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: onDelete, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-2 h-4 w-4" }),
          " Kursni o'chirish"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: save, disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
          " ",
          busy ? "Saqlanmoqda..." : "Saqlash"
        ] })
      ] })
    ] })
  ] });
}
function CoverPreview({
  coverUrl
}) {
  const [url, setUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
      const {
        data
      } = await supabase.storage.from("course-covers").createSignedUrl(coverUrl, 60 * 60);
      if (!off) setUrl(data?.signedUrl ?? null);
    })();
    return () => {
      off = true;
    };
  }, [coverUrl]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] overflow-hidden rounded-lg border bg-muted", children: url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8" }) }) });
}
function ModulesEditor({
  modules,
  courseId,
  onChange,
  onUpdateModule,
  onDeleteModule
}) {
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const ids = modules.map((m) => m.id);
  const handleEnd = async (e) => {
    const {
      active,
      over
    } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(active.id);
    const newIdx = ids.indexOf(over.id);
    const ordered = arrayMove(modules, oldIdx, newIdx);
    await Promise.all(ordered.map((m, i) => supabase.from("modules").update({
      position: -(i + 1)
    }).eq("id", m.id)));
    await Promise.all(ordered.map((m, i) => supabase.from("modules").update({
      position: i
    }).eq("id", m.id)));
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: ids, strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion, { type: "multiple", defaultValue: ids, className: "space-y-2", children: modules.map((m, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(SortableModule, { m, idx, courseId, onChange, onUpdateModule, onDeleteModule }, m.id)) }) }) });
}
function SortableModule({
  m,
  idx,
  courseId,
  onChange,
  onUpdateModule,
  onDeleteModule
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: m.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: setNodeRef, style, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: m.id, className: "overflow-hidden rounded-lg border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "px-2 py-3 hover:no-underline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full items-center gap-2 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", ...attributes, ...listeners, onClick: (e) => e.stopPropagation(), className: "cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing", "aria-label": "Tartiblash", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded bg-primary/10 font-display text-sm font-bold text-primary", children: idx + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-display text-sm font-semibold", children: m.title }),
        m.description && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-muted-foreground", children: m.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
        m.lessons.length,
        " dars"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditModuleDialog, { m, onSaved: (p) => onUpdateModule(m.id, p) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive", onClick: (e) => {
        e.stopPropagation();
        onDeleteModule(m.id);
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionContent, { className: "border-t bg-muted/20 px-0 pb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SortableLessons, { lessons: m.lessons, onChange }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/20 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddLessonDialog, { moduleId: m.id, courseId, onAdded: onChange }) })
    ] })
  ] }) });
}
function SortableLessons({
  lessons,
  onChange
}) {
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const ids = lessons.map((l) => l.id);
  const handleEnd = async (e) => {
    const {
      active,
      over
    } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = ids.indexOf(active.id);
    const newIdx = ids.indexOf(over.id);
    const ordered = arrayMove(lessons, oldIdx, newIdx);
    await Promise.all(ordered.map((l, i) => supabase.from("lessons").update({
      position: -(i + 1)
    }).eq("id", l.id)));
    await Promise.all(ordered.map((l, i) => supabase.from("lessons").update({
      position: i
    }).eq("id", l.id)));
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: ids, strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: lessons.map((l, li) => /* @__PURE__ */ jsxRuntimeExports.jsx(LessonRow, { lesson: l, index: li, onChange }, l.id)) }) }) });
}
function LessonRow({
  lesson,
  index,
  onChange
}) {
  const Icon = lesson.type === "presentation" ? Presentation : lesson.type === "text" ? FileText : Video;
  const deleteVideo = useServerFn(deleteBunnyVideo);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: lesson.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1
  };
  const del = async () => {
    if (!confirm(`"${lesson.title}" darsi o'chirilsinmi?`)) return;
    if (lesson.bunny_video_id) {
      try {
        await deleteVideo({
          data: {
            videoId: lesson.bunny_video_id
          }
        });
      } catch {
      }
    }
    const {
      error
    } = await supabase.from("lessons").delete().eq("id", lesson.id);
    if (error) return toast.error(error.message);
    toast.success("Dars o'chirildi");
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { ref: setNodeRef, style, className: "flex items-center gap-3 px-4 py-3 bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", ...attributes, ...listeners, className: "cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing", "aria-label": "Tartiblash", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center text-xs font-semibold text-muted-foreground", children: index + 1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: lesson.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: lesson.type }),
        lesson.bunny_video_id && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-4 px-1 text-[10px]", children: "Video yuklangan" }),
        lesson.has_quiz && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "h-4 px-1 text-[10px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "mr-0.5 h-2.5 w-2.5" }),
          " Test"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LessonEditDialog, { lesson, onChange }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive", onClick: del, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
  ] });
}
function CoverUploader({
  courseId,
  coverUrl,
  onChange
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const [previewUrl, setPreviewUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
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
      const {
        data
      } = await supabase.storage.from("course-covers").createSignedUrl(coverUrl, 60 * 60);
      if (!cancelled) setPreviewUrl(data?.signedUrl ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [coverUrl]);
  const upload = async (file) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${courseId}/cover-${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("course-covers").upload(path, file, {
        upsert: true,
        contentType: file.type
      });
      if (upErr) throw upErr;
      const {
        error
      } = await supabase.from("courses").update({
        cover_url: path
      }).eq("id", courseId);
      if (error) throw error;
      toast.success("Kurs rasmi yangilandi");
      onChange();
    } catch (e) {
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
    await supabase.from("courses").update({
      cover_url: null
    }).eq("id", courseId);
    onChange();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kurs muqovasi" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[16/9] w-64 overflow-hidden rounded-lg border bg-muted", children: previewUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: previewUrl, alt: "Kurs muqovasi", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
          " ",
          busy ? "Yuklanmoqda..." : coverUrl ? "Rasmni almashtirish" : "Rasm yuklash",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", disabled: busy, onChange: (e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          } })
        ] }),
        coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "text-destructive", onClick: remove, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3.5 w-3.5" }),
          " O'chirish"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "16:9 nisbatda JPG/PNG tavsiya etiladi." })
      ] })
    ] })
  ] });
}
function LessonEditDialog({
  lesson,
  onChange
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState(lesson.title);
  const [description, setDescription] = reactExports.useState(lesson.description ?? "");
  const [content, setContent] = reactExports.useState(lesson.content ?? "");
  const [type, setType] = reactExports.useState(lesson.type);
  const [hasQuiz, setHasQuiz] = reactExports.useState(lesson.has_quiz);
  const [passThreshold, setPassThreshold] = reactExports.useState(lesson.pass_threshold ?? 80);
  const [file, setFile] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const createVideo = useServerFn(createBunnyVideo);
  const deleteVideo = useServerFn(deleteBunnyVideo);
  reactExports.useEffect(() => {
    if (!open) return;
    setTitle(lesson.title);
    setDescription(lesson.description ?? "");
    setContent(lesson.content ?? "");
    setType(lesson.type);
    setHasQuiz(lesson.has_quiz);
    setPassThreshold(lesson.pass_threshold ?? 80);
    setFile(null);
    setProgress(0);
  }, [open, lesson]);
  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    setBusy(true);
    try {
      const patch = {
        title,
        description: description || null,
        content: content || null,
        type,
        has_quiz: hasQuiz,
        pass_threshold: passThreshold
      };
      if (type === "video" && file) {
        if (lesson.bunny_video_id) {
          try {
            await deleteVideo({
              data: {
                videoId: lesson.bunny_video_id
              }
            });
          } catch {
          }
        }
        const sig = await createVideo({
          data: {
            title
          }
        });
        patch.bunny_video_id = sig.videoId;
        patch.bunny_library_id = sig.libraryId;
        const tus = await import("../_libs/tus-js-client.mjs");
        await new Promise((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: sig.endpoint,
            retryDelays: [0, 3e3, 5e3, 1e4, 2e4],
            headers: {
              AuthorizationSignature: sig.signature,
              AuthorizationExpire: String(sig.expire),
              VideoId: sig.videoId,
              LibraryId: sig.libraryId
            },
            metadata: {
              filetype: file.type,
              title,
              filename: file.name
            },
            onError: (e2) => reject(e2),
            onProgress: (sent, total) => setProgress(Math.round(sent / total * 100)),
            onSuccess: () => resolve()
          });
          upload.start();
        });
      }
      if (type !== "video" && lesson.bunny_video_id) {
        try {
          await deleteVideo({
            data: {
              videoId: lesson.bunny_video_id
            }
          });
        } catch {
        }
        patch.bunny_video_id = null;
        patch.bunny_library_id = null;
      }
      const {
        error
      } = await supabase.from("lessons").update(patch).eq("id", lesson.id);
      if (error) throw error;
      toast.success("Saqlandi");
      onChange();
      setOpen(false);
    } catch (err) {
      toast.error(err.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[90vh] max-w-2xl overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Darsni tahrirlash" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sarlavha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Qisqa tavsif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Dars haqida bir-ikki gap" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "video", children: "Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "presentation", children: "Prezentatsiya" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "text", children: "Matn" })
            ] })
          ] })
        ] }),
        type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            "Video ",
            lesson.bunny_video_id ? "(almashtirish)" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center text-muted-foreground transition-colors hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: file ? file.name : lesson.bunny_video_id ? "Yangi video tanlang (ixtiyoriy)" : "Video tanlang" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "video/*", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
          ] }),
          busy && progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              progress,
              "% yuklandi"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: type === "presentation" ? "Prezentatsiya mazmuni" : type === "text" ? "Matn mazmuni" : "Qo'shimcha matn (ixtiyoriy)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 10, value: content, onChange: (e) => setContent(e.target.value), placeholder: "HTML qo'llab-quvvatlanadi. Masalan: <h2>Mavzu</h2><p>...</p><ul><li>...</li></ul>", className: "font-mono text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Mazmun darslik sahifasida to'g'ridan-to'g'ri ko'rsatiladi (yuklanmaydi)." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Test bor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Dars yakunida" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: hasQuiz, onCheckedChange: setHasQuiz })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "O'tish bali (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 0, max: 100, value: passThreshold, onChange: (e) => setPassThreshold(Number(e.target.value)), disabled: !hasQuiz })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MaterialsManager, { lessonId: lesson.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LessonPresentationUploader, { lesson }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
          " ",
          busy ? "Saqlanmoqda..." : "Saqlash"
        ] }) })
      ] })
    ] })
  ] });
}
function AddModuleDialog({
  courseId,
  nextPosition,
  onAdded
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const {
      error
    } = await supabase.from("modules").insert({
      course_id: courseId,
      title: title.trim(),
      description: description.trim() || null,
      position: nextPosition
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Modul qo'shildi");
    setTitle("");
    setDescription("");
    setOpen(false);
    onAdded();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Modul"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Yangi modul" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Modul nomi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Masalan: ReactJS asoslari", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tavsif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Bu modulda nimalar o'rganiladi?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saqlanmoqda..." : "Qo'shish" }) })
      ] })
    ] })
  ] });
}
function EditModuleDialog({
  m,
  onSaved
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState(m.title ?? "");
  const [description, setDescription] = reactExports.useState(m.description ?? "");
  reactExports.useEffect(() => {
    setTitle(m.title ?? "");
    setDescription(m.description ?? "");
  }, [m.title, m.description]);
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSaved({
      title: title.trim(),
      description: description.trim() || null
    });
    setOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: (e) => e.stopPropagation(), "aria-label": "Modulni tahrirlash", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Modulni tahrirlash" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Modul nomi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tavsif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Bu modulda nimalar o'rganiladi?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Saqlash" }) })
      ] })
    ] })
  ] });
}
function MaterialsManager({
  lessonId
}) {
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const {
    data: materials = []
  } = useQuery({
    queryKey: ["admin", "lesson-materials", lessonId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("lesson_materials").select("*").eq("lesson_id", lessonId).order("created_at");
      if (error) throw error;
      return data ?? [];
    }
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin", "lesson-materials", lessonId]
  });
  const upload = async (file) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const path = `${lessonId}/${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("materials").upload(path, file, {
        contentType: file.type
      });
      if (upErr) throw upErr;
      const {
        error
      } = await supabase.from("lesson_materials").insert({
        lesson_id: lessonId,
        name: file.name,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size
      });
      if (error) throw error;
      toast.success("Material qo'shildi");
      refresh();
    } catch (e) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };
  const del = async (m) => {
    if (!confirm(`"${m.name}" o'chirilsinmi?`)) return;
    await supabase.storage.from("materials").remove([m.storage_path]);
    await supabase.from("lesson_materials").delete().eq("id", m.id);
    refresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "mr-1 inline h-3.5 w-3.5" }),
        " Qo'shimcha materiallar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
        " ",
        busy ? "Yuklanmoqda..." : "Fayl qo'shish",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", className: "hidden", disabled: busy, onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) {
            upload(f);
            e.target.value = "";
          }
        } })
      ] })
    ] }),
    materials.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "PDF, rasm, slayd va boshqa fayllarni shu yerda qo'shing." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: materials.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 py-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: m.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "h-7 w-7 text-destructive", onClick: () => del(m), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
    ] }, m.id)) })
  ] });
}
function AddLessonDialog({
  moduleId,
  courseId,
  onAdded
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [type, setType] = reactExports.useState("video");
  const [file, setFile] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [busy, setBusy] = reactExports.useState(false);
  const createVideo = useServerFn(createBunnyVideo);
  const reset = () => {
    setTitle("");
    setType("video");
    setFile(null);
    setProgress(0);
    setBusy(false);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    if (type === "video" && !file) return toast.error("Video fayl tanlang");
    setBusy(true);
    let bunnyVideoId = null;
    let bunnyLibraryId = null;
    try {
      if (type === "video" && file) {
        const sig = await createVideo({
          data: {
            title
          }
        });
        bunnyVideoId = sig.videoId;
        bunnyLibraryId = sig.libraryId;
        const tus = await import("../_libs/tus-js-client.mjs");
        await new Promise((resolve, reject) => {
          const upload = new tus.Upload(file, {
            endpoint: sig.endpoint,
            retryDelays: [0, 3e3, 5e3, 1e4, 2e4],
            headers: {
              AuthorizationSignature: sig.signature,
              AuthorizationExpire: String(sig.expire),
              VideoId: sig.videoId,
              LibraryId: sig.libraryId
            },
            metadata: {
              filetype: file.type,
              title,
              filename: file.name
            },
            onError: (e2) => reject(e2),
            onProgress: (sent, total) => setProgress(Math.round(sent / total * 100)),
            onSuccess: () => resolve()
          });
          upload.start();
        });
      }
      const {
        data: last
      } = await supabase.from("lessons").select("position").eq("module_id", moduleId).order("position", {
        ascending: false
      }).limit(1).maybeSingle();
      const nextPosition = (last?.position ?? -1) + 1;
      const {
        error
      } = await supabase.from("lessons").insert({
        module_id: moduleId,
        course_id: courseId,
        title,
        type,
        position: nextPosition,
        bunny_video_id: bunnyVideoId,
        bunny_library_id: bunnyLibraryId
      });
      if (error) throw error;
      toast.success("Dars qo'shildi");
      setOpen(false);
      reset();
      onAdded();
    } catch (err) {
      toast.error(err.message ?? "Xatolik");
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (o) => {
    setOpen(o);
    if (!o) reset();
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-3.5 w-3.5" }),
      " Dars qo'shish"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Yangi dars" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sarlavha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "video", children: "Video" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "presentation", children: "Prezentatsiya" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "text", children: "Matn" })
            ] })
          ] })
        ] }),
        type === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Video fayl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center text-muted-foreground transition-colors hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: file ? file.name : "Video tanlang yoki tashlang" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "video/*", className: "hidden", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
          ] }),
          busy && progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              progress,
              "% yuklandi"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
          " ",
          busy ? "Yuklanmoqda..." : "Saqlash"
        ] }) })
      ] })
    ] })
  ] });
}
function SlidesEditor({
  pathPrefix,
  slides,
  onChange
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const [previews, setPreviews] = reactExports.useState({});
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const paths = slides.filter((s) => !s.startsWith("http") && !previews[s]);
      if (!paths.length) return;
      const {
        data
      } = await supabase.storage.from("presentations").createSignedUrls(paths, 60 * 60);
      if (cancelled || !data) return;
      setPreviews((prev) => {
        const next = {
          ...prev
        };
        for (const it of data) if (it.path && it.signedUrl) next[it.path] = it.signedUrl;
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [slides.join("|")]);
  const upload = async (files) => {
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name}: faqat rasm fayllari qabul qilinadi`);
          continue;
        }
        const ext = file.name.split(".").pop() || "png";
        const path = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const {
          error
        } = await supabase.storage.from("presentations").upload(path, file, {
          contentType: file.type,
          upsert: false
        });
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
  const removeAt = async (i) => {
    const path = slides[i];
    if (!confirm(`Slayd ${i + 1} o'chirilsinmi?`)) return;
    if (path && !path.startsWith("http")) {
      await supabase.storage.from("presentations").remove([path]);
    }
    await onChange(slides.filter((_, idx) => idx !== i));
  };
  const move = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const next = [...slides];
    [next[i], next[j]] = [next[j], next[i]];
    await onChange(next);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        slides.length,
        " ta slayd"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs hover:bg-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
        " ",
        busy ? "Yuklanmoqda..." : "Slayd rasm(lar) qo'shish",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", disabled: busy, onChange: (e) => {
          if (e.target.files?.length) {
            upload(e.target.files);
            e.target.value = "";
          }
        } })
      ] })
    ] }),
    slides.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground", children: "PowerPoint yoki PDF dan slaydlarni rasm (PNG/JPG) qilib eksport qilib, ketma-ket yuklang. O'quvchilar ularni karusel ko'rinishida ko'radi va yuklab ololmaydi." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3", children: slides.map((path, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group relative overflow-hidden rounded-md border bg-muted", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video w-full bg-black", children: previews[path] || path.startsWith("http") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: path.startsWith("http") ? path : previews[path], alt: `Slayd ${i + 1}`, className: "h-full w-full object-contain", draggable: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-full w-full place-items-center text-xs text-white/60", children: "..." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white", children: [
        "#",
        i + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-x-1 bottom-1 flex justify-between gap-1 opacity-0 transition-opacity group-hover:opacity-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "secondary", className: "h-6 w-6", disabled: i === 0, onClick: () => move(i, -1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3 w-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "secondary", className: "h-6 w-6", disabled: i === slides.length - 1, onClick: () => move(i, 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-3 w-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "icon", variant: "destructive", className: "h-6 w-6", onClick: () => removeAt(i), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }) })
      ] })
    ] }, path + i)) })
  ] });
}
function LessonPresentationUploader({
  lesson
}) {
  const qc = useQueryClient();
  const [slides, setSlides] = reactExports.useState(lesson.presentation_slides ?? []);
  reactExports.useEffect(() => {
    setSlides(lesson.presentation_slides ?? []);
  }, [lesson.id, lesson.presentation_slides]);
  const persist = async (next) => {
    setSlides(next);
    const {
      error
    } = await supabase.from("lessons").update({
      presentation_slides: next
    }).eq("id", lesson.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({
      queryKey: ["admin", "course"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-lg border p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "mr-1 inline h-3.5 w-3.5" }),
      " Dars prezentatsiyasi (slayd rasmlari)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SlidesEditor, { pathPrefix: `lessons/${lesson.id}`, slides, onChange: persist })
  ] });
}
function CoursePresentationsManager({
  courseId
}) {
  const qc = useQueryClient();
  const {
    data: items = []
  } = useQuery({
    queryKey: ["admin", "course-presentations", courseId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("course_presentations").select("*").eq("course_id", courseId).order("position");
      if (error) throw error;
      return data ?? [];
    }
  });
  const refresh = () => qc.invalidateQueries({
    queryKey: ["admin", "course-presentations", courseId]
  });
  const del = async (item) => {
    if (!confirm(`"${item.title}" o'chirilsinmi?`)) return;
    const paths = (item.slides ?? []).filter((s) => s && !s.startsWith("http"));
    if (paths.length) {
      await supabase.storage.from("presentations").remove(paths);
    }
    const {
      error
    } = await supabase.from("course_presentations").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    refresh();
  };
  const move = async (item, dir) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from("course_presentations").update({
      position: swap.position
    }).eq("id", item.id);
    await supabase.from("course_presentations").update({
      position: item.position
    }).eq("id", swap.id);
    refresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Takrorlash prezentatsiyalari" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AddCoursePresentationDialog, { courseId, position: items.length, onAdded: refresh })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center text-sm text-muted-foreground", children: "Hozircha alohida prezentatsiyalar yo'q. 5-6 darsni bir prezentatsiyada jamlash uchun yangisini qo'shing." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CoursePresentationCardAdmin, { item, index: i, total: items.length, onMoveUp: () => move(item, -1), onMoveDown: () => move(item, 1), onDelete: () => del(item), onChanged: refresh }, item.id)) })
  ] });
}
function CoursePresentationCardAdmin({
  item,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  onChanged
}) {
  const [title, setTitle] = reactExports.useState(item.title);
  const [description, setDescription] = reactExports.useState(item.description ?? "");
  const [slides, setSlides] = reactExports.useState(item.slides ?? []);
  const [expanded, setExpanded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setTitle(item.title);
    setDescription(item.description ?? "");
    setSlides(item.slides ?? []);
  }, [item.id, item.title, item.description, item.slides]);
  const saveField = async (patch) => {
    const {
      error
    } = await supabase.from("course_presentations").update(patch).eq("id", item.id);
    if (error) toast.error(error.message);
    else onChanged();
  };
  const persistSlides = async (next) => {
    setSlides(next);
    const {
      error
    } = await supabase.from("course_presentations").update({
      slides: next
    }).eq("id", item.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    onChanged();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 flex-shrink-0 place-items-center rounded bg-primary/10 text-sm font-bold text-primary", children: index + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), onBlur: () => title !== item.title && saveField({
        title
      }), className: "h-9 flex-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
        slides.length,
        " slayd"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", disabled: index === 0, onClick: onMoveUp, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", disabled: index === total - 1, onClick: onMoveDown, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setExpanded((v) => !v), children: expanded ? "Yopish" : "Tahrirlash" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 text-destructive", onClick: onDelete, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Tavsif" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), onBlur: () => description !== (item.description ?? "") && saveField({
          description: description || null
        }), placeholder: "Masalan: 1-5 darslar takrori" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SlidesEditor, { pathPrefix: `courses/${item.course_id}/${item.id}`, slides, onChange: persistSlides })
    ] })
  ] }) });
}
function AddCoursePresentationDialog({
  courseId,
  position,
  onAdded
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Sarlavha kiriting");
    setBusy(true);
    try {
      const {
        error
      } = await supabase.from("course_presentations").insert({
        course_id: courseId,
        title,
        description: description || null,
        slides: [],
        position
      });
      if (error) throw error;
      toast.success("Qo'shildi. Endi slayd rasmlarni yuklang.");
      setOpen(false);
      setTitle("");
      setDescription("");
      onAdded();
    } catch (e2) {
      toast.error(e2.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Yangi prezentatsiya"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Yangi takrorlash prezentatsiyasi" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sarlavha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tavsif (ixtiyoriy)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Masalan: 1-5 darslar takrori" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: 'Sarlavhani saqlagandan keyin slayd rasmlarini "Tahrirlash" tugmasi orqali yuklaysiz.' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, children: busy ? "Saqlanmoqda..." : "Saqlash" }) })
      ] })
    ] })
  ] });
}
export {
  EditCourse as component
};
