import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar, A as Avatar, c as AvatarImage, d as AvatarFallback } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-K6UF5XG9.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { O as Search } from "../_libs/lucide-react.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./button-BXrfXN_b.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function AdminStudents() {
  const [q, setQ] = reactExports.useState("");
  const {
    data: students = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const {
        data: roles,
        error
      } = await supabase.from("user_roles").select("user_id, role").in("role", ["student", "admin"]);
      if (error) throw error;
      const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
      const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
      if (!ids.length) return [];
      const [{
        data: profs
      }, {
        data: plans
      }] = await Promise.all([supabase.from("profiles").select("id, full_name, phone, avatar_url, created_at").in("id", ids), supabase.from("user_plan").select("user_id, expires_at, is_trial, plans(title)").in("user_id", ids)]);
      const pMap = /* @__PURE__ */ new Map();
      for (const p of plans ?? []) pMap.set(p.user_id, p);
      return (profs ?? []).map((p) => ({
        ...p,
        plan: pMap.get(p.id) ?? null,
        is_admin: adminSet.has(p.id)
      }));
    }
  });
  const filtered = reactExports.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return students;
    return students.filter((s) => (s.full_name ?? "").toLowerCase().includes(t) || (s.phone ?? "").includes(t));
  }, [students, q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "O'quvchilar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Barcha o'quvchilar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Yuklanmoqda..." : `${students.length} ta ro'yxatdan o'tgan` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-72", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ism yoki telefon bo'yicha...", className: "pl-9", value: q, onChange: (e) => setQ(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "O'quvchi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tarif" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tugash" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ro'yxatdan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Holat" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          filtered.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center text-muted-foreground py-8", children: "Topilmadi" }) }),
          filtered.map((s) => {
            const initials = (s.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const active = s.plan && (!s.plan.expires_at || new Date(s.plan.expires_at) > /* @__PURE__ */ new Date());
            const planLabel = s.plan?.is_trial ? "Sinov" : s.plan?.plans?.title ?? "—";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9", children: [
                  s.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: s.avatar_url, alt: s.full_name ?? "" }) : null,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs", children: initials })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
                    s.full_name || "—",
                    s.is_admin && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground h-5 px-1.5 text-[10px]", children: "Admin" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.phone ?? "—" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: active ? planLabel : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: s.plan?.expires_at ? new Date(s.plan.expires_at).toLocaleDateString("uz-UZ") : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: new Date(s.created_at).toLocaleDateString("uz-UZ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-success text-success-foreground", children: "Faol" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Tarifsiz" }) })
            ] }, s.id);
          })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  AdminStudents as component
};
