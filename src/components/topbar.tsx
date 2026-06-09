import { Bell, CheckCheck } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/lib/notifications";

export function Topbar({ title, initials = "AY" }: { title: string; initials?: string }) {
  const { data: notifs = [] } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <SidebarTrigger />
      <h1 className="font-display text-lg font-semibold tracking-tight truncate">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Bildirishnomalar">
              <Bell className="h-5 w-5" />
              {unread.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread.length > 9 ? "9+" : unread.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 sm:w-96">
            <div className="flex items-center justify-between border-b p-3">
              <div className="font-display font-semibold">Bildirishnomalar</div>
              {unread.length > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAll.mutate(unread.map((n) => n.id))}>
                  <CheckCheck className="mr-1 h-3.5 w-3.5" /> Hammasini o'qildi
                </Button>
              )}
            </div>
            <ScrollArea className="max-h-96">
              {notifs.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">Hozircha bildirishnomalar yo'q</div>}
              <ul className="divide-y">
                {notifs.map((n) => {
                  const item = (
                    <div className="flex gap-3 p-3 hover:bg-muted/50 transition-colors">
                      <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${n.is_read ? "bg-transparent" : "bg-primary"}`} />
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm ${n.is_read ? "" : "font-semibold"}`}>{n.title}</div>
                        {n.body && <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</div>}
                        <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                          {new Date(n.created_at).toLocaleString("uz-UZ", { dateStyle: "medium", timeStyle: "short" })}
                        </div>
                      </div>
                    </div>
                  );
                  return (
                    <li key={n.id} onClick={() => !n.is_read && markRead.mutate(n.id)}>
                      {n.link ? (
                        <Link to={n.link as any} className="block">{item}</Link>
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
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}