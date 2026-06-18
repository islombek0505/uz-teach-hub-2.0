import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Topbar } from "./topbar-OGx_zO3a.mjs";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CPilEoFz.mjs";
import { B as Button } from "./button-BXrfXN_b.mjs";
import { I as Input } from "./auth-yqoVlx_c.mjs";
import { L as Label } from "./label-Brw405F4.mjs";
import { T as Textarea } from "./textarea-BBisE2jS.mjs";
import { B as Badge } from "./badge-B-q03HH0.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Dn_c42EA.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as Send, c as Users, U as User, q as Megaphone, a1 as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
function AdminNotifications() {
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [audience, setAudience] = reactExports.useState("all");
  const [userId, setUserId] = reactExports.useState("");
  const [link, setLink] = reactExports.useState("");
  const {
    data: items = [],
    isLoading
  } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("notifications").select("*").order("created_at", {
        ascending: false
      }).limit(200);
      if (error) throw error;
      const userIds = Array.from(new Set((data ?? []).map((n) => n.user_id).filter(Boolean)));
      const {
        data: profs
      } = userIds.length ? await supabase.from("profiles").select("id, full_name").in("id", userIds) : {
        data: []
      };
      const map = new Map((profs ?? []).map((p) => [p.id, p.full_name]));
      return (data ?? []).map((n) => ({
        ...n,
        recipient: n.user_id ? map.get(n.user_id) || "—" : null
      }));
    }
  });
  const {
    data: students = []
  } = useQuery({
    queryKey: ["admin", "all-students-min"],
    queryFn: async () => {
      const {
        data: roles
      } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      const ids = (roles ?? []).map((r) => r.user_id);
      if (!ids.length) return [];
      const {
        data
      } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      return data ?? [];
    }
  });
  const send = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Sarlavhani kiriting");
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      const payload = {
        title: title.trim(),
        body: body.trim() || null,
        type: audience === "all" ? "announcement" : "info",
        link: link.trim() || null,
        created_by: user?.id ?? null,
        user_id: audience === "all" ? null : userId
      };
      if (audience === "one" && !userId) throw new Error("Foydalanuvchini tanlang");
      const {
        error
      } = await supabase.from("notifications").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bildirishnoma yuborildi");
      setTitle("");
      setBody("");
      setLink("");
      setUserId("");
      qc.invalidateQueries({
        queryKey: ["admin", "notifications"]
      });
      qc.invalidateQueries({
        queryKey: ["notifications"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({
        queryKey: ["admin", "notifications"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, { title: "Bildirishnomalar", initials: "AD" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 space-y-6 p-4 lg:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[420px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }),
          " Yangi bildirishnoma"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Kimga" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: audience, onValueChange: (v) => setAudience(v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
                  " Hamma o'quvchilarga (e'lon)"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "one", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                  " Bitta o'quvchiga"
                ] }) })
              ] })
            ] })
          ] }),
          audience === "one" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "O'quvchi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: userId, onValueChange: setUserId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tanlang..." }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: students.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.full_name || s.phone || s.id.slice(0, 8) }, s.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sarlavha" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Masalan: Yangi kurs ochildi!", maxLength: 200 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Matn" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: body, onChange: (e) => setBody(e.target.value), placeholder: "Batafsil ma'lumot...", maxLength: 2e3 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Havola (ixtiyoriy)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: link, onChange: (e) => setLink(e.target.value), placeholder: "/app/courses" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => send.mutate(), disabled: send.isPending, className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
            " ",
            send.isPending ? "Yuborilmoqda..." : "Yuborish"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4" }),
          " Tarix"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Yuklanmoqda..." }),
          !isLoading && items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Hozircha bildirishnomalar yo'q" }),
          items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: n.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: n.type }),
                n.user_id === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-1 h-3 w-3" }),
                  " Hammaga"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "mr-1 h-3 w-3" }),
                  " ",
                  n.recipient
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: new Date(n.created_at).toLocaleString("uz-UZ", {
                  dateStyle: "short",
                  timeStyle: "short"
                }) })
              ] }),
              n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: n.body })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive", onClick: () => {
              if (confirm("O'chirilsinmi?")) del.mutate(n.id);
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] }, n.id))
        ] })
      ] })
    ] }) })
  ] });
}
export {
  AdminNotifications as component
};
