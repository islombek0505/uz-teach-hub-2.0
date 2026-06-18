import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, d as useRouterState, e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SidebarProvider, a as SidebarInset, u as useSidebar, b as Sidebar, c as SidebarHeader, d as SidebarContent, e as SidebarGroup, f as SidebarGroupLabel, g as SidebarGroupContent, h as SidebarMenu, i as SidebarMenuItem, j as SidebarMenuButton, k as SidebarFooter } from "./sidebar-yL0Cwk17.mjs";
import { s as signOut } from "./auth-yqoVlx_c.mjs";
import { A as AuthGate } from "./auth-gate-CKzouA3L.mjs";
import { S as Shield, L as LayoutDashboard, B as BookOpen, c as Users, d as ChartColumn, e as Crown, C as CreditCard, a as Bell, N as Newspaper, M as MessageSquare, U as User, f as Settings, b as LogOut } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./button-BXrfXN_b.mjs";
import "../_libs/tailwind-merge.mjs";
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
import "./client-CbMU9m-9.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Kurslar", url: "/admin/courses", icon: BookOpen },
  { title: "O'quvchilar", url: "/admin/students", icon: Users },
  { title: "O'quvchilar statistikasi", url: "/admin/student-stats", icon: ChartColumn },
  { title: "Tariflar", url: "/admin/plans", icon: Crown },
  { title: "To'lovlar", url: "/admin/payments", icon: CreditCard },
  { title: "Bildirishnomalar", url: "/admin/notifications", icon: Bell },
  { title: "Yangiliklar", url: "/admin/news", icon: Newspaper },
  { title: "Takliflar", url: "/admin/feedback", icon: MessageSquare },
  { title: "Mening profilim", url: "/admin/profile", icon: User },
  { title: "Sozlamalar", url: "/admin/settings", icon: Settings }
];
function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };
  const handleLogout = async () => {
    closeOnMobile();
    await signOut();
    navigate({ to: "/auth/login" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { className: "border-b border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", onClick: closeOnMobile, className: "flex items-center gap-2 px-2 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-col group-data-[collapsible=icon]:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-base font-semibold text-sidebar-foreground", children: "LearnHub" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-sidebar-foreground/60", children: "Admin paneli" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupLabel, { children: "Boshqaruv" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: items.map((item) => {
        const active = item.url === "/admin" ? pathname === "/admin" : pathname.startsWith(item.url);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuButton, { asChild: true, isActive: active, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.url, onClick: closeOnMobile, className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.title })
        ] }) }) }, item.url);
      }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarFooter, { className: "border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarMenuButton, { onClick: handleLogout, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Chiqish" })
    ] }) }) }) })
  ] });
}
function AdminLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { requireAdmin: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen w-full bg-muted/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarInset, { className: "flex w-full flex-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] }) }) });
}
export {
  AdminLayout as component
};
