import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Crown, Clock } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn, addMonths, planDurationLabel } from "@/lib/utils";

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
        duration_days: Number(p.duration_days || (p.duration_months ? p.duration_months * 30 : 30)),
        duration_months: p.duration_months != null ? Number(p.duration_months) : null,
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
    onSuccess: () => {
      toast.success("Saqlandi");
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'chirildi");
      qc.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeCount = plans.filter((p: any) => p.is_active).length;

  return (
    <>
      <Topbar title="Tariflar" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="admin-icon-chip h-11 w-11">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">Tarif rejalari</h2>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Yuklanmoqda..." : `Jami ${plans.length} ta · ${activeCount} faol`}
              </p>
            </div>
          </div>
          <PlanDialog onSave={(p) => save.mutate(p)} />
        </div>

        {/* Plans grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Card className="rounded-2xl border-transparent">
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Hozircha tarif rejalari yo'q</div>
              <PlanDialog onSave={(p) => save.mutate(p)} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p: any) => (
              <Card
                key={p.id}
                className={cn(
                  "admin-card-hover flex flex-col rounded-2xl border-transparent",
                  !p.is_active && "opacity-70",
                )}
              >
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="admin-icon-chip h-11 w-11 shrink-0">
                        <Crown className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-display text-base font-semibold">
                          {p.title}
                        </div>
                        <Badge variant="secondary" className="mt-1 text-[10px] uppercase">
                          {p.code}
                        </Badge>
                      </div>
                    </div>
                    {p.is_active ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Faol
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" /> Faolsiz
                      </span>
                    )}
                  </div>

                  <div className="mt-5">
                    <div className="font-display text-2xl font-bold tracking-tight">
                      {fmt(Number(p.price))}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {planDurationLabel(p)}
                    </div>
                  </div>

                  {p.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 pt-5">
                    <PlanDialog
                      plan={p}
                      onSave={(payload) => save.mutate({ ...payload, id: p.id })}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Tahrirlash
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (confirm("O'chirilsinmi?")) del.mutate(p.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

// Standard subscription lengths. `months` drives the calendar-accurate expiry;
// the title/code/description are editable suggestions generated from it.
const DURATIONS = [
  { months: 1, label: "1 oy" },
  { months: 3, label: "3 oy" },
  { months: 6, label: "6 oy" },
  { months: 12, label: "1 yil" },
];

function presetFor(months: number) {
  const period = months % 12 === 0 ? `${months / 12} yil` : `${months} oy`;
  return {
    code: `${months}m`,
    title: `${period}lik obuna`,
    description: `${period} davomida barcha kurslar va video darslarga to'liq ruxsat.`,
  };
}

// A field is "auto" (safe to refill when the duration changes) when it is empty
// or still equals a generated preset — anything hand-typed is left untouched.
function isAutoValue(kind: "code" | "title" | "description", value: string) {
  if (!value) return true;
  for (let m = 1; m <= 36; m++) if (presetFor(m)[kind] === value) return true;
  return false;
}

function newPlanForm() {
  return {
    ...presetFor(3),
    duration_months: 3,
    duration_days: 90,
    price: 0,
    is_active: true,
    sort_order: 2,
  };
}

function PlanDialog({
  plan,
  onSave,
  trigger,
}: {
  plan?: any;
  onSave: (p: any) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [form, setForm] = useState<any>(newPlanForm);

  useEffect(() => {
    if (!open) return;
    if (plan) {
      // Editing: prefer stored months, else derive from the legacy day count.
      const months =
        plan.duration_months ?? Math.max(1, Math.round((plan.duration_days ?? 30) / 30));
      setForm({ ...plan, duration_months: months });
      setCustomMode(!DURATIONS.some((d) => d.months === months));
    } else {
      setForm(newPlanForm());
      setCustomMode(false);
    }
  }, [plan, open]);

  // Set the length and refill any auto (untouched) name/code/description.
  function applyMonths(months: number) {
    setForm((f: any) => {
      const p = presetFor(months);
      return {
        ...f,
        duration_months: months,
        duration_days: months * 30,
        title: isAutoValue("title", f.title ?? "") ? p.title : f.title,
        code: isAutoValue("code", f.code ?? "") ? p.code : f.code,
        description: isAutoValue("description", f.description ?? "") ? p.description : f.description,
      };
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yangi tarif
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">
            {plan ? "Tarifni tahrirlash" : "Yangi tarif"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Nom</Label>
              <Input
                value={form.title ?? ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Kod</Label>
              <Input
                value={form.code ?? ""}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="3m / 6m / 12m"
              />
            </div>
          </div>
          <div>
            <Label>Tavsif</Label>
            <Textarea
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Muddat</Label>
              <Select
                value={
                  !customMode && DURATIONS.some((d) => d.months === form.duration_months)
                    ? String(form.duration_months)
                    : "custom"
                }
                onValueChange={(v) => {
                  if (v === "custom") {
                    setCustomMode(true);
                  } else {
                    setCustomMode(false);
                    applyMonths(Number(v));
                  }
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Muddatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d.months} value={String(d.months)}>
                      {d.label}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Boshqa (oy)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Narx (so'm)</Label>
              <Input
                type="number"
                value={form.price ?? 0}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
          </div>

          {customMode && (
            <div>
              <Label>Oylar soni</Label>
              <Input
                type="number"
                min={1}
                value={form.duration_months ?? 1}
                onChange={(e) => applyMonths(Math.max(1, Number(e.target.value)))}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tartib</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Bugun olinsa</Label>
              <div className="mt-1 flex h-9 items-center rounded-md border bg-muted/40 px-3 text-xs text-muted-foreground">
                {form.duration_months > 0
                  ? `${addMonths(new Date(), Number(form.duration_months)).toLocaleDateString("uz-UZ")} gacha`
                  : "—"}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="text-sm font-medium">Faol</div>
            <Switch
              checked={!!form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSave(form);
              setOpen(false);
            }}
          >
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
