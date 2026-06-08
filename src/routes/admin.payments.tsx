import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, X, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button as Btn } from "@/components/ui/button";
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
        .select("*, courses(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const userIds = Array.from(new Set((pays ?? []).map((p) => p.user_id)));
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
      const pmap = new Map((profs ?? []).map((p: any) => [p.id, p]));
      return (pays ?? []).map((p: any) => ({ ...p, profile: pmap.get(p.user_id) }));
    },
  });

  const list = filter === "all" ? payments : payments.filter((p: any) => p.status === filter);

  const approve = useMutation({
    mutationFn: async ({ p, mentorId }: { p: any; mentorId?: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: e1 } = await supabase.from("payments").update({ status: "approved", reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", p.id);
      if (e1) throw e1;
      const expires = new Date(); expires.setMonth(expires.getMonth() + 1);
      const { error: e2 } = await supabase.from("subscriptions").upsert(
        { user_id: p.user_id, course_id: p.course_id, payment_id: p.id, active: true, expires_at: expires.toISOString(), tariff: p.tariff ?? "self", mentor_id: p.tariff === "mentor" ? (mentorId ?? null) : null },
        { onConflict: "user_id,course_id" },
      );
      if (e2) throw e2;
    },
    onSuccess: () => { toast.success("Tasdiqlandi va obuna faollashtirildi"); qc.invalidateQueries({ queryKey: ["admin", "payments"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const reject = useMutation({
    mutationFn: async (p: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("payments").update({ status: "rejected", reviewed_by: user?.id, reviewed_at: new Date().toISOString() }).eq("id", p.id);
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
                  <TableHead>Kurs</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Summa</TableHead>
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
                    <TableCell className="text-sm">{p.courses?.title ?? "—"}</TableCell>
                    <TableCell>
                      {p.tariff === "mentor"
                        ? <Badge className="bg-primary text-primary-foreground">Mentor</Badge>
                        : <Badge variant="outline">Erkin</Badge>}
                    </TableCell>
                    <TableCell className="font-display font-semibold">{fmt(Number(p.amount))}</TableCell>
                    <TableCell className="text-sm">{new Date(p.created_at).toLocaleDateString("uz-UZ")}</TableCell>
                    <TableCell>
                      {p.status === "approved" && <Badge className="bg-success text-success-foreground">Tasdiqlangan</Badge>}
                      {p.status === "pending" && <Badge className="bg-warning text-warning-foreground">Kutilmoqda</Badge>}
                      {p.status === "rejected" && <Badge variant="destructive">Rad etilgan</Badge>}
                    </TableCell>
                    <TableCell>
                      {p.status === "pending" && (
                        <div className="flex gap-1">
                          {p.tariff === "mentor"
                            ? <ApproveWithMentorButton p={p} onApprove={(mentorId) => approve.mutate({ p, mentorId })} pending={approve.isPending} />
                            : <Button size="icon" variant="ghost" className="text-success" onClick={() => approve.mutate({ p })} disabled={approve.isPending}><CheckCircle2 className="h-4 w-4" /></Button>}
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => reject.mutate(p)} disabled={reject.isPending}><X className="h-4 w-4" /></Button>
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

function ApproveWithMentorButton({ p, onApprove, pending }: { p: any; onApprove: (mentorId: string) => void; pending: boolean }) {
  const [open, setOpen] = useState(false);
  const [mentorId, setMentorId] = useState<string>("");
  const { data: mentors = [] } = useQuery({
    queryKey: ["admin", "mentor-list"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "mentor" as any);
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) return [];
      const { data } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      return data ?? [];
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Btn size="icon" variant="ghost" className="text-success" title="Mentor biriktirib tasdiqlash"><UserCheck className="h-4 w-4" /></Btn>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Mentor biriktirish</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">{p.profile?.full_name ?? "O'quvchi"} — {p.courses?.title}. Tarif: <strong>Mentor yordami bilan</strong>.</p>
        <Select value={mentorId} onValueChange={setMentorId}>
          <SelectTrigger><SelectValue placeholder="Mentor tanlang" /></SelectTrigger>
          <SelectContent>
            {mentors.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Hozircha mentor yo'q. Avval Mentorlar bo'limidan qo'shing.</div>}
            {mentors.map((m: any) => (
              <SelectItem key={m.id} value={m.id}>{m.full_name || m.phone || m.id.slice(0, 8)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Btn onClick={() => { onApprove(mentorId); setOpen(false); }} disabled={!mentorId || pending}><CheckCircle2 className="mr-1 h-4 w-4" /> Tasdiqlash</Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}