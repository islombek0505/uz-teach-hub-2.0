import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useNotifications, a as useMarkRead, b as useMarkAllRead, T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { H as CheckCheck, C as CreditCard, M as MessageSquare, q as Megaphone, a as Bell, J as Info } from "../_libs/lucide-react.mjs";
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
import "./client-CbMU9m-9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tailwind-merge.mjs";
const iconFor = (t) => t === "payment" ? CreditCard : t === "feedback" ? MessageSquare : t === "news" ? Megaphone : t === "announcement" ? Bell : Info;
const colorFor = (t) => t === "payment" ? "bg-success/15 text-success" : t === "feedback" ? "bg-primary/10 text-primary" : t === "news" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground";
function NotificationsPage() {
  const {
    data: notifs = [],
    isLoading
  } = useNotifications(100);
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Bildirishnomalar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-4 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Yuklanmoqda..." : `${notifs.length} ta xabar, ${unread.length} ta o'qilmagan` }),
        unread.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => markAll.mutate(unread.map((n) => n.id)), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "mr-1 h-4 w-4" }),
          " Hammasini o'qildi"
        ] })
      ] }),
      notifs.length === 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-10 text-center text-muted-foreground", children: "Hozircha bildirishnomalar yo'q" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: notifs.map((n) => {
        const Icon = iconFor(n.type);
        const wrapper = /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `transition-colors hover:bg-muted/30 cursor-pointer ${n.is_read ? "" : "border-primary/30 bg-primary/5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex gap-4 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg ${colorFor(n.type)}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${n.is_read ? "" : "font-semibold"}`, children: n.title }),
              !n.is_read && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "h-5 px-1.5 text-[10px]", children: "Yangi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: new Date(n.created_at).toLocaleString("uz-UZ", {
                dateStyle: "medium",
                timeStyle: "short"
              }) })
            ] }),
            n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: n.body })
          ] })
        ] }) });
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => !n.is_read && markRead.mutate(n.id), children: n.link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: n.link, className: "block", children: wrapper }) : wrapper }, n.id);
      }) })
    ] })
  ] });
}
export {
  NotificationsPage as component
};
