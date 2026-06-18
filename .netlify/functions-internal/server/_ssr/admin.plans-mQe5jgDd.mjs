import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { S as Switch } from "./switch-DDHih_sy.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-K6UF5XG9.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-sifHCTRo.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { a0 as Pencil, a1 as Trash2, Z as Plus } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
function AdminPlans() {
  const qc = useQueryClient();
  const {
    data: plans = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("plans").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    }
  });
  const save = useMutation({
    mutationFn: async (p) => {
      const payload = {
        code: p.code,
        title: p.title,
        description: p.description || null,
        duration_days: Number(p.duration_days),
        price: Number(p.price),
        is_active: !!p.is_active,
        sort_order: Number(p.sort_order ?? 0)
      };
      if (p.id) {
        const {
          error
        } = await supabase.from("plans").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("plans").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saqlandi");
      qc.invalidateQueries({
        queryKey: ["admin", "plans"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({
        queryKey: ["admin", "plans"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Tariflar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Tarif rejalari" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Yuklanmoqda..." : `${plans.length} ta tarif` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PlanDialog, { onSave: (p) => save.mutate(p) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Kod" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Davomiyligi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Narx" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Holat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32", children: "Amallar" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: p.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: p.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-sm", children: [
            p.duration_days,
            " kun"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-display font-semibold", children: fmt(Number(p.price)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: p.is_active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-success", children: "Faol" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Faolsiz" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PlanDialog, { plan: p, onSave: (payload) => save.mutate({
              ...payload,
              id: p.id
            }), trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-destructive", onClick: () => {
              if (confirm("O'chirilsinmi?")) del.mutate(p.id);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, p.id)) })
      ] }) }) })
    ] })
  ] });
}
function PlanDialog({
  plan,
  onSave,
  trigger
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    code: "",
    title: "",
    description: "",
    duration_days: 30,
    price: 0,
    is_active: true,
    sort_order: 0
  });
  reactExports.useEffect(() => {
    if (plan && open) setForm(plan);
  }, [plan, open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Yangi tarif"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: plan ? "Tarifni tahrirlash" : "Yangi tarif" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nom" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.title ?? "", onChange: (e) => setForm({
              ...form,
              title: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kod" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.code ?? "", onChange: (e) => setForm({
              ...form,
              code: e.target.value
            }), placeholder: "3m / 6m / 12m" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tavsif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: form.description ?? "", onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kunlar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.duration_days ?? 0, onChange: (e) => setForm({
              ...form,
              duration_days: Number(e.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Narx (so'm)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.price ?? 0, onChange: (e) => setForm({
              ...form,
              price: Number(e.target.value)
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Tartib" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.sort_order ?? 0, onChange: (e) => setForm({
              ...form,
              sort_order: Number(e.target.value)
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Faol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: !!form.is_active, onCheckedChange: (v) => setForm({
            ...form,
            is_active: v
          }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => {
        onSave(form);
        setOpen(false);
      }, children: "Saqlash" }) })
    ] })
  ] });
}
export {
  AdminPlans as component
};
