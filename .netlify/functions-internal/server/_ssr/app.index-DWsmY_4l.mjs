import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { P as Progress } from "./progress-D3GtpSk9.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useEmblaCarousel } from "../_libs/embla-carousel-react.mjs";
import { i as CirclePlay, B as BookOpen, n as Clock, T as Trophy, o as Calendar, p as TrendingUp, N as Newspaper, h as Sparkles, q as Megaphone, r as ArrowLeft, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/embla-carousel-reactive-utils.mjs";
import "../_libs/embla-carousel.mjs";
const CarouselContext = reactExports.createContext(null);
function useCarousel() {
  const context = reactExports.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
const Carousel = reactExports.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y"
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = reactExports.useState(false);
  const [canScrollNext, setCanScrollNext] = reactExports.useState(false);
  const onSelect = reactExports.useCallback((api2) => {
    if (!api2) {
      return;
    }
    setCanScrollPrev(api2.canScrollPrev());
    setCanScrollNext(api2.canScrollNext());
  }, []);
  const scrollPrev = reactExports.useCallback(() => {
    api?.scrollPrev();
  }, [api]);
  const scrollNext = reactExports.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  const handleKeyDown = reactExports.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );
  reactExports.useEffect(() => {
    if (!api || !setApi) {
      return;
    }
    setApi(api);
  }, [api, setApi]);
  reactExports.useEffect(() => {
    if (!api) {
      return;
    }
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CarouselContext.Provider,
    {
      value: {
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref,
          onKeyDownCapture: handleKeyDown,
          className: cn("relative", className),
          role: "region",
          "aria-roledescription": "carousel",
          ...props,
          children
        }
      )
    }
  );
});
Carousel.displayName = "Carousel";
const CarouselContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        ),
        ...props
      }
    ) });
  }
);
CarouselContent.displayName = "CarouselContent";
const CarouselItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        role: "group",
        "aria-roledescription": "slide",
        className: cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        ),
        ...props
      }
    );
  }
);
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = reactExports.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute  h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollPrev,
        onClick: scrollPrev,
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Previous slide" })
        ]
      }
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = reactExports.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollNext,
        onClick: scrollNext,
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Next slide" })
        ]
      }
    );
  }
);
CarouselNext.displayName = "CarouselNext";
const categories = {
  announcement: { label: "E'lon", color: "bg-secondary text-secondary-foreground", icon: Megaphone },
  course: { label: "Yangi kurs", color: "bg-primary text-primary-foreground", icon: Sparkles },
  discount: { label: "Chegirma", color: "bg-warning text-warning-foreground", icon: Sparkles },
  event: { label: "Tadbir", color: "bg-accent text-accent-foreground", icon: Calendar }
};
function NewsCarousel() {
  const { data: items = [] } = useQuery({
    queryKey: ["public", "news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news").select("*").eq("published", true).order("published_at", { ascending: false }).limit(10);
      if (error) throw error;
      const list = data ?? [];
      await Promise.all(list.map(async (n) => {
        if (n.image_url && !n.image_url.startsWith("http")) {
          const { data: s } = await supabase.storage.from("course-covers").createSignedUrl(n.image_url, 3600);
          n._image = s?.signedUrl ?? null;
        } else if (n.image_url) n._image = n.image_url;
      }));
      return list;
    }
  });
  if (!items.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold", children: "Yangiliklar" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Carousel, { opts: { align: "start", loop: items.length > 1 }, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselContent, { children: items.map((n) => {
        const c = categories[n.category] ?? categories.announcement;
        const Icon = c.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselItem, { className: "md:basis-1/2 lg:basis-1/3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full overflow-hidden", children: [
          n._image ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] bg-cover bg-center", style: { backgroundImage: `url(${n._image})` } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/9] grid place-items-center bg-gradient-to-br from-primary/10 to-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-10 w-10 text-primary/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: c.color, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "mr-1 h-3 w-3" }),
              " ",
              c.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-semibold leading-snug line-clamp-2", children: n.title }),
            n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-3 text-sm text-muted-foreground", children: n.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(n.published_at).toLocaleDateString("uz-UZ") })
          ] })
        ] }) }, n.id);
      }) }),
      items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselPrevious, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselNext, {})
      ] })
    ] })
  ] });
}
function Dashboard() {
  const {
    user
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [subs, setSubs] = reactExports.useState([]);
  const [courses, setCourses] = reactExports.useState([]);
  const [progress, setProgress] = reactExports.useState([]);
  const [avgScore, setAvgScore] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) return;
    (async () => {
      const [{
        data: prof
      }, {
        data: planRow
      }, {
        data: prog
      }, {
        data: attempts
      }] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), supabase.from("user_plan").select("expires_at, is_trial, plans(title, duration_days)").eq("user_id", user.id).maybeSingle(), supabase.from("lesson_progress").select("*").eq("user_id", user.id).eq("completed", true), supabase.from("quiz_attempts").select("score").eq("user_id", user.id)]);
      setProfile(prof);
      const active = planRow && (!planRow.expires_at || new Date(planRow.expires_at) > /* @__PURE__ */ new Date());
      setSubs(active ? [planRow] : []);
      setProgress(prog ?? []);
      const recentLessonIds = (prog ?? []).slice(0, 50).map((p) => p.lesson_id);
      if (recentLessonIds.length) {
        const {
          data: ls
        } = await supabase.from("lessons").select("module_id, modules(course_id)").in("id", recentLessonIds);
        const cIds = Array.from(new Set((ls ?? []).map((l) => l.modules?.course_id).filter(Boolean)));
        if (cIds.length) {
          const {
            data: cs
          } = await supabase.from("courses").select("*, modules(*, lessons(id))").in("id", cIds);
          const list = cs ?? [];
          await Promise.all(list.map(async (c) => {
            if (c.cover_url && !c.cover_url.startsWith("http")) {
              const {
                data: s
              } = await supabase.storage.from("course-covers").createSignedUrl(c.cover_url, 60 * 60);
              c.cover_url = s?.signedUrl ?? null;
            }
          }));
          setCourses(list);
        }
      }
      if (attempts && attempts.length) {
        setAvgScore(Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length));
      }
    })();
  }, [user?.id]);
  const firstName = (profile?.full_name || "Foydalanuvchi").split(" ")[0];
  const activeSub = subs[0];
  const stats = [{
    label: "Tugatilgan darslar",
    value: String(progress.length),
    icon: CirclePlay,
    color: "text-primary bg-primary/10"
  }, {
    label: "Faol kurslar",
    value: String(courses.length),
    icon: BookOpen,
    color: "text-accent-foreground bg-accent/40"
  }, {
    label: "Tarif",
    value: activeSub ? activeSub.is_trial ? "Sinov" : activeSub.plans?.title ?? "Faol" : "Yo'q",
    icon: Clock,
    color: "text-warning bg-warning/15"
  }, {
    label: "O'rtacha ball",
    value: avgScore !== null ? `${avgScore}%` : "—",
    icon: Trophy,
    color: "text-success bg-success/15"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Bosh sahifa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl p-6 text-primary-foreground lg:p-8", style: {
        background: "var(--gradient-hero)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-2xl font-bold lg:text-3xl", children: [
            "Assalomu alaykum, ",
            firstName,
            "! 👋"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/80", children: "Bugun ham yangi bilim olishga tayyormisiz?" }),
          activeSub && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/80", children: [
              "Tarif faol — ",
              activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString() : "muddatsiz"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-white text-primary hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/courses", children: "Kurslarga o'tish" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-12 w-12 place-items-center rounded-lg ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl font-bold", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.label })
        ] })
      ] }) }, s.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCarousel, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-semibold", children: "Davom etayotgan kurslar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/courses", children: [
            "Hammasi ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "ml-1 h-3.5 w-3.5" })
          ] }) })
        ] }),
        courses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 text-center text-muted-foreground", children: [
          "Hozircha faol kurslaringiz yo'q. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/courses", className: "text-primary underline", children: "Kurs tanlash" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: courses.slice(0, 2).map((c) => {
          const total = (c.modules ?? []).reduce((s, m) => s + (m.lessons?.length || 0), 0);
          const courseLessonIds = new Set((c.modules ?? []).flatMap((m) => (m.lessons ?? []).map((l) => l.id)));
          const done = progress.filter((p) => courseLessonIds.has(p.lesson_id)).length;
          const pct = total ? Math.round(done / total * 100) : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
            c.cover_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[16/7] bg-cover bg-center", style: {
              backgroundImage: `url(${c.cover_url})`
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: c.category }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-3 font-display text-lg font-semibold leading-snug", children: c.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center gap-3 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                done,
                "/",
                total,
                " dars"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Taraqqiyot" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    pct,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: pct, className: "mt-1" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/courses/$courseId", params: {
                courseId: c.id
              }, children: "Davom etish" }) })
            ] })
          ] }, c.id);
        }) })
      ] }),
      activeSub && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Tarif ma'lumotlari" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Tarif" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold", children: activeSub.is_trial ? "Sinov muddati" : activeSub.plans?.title ?? "Faol" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Tugash sanasi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-lg font-semibold text-success", children: activeSub.expires_at ? new Date(activeSub.expires_at).toLocaleDateString() : "Muddatsiz" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2 flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/subscription", children: "Batafsil" }) }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
