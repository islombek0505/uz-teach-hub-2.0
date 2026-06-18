import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { l as CircleCheck, B as BookOpen, t as Lock } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function CoursesList() {
  const {
    user
  } = useAuth();
  const {
    data,
    isLoading
  } = useQuery({
    enabled: !!user,
    queryKey: ["app", "courses", user?.id],
    queryFn: async () => {
      const [{
        data: cs,
        error
      }, {
        data: plan
      }] = await Promise.all([supabase.from("courses").select("id, title, description, cover_url, category, lessons(count)").eq("published", true).order("created_at", {
        ascending: false
      }), supabase.from("user_plan").select("expires_at").eq("user_id", user.id).maybeSingle()]);
      if (error) throw error;
      const hasPlan = !!plan && (!plan.expires_at || new Date(plan.expires_at) > /* @__PURE__ */ new Date());
      const mapped = (cs ?? []).map((c) => ({
        ...c,
        enrolled: hasPlan
      }));
      await Promise.all(mapped.map(async (c) => {
        if (c.cover_url && !c.cover_url.startsWith("http")) {
          const {
            data: s
          } = await supabase.storage.from("course-covers").createSignedUrl(c.cover_url, 60 * 60);
          c.cover_url = s?.signedUrl ?? null;
        }
      }));
      return mapped;
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Kurslar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Barcha mavjud kurslar — faol tarif bilan barchasini ko'rishingiz mumkin" }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Yuklanmoqda..." }),
      !isLoading && (data ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-10 text-center text-muted-foreground", children: "Hozircha nashr etilgan kurslar yo'q." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: (data ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group overflow-hidden transition-all hover:shadow-[var(--shadow-elegant)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video overflow-hidden bg-muted", children: [
          c.cover_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105", style: {
            backgroundImage: `url(${c.cover_url})`
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 flex gap-2", children: c.category && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "backdrop-blur-sm", children: c.category }) }),
          c.enrolled && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-success text-success-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-1 h-3 w-3" }),
            " Faol"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold leading-snug line-clamp-2", children: c.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground line-clamp-2", children: c.description ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-center justify-between text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5" }),
            " ",
            c.lessons?.[0]?.count ?? 0,
            " dars"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 w-full", variant: c.enrolled ? "default" : "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/courses/$courseId", params: {
            courseId: c.id
          }, children: c.enrolled ? "Davom etish" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mr-1 h-3.5 w-3.5" }),
            " Tarif kerak"
          ] }) }) })
        ] })
      ] }, c.id)) })
    ] })
  ] });
}
export {
  CoursesList as component
};
