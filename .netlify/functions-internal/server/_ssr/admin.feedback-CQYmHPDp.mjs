import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MessageSquare, s as CircleAlert, K as Lightbulb, a7 as Reply, a1 as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const typeMeta = {
  suggestion: {
    icon: Lightbulb,
    label: "Taklif",
    color: "bg-warning/15 text-warning-foreground"
  },
  feedback: {
    icon: MessageSquare,
    label: "Fikr",
    color: "bg-primary/10 text-primary"
  },
  complaint: {
    icon: CircleAlert,
    label: "Shikoyat",
    color: "bg-destructive/10 text-destructive"
  },
  question: {
    icon: MessageSquare,
    label: "Savol",
    color: "bg-accent/40 text-accent-foreground"
  }
};
function AdminFeedback() {
  const [items, setItems] = reactExports.useState([]);
  const [replyId, setReplyId] = reactExports.useState(null);
  const [replyText, setReplyText] = reactExports.useState("");
  const load = async () => {
    const {
      data: fb
    } = await supabase.from("feedback").select("*").order("created_at", {
      ascending: false
    });
    const list = fb ?? [];
    const ids = Array.from(new Set(list.map((f) => f.user_id)));
    if (ids.length) {
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      list.forEach((f) => {
        f.profile = map.get(f.user_id);
      });
    }
    setItems(list);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const markRead = async (id) => {
    await supabase.from("feedback").update({
      read: true
    }).eq("id", id);
    load();
  };
  const sendReply = async (id) => {
    const {
      error
    } = await supabase.from("feedback").update({
      admin_reply: replyText,
      read: true
    }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Javob yuborildi");
    setReplyId(null);
    setReplyText("");
    load();
  };
  const del = async (id) => {
    if (!confirm("O'chirilsinmi?")) return;
    const {
      error
    } = await supabase.from("feedback").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("O'chirildi");
    load();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Murojaatlar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Jami" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-bold", children: items.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "O'qilmagan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-bold text-primary", children: items.filter((f) => !f.read).length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted-foreground", children: "Shikoyatlar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-display text-2xl font-bold text-destructive", children: items.filter((f) => f.type === "complaint").length })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Hozircha murojaatlar yo'q" }),
        items.map((f) => {
          const meta = typeMeta[f.type] ?? typeMeta.feedback;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: !f.read ? "border-primary/40 bg-primary/5" : "", onClick: () => !f.read && markRead(f.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg ${meta.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(meta.icon, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: f.profile?.full_name || "Foydalanuvchi" }),
                f.profile?.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: f.profile.phone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: meta.label }),
                !f.read && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: "Yangi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: new Date(f.created_at).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-medium", children: f.subject }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.message }),
              f.admin_reply && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md bg-primary/5 p-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs font-semibold text-primary", children: "Sizning javobingiz:" }),
                f.admin_reply
              ] }),
              replyId === f.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: replyText, onChange: (e) => setReplyText(e.target.value), placeholder: "Javob..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => sendReply(f.id), children: "Yuborish" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
                    setReplyId(null);
                    setReplyText("");
                  }, children: "Bekor" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
                  setReplyId(f.id);
                  setReplyText(f.admin_reply || "");
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "mr-1 h-3.5 w-3.5" }),
                  " Javob berish"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "text-destructive", onClick: () => del(f.id), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "mr-1 h-3.5 w-3.5" }),
                  " O'chirish"
                ] })
              ] })
            ] })
          ] }) }) }, f.id);
        })
      ] })
    ] })
  ] });
}
export {
  AdminFeedback as component
};
