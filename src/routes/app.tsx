import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student-sidebar";
import { AuthGate } from "@/components/auth-gate";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <AuthGate>
      <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <StudentSidebar />
        <SidebarInset className="flex w-full flex-col">
          <Outlet />
        </SidebarInset>
      </div>
      </SidebarProvider>
    </AuthGate>
  );
}