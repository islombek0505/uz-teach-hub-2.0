import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as SidebarTrigger } from "./sidebar-yL0Cwk17.mjs";
import { B as Button, c as cn } from "./button-BXrfXN_b.mjs";
import { R as Root, I as Image, F as Fallback } from "../_libs/radix-ui__react-avatar.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { R as Root$1, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CbMU9m-9.mjs";
import { u as useAuth } from "./auth-yqoVlx_c.mjs";
import { a as Bell, H as CheckCheck } from "../_libs/lucide-react.mjs";
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root$1,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Corner, {})
    ]
  }
));
ScrollArea.displayName = Root$1.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function useNotifications(limit = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id, limit],
    enabled: !!user,
    refetchInterval: 3e4,
    queryFn: async () => {
      if (!user) return [];
      const [notifsRes, readsRes] = await Promise.all([
        supabase.from("notifications").select("*").or(`user_id.eq.${user.id},user_id.is.null`).order("created_at", { ascending: false }).limit(limit),
        supabase.from("notification_reads").select("notification_id").eq("user_id", user.id)
      ]);
      if (notifsRes.error) throw notifsRes.error;
      const readSet = new Set((readsRes.data ?? []).map((r) => r.notification_id));
      return (notifsRes.data ?? []).map((n) => ({
        ...n,
        is_read: n.user_id === user.id ? !!readSet.has(n.id) : readSet.has(n.id)
      }));
    }
  });
}
function useMarkRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId) => {
      if (!user) return;
      await supabase.from("notification_reads").upsert(
        { notification_id: notificationId, user_id: user.id },
        { onConflict: "notification_id,user_id" }
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });
}
function useMarkAllRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids) => {
      if (!user || !ids.length) return;
      const rows = ids.map((id) => ({ notification_id: id, user_id: user.id }));
      await supabase.from("notification_reads").upsert(rows, { onConflict: "notification_id,user_id" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
  });
}
function Topbar({ title, initials = "AY" }) {
  const { data: notifs = [] } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);
  const { user } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user?.id]);
  const computedInitials = profile?.full_name?.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || initials;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-semibold tracking-tight truncate", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "icon", className: "relative", "aria-label": "Bildirishnomalar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
          unread.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground", children: unread.length > 9 ? "9+" : unread.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { align: "end", className: "w-80 p-0 sm:w-96", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-semibold", children: "Bildirishnomalar" }),
            unread.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", onClick: () => markAll.mutate(unread.map((n) => n.id)), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "mr-1 h-3.5 w-3.5" }),
              " Hammasini o'qildi"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "max-h-96", children: [
            notifs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "Hozircha bildirishnomalar yo'q" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: notifs.map((n) => {
              const item = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 p-3 hover:bg-muted/50 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.is_read ? "bg-transparent" : "bg-primary"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm ${n.is_read ? "" : "font-semibold"}`, children: n.title }),
                  n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 line-clamp-2 text-xs text-muted-foreground", children: n.body }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] uppercase tracking-wide text-muted-foreground", children: new Date(n.created_at).toLocaleString("uz-UZ", { dateStyle: "medium", timeStyle: "short" }) })
                ] })
              ] });
              return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { onClick: () => !n.is_read && markRead.mutate(n.id), children: n.link ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: n.link, className: "block", children: item }) : item }, n.id);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t p-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", className: "w-full text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notifications", children: "Barchasini ko'rish" }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9", children: [
        profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: profile.full_name ?? "" }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-sm font-medium", children: computedInitials })
      ] })
    ] })
  ] });
}
export {
  Avatar as A,
  Topbar as T,
  useMarkRead as a,
  useMarkAllRead as b,
  AvatarImage as c,
  AvatarFallback as d,
  useNotifications as u
};
