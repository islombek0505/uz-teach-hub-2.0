import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student-sidebar";
import { AuthGate } from "@/components/auth-gate";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  // Authenticated student area — keep every sub-route out of search engines.
  head: () => seo({ title: "O‘quvchi paneli", noindex: true }),
});

function AppLayout() {
  return (
    <AuthGate>
      <SidebarProvider>
        <div className="app-surface flex min-h-screen w-full">
          <StudentSidebar />
          <SidebarInset className="flex w-full flex-col bg-transparent">
            <Outlet />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGate>
  );
}