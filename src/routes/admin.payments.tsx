import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, X } from "lucide-react";
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
                  <TableHead>Tarif</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-32">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Yuklanmoqda...</TableCell></TableRow>}
                {!isLoading && list.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">To'lovlar yo'q</TableCell></TableRow>}
                {list.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.profile?.full_name ?? p.payer_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{p.profile?.phone ?? p.payer_phone ?? "—"}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.plans?.title ?? "—"}</TableCell>
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
                          <Button size="icon" variant="ghost" className="text-success" onClick={() => approve.mutate(p)} disabled={approve.isPending}><CheckCircle2 className="h-4 w-4" /></Button>
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
