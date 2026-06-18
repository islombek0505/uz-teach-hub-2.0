import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { u as useAuth, I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { K as Lightbulb, M as MessageSquare, s as CircleAlert } from "../_libs/lucide-react.mjs";
import "./sidebar-yL0Cwk17.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function FeedbackPage() {
  const {
    user
  } = useAuth();
  const [type, setType] = reactExports.useState("suggestion");
  const [subject, setSubject] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const loadHistory = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from("feedback").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    });
    setHistory(data ?? []);
  };
  reactExports.useEffect(() => {
    loadHistory();
  }, [user?.id]);
  const submit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const {
      error
    } = await supabase.from("feedback").insert({
      user_id: user.id,
      type,
      subject,
      message
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Murojaatingiz yuborildi!");
    setSubject("");
    setMessage("");
    loadHistory();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Takliflar va murojaatlar" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-3", children: [{
        icon: Lightbulb,
        label: "Taklif",
        desc: "Platformani yaxshilash bo'yicha g'oyalaringiz"
      }, {
        icon: MessageSquare,
        label: "Fikr-mulohaza",
        desc: "Kurs yoki dars haqida fikringiz"
      }, {
        icon: CircleAlert,
        label: "Shikoyat",
        desc: "Texnik muammo yoki noqulaylik"
      }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: c.desc })
      ] }) }, c.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display", children: "Murojaat yuborish" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Turi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "suggestion", children: "Taklif" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "feedback", children: "Fikr-mulohaza" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "complaint", children: "Shikoyat" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "question", children: "Savol" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mavzu" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: subject, onChange: (e) => setSubject(e.target.value), placeholder: "Qisqacha mavzu", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Xabar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 6, value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Murojaatingizni batafsil yozing...", required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", disabled: loading, children: loading ? "Yuborilmoqda..." : "Yuborish" })
          ] }),
          history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold", children: "Oldingi murojaatlaringiz" }),
            history.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: f.type }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: f.subject }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: new Date(f.created_at).toLocaleDateString() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: f.message }),
              f.admin_reply && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md bg-primary/5 p-3 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs font-semibold text-primary", children: "Admin javobi:" }),
                f.admin_reply
              ] })
            ] }, f.id))
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  FeedbackPage as component
};
