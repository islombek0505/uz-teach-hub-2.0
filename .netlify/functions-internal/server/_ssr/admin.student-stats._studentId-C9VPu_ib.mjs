import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-Cbl1egtb.mjs";
import { T as Topbar, A as Avatar, c as AvatarImage, d as AvatarFallback } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { P as Progress } from "./progress-D3GtpSk9.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { m as Separator } from "./sidebar-yL0Cwk17.mjs";
import { a as getStudentDetail } from "./admin-stats.functions-D4Yl2s08.mjs";
import { R as Route$4 } from "./router-DajYyTeL.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import { W as ChevronLeft, P as Phone, y as Mail, a2 as MapPin, n as Clock, V as Video, B as BookOpen, ad as ListChecks, l as CircleCheck, ae as Circle } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-B51iIGrX.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./button-BXrfXN_b.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__number.mjs";
import "./client-CbMU9m-9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./auth-yqoVlx_c.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "./auth-middleware-BCSfl_Vl.mjs";
function StudentDetailPage() {
  const {
    studentId
  } = Route$4.useParams();
  const fetchDetail = useServerFn(getStudentDetail);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin", "student-detail", studentId],
    queryFn: () => fetchDetail({
      data: {
        studentId
      }
    })
  });
  const [selectedCourse, setSelectedCourse] = reactExports.useState("");
  const activeCourse = reactExports.useMemo(() => {
    if (!data) return null;
    return data.courses.find((c) => c.course_id === selectedCourse) ?? data.courses[0] ?? null;
  }, [data, selectedCourse]);
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6 text-muted-foreground", children: "Yuklanmoqda..." });
  const p = data.profile;
  const initials = (p.full_name ?? "?").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "O'quvchi tafsilotlari", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/student-stats", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
        " Statistikaga qaytish"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-6 p-6 lg:flex-row lg:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-20 w-20", children: [
          p.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: p.avatar_url }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-2xl", children: initials })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold", children: p.full_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground", children: [
            p.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }),
              " ",
              p.phone
            ] }),
            p.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
              " ",
              p.email
            ] }),
            p.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
              " ",
              p.city
            ] }),
            p.birth_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "🎂 ",
              new Date(p.birth_date).toLocaleDateString("uz-UZ")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              " Ro'yxatdan: ",
              new Date(p.created_at).toLocaleDateString("uz-UZ")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
              " Oxirgi kirish: ",
              p.last_sign_in_at ? new Date(p.last_sign_in_at).toLocaleString("uz-UZ") : "—"
            ] })
          ] }),
          p.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: p.bio }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            p.telegram_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: p.telegram_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Telegram" }) }),
            p.instagram_url && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: p.instagram_url, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Instagram" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5" }), label: "Ko'rilgan videolar", value: data.totals.videos_watched }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5" }), label: "Tugatilgan darslar", value: data.totals.lessons_completed }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-5 w-5" }), label: "Faol kurslar", value: data.totals.active_courses }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }), label: "Test urinishlari", value: data.totals.quiz_attempts })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg", children: "Kurs statistikasi" }),
          data.courses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: activeCourse?.course_id ?? "", onValueChange: setSelectedCourse, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Kursni tanlang" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: data.courses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.course_id, children: c.course_title }, c.course_id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          !activeCourse && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Faol kurslar yo'q." }),
          activeCourse && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Umumiy progress", value: `${activeCourse.percent}%`, sub: `${activeCourse.completed_lessons} / ${activeCourse.total_lessons} dars` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Videolar", value: `${activeCourse.watched_videos} / ${activeCourse.total_videos}`, sub: "Ko'rilgan / jami" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(MiniStat, { label: "Holati", value: activeCourse.percent === 100 ? "Tugatilgan" : activeCourse.percent > 0 ? "Davom etmoqda" : "Boshlanmagan", sub: "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: activeCourse.percent, className: "h-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: activeCourse.modules.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mb-2 font-display font-semibold", children: m.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: m.lessons.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  l.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: l.title }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground capitalize", children: l.type })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: l.completed ? "default" : "outline", className: l.completed ? "bg-success text-success-foreground" : "", children: l.completed ? "Tugatildi" : "Ko'rilmagan" })
              ] }, l.id)) })
            ] }, m.id)) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] }) });
}
function MiniStat({
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-muted/30 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-semibold", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: sub })
  ] });
}
export {
  StudentDetailPage as component
};
