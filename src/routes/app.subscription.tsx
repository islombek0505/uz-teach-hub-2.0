import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Phone, Send, Copy, Instagram, Mail, Globe, Youtube, Facebook, MessageCircle, Crown, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/subscription")({
  component: SubscriptionPage,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function SubscriptionPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const copy = (t: string) => { navigator.clipboard.writeText(t); toast.success("Nusxa olindi"); };

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["app", "subscription", user?.id],
    queryFn: async () => {
      const [{ data: plans }, { data: userPlan }, { data: profile }, { data: payments }, { data: cards }, { data: channels }] = await Promise.all([
        supabase.from("plans").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("user_plan").select("*, plans(title, duration_days)").eq("user_id", user!.id).maybeSingle(),
        supabase.from("profiles").select("trial_activated_at").eq("id", user!.id).maybeSingle(),
        supabase.from("payments").select("id, amount, status, created_at, plans(title)").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("payment_cards" as any).select("*").eq("is_active", true).order("sort_order"),
        supabase.from("contact_channels" as any).select("*").eq("is_active", true).order("sort_order"),
      ]);
      return {
        plans: plans ?? [],
        userPlan: userPlan as any,
        profile: profile as any,
        payments: payments ?? [],
        cards: (cards ?? []) as any[],
        channels: (channels ?? []) as any[],
      };
    },
  });

  const activateTrial = useMutation({
    mutationFn: async () => {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const { error: e1 } = await supabase.from("profiles").update({ trial_activated_at: new Date().toISOString() }).eq("id", user!.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("user_plan").upsert(
        { user_id: user!.id, plan_id: null, is_trial: true, started_at: new Date().toISOString(), expires_at: expires.toISOString() },
        { onConflict: "user_id" },
      );
      if (e2) throw e2;
    },
    onSuccess: () => { toast.success("Sinov muddati aktivlashtirildi!"); qc.invalidateQueries({ queryKey: ["app", "subscription"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const iconFor = (type: string) => ({ telegram: Send, phone: Phone, whatsapp: MessageCircle, instagram: Instagram, email: Mail, website: Globe, youtube: Youtube, facebook: Facebook } as any)[type] ?? Phone;

  const userPlan = data?.userPlan;
  const planActive = !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at) > new Date());
  const trialUsed = !!data?.profile?.trial_activated_at;

  return (
    <>
      <Topbar title="Tarif va to'lov" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Card className={planActive ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"}>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">
                  {planActive ? (userPlan.is_trial ? "Sinov muddati faol" : (userPlan.plans?.title ?? "Tarif faol")) : "Akkountingiz tarifsiz"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {planActive
                    ? `Tugaydi: ${userPlan.expires_at ? new Date(userPlan.expires_at).toLocaleDateString("uz-UZ") : "muddatsiz"}`
                    : "Video darslarni ko'rish uchun tarif sotib oling"}
                </div>
              </div>
            </div>
            {!planActive && !trialUsed && (
              <Button onClick={() => activateTrial.mutate()} disabled={activateTrial.isPending}>
                <Sparkles className="mr-2 h-4 w-4" /> 1 haftalik bepul sinovni boshlash
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Tariflarni tanlang</CardTitle></CardHeader>
          <CardContent>
            {(data?.plans ?? []).length === 0 && <div className="text-sm text-muted-foreground">Hozircha tariflar yo'q.</div>}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.plans ?? []).map((p: any) => (
                <Card key={p.id} className="border-2 transition-colors hover:border-primary">
                  <CardContent className="space-y-3 p-5">
                    <div className="font-display text-lg font-semibold">{p.title}</div>
                    <div className="font-display text-3xl font-bold">{fmt(Number(p.price))}</div>
                    <div className="text-xs text-muted-foreground">{p.duration_days} kun • barcha kurslarga ruxsat</div>
                    {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
                    <PayDialog plan={p} userId={user!.id} cards={data?.cards ?? []} onDone={() => qc.invalidateQueries({ queryKey: ["app", "subscription"] })} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">To'lov uchun ma'lumotlar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(data?.cards ?? []).length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">To'lov kartalari sozlanmagan.</div>
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
                    <div className="text-xs text-muted-foreground">{p.plans?.title ?? "—"} • {new Date(p.created_at).toLocaleDateString("uz-UZ")}</div>
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

function PayDialog({ plan, userId, cards, onDone }: { plan: any; userId: string; cards: any[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let receipt_url: string | null = null;
      if (file) {
        const path = `${userId}/${plan.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        receipt_url = path;
      }
      const { error } = await supabase.from("payments").insert({
        user_id: userId,
        plan_id: plan.id,
        amount: plan.price,
        note: note || null,
        receipt_url,
        status: "pending",
      });
      if (error) throw error;
      toast.success("To'lov yuborildi! Admin tasdiqlashini kuting.");
      onDone();
      setOpen(false); setFile(null); setNote("");
    } catch (err: any) {
      toast.error(err.message ?? "Xatolik");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full"><CreditCard className="mr-2 h-4 w-4" /> Sotib olish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">{plan.title} — to'lov</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {cards.length > 0 && (
            <Card><CardContent className="p-4 space-y-1">
              <div className="text-xs uppercase text-muted-foreground">{cards[0].label}{cards[0].bank ? ` • ${cards[0].bank}` : ""}</div>
              <div className="font-display text-xl font-bold tracking-wider">{cards[0].card_number}</div>
              <div className="text-sm text-muted-foreground">{cards[0].holder_name}</div>
            </CardContent></Card>
          )}
          <div className="space-y-2">
            <Label>Summa</Label>
            <Input value={fmt(Number(plan.price))} disabled />
          </div>
          <div className="space-y-2">
            <Label>Chek rasmi (ixtiyoriy)</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground hover:bg-muted/50">
              <Upload className="h-5 w-5" />
              <span>{file ? file.name : "Chek skrinshotni tanlang"}</span>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="space-y-2">
            <Label>Eslatma (ixtiyoriy)</Label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Masalan: Telegram username yoki transfer raqami" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>{busy ? "Yuborilmoqda..." : "Yuborish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
