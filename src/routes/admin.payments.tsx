import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addMonths } from "@/lib/utils";
import {
  CheckCircle2,
  X,
  Receipt,
  ExternalLink,
  FileText,
  Clock,
  Wallet,
  Phone,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

const initialsOf = (name?: string | null) =>
  (name || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const STATUS = {
  approved: { label: "Tasdiqlangan", cls: "bg-success/15 text-success", icon: CheckCircle2 },
  pending: { label: "Kutilmoqda", cls: "bg-warning/15 text-warning", icon: Clock },
  rejected: { label: "Rad etilgan", cls: "bg-destructive/15 text-destructive", icon: X },
} as const;

function StatusPill({ status }: { status: string }) {
  const m = STATUS[status as keyof typeof STATUS];
  if (!m) return <span className="text-xs text-muted-foreground">—</span>;
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${m.cls}`}
    >
      <Icon className="h-3.5 w-3.5" /> {m.label}
    </span>
  );
}

function AdminPayments() {
  const [filter, setFilter] = useState<string>("all");
  const qc = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const { data: pays, error } = await supabase
        .from("payments")
        .select("*, plans(id, title, duration_days, duration_months)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = Array.from(new Set((pays ?? []).map((p: any) => p.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
      const pmap = new Map((profs ?? []).map((p: any) => [p.id, p]));
      return (pays ?? []).map((p: any) => ({ ...p, profile: pmap.get(p.user_id) }));
    },
  });

  const list = filter === "all" ? payments : payments.filter((p: any) => p.status === filter);

  const summary = useMemo(() => {
    const by = (st: string) => payments.filter((p: any) => p.status === st);
    const sum = (arr: any[]) => arr.reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0);
    return {
      counts: {
        all: payments.length,
        pending: by("pending").length,
        approved: by("approved").length,
        rejected: by("rejected").length,
      },
      revenue: sum(by("approved")),
      pendingSum: sum(by("pending")),
    };
  }, [payments]);

  const approve = useMutation({
    mutationFn: async (p: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error: e1 } = await supabase
        .from("payments")
        .update({
          status: "approved",
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", p.id);
      if (e1) throw e1;
      // extend from current expiry if still active, else from now
      const { data: current } = await supabase
        .from("user_plan")
        .select("expires_at")
        .eq("user_id", p.user_id)
        .maybeSingle();
      const baseTs =
        current?.expires_at && new Date(current.expires_at).getTime() > Date.now()
          ? new Date(current.expires_at).getTime()
          : Date.now();
      // Calendar-accurate: add whole calendar months when the plan defines them
      // (so 3 months = exactly 3 months from the start date, not a flat 90 days),
      // falling back to the legacy fixed day count for older plans.
      const months = p.plans?.duration_months ?? null;
      const expires =
        months && months > 0
          ? addMonths(new Date(baseTs), months)
          : new Date(baseTs + (p.plans?.duration_days ?? 30) * 24 * 60 * 60 * 1000);
      const { error: e2 } = await supabase.from("user_plan").upsert(
        {
          user_id: p.user_id,
          plan_id: p.plan_id,
          payment_id: p.id,
          is_trial: false,
          started_at: new Date().toISOString(),
          expires_at: expires.toISOString(),
        },
        { onConflict: "user_id" },
      );
      if (e2) throw e2;
    },
    onSuccess: () => {
      toast.success("Tasdiqlandi va tarif faollashtirildi");
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reject = useMutation({
    mutationFn: async ({ p, reason }: { p: any; reason: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("payments")
        .update({
          status: "rejected",
          admin_note: reason,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", p.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Rad etildi");
      qc.invalidateQueries({ queryKey: ["admin", "payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cards = [
    {
      label: "Tasdiqlangan daromad",
      value: fmt(summary.revenue),
      sub: `${summary.counts.approved} ta to'lov`,
      icon: Wallet,
      tint: "text-success",
      chip: "bg-success/15",
    },
    {
      label: "Kutilayotgan",
      value: String(summary.counts.pending),
      sub: summary.pendingSum ? fmt(summary.pendingSum) : "Yangi yo'q",
      icon: Clock,
      tint: "text-warning",
      chip: "bg-warning/15",
    },
    {
      label: "Tasdiqlangan",
      value: String(summary.counts.approved),
      sub: "Jami tasdiqlangan",
      icon: CheckCircle2,
      tint: "text-primary",
      chip: "bg-primary/10",
    },
    {
      label: "Rad etilgan",
      value: String(summary.counts.rejected),
      sub: "Jami rad etilgan",
      icon: X,
      tint: "text-destructive",
      chip: "bg-destructive/15",
    },
  ];

  const tabs = [
    { value: "all", label: "Hammasi", count: summary.counts.all },
    { value: "pending", label: "Kutilmoqda", count: summary.counts.pending },
    { value: "approved", label: "Tasdiqlangan", count: summary.counts.approved },
    { value: "rejected", label: "Rad etilgan", count: summary.counts.rejected },
  ];

  return (
    <>
      <Topbar title="To'lovlar boshqaruvi" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Card key={c.label} className="rounded-2xl border-transparent">
              <CardContent className="p-5">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.chip}`}>
                  <c.icon className={`h-5 w-5 ${c.tint}`} />
                </div>
                <div className="mt-4 truncate font-display text-2xl font-bold tracking-tight">
                  {c.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground/80">{c.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-hidden rounded-2xl border-transparent">
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="flex-wrap">
                {tabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                    {t.label}
                    <span className="rounded-full bg-foreground/10 px-1.5 text-[11px] font-semibold leading-5">
                      {t.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <span className="text-sm text-muted-foreground">{list.length} ta ko'rsatilmoqda</span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    O'quvchi
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tarif
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Summa
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Chek / Izoh
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Sana
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                    Holat
                  </TableHead>
                  <TableHead className="w-28 text-right text-xs uppercase tracking-wide text-muted-foreground">
                    Amallar
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                      Yuklanmoqda...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && list.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="py-12">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">
                          <Inbox className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Bu bo'limda to'lovlar yo'q
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {list.map((p: any) => (
                  <TableRow
                    key={p.id}
                    className={`border-border/60 transition-colors ${p.status === "pending" ? "bg-warning/[0.035]" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {initialsOf(p.profile?.full_name ?? p.payer_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {p.profile?.full_name ?? p.payer_name ?? "—"}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {p.profile?.phone ?? p.payer_phone ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.plans?.title ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap font-display font-semibold tabular-nums">
                      {fmt(Number(p.amount))}
                    </TableCell>
                    <TableCell>
                      <ReceiptCell receiptUrl={p.receipt_url} note={p.note} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("uz-UZ")}
                    </TableCell>
                    <TableCell>
                      <StatusPill status={p.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === "pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <Button
                            size="sm"
                            className="h-8 gap-1 bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => approve.mutate(p)}
                            disabled={approve.isPending}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Tasdiq
                          </Button>
                          <RejectDialog
                            onConfirm={(reason) => reject.mutate({ p, reason })}
                            pending={reject.isPending}
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </>
  );
}

function RejectDialog({
  onConfirm,
  pending,
}: {
  onConfirm: (reason: string) => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const confirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      toast.error("Rad etish sababini yozing");
      return;
    }
    onConfirm(trimmed);
    setOpen(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={pending}
        >
          <X className="h-3.5 w-3.5" /> Rad
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">To'lovni rad etish</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label>
            Rad etish sababi <span className="text-destructive">*</span>
          </Label>
          <Textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Masalan: Chek summasi tarif narxiga to'g'ri kelmadi"
          />
          <p className="text-xs text-muted-foreground">Bu sabab o'quvchiga ko'rsatiladi.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={pending || !reason.trim()}>
            Rad etish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptCell({ receiptUrl, note }: { receiptUrl: string | null; note: string | null }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !receiptUrl || url) return;
    let cancelled = false;
    (async () => {
      // `receipts` is a private bucket — admins are allowed to read all via RLS,
      // so a short-lived signed URL is enough to display the file.
      const { data, error } = await supabase.storage
        .from("receipts")
        .createSignedUrl(receiptUrl, 60 * 60);
      if (cancelled) return;
      if (error || !data?.signedUrl) setErr(error?.message ?? "Yuklab bo'lmadi");
      else setUrl(data.signedUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, receiptUrl, url]);

  const ext = (receiptUrl?.split(".").pop() ?? "").toLowerCase();
  const isPdf = ext === "pdf";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "heic", "heif", "avif"].includes(
    ext,
  );

  return (
    <div className="space-y-1">
      {receiptUrl ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Receipt className="h-3.5 w-3.5" /> Ko'rish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">
                Chek{ext ? ` · ${ext.toUpperCase()}` : ""}
              </DialogTitle>
            </DialogHeader>
            {err ? (
              <div className="grid aspect-video place-items-center text-sm text-destructive">
                {err}
              </div>
            ) : !url ? (
              <div className="grid aspect-video place-items-center text-sm text-muted-foreground">
                Yuklanmoqda...
              </div>
            ) : isImage ? (
              <img
                src={url}
                alt="Chek"
                className="mx-auto max-h-[70vh] w-full rounded-md object-contain"
              />
            ) : isPdf ? (
              <iframe src={url} title="Chek" className="h-[70vh] w-full rounded-md bg-white" />
            ) : (
              <div className="grid place-items-center gap-3 rounded-md border border-dashed bg-muted/30 p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Bu fayl turini ({ext || "noma'lum"}) sahifada ko'rsatib bo'lmaydi. Yangi oynada
                  oching.
                </div>
              </div>
            )}
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <ExternalLink className="h-4 w-4" /> Yangi oynada ochish / yuklab olish
                </Button>
              </a>
            )}
            {note && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <span className="font-medium">Izoh: </span>
                {note}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <span className="text-xs text-muted-foreground">Chek yo'q</span>
      )}
      {note && (
        <div className="max-w-[220px] truncate text-xs text-muted-foreground" title={note}>
          💬 {note}
        </div>
      )}
    </div>
  );
}
