import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCheck,
  Bell,
  CreditCard,
  MessageSquare,
  Megaphone,
  Info,
  type LucideIcon,
} from "lucide-react";
import { useNotifications, useMarkAllRead, useMarkRead } from "@/lib/notifications";
import { Sk } from "@/components/student/loaders";

export const Route = createFileRoute("/app/notifications")({
  component: NotificationsPage,
});

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
  return new Date(iso).toLocaleDateString("uz-UZ", { dateStyle: "medium" } as any);
}

function NotificationsPage() {
  const { data: notifs = [], isLoading } = useNotifications(100);
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const unread = notifs.filter((n) => !n.is_read);

  return (
    <>
      <Topbar title="Bildirishnomalar" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          icon={Bell}
          title="Bildirishnomalar"
          subtitle={
            isLoading
              ? "Yuklanmoqda..."
              : `${notifs.length} ta xabar${unread.length ? ` · ${unread.length} ta o'qilmagan` : ""}`
          }
          action={
            unread.length > 0 ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => markAll.mutate(unread.map((n) => n.id))}
              >
                <CheckCheck className="mr-1 h-4 w-4" /> Hammasini o'qildi
              </Button>
            ) : undefined
          }
        />

        {isLoading && (
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Sk key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        )}

        {notifs.length === 0 && !isLoading && (
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Hozircha bildirishnomalar yo'q</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2.5">
          {notifs.map((n) => {
            const Icon = iconFor(n.type);
            const wrapper = (
              <Card
                className={`glass glass-hover cursor-pointer rounded-2xl ${
                  n.is_read ? "border-transparent" : "border-primary/40"
                }`}
              >
                <CardContent className="flex gap-4 p-4">
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${colorFor(n.type)}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={n.is_read ? "" : "font-semibold"}>{n.title}</div>
                      {!n.is_read && <Badge className="h-5 px-1.5 text-[10px]">Yangi</Badge>}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {relativeTime(n.created_at)}
                      </span>
                    </div>
                    {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  </div>
                </CardContent>
              </Card>
            );
            return (
              <div key={n.id} onClick={() => !n.is_read && markRead.mutate(n.id)}>
                {n.link ? (
                  <Link to={n.link as any} className="block">
                    {wrapper}
                  </Link>
                ) : (
                  wrapper
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
