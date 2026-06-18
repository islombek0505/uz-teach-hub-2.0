import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { c as Users, C as CreditCard, D as DollarSign, B as BookOpen, s as CircleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./auth-yqoVlx_c.mjs";
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
function AdminDashboard() {
  const {
    data
  } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const monthStart = /* @__PURE__ */ new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const [studentsRes, plansRes, coursesRes, lessonsRes, payRes, pendingRes] = await Promise.all([supabase.from("user_roles").select("user_id", {
        count: "exact",
        head: true
      }).eq("role", "student"), supabase.from("user_plan").select("user_id", {
        count: "exact",
        head: true
      }).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()), supabase.from("courses").select("id", {
        count: "exact",
        head: true
      }), supabase.from("lessons").select("id", {
        count: "exact",
        head: true
      }), supabase.from("payments").select("amount").eq("status", "approved").gte("created_at", monthStart.toISOString()), supabase.from("payments").select("id, amount, payer_name, user_id, plans(title)").eq("status", "pending").order("created_at", {
        ascending: false
      }).limit(5)]);
      const revenue = (payRes.data ?? []).reduce((s, p) => s + Number(p.amount ?? 0), 0);
      return {
        students: studentsRes.count ?? 0,
        active: plansRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        lessons: lessonsRes.count ?? 0,
        revenue,
        pending: pendingRes.data ?? []
      };
    }
  });
  const stats = [{
    label: "Jami o'quvchilar",
    value: data?.students ?? "—",
    icon: Users,
    color: "text-primary bg-primary/10"
  }, {
    label: "Faol obunalar",
    value: data?.active ?? "—",
    icon: CreditCard,
    color: "text-success bg-success/15"
  }, {
    label: "Oylik daromad",
    value: data ? fmt(data.revenue) : "—",
    icon: DollarSign,
    color: "text-warning bg-warning/15"
  }, {
    label: "Kurslar",
    value: data?.courses ?? "—",
    icon: BookOpen,
    color: "text-accent-foreground bg-accent/40",
    trend: data ? `${data.lessons} dars` : void 0
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Admin Dashboard", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-11 w-11 place-items-center rounded-lg ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
          s.trend && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: s.trend })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 font-display text-2xl font-bold", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.label })
      ] }) }, s.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base", children: "Tasdiqlash kutilmoqda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: data?.pending.length ? "destructive" : "outline", children: data?.pending.length ?? 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          (data?.pending ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Yangi to'lovlar yo'q" }),
          (data?.pending ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-warning" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-sm font-medium", children: [
                p.payer_name ?? "—",
                " — ",
                p.plans?.title ?? "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: fmt(Number(p.amount)) })
            ] })
          ] }, p.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/payments", children: "Hammasi" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as component
};
