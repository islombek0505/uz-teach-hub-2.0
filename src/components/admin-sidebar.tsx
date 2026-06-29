import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Users2,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Bell,
  BarChart3,
  Newspaper,
  User,
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/lib/notifications";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "notif" | "groups";
};

type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Boshqaruv",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
      { title: "Yo'nalishlar", url: "/admin/courses", icon: BookOpen },
      { title: "Guruhlar", url: "/admin/groups", icon: Users2, badge: "groups" },
      { title: "O'quvchilar", url: "/admin/students", icon: Users },
      { title: "O'quvchilar statistikasi", url: "/admin/student-stats", icon: BarChart3 },
    ],
  },
  {
    label: "Moliya",
    items: [{ title: "To'lovlar", url: "/admin/payments", icon: CreditCard }],
  },
  {
    label: "Tizim",
    items: [
      { title: "Bildirishnomalar", url: "/admin/notifications", icon: Bell, badge: "notif" },
      { title: "Yangiliklar", url: "/admin/news", icon: Newspaper },
      { title: "Takliflar", url: "/admin/feedback", icon: MessageSquare },
      { title: "Mening profilim", url: "/admin/profile", icon: User },
      { title: "Sozlamalar", url: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["admin-sidebar", "profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: notifs = [] } = useNotifications();
  const unread = notifs.filter((n) => !n.is_read).length;

  // Guruhga qo'shilish + chiqish so'rovlari soni (Guruhlar menyusida badge)
  const { data: requestsCount = 0 } = useQuery({
    queryKey: ["admin-sidebar", "group-requests"],
    enabled: !!user,
    refetchInterval: 60000,
    queryFn: async () => {
      const { data } = await supabase.from("group_members").select("*");
      const rows = data ?? [];
      const pending = rows.filter((m) => m.status === "pending").length;
      const leave = rows.filter((m) => m.status === "approved" && m.leave_requested_at).length;
      return pending + leave;
    },
  });

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    closeOnMobile();
    await signOut();
    navigate({ to: "/auth/login" });
  };

  const name = profile?.full_name || "Administrator";
  const initials =
    name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <Sidebar collapsible="icon">
      {/* Brand header with a soft glow */}
      <SidebarHeader className="sidebar-glow relative overflow-hidden border-b border-sidebar-border">
        <Link
          to="/admin"
          onClick={closeOnMobile}
          className="relative flex items-center gap-2.5 px-2 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="relative shrink-0">
            <div
              className="animate-soft-pulse absolute -inset-1 rounded-2xl opacity-60 blur-md"
              style={{ background: "var(--gradient-accent)" }}
              aria-hidden
            />
            <div
              className="relative grid h-9 w-9 place-items-center rounded-xl text-sidebar-primary-foreground shadow-sm ring-1 ring-white/20"
              style={{ background: "var(--gradient-accent)" }}
            >
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-bold tracking-tight text-sidebar-foreground">
              OnlineTalim
            </span>
            <span className="text-xs text-sidebar-foreground/55">Admin paneli</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = item.exact ? pathname === item.url : pathname.startsWith(item.url);
                  const badgeCount =
                    item.badge === "notif" ? unread : item.badge === "groups" ? requestsCount : 0;
                  const showBadge = badgeCount > 0;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "group/navi relative h-10 gap-3 rounded-xl px-3 font-medium transition-all duration-200",
                          active
                            ? "sidebar-nav-active text-white hover:text-white"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white",
                        )}
                      >
                        <Link to={item.url} onClick={closeOnMobile}>
                          {/* Animated active accent bar */}
                          <span
                            className={cn(
                              "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-300",
                              active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0",
                            )}
                            aria-hidden
                          />
                          <item.icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0 transition-all duration-200 group-hover/navi:scale-110",
                              active &&
                                "text-sidebar-primary drop-shadow-[0_0_6px_oklch(0.7_0.12_195/0.6)]",
                            )}
                          />
                          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>

                          {/* Live unread badge for notifications */}
                          {showBadge && (
                            <>
                              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground shadow-sm group-data-[collapsible=icon]:hidden">
                                {badgeCount > 9 ? "9+" : badgeCount}
                              </span>
                              <span className="absolute right-1.5 top-1.5 hidden h-2.5 w-2.5 group-data-[collapsible=icon]:block">
                                <span className="animate-badge-ping absolute inset-0 rounded-full bg-destructive" />
                                <span className="absolute inset-0 rounded-full bg-destructive ring-2 ring-sidebar" />
                              </span>
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        {/* Admin profile + logout */}
        <Link
          to="/admin/profile"
          onClick={closeOnMobile}
          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <div className="relative shrink-0">
            <Avatar className="h-8 w-8">
              {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={name} /> : null}
              <AvatarFallback className="bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-sidebar"
              aria-hidden
            />
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-sidebar-foreground">{name}</span>
            <span className="inline-flex items-center gap-1 text-xs text-sidebar-foreground/55">
              <Shield className="h-3 w-3" /> Administrator
            </span>
          </div>
        </Link>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Chiqish"
              className="rounded-xl text-sidebar-foreground/70 transition-colors hover:bg-destructive/15 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Chiqish</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
