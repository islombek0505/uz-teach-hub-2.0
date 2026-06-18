import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-sifHCTRo.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Newspaper, Z as Plus, a6 as Image, a0 as Pencil, a1 as Trash2 } from "../_libs/lucide-react.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
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
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const categories = [{
  value: "announcement",
  label: "E'lon"
}, {
  value: "course",
  label: "Yangi kurs"
}, {
  value: "discount",
  label: "Chegirma"
}, {
  value: "event",
  label: "Tadbir"
}];
const catColor = (c) => c === "discount" ? "bg-warning text-warning-foreground" : c === "course" ? "bg-primary text-primary-foreground" : c === "event" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground";
function AdminNews() {
  const qc = useQueryClient();
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: items = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("news").select("*").order("published_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const upload = async (file) => {
    const path = `news/${Date.now()}_${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const {
      error
    } = await supabase.storage.from("course-covers").upload(path, file, {
      upsert: true
    });
    if (error) throw error;
    return path;
  };
  const save = useMutation({
    mutationFn: async (form) => {
      let imagePath = form.image_url ?? null;
      if (form.file) imagePath = await upload(form.file);
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const payload = {
        title: form.title.trim(),
        body: form.body?.trim() || null,
        category: form.category,
        link: form.link?.trim() || null,
        published: !!form.published,
        image_url: imagePath
      };
      if (editing?.id) {
        const {
          error
        } = await supabase.from("news").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        payload.created_by = user?.id ?? null;
        const {
          error
        } = await supabase.from("news").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Saqlandi" : "Yangilik qo'shildi");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({
        queryKey: ["admin", "news"]
      });
      qc.invalidateQueries({
        queryKey: ["public", "news"]
      });
      qc.invalidateQueries({
        queryKey: ["notifications"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({
        queryKey: ["admin", "news"]
      });
      qc.invalidateQueries({
        queryKey: ["public", "news"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Yangiliklar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-5 w-5" }),
            " Yangiliklar boshqaruvi"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Kelajakdagi kurslar, chegirmalar va e'lonlar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: (o) => {
          setOpen(o);
          if (!o) setEditing(null);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-4 w-4" }),
            " Yangilik qo'shish"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(NewsForm, { initial: editing, onSubmit: (f) => save.mutate(f), pending: save.isPending }, editing?.id ?? "new")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Yuklanmoqda..." }),
        !isLoading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "md:col-span-2 xl:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-10 text-center text-muted-foreground", children: "Hozircha yangiliklar yo'q" }) }),
        items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCard, { item: n, onEdit: () => {
          setEditing(n);
          setOpen(true);
        }, onDelete: () => {
          if (confirm("O'chirilsinmi?")) del.mutate(n.id);
        } }, n.id))
      ] })
    ] })
  ] });
}
function NewsCard({
  item,
  onEdit,
  onDelete
}) {
  const [signed, setSigned] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (item.image_url && !item.image_url.startsWith("http")) {
      supabase.storage.from("course-covers").createSignedUrl(item.image_url, 3600).then(({
        data
      }) => setSigned(data?.signedUrl ?? null));
    } else if (item.image_url) setSigned(item.image_url);
  }, [item.image_url]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
    signed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] bg-cover bg-center", style: {
      backgroundImage: `url(${signed})`
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] bg-muted grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-8 w-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: catColor(item.category), children: categories.find((c) => c.value === item.category)?.label ?? item.category }),
        !item.published && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Yashirilgan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold leading-snug", children: item.title }),
      item.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2 text-sm text-muted-foreground", children: item.body }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(item.published_at).toLocaleDateString("uz-UZ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: onEdit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-1 h-3.5 w-3.5" }),
          " Tahrirlash"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-destructive", onClick: onDelete, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3.5 w-3.5" }),
          " O'chirish"
        ] })
      ] })
    ] })
  ] });
}
function NewsForm({
  initial,
  onSubmit,
  pending
}) {
  const [title, setTitle] = reactExports.useState(initial?.title ?? "");
  const [body, setBody] = reactExports.useState(initial?.body ?? "");
  const [category, setCategory] = reactExports.useState(initial?.category ?? "announcement");
  const [link, setLink] = reactExports.useState(initial?.link ?? "");
  const [published, setPublished] = reactExports.useState(initial ? !!initial.published : true);
  const [file, setFile] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: initial ? "Yangilikni tahrirlash" : "Yangi yangilik" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sarlavha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), maxLength: 200 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Toifa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: category, onValueChange: setCategory, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.value, children: c.label }, c.value)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Matn" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: body, onChange: (e) => setBody(e.target.value), maxLength: 3e3 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rasm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "image/*", onChange: (e) => setFile(e.target.files?.[0] ?? null) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Havola (ixtiyoriy)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: link, onChange: (e) => setLink(e.target.value), placeholder: "/app/courses" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: "Chop etilsin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Faqat ko'rinadigan yangiliklar studentlarga ko'rsatiladi" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: published, onCheckedChange: setPublished })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
      if (!title.trim()) {
        toast.error("Sarlavha kerak");
        return;
      }
      onSubmit({
        title,
        body,
        category,
        link,
        published,
        file,
        image_url: initial?.image_url
      });
    }, disabled: pending, children: pending ? "Saqlanmoqda..." : "Saqlash" }) })
  ] });
}
export {
  AdminNews as component
};
