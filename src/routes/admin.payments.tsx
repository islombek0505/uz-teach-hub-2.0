import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { CheckCircle2, X, Receipt, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function AdminPayments() {
  const [filter, setFilter] = useState<string>("all");
  const qc = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const { data: pays, error } = await supabase
        .from("payments")
        .select("*, plans(id, title, duration_days)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = Array.from(new Set((pays ?? []).map((p: any) => p.user_id)));
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
      const pmap = new Map((profs ?? []).map((p: any) => [p.id, p]));
      return (pays ?? []).map((p: any) => ({ ...p, profile: pmap.get(p.user_id) }));
    },
  });

  const list = filter === "all" ? payments : payments.filter((p: any) => p.status === filter);

  const approve = useMutation({
    mutationFn: async (p: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: e1 } = await supabase.from("payments").update({ status: "approved", reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", p.id);
      if (e1) throw e1;
      const days = p.plans?.duration_days ?? 30;
      // extend from current expiry if still active, else from now
      const { data: current } = await supabase.from("user_plan").select("expires_at").eq("user_id", p.user_id).maybeSingle();
      const baseTs = current?.expires_at && new Date(current.expires_at).getTime() > Date.now()
        ? new Date(current.expires_at).getTime()
        : Date.now();
      const expires = new Date(baseTs + days * 24 * 60 * 60 * 1000);
      const { error: e2 } = await supabase.from("user_plan").upsert(
        { user_id: p.user_id, plan_id: p.plan_id, payment_id: p.id, is_trial: false, started_at: new Date().toISOString(), expires_at: expires.toISOString() },
        { onConflict: "user_id" },
      );
      if (e2) throw e2;
    },
    onSuccess: () => { toast.success("Tasdiqlandi va tarif faollashtirildi"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const reject = useMutation({
    mutationFn: async ({ p, reason }: { p: any; reason: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
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
    onSuccess: () => { toast.success("Rad etildi"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="To'lovlar boshqaruvi" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">Hammasi</TabsTrigger>
            <TabsTrigger value="pending">Kutilmoqda</TabsTrigger>
            <TabsTrigger value="approved">Tasdiqlangan</TabsTrigger>
            <TabsTrigger value="rejected">Rad etilgan</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Chek / Izoh</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-32">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Yuklanmoqda...</TableCell></TableRow>}
                {!isLoading && list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">To'lovlar yo'q</TableCell></TableRow>}
                {list.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.profile?.full_name ?? p.payer_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{p.profile?.phone ?? p.payer_phone ?? "—"}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.plans?.title ?? "—"}</TableCell>
                    <TableCell className="font-display font-semibold">{fmt(Number(p.amount))}</TableCell>
                    <TableCell>
                      <ReceiptCell receiptUrl={p.receipt_url} note={p.note} />
                    </TableCell>
                    <TableCell className="text-sm">{new Date(p.created_at).toLocaleDateString("uz-UZ")}</TableCell>
                    <TableCell>
                      {p.status === "approved" && <Badge className="bg-success text-success-foreground">Tasdiqlangan</Badge>}
                      {p.status === "pending" && <Badge className="bg-warning text-warning-foreground">Kutilmoqda</Badge>}
                      {p.status === "rejected" && <Badge variant="destructive">Rad etilgan</Badge>}
                    </TableCell>
                    <TableCell>
                      {p.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="text-success" onClick={() => approve.mutate(p)} disabled={approve.isPending}><CheckCircle2 className="h-4 w-4" /></Button>
                          <RejectDialog
                            onConfirm={(reason) => reject.mutate({ p, reason })}
                            pending={reject.isPending}
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
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
        <Button size="icon" variant="ghost" className="text-destructive" disabled={pending}>
          <X className="h-4 w-4" />
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
          <p className="text-xs text-muted-foreground">
            Bu sabab o'quvchiga ko'rsatiladi.
          </p>
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
        <div
          className="max-w-[220px] truncate text-xs text-muted-foreground"
          title={note}
        >
          💬 {note}
        </div>
      )}
    </div>
  );
}
