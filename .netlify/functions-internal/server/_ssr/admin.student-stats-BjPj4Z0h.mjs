import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-Cbl1egtb.mjs";
import { T as Topbar, A as Avatar, c as AvatarImage, d as AvatarFallback } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { B as Button, c as cn, b as buttonVariants } from "./button-BXrfXN_b.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-K6UF5XG9.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { g as getStudentsStats } from "./admin-stats.functions-D4Yl2s08.mjs";
import "../_libs/seroval.mjs";
import { O as Search, Q as ArrowUpDown, V as Video, B as BookOpen, n as Clock, R as ChevronRight, W as ChevronLeft } from "../_libs/lucide-react.mjs";
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
import "./client-CbMU9m-9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "./auth-middleware-BCSfl_Vl.mjs";
const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
const PaginationContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { ref, className: cn("flex flex-row items-center gap-1", className), ...props })
);
PaginationContent.displayName = "PaginationContent";
const PaginationItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ref, className: cn("", className), ...props })
);
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({ className, isActive, size = "icon", ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "a",
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  }
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";
const PAGE_SIZE = 10;
function AdminStudentStats() {
  const fetchStats = useServerFn(getStudentsStats);
  const {
    data: students = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "student-stats"],
    queryFn: () => fetchStats()
  });
  const [search, setSearch] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [courseId, setCourseId] = reactExports.useState("all");
  const [minVideos, setMinVideos] = reactExports.useState("0");
  const [sortBy, setSortBy] = reactExports.useState("videos_desc");
  const [page, setPage] = reactExports.useState(1);
  const allCourses = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of students) for (const c of s.active_courses) map.set(c.id, c.title);
    return Array.from(map.entries()).map(([id, title]) => ({
      id,
      title
    }));
  }, [students]);
  const filtered = reactExports.useMemo(() => {
    const term = search.trim().toLowerCase();
    const ph = phone.replace(/\D/g, "");
    const mv = Number(minVideos) || 0;
    let list = students.filter((s) => {
      if (term && !(s.full_name ?? "").toLowerCase().includes(term)) return false;
      if (ph && !(s.phone ?? "").replace(/\D/g, "").includes(ph)) return false;
      if (courseId !== "all" && !s.active_courses.some((c) => c.id === courseId)) return false;
      if (s.videos_watched < mv) return false;
      return true;
    });
    switch (sortBy) {
      case "videos_desc":
        list = list.sort((a, b) => b.videos_watched - a.videos_watched);
        break;
      case "last_login_desc":
        list = list.sort((a, b) => new Date(b.last_sign_in_at ?? 0).getTime() - new Date(a.last_sign_in_at ?? 0).getTime());
        break;
      case "name_asc":
        list = list.sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? ""));
        break;
      case "created_desc":
        list = list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    return list;
  }, [students, search, phone, courseId, minVideos, sortBy]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "O'quvchilar statistikasi", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Statistika va filtrlar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Yuklanmoqda..." : `${filtered.length} ta o'quvchi topildi (jami ${students.length})` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-3 p-4 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ism familiya bo'yicha...", className: "pl-9", value: search, onChange: (e) => {
            setSearch(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Telefon raqami...", className: "pl-9", value: phone, onChange: (e) => {
            setPhone(e.target.value);
            setPage(1);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: courseId, onValueChange: (v) => {
          setCourseId(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Kurs" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Barcha kurslar" }),
            allCourses.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.title }, c.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: minVideos, onValueChange: (v) => {
          setMinVideos(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "0", children: "Barcha (video soni)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1", children: "≥ 1 ta video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "5", children: "≥ 5 ta video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", children: "≥ 10 ta video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "25", children: "≥ 25 ta video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", children: "≥ 50 ta video" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Tartiblash:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sortBy, onValueChange: (v) => setSortBy(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "videos_desc", children: "Ko'p video ko'rgan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "last_login_desc", children: "Oxirgi marta kirgan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name_asc", children: "Ism (A-Z)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "created_desc", children: "Ro'yxatdan o'tgan vaqti" })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "O'quvchi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Faol kurslar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-3.5 w-3.5" }),
            " Videolar"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5" }),
            " Darslar"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
            " Oxirgi kirish"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Amal" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableBody, { children: [
          pageItems.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "py-8 text-center text-muted-foreground", children: "Topilmadi" }) }),
          pageItems.map((s) => {
            const initials = (s.full_name ?? "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9", children: [
                  s.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: s.avatar_url }) : null,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-xs", children: initials })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: s.full_name ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.phone ?? "—" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.active_courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "—" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                s.active_courses.slice(0, 2).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-normal", children: c.title }, c.id)),
                s.active_courses.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
                  "+",
                  s.active_courses.length - 2
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold", children: s.videos_watched }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: s.lessons_completed }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm", children: s.last_sign_in_at ? new Date(s.last_sign_in_at).toLocaleString("uz-UZ", {
                dateStyle: "short",
                timeStyle: "short"
              }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/student-stats/$studentId", params: {
                studentId: s.id
              }, children: [
                "Ko'proq ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-3.5 w-3.5" })
              ] }) }) })
            ] }, s.id);
          })
        ] })
      ] }) }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PaginationContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationPrevious, { onClick: (e) => {
          e.preventDefault();
          setPage(Math.max(1, currentPage - 1));
        }, href: "#", className: currentPage === 1 ? "pointer-events-none opacity-50" : "" }) }),
        Array.from({
          length: totalPages
        }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationLink, { href: "#", isActive: p === currentPage, onClick: (e) => {
          e.preventDefault();
          setPage(p);
        }, children: p }) }, p)),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationNext, { onClick: (e) => {
          e.preventDefault();
          setPage(Math.min(totalPages, currentPage + 1));
        }, href: "#", className: currentPage === totalPages ? "pointer-events-none opacity-50" : "" }) })
      ] }) })
    ] })
  ] });
}
export {
  AdminStudentStats as component
};
