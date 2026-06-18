import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/plans")({
  component: AdminPlans,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function AdminPlans() {
  const qc = useQueryClient();
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plans").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (p: any) => {
      const payload = {
        code: p.code,
        title: p.title,
        description: p.description || null,
        duration_days: Number(p.duration_days),
        price: Number(p.price),
        is_active: !!p.is_active,
        sort_order: Number(p.sort_order ?? 0),
      };
      if (p.id) {
        const { error } = await supabase.from("plans").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("plans").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saqlandi"); qc.invalidateQueries({ queryKey: ["admin", "plans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ["admin", "plans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="Tariflar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Tarif rejalari</h2>
            <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${plans.length} ta tarif`}</p>
          </div>
          <PlanDialog onSave={(p) => save.mutate(p)} />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Kod</TableHead>
                  <TableHead>Davomiyligi</TableHead>
                  <TableHead>Narx</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-32">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.code}</TableCell>
                    <TableCell className="text-sm">{p.duration_days} kun</TableCell>
                    <TableCell className="font-display font-semibold">{fmt(Number(p.price))}</TableCell>
                    <TableCell>{p.is_active ? <span className="text-success">Faol</span> : <span className="text-muted-foreground">Faolsiz</span>}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <PlanDialog plan={p} onSave={(payload) => save.mutate({ ...payload, id: p.id })} trigger={<Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>} />
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if (confirm("O'chirilsinmi?")) del.mutate(p.id); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
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

function PlanDialog({ plan, onSave, trigger }: { plan?: any; onSave: (p: any) => void; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ code: "", title: "", description: "", duration_days: 30, price: 0, is_active: true, sort_order: 0 });
  useEffect(() => { if (plan && open) setForm(plan); }, [plan, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button><Plus className="mr-2 h-4 w-4" /> Yangi tarif</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">{plan ? "Tarifni tahrirlash" : "Yangi tarif"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nom</Label><Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Kod</Label><Input value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="3m / 6m / 12m" /></div>
          </div>
          <div><Label>Tavsif</Label><Textarea rows={2} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Kunlar</Label><Input type="number" value={form.duration_days ?? 0} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} /></div>
            <div><Label>Narx (so'm)</Label><Input type="number" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
            <div><Label>Tartib</Label><Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="text-sm font-medium">Faol</div>
            <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => { onSave(form); setOpen(false); }}>Saqlash</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
