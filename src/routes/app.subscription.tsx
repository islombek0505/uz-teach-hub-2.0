import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { PageHeader } from "@/components/page-header";
import { planDurationLabel } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  CreditCard,
  Phone,
  Send,
  Copy,
  Instagram,
  Mail,
  Globe,
  Youtube,
  Facebook,
  MessageCircle,
  Crown,
  Upload,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { activateTrial as activateTrialFn } from "@/lib/subscription.functions";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success("Nusxa olindi");
  };

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["app", "subscription", user?.id],
    queryFn: async () => {
      const [
        { data: plans },
        { data: userPlan },
        { data: profile },
        { data: payments },
        { data: cards },
        { data: channels },
      ] = await Promise.all([
        supabase.from("plans").select("*").eq("is_active", true).order("sort_order"),
        supabase
          .from("user_plan")
          .select("*, plans(title, duration_days)")
          .eq("user_id", user!.id)
          .maybeSingle(),
        supabase.from("profiles").select("trial_activated_at").eq("id", user!.id).maybeSingle(),
        supabase
          .from("payments")
          .select("id, amount, status, created_at, admin_note, plans(title)")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("payment_cards" as any)
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("contact_channels" as any)
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
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

  const runActivateTrial = useServerFn(activateTrialFn);
  const activateTrial = useMutation({
    mutationFn: async () => {
      await runActivateTrial({});
    },
    onSuccess: () => {
      toast.success("Sinov muddati aktivlashtirildi!");
      qc.invalidateQueries({ queryKey: ["app", "subscription"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const iconFor = (type: string) =>
    (
      ({
        telegram: Send,
        phone: Phone,
        whatsapp: MessageCircle,
        instagram: Instagram,
        email: Mail,
        website: Globe,
        youtube: Youtube,
        facebook: Facebook,
      }) as any
    )[type] ?? Phone;

  const userPlan = data?.userPlan;
  const planActive =
    !!userPlan && (!userPlan.expires_at || new Date(userPlan.expires_at) > new Date());
  const trialUsed = !!data?.profile?.trial_activated_at;

  return (
    <>
      <Topbar title="Tarif va to'lov" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          // icon={Crown}
          title="Tarif va to'lov"
          subtitle="Barcha kurslarga to'liq kirish uchun tarif sotib oling"
        />

        {/* Current status */}
        <Card
          className="overflow-hidden rounded-2xl border-0 text-primary-foreground shadow-sm"
          style={{ background: planActive ? "var(--gradient-hero)" : "var(--gradient-primary)" }}
        >
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {/* <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15">
                <Crown className="h-6 w-6" />
              </div> */}
              <div>
                <div className="font-display text-lg font-semibold">
                  {planActive
                    ? userPlan.is_trial
                      ? "Sinov muddati faol"
                      : (userPlan.plans?.title ?? "Tarif faol")
                    : "Akkountingiz tarifsiz"}
                </div>
                <div className="mt-0.5 text-sm text-white/75">
                  {planActive
                    ? `Tugaydi: ${userPlan.expires_at ? new Date(userPlan.expires_at).toLocaleDateString("uz-UZ") : "muddatsiz"}`
                    : "Video darslarni ko'rish uchun tarif sotib oling"}
                </div>
              </div>
            </div>
            {!planActive && !trialUsed && (
              <Button
                onClick={() => activateTrial.mutate()}
                disabled={activateTrial.isPending}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Sparkles className="mr-2 h-4 w-4" /> 1 haftalik bepul sinov
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h3 className="mb-4 font-display text-xl font-semibold">Tariflarni tanlang</h3>
          {(data?.plans ?? []).length === 0 && (
            <div className="text-sm text-muted-foreground">Hozircha tariflar yo'q.</div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.plans ?? []).map((p: any, i: number) => {
              const popular = i === 1;
              return (
                <Card
                  key={p.id}
                  className={`relative rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                    popular ? "border-2 border-primary" : "border-border/60"
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-sm">
                        Ommabop
                      </Badge>
                    </div>
                  )}
                  <CardContent className="space-y-3 p-5">
                    <div className="font-display text-lg font-semibold">{p.title}</div>
                    <div className="font-display text-3xl font-bold tracking-tight">
                      {fmt(Number(p.price))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      {planDurationLabel(p)} · barcha kurslarga ruxsat
                    </div>
                    {p.description && (
                      <p className="text-sm text-muted-foreground">{p.description}</p>
                    )}
                    <PayDialog
                      plan={p}
                      userId={user!.id}
                      cards={data?.cards ?? []}
                      popular={popular}
                      onDone={() => qc.invalidateQueries({ queryKey: ["app", "subscription"] })}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment details */}
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">To'lov uchun ma'lumotlar</h3>
              <div className="space-y-4">
                {(data?.cards ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    To'lov kartalari sozlanmagan.
                  </div>
                )}
                {(data?.cards ?? []).map((c: any) => (
                  <div key={c.id} className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <div className="text-xs uppercase text-muted-foreground">
                      {c.label}
                      {c.bank ? ` · ${c.bank}` : ""}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="font-display text-xl font-bold tracking-wider sm:text-2xl">
                        {c.card_number}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(c.card_number.replace(/\s+/g, ""))}
                      >
                        <Copy className="mr-1 h-3.5 w-3.5" /> Nusxa
                      </Button>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{c.holder_name}</div>
                  </div>
                ))}

                {(data?.channels ?? []).length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(data?.channels ?? []).map((c: any) => {
                      const Icon = iconFor(c.type);
                      return (
                        <a
                          key={c.id}
                          href={c.url || "#"}
                          target={c.type === "phone" || c.type === "email" ? undefined : "_blank"}
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{c.label}</div>
                            <div className="truncate text-sm text-muted-foreground">{c.value}</div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment history */}
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">To'lovlar tarixi</h3>
              <div className="space-y-2.5">
                {(data?.payments ?? []).length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    To'lovlar tarixi bo'sh
                  </div>
                )}
                {(data?.payments ?? []).map((p: any) => (
                  <div key={p.id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{fmt(Number(p.amount))}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.plans?.title ?? "-"} ·{" "}
                          {new Date(p.created_at).toLocaleDateString("uz-UZ")}
                        </div>
                      </div>
                      <Badge
                        className={
                          p.status === "approved"
                            ? "bg-success text-success-foreground"
                            : p.status === "rejected"
                              ? "bg-destructive text-destructive-foreground"
                              : "bg-warning text-warning-foreground"
                        }
                      >
                        {p.status === "approved"
                          ? "Tasdiqlangan"
                          : p.status === "rejected"
                            ? "Rad etilgan"
                            : "Kutilmoqda"}
                      </Badge>
                    </div>
                    {p.status === "rejected" && p.admin_note && (
                      <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        <span className="font-medium">Rad etish sababi: </span>
                        {p.admin_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function PayDialog({
  plan,
  userId,
  cards,
  popular,
  onDone,
}: {
  plan: any;
  userId: string;
  cards: any[];
  popular?: boolean;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Chek rasmini yuklang — bu majburiy");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fayl 5MB dan kichik bo'lsin");
      return;
    }
    const okType =
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|pdf)$/i.test(file.name);
    if (!okType) {
      toast.error("Faqat rasm yoki PDF yuklang");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${plan.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("receipts")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (upErr) throw upErr;
      const receipt_url = path;
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
      setOpen(false);
      setFile(null);
      setNote("");
    } catch (err: any) {
      toast.error(err.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={popular ? "default" : "outline"}>
          <CreditCard className="mr-2 h-4 w-4" /> Sotib olish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">{plan.title} — to'lov</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {cards.length > 0 && (
            <Card className="rounded-xl border-border/60">
              <CardContent className="space-y-1 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  {cards[0].label}
                  {cards[0].bank ? ` · ${cards[0].bank}` : ""}
                </div>
                <div className="font-display text-xl font-bold tracking-wider">
                  {cards[0].card_number}
                </div>
                <div className="text-sm text-muted-foreground">{cards[0].holder_name}</div>
              </CardContent>
            </Card>
          )}
          <div className="space-y-2">
            <Label>Summa</Label>
            <Input value={fmt(Number(plan.price))} disabled />
          </div>
          <div className="space-y-2">
            <Label>
              Chek rasmi <span className="text-destructive">*</span>
            </Label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 text-sm hover:bg-muted/50 ${
                file ? "border-success/60 text-foreground" : "text-muted-foreground"
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>{file ? file.name : "Chek faylini tanlang (majburiy)"}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {!file && (
              <p className="text-xs text-muted-foreground">
                To'lovni tasdiqlash uchun chek majburiy. Faqat rasm (JPG/PNG) yoki PDF — 5MB
                gacha.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Eslatma (ixtiyoriy)</Label>
            <Textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Masalan: Telegram username yoki transfer raqami"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy || !file}>
              {busy ? "Yuborilmoqda..." : "Yuborish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
