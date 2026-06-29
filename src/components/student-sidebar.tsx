import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  GraduationCap,
  Bell,
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
import { signOut } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: "notif";
};

const items: NavItem[] = [
  { title: "Bosh sahifa", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Guruhlarim", url: "/app/groups", icon: BookOpen },
  { title: "Ochiq guruhlar", url: "/app/admissions", icon: CalendarDays },
  { title: "Bildirishnomalar", url: "/app/notifications", icon: Bell, badge: "notif" },
  { title: "To'lovlar", url: "/app/subscription", icon: CreditCard },
  { title: "Takliflar", url: "/app/feedback", icon: MessageSquare },
  { title: "Profil", url: "/app/profile", icon: User },
];

export function StudentSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["sidebar", "profile", user?.id],
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

  const closeOnMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    closeOnMobile();
    await signOut();
    navigate({ to: "/auth/login" });
  };

  const name = profile?.full_name || "Foydalanuvchi";
  const initials =
    name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "O";

  return (
    <Sidebar collapsible="icon">
      {/* Brand header with a soft glow */}
      <SidebarHeader className="sidebar-glow relative overflow-hidden border-b border-sidebar-border">
        <Link
          to="/app"
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
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-bold tracking-tight text-sidebar-foreground">
              OnlineTalim
            </span>
            <span className="text-xs text-sidebar-foreground/55">O'quvchi paneli</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menyu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = item.exact ? pathname === item.url : pathname.startsWith(item.url);
                const showBadge = item.badge === "notif" && unread > 0;
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

                        {/* Live unread badge (count when expanded, ping dot when collapsed) */}
                        {showBadge && (
                          <>
                            <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground shadow-sm group-data-[collapsible=icon]:hidden">
                              {unread > 9 ? "9+" : unread}
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
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        {/* Profile + logout */}
        <Link
          to="/app/profile"
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
            <span className="text-xs text-sidebar-foreground/55">O'quvchi</span>
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
