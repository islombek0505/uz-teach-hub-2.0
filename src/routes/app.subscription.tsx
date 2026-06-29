import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Upload,
  Clock,
  CalendarDays,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { formatPrice, pricePeriodLabel, type MembershipStatus } from "@/lib/groups";

export const Route = createFileRoute("/app/subscription")({
  component: PaymentsPage,
});

const UZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

function monthLabel(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}-yil ${UZ_MONTHS[d.getMonth()]}`;
}

function currentPeriodMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

type ActiveGroup = {
  id: string;
  name: string;
  price: number;
  price_period: string;
  courseTitle: string;
};

function PaymentsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const periodMonth = currentPeriodMonth();

  const copy = (t: string) => {
    navigator.clipboard.writeText(t);
    toast.success("Nusxa olindi");
  };

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ["app", "payments", user?.id],
    queryFn: async () => {
      const { data: memberships } = await supabase
        .from("group_members")
        .select("groups(id, name, price, price_period, status, courses(title))")
        .eq("user_id", user!.id)
        .eq("status", "approved" as MembershipStatus);

      const activeGroups: ActiveGroup[] = (memberships ?? [])
        .map((m) => {
          const g = m.groups as {
            id: string;
            name: string;
            price: number;
            price_period: string;
            status: string;
            courses: { title: string } | { title: string }[] | null;
          } | null;
          if (!g || g.status !== "active") return null;
          const c = g.courses;
          const courseTitle = Array.isArray(c) ? (c[0]?.title ?? "—") : (c?.title ?? "—");
          return {
            id: g.id,
            name: g.name,
            price: g.price,
            price_period: g.price_period,
            courseTitle,
          };
        })
        .filter((g): g is ActiveGroup => !!g);

      const { data: payments } = await supabase
        .from("payments")
        .select("id, amount, status, created_at, period_month, group_id, groups(name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      const [{ data: cards }, { data: channels }] = await Promise.all([
        supabase.from("payment_cards").select("*").eq("is_active", true).order("sort_order"),
        supabase.from("contact_channels").select("*").eq("is_active", true).order("sort_order"),
      ]);

      // Joriy oy uchun guruh bo'yicha to'lov holati
      const thisMonth = new Map<string, MembershipStatus>();
      for (const p of payments ?? []) {
        if (p.period_month === periodMonth && p.group_id && p.status !== "rejected") {
          thisMonth.set(p.group_id, p.status as MembershipStatus);
        }
      }

      return {
        activeGroups,
        payments: payments ?? [],
        cards: cards ?? [],
        channels: channels ?? [],
        thisMonth,
      };
    },
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
      }) as Record<string, typeof Phone>
    )[type] ?? Phone;

  const activeGroups = data?.activeGroups ?? [];
  const thisMonth = data?.thisMonth ?? new Map<string, MembershipStatus>();
  const cards = data?.cards ?? [];

  return (
    <>
      <Topbar title="To'lovlar" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">To'lovlar</h2>
          <p className="text-sm text-muted-foreground">
            Siz a'zo bo'lgan va darslari boshlangan guruhlar uchun oylik to'lov.
          </p>
        </div>

        {/* Joriy oy to'lovlari */}
        <div>
          <h3 className="mb-3 font-display text-lg font-semibold">
            Joriy oy to'lovi · {monthLabel(periodMonth)}
          </h3>

          {activeGroups.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                <Inbox className="h-8 w-8 opacity-40" />
                <p>
                  Hozircha to'lov talab qilinmaydi. Darslar boshlangan guruhga biriktirilganingizdan
                  so'ng bu yerda oylik to'lov chiqadi.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/groups">Guruhlarim</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeGroups.map((g) => {
                const status = thisMonth.get(g.id);
                return (
                  <Card key={g.id} className="overflow-hidden">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{g.courseTitle}</Badge>
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold">{g.name}</h4>
                        <div className="mt-1 font-display text-2xl font-bold tracking-tight">
                          {formatPrice(g.price)}
                          <span className="ml-1 text-sm font-normal text-muted-foreground">
                            / {pricePeriodLabel(g.price_period)}
                          </span>
                        </div>
                      </div>
                      {status === "approved" ? (
                        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                          <CheckCircle2 className="h-4 w-4" /> Bu oy uchun to'langan
                        </div>
                      ) : status === "pending" ? (
                        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                          <Clock className="h-4 w-4" /> To'lov tekshirilmoqda
                        </div>
                      ) : (
                        <PayDialog
                          group={g}
                          userId={user!.id}
                          periodMonth={periodMonth}
                          periodLabel={monthLabel(periodMonth)}
                          cards={cards}
                          onDone={() => qc.invalidateQueries({ queryKey: ["app", "payments"] })}
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* To'lov uchun ma'lumotlar */}
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">To'lov uchun ma'lumotlar</h3>
              <div className="space-y-4">
                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    To'lov kartalari sozlanmagan.
                  </div>
                )}
                {cards.map((c) => (
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
                    {(data?.channels ?? []).map((c) => {
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

          {/* To'lovlar tarixi */}
          <Card className="glass rounded-2xl border-transparent">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">To'lovlar tarixi</h3>
              <div className="space-y-2.5">
                {(data?.payments ?? []).length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    To'lovlar tarixi bo'sh
                  </div>
                )}
                {(data?.payments ?? []).map((p) => {
                  const grp = p.groups as { name: string } | { name: string }[] | null;
                  const groupName = Array.isArray(grp) ? (grp[0]?.name ?? "—") : (grp?.name ?? "—");
                  return (
                    <div key={p.id} className="rounded-xl border border-border/60 p-4">
                      <div className="flex items-center gap-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{formatPrice(Number(p.amount))}</div>
                          <div className="text-xs text-muted-foreground">
                            {groupName} · {monthLabel(p.period_month)}
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
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function PayDialog({
  group,
  userId,
  periodMonth,
  periodLabel,
  cards,
  onDone,
}: {
  group: ActiveGroup;
  userId: string;
  periodMonth: string;
  periodLabel: string;
  cards: Array<{
    id: string;
    label: string;
    bank: string | null;
    card_number: string;
    holder_name: string;
  }>;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Chek rasmini yuklang — bu majburiy");
    if (file.size > 5 * 1024 * 1024) return toast.error("Fayl 5MB dan kichik bo'lsin");
    const okType =
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|pdf)$/i.test(file.name);
    if (!okType) return toast.error("Faqat rasm yoki PDF yuklang");
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/${group.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("receipts")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (upErr) throw upErr;
      const { error } = await supabase.from("payments").insert({
        user_id: userId,
        group_id: group.id,
        period_month: periodMonth,
        amount: group.price,
        note: note || null,
        receipt_url: path,
        status: "pending",
      });
      if (error) throw error;
      toast.success("To'lov yuborildi! Admin tasdiqlashini kuting.");
      onDone();
      setOpen(false);
      setFile(null);
      setNote("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CreditCard className="mr-2 h-4 w-4" /> To'lash
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            {group.name} — {periodLabel}
          </DialogTitle>
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
            <Input value={formatPrice(group.price)} disabled />
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
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
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
