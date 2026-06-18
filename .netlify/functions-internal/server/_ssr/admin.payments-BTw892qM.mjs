import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-c5KQ8wMi.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-K6UF5XG9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { l as CircleCheck, a5 as X } from "../_libs/lucide-react.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./auth-yqoVlx_c.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
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
const fmt = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
function AdminPayments() {
  const [filter, setFilter] = reactExports.useState("all");
  const qc = useQueryClient();
  const {
    data: payments = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const {
        data: pays,
        error
      } = await supabase.from("payments").select("*, plans(id, title, duration_days)").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      const userIds = Array.from(new Set((pays ?? []).map((p) => p.user_id)));
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name, phone").in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
      const pmap = new Map((profs ?? []).map((p) => [p.id, p]));
      return (pays ?? []).map((p) => ({
        ...p,
        profile: pmap.get(p.user_id)
      }));
    }
  });
  const list = filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const approve = useMutation({
    mutationFn: async (p) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const {
        error: e1
      } = await supabase.from("payments").update({
        status: "approved",
        reviewed_by: user?.id,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", p.id);
      if (e1) throw e1;
      const days = p.plans?.duration_days ?? 30;
      const {
        data: current
      } = await supabase.from("user_plan").select("expires_at").eq("user_id", p.user_id).maybeSingle();
      const baseTs = current?.expires_at && new Date(current.expires_at).getTime() > Date.now() ? new Date(current.expires_at).getTime() : Date.now();
      const expires = new Date(baseTs + days * 24 * 60 * 60 * 1e3);
      const {
        error: e2
      } = await supabase.from("user_plan").upsert({
        user_id: p.user_id,
        plan_id: p.plan_id,
        payment_id: p.id,
        is_trial: false,
        started_at: (/* @__PURE__ */ new Date()).toISOString(),
        expires_at: expires.toISOString()
      }, {
        onConflict: "user_id"
      });
      if (e2) throw e2;
    },
    onSuccess: () => {
      toast.success("Tasdiqlandi va tarif faollashtirildi");
      qc.invalidateQueries({
        queryKey: ["admin", "payments"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const reject = useMutation({
    mutationFn: async (p) => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const {
        error
      } = await supabase.from("payments").update({
        status: "rejected",
        reviewed_by: user?.id,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Rad etildi");
      qc.invalidateQueries({
        queryKey: ["admin", "payments"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "To'lovlar boshqaruvi", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: filter, onValueChange: setFilter, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", children: "Hammasi" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pending", children: "Kutilmoqda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "approved", children: "Tasdiqlangan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "rejected", children: "Rad etilgan" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "O'quvchi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tarif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Summa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sana" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Holat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-32", children: "Amallar" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground py-8", children: "Yuklanmoqda..." }) }),
          !isLoading && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center text-muted-foreground py-8", children: "To'lovlar yo'q" }) }),
          list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: p.profile?.full_name ?? p.payer_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: p.profile?.phone ?? p.payer_phone ?? "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: p.plans?.title ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-display font-semibold", children: fmt(Number(p.amount)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: new Date(p.created_at).toLocaleDateString("uz-UZ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
              p.status === "approved" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Tasdiqlangan" }),
              p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-warning text-warning-foreground", children: "Kutilmoqda" }),
              p.status === "rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Rad etilgan" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: p.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-success", onClick: () => approve.mutate(p), disabled: approve.isPending, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-destructive", onClick: () => reject.mutate(p), disabled: reject.isPending, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
            ] }) })
          ] }, p.id))
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminPayments as component
};
