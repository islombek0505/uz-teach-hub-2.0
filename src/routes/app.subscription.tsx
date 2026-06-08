import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUser, formatPrice, mockPayments } from "@/lib/mock-data";
import { CheckCircle2, Calendar, CreditCard, Phone, Send, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/subscription")({
  component: SubscriptionPage,
});

function SubscriptionPage() {
  const myPayments = mockPayments.filter(p => p.studentName === mockUser.name);
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Nusxa olindi"); };

  return (
    <>
      <Topbar title="Obuna va to'lov" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Active status */}
        <Card className="overflow-hidden">
          <div className="p-6 text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/20 text-success border-success/30">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Faol
                  </Badge>
                  <span className="text-sm text-white/80">{mockUser.subscription.plan} tarif</span>
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold">{formatPrice(mockUser.subscription.amount)}/oy</h2>
                <p className="mt-1 text-sm text-white/70">Barcha kurslarga to'liq ruxsat</p>
              </div>
              <div className="text-right text-sm">
                <div className="text-white/70">Tugaydi</div>
                <div className="font-display text-2xl font-bold">{mockUser.subscription.endDate}</div>
                <div className="mt-1 flex items-center gap-1 text-white/70"><Calendar className="h-3.5 w-3.5" /> 30 kun qoldi</div>
              </div>
            </div>
          </div>
        </Card>

        {/* How to pay */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Obunani yangilash / To'lov qilish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To'lov qo'lda amalga oshiriladi. Quyidagi karta raqamiga to'lov qiling va keyin operator bilan bog'laning.
            </p>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="text-xs uppercase text-muted-foreground">Plastik karta raqami</div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="font-display text-2xl font-bold tracking-wider">8600 1234 5678 9012</div>
                <Button variant="outline" size="sm" onClick={() => copy("8600123456789012")}><Copy className="mr-1 h-3.5 w-3.5" /> Nusxa</Button>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Yusupov A.K. — Humo / Uzcard</div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href="tel:+998901234567" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Phone className="h-5 w-5" /></div>
                <div><div className="font-medium">Telefon orqali</div><div className="text-sm text-muted-foreground">+998 90 123 45 67</div></div>
              </a>
              <a href="https://t.me/learnhub_uz" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Send className="h-5 w-5" /></div>
                <div><div className="font-medium">Telegram orqali</div><div className="text-sm text-muted-foreground">@learnhub_uz</div></div>
              </a>
            </div>

            <div className="rounded-lg border border-dashed bg-warning/5 p-3 text-xs">
              <strong>Eslatma:</strong> To'lov qilingach, operator 1-2 soat ichida obunangizni faollashtiradi. Obuna muddati tugagach, kurslarga ruxsat bloklanadi.
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader><CardTitle className="font-display">To'lovlar tarixi</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><CreditCard className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="font-medium">{formatPrice(p.amount)}</div>
                    <div className="text-xs text-muted-foreground">{p.method} • {p.date}</div>
                  </div>
                  <Badge variant={p.status === "approved" ? "default" : "secondary"} className={p.status === "approved" ? "bg-success text-success-foreground" : ""}>
                    {p.status === "approved" ? "Tasdiqlangan" : "Kutilmoqda"}
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