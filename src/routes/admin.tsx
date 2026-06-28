import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AuthGate } from "@/components/auth-gate";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => seo({ title: "Admin panel", noindex: true }),
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AuthGate requireAdmin>
      <SidebarProvider>
        <div className="admin-surface flex min-h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex w-full flex-col bg-transparent">
            {/* Keyed by route so each page gets a gentle opacity entrance.
                Opacity-only (no transform) keeps the sticky Topbar intact. */}
            <div key={pathname} className="admin-fade-in flex flex-1 flex-col">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGate>
  );
}
