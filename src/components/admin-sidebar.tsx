import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Bell,
  Newspaper,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Kurslar", url: "/admin/courses", icon: BookOpen },
  { title: "O'quvchilar", url: "/admin/students", icon: Users },
  { title: "Mentorlar", url: "/admin/mentors", icon: UserCheck },
  { title: "To'lovlar", url: "/admin/payments", icon: CreditCard },
  { title: "Bildirishnomalar", url: "/admin/notifications", icon: Bell },
  { title: "Yangiliklar", url: "/admin/news", icon: Newspaper },
  { title: "Takliflar", url: "/admin/feedback", icon: MessageSquare },
  { title: "Sozlamalar", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/auth/login" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-semibold text-sidebar-foreground">LearnHub</span>
            <span className="text-xs text-sidebar-foreground/60">Admin paneli</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Boshqaruv</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/admin" ? pathname === "/admin" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Chiqish</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}