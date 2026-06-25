import {
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  Megaphone,
  Info,
  type LucideIcon,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/lib/notifications";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const iconFor = (t: string): LucideIcon =>
  t === "payment"
    ? CreditCard
    : t === "feedback"
      ? MessageSquare
      : t === "news"
        ? Megaphone
        : t === "announcement"
          ? Bell
          : Info;

const colorFor = (t: string) =>
  t === "payment"
    ? "bg-success/15 text-success"
    : t === "feedback"
      ? "bg-primary/10 text-primary"
      : t === "news"
        ? "bg-warning/15 text-warning"
        : "bg-[oklch(0.55_0.13_220/0.12)] text-[oklch(0.42_0.13_240)]";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "hozirgina";
  if (m < 60) return `${m} daqiqa oldin`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} soat oldin`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} kun oldin`;
  return new Date(iso).toLocaleDateString("uz-UZ");
}

export function Topbar({ title, initials = "AY" }: { title: string; initials?: string }) {
  const { data: notifs = [] } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string | null;
    avatar_url: string | null;
  } | null>(null);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data as any));
  }, [user?.id]);
  const name = profile?.full_name || "Foydalanuvchi";
  const computedInitials =
    profile?.full_name
      ?.split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || initials;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/30 bg-background/60 px-4 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 lg:px-6">
      <SidebarTrigger />
      <h1 className="truncate font-display text-lg font-semibold tracking-tight">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              aria-label="Bildirishnomalar"
            >
              <Bell className="h-5 w-5" />
              {unread.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground ring-2 ring-background">
                  {unread.length > 9 ? "9+" : unread.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 overflow-hidden rounded-2xl p-0 sm:w-96">
            <div className="flex items-center justify-between border-b bg-muted/30 p-3">
              <div>
                <div className="font-display text-sm font-semibold">Bildirishnomalar</div>
                <div className="text-xs text-muted-foreground">
                  {unread.length > 0 ? `${unread.length} ta yangi` : "Hammasi o'qilgan"}
                </div>
              </div>
              {unread.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => markAll.mutate(unread.map((n) => n.id))}
                >
                  <CheckCheck className="mr-1 h-3.5 w-3.5" /> Hammasi
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-96">
              {notifs.length === 0 && (
                <div className="flex flex-col items-center gap-2 p-8 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Hozircha bildirishnomalar yo'q
                  </div>
                </div>
              )}
              <ul className="divide-y">
                {notifs.map((n) => {
                  const Icon = iconFor(n.type);
                  const item = (
                    <div
                      className={`flex gap-3 p-3 transition-colors hover:bg-muted/50 ${n.is_read ? "" : "bg-primary/5"}`}
                    >
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${colorFor(n.type)}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm ${n.is_read ? "" : "font-semibold"}`}>
                          {n.title}
                        </div>
                        {n.body && (
                          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {n.body}
                          </div>
                        )}
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {relativeTime(n.created_at)}
                        </div>
                      </div>
                      {!n.is_read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                  return (
                    <li key={n.id} onClick={() => !n.is_read && markRead.mutate(n.id)}>
                      {n.link ? (
                        <Link to={n.link as any} className="block">
                          {item}
                        </Link>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
            <div className="border-t p-2 text-center">
              <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                <Link to="/app/notifications">Barchasini ko'rish</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Link
          to="/app/profile"
          className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-muted sm:pr-3"
        >
          <Avatar className="h-9 w-9">
            {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={name} /> : null}
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {computedInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-sm font-medium sm:block">{name}</span>
        </Link>
      </div>
    </header>
  );
}
