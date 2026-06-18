import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as notFound } from "../_libs/tanstack__router-core.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { P as Progress } from "./progress-D3GtpSk9.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { P as PresentationSlidesViewer } from "./presentation-viewer-CxrJzvGJ.mjs";
import { b as Route$1 } from "./router-DajYyTeL.mjs";
import "../_libs/sonner.mjs";
import { B as BookOpen, e as Crown, aj as Presentation, ak as FileText, i as CirclePlay, l as CircleCheck, a5 as X, Z as Plus, t as Lock } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/radix-ui__react-progress.mjs";
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
function CourseDetail() {
  const {
    courseId
  } = Route$1.useParams();
  const {
    user
  } = useAuth();
  const {
    data,
    isLoading
  } = useQuery({
    enabled: !!user,
    queryKey: ["app", "course", courseId, user?.id],
    queryFn: async () => {
      const {
        data: course2,
        error
      } = await supabase.from("courses").select("*, modules(*, lessons(id, title, type, position, has_quiz))").eq("id", courseId).maybeSingle();
      if (error) throw error;
      if (!course2) throw notFound();
      course2.modules = (course2.modules ?? []).sort((a, b) => a.position - b.position);
      for (const m of course2.modules) m.lessons = (m.lessons ?? []).sort((a, b) => a.position - b.position);
      if (course2.cover_url && !course2.cover_url.startsWith("http")) {
        const {
          data: signed
        } = await supabase.storage.from("course-covers").createSignedUrl(course2.cover_url, 60 * 60);
        course2.cover_url = signed?.signedUrl ?? null;
      }
      const {
        data: userPlan
      } = await supabase.from("user_plan").select("expires_at, is_trial").eq("user_id", user.id).maybeSingle();
      const enrolled2 = !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at) > /* @__PURE__ */ new Date());
      const {
        data: progress
      } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user.id).eq("course_id", courseId);
      const completedSet2 = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id));
      const {
        data: pres
      } = await supabase.from("course_presentations").select("*").eq("course_id", courseId).order("position");
      const presentations2 = pres ?? [];
      return {
        course: course2,
        enrolled: enrolled2,
        completedSet: completedSet2,
        presentations: presentations2,
        isTrial: userPlan?.is_trial ?? false
      };
    }
  });
  const [activeModuleId, setActiveModuleId] = reactExports.useState(null);
  const [expandedLessonId, setExpandedLessonId] = reactExports.useState(null);
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-6 text-muted-foreground", children: "Yuklanmoqda..." });
  const {
    course,
    enrolled,
    completedSet,
    presentations,
    isTrial
  } = data;
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l) => completedSet.has(l.id)).length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const activeModule = course.modules.find((m) => m.id === activeModuleId) ?? course.modules[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: course.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[16/5] bg-muted bg-cover bg-center", style: course.cover_url ? {
        backgroundImage: `url(${course.cover_url})`
      } : void 0, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            course.category && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: course.category }),
            enrolled && isTrial && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-warning text-warning-foreground", children: "Sinov" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 font-display text-2xl font-bold lg:text-4xl", children: course.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-sm text-white/80 lg:text-base", children: course.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap items-center gap-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4" }),
            " ",
            total,
            " dars"
          ] }) })
        ] })
      ] }) }),
      !enrolled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-warning/40 bg-warning/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg font-semibold", children: "Akkountingiz aktiv emas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Video darslarni ko'rish uchun tarif sotib oling yoki 1 haftalik bepul sinovni boshlang." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/subscription", children: "Tarif sotib olish" }) })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Sizning taraqqiyotingiz" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            done,
            " ta dars yakunlangan, ",
            total - done,
            " ta qoldi"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full sm:w-1/2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            pct,
            "%"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "mt-1" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-xl font-semibold", children: "Modullar" }),
        course.modules.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-10 text-center text-muted-foreground", children: "Bu kursda hali modullar qo'shilmagan" }) }),
        course.modules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-4 sm:p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-2 mb-2 flex gap-5 overflow-x-auto px-2 pb-2 sm:gap-8", children: course.modules.map((m, idx) => {
            const isActive = activeModule?.id === m.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setActiveModuleId(m.id);
              setExpandedLessonId(null);
            }, className: `shrink-0 font-display text-lg font-bold tracking-tight transition-colors sm:text-2xl ${isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"}`, children: [
              idx + 1,
              "-modul"
            ] }, m.id);
          }) }),
          activeModule && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t", children: [
            activeModule.lessons.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "Bu modulda hali darslar yo'q." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: activeModule.lessons.map((l, li) => {
              const locked = !enrolled;
              const done2 = completedSet.has(l.id);
              const expanded = expandedLessonId === l.id;
              const TypeIcon = l.type === "presentation" ? Presentation : l.type === "text" ? FileText : CirclePlay;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "border-b last:border-b-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 py-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors ${done2 ? "bg-success text-success-foreground" : expanded ? "bg-foreground text-background" : "bg-muted text-foreground"}`, children: done2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : li + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpandedLessonId(expanded ? null : l.id), className: "min-w-0 flex-1 truncate text-left font-display text-base font-semibold sm:text-lg", children: l.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpandedLessonId(expanded ? null : l.id), className: "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-foreground/70 transition-colors hover:bg-muted", "aria-label": expanded ? "Yopish" : "Ochish", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
                ] }),
                expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pb-5 pl-[52px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LessonSubRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeIcon, { className: "h-4 w-4" }), label: l.type === "video" ? "Video darslik" : l.type === "presentation" ? "Prezentatsiya" : "Matn darslik", locked, href: !locked ? {
                    courseId: course.id,
                    lessonId: l.id
                  } : void 0 }),
                  l.has_quiz && /* @__PURE__ */ jsxRuntimeExports.jsx(LessonSubRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }), label: "Yakuniy test", locked, href: !locked ? {
                    courseId: course.id,
                    lessonId: l.id
                  } : void 0 }),
                  locked && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bu darslikni ochish uchun faol tarif kerak." })
                ] })
              ] }, l.id);
            }) })
          ] })
        ] })
      ] }),
      presentations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold", children: "Takrorlash prezentatsiyalari" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-sm text-muted-foreground", children: enrolled ? "Bir nechta darsning qisqacha jamlanmasi. Tez takrorlash uchun." : "Faol tarif bilan prezentatsiyalar ochiladi." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: presentations.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(CoursePresentationCard, { item: p, locked: !enrolled }, p.id)) })
      ] })
    ] })
  ] });
}
function LessonSubRow({
  icon,
  label,
  locked,
  href
}) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-4 rounded-lg px-3 py-2 transition-colors ${locked ? "opacity-70" : "hover:bg-muted"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-md border", children: locked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }) : icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex-1 text-sm font-medium", children: label })
  ] });
  if (!locked && href) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/courses/$courseId/lessons/$lessonId", params: href, children: inner });
  }
  return inner;
}
function CoursePresentationCard({
  item,
  locked = false
}) {
  const [open, setOpen] = reactExports.useState(false);
  const slides = Array.isArray(item.slides) ? item.slides : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: locked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Presentation, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: item.title }),
        item.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: item.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
        slides.length,
        " slayd"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: open ? "outline" : "default", disabled: !slides.length || locked, onClick: () => setOpen((v) => !v), children: locked ? "Yopiq" : open ? "Yopish" : "Ochish" })
    ] }),
    !locked && open && slides.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(PresentationSlidesViewer, { slides, title: item.title })
  ] }) });
}
export {
  CourseDetail as component
};
