import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Phone, Send, Copy, Instagram, Mail, Globe, Youtube, Facebook, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/subscription")({
  component: SubscriptionPage,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function SubscriptionPage() {
  const { user } = useAuth();
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Nusxa olindi"); };

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["app", "subscription", user?.id],
    queryFn: async () => {
      const [{ data: subs }, { data: payments }, { data: cards }, { data: channels }] = await Promise.all([
        supabase.from("subscriptions").select("active, expires_at, courses(title)").eq("user_id", user!.id).eq("active", true),
        supabase.from("payments").select("id, amount, status, created_at, courses(title)").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("payment_cards" as any).select("*").eq("is_active", true).order("sort_order"),
        supabase.from("contact_channels" as any).select("*").eq("is_active", true).order("sort_order"),
      ]);
      return { subs: subs ?? [], payments: payments ?? [], cards: (cards ?? []) as any[], channels: (channels ?? []) as any[] };
    },
  });

  const iconFor = (type: string) => ({ telegram: Send, phone: Phone, whatsapp: MessageCircle, instagram: Instagram, email: Mail, website: Globe, youtube: Youtube, facebook: Facebook } as any)[type] ?? Phone;

  return (
    <>
      <Topbar title="Obuna va to'lov" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Card>
          <CardHeader><CardTitle className="font-display">Faol obunalar</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(data?.subs ?? []).length === 0 && <div className="text-sm text-muted-foreground">Hozircha faol obuna yo'q. <Link to="/app/courses" className="text-primary underline">Kurslarni ko'ring</Link>.</div>}
            {(data?.subs ?? []).map((s: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="font-medium">{s.courses?.title ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">Tugaydi: {s.expires_at ? new Date(s.expires_at).toLocaleDateString("uz-UZ") : "muddatsiz"}</div>
                </div>
                <Badge className="bg-success text-success-foreground"><CheckCircle2 className="mr-1 h-3 w-3" /> Faol</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Obunani yangilash / To'lov qilish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To'lov qo'lda amalga oshiriladi. Quyidagi karta raqamiga to'lov qiling va keyin operator bilan bog'laning.
            </p>

            {(data?.cards ?? []).length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">To'lov kartalari sozlanmagan. Operator bilan bog'laning.</div>
            )}
            {(data?.cards ?? []).map((c: any) => (
              <div key={c.id} className="rounded-lg border bg-muted/30 p-4">
                <div className="text-xs uppercase text-muted-foreground">{c.label}{c.bank ? ` • ${c.bank}` : ""}</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="font-display text-xl font-bold tracking-wider sm:text-2xl">{c.card_number}</div>
                  <Button variant="outline" size="sm" onClick={() => copy(c.card_number.replace(/\s+/g, ""))}><Copy className="mr-1 h-3.5 w-3.5" /> Nusxa</Button>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{c.holder_name}</div>
              </div>
            ))}

            {(data?.channels ?? []).length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {(data?.channels ?? []).map((c: any) => {
                  const Icon = iconFor(c.type);
                  return (
                    <a key={c.id} href={c.url || "#"} target={c.type === "phone" || c.type === "email" ? undefined : "_blank"} rel="noreferrer" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                      <div className="min-w-0"><div className="truncate font-medium">{c.label}</div><div className="truncate text-sm text-muted-foreground">{c.value}</div></div>
                    </a>
                  );
                })}
              </div>
            )}

            <div className="rounded-lg border border-dashed bg-warning/5 p-3 text-xs">
              <strong>Eslatma:</strong> To'lov qilingach, operator 1-2 soat ichida obunangizni faollashtiradi. Obuna muddati tugagach, kurslarga ruxsat bloklanadi.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">To'lovlar tarixi</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data?.payments ?? []).length === 0 && <div className="text-sm text-muted-foreground">To'lovlar tarixi bo'sh</div>}
              {(data?.payments ?? []).map((p: any) => (
                <div key={p.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><CreditCard className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="font-medium">{fmt(Number(p.amount))}</div>
                    <div className="text-xs text-muted-foreground">{p.courses?.title ?? "—"} • {new Date(p.created_at).toLocaleDateString("uz-UZ")}</div>
                  </div>
                  <Badge className={p.status === "approved" ? "bg-success text-success-foreground" : p.status === "rejected" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}>
                    {p.status === "approved" ? "Tasdiqlangan" : p.status === "rejected" ? "Rad etilgan" : "Kutilmoqda"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}