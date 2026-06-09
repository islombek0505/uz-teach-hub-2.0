import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Bell, CreditCard, MessageSquare, Megaphone, Info } from "lucide-react";
import { useNotifications, useMarkAllRead, useMarkRead } from "@/lib/notifications";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

const iconFor = (t: string) =>
  t === "payment" ? CreditCard : t === "feedback" ? MessageSquare : t === "news" ? Megaphone : t === "announcement" ? Bell : Info;

const colorFor = (t: string) =>
  t === "payment" ? "bg-success/15 text-success" :
  t === "feedback" ? "bg-primary/10 text-primary" :
  t === "news" ? "bg-warning/15 text-warning" :
  "bg-muted text-muted-foreground";

function NotificationsPage() {
  const { data: notifs = [], isLoading } = useNotifications(100);
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);

  return (
    <>
      <Topbar title="Bildirishnomalar" />
      <main className="flex-1 space-y-4 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${notifs.length} ta xabar, ${unread.length} ta o'qilmagan`}</p>
          {unread.length > 0 && (
            <Button size="sm" variant="outline" onClick={() => markAll.mutate(unread.map((n) => n.id))}>
              <CheckCheck className="mr-1 h-4 w-4" /> Hammasini o'qildi
            </Button>
          )}
        </div>
        {notifs.length === 0 && !isLoading && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">Hozircha bildirishnomalar yo'q</CardContent></Card>
        )}
        <div className="space-y-2">
          {notifs.map((n) => {
            const Icon = iconFor(n.type);
            const wrapper = (
              <Card className={`transition-colors hover:bg-muted/30 cursor-pointer ${n.is_read ? "" : "border-primary/30 bg-primary/5"}`}>
                <CardContent className="flex gap-4 p-4">
                  <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg ${colorFor(n.type)}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`${n.is_read ? "" : "font-semibold"}`}>{n.title}</div>
                      {!n.is_read && <Badge className="h-5 px-1.5 text-[10px]">Yangi</Badge>}
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("uz-UZ", { dateStyle: "medium", timeStyle: "short" })}</span>
                    </div>
                    {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  </div>
                </CardContent>
              </Card>
            );
            return (
              <div key={n.id} onClick={() => !n.is_read && markRead.mutate(n.id)}>
                {n.link ? <Link to={n.link as any} className="block">{wrapper}</Link> : wrapper}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}