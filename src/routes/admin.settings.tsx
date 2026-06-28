import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, CreditCard, Phone, Send, Instagram, Mail, Globe, Youtube, Facebook, MessageCircle, Settings as Cog, Building2 } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const CHANNEL_TYPES = [
  { value: "telegram", label: "Telegram", icon: Send, prefix: "https://t.me/" },
  { value: "phone", label: "Telefon", icon: Phone, prefix: "tel:" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, prefix: "https://wa.me/" },
  { value: "instagram", label: "Instagram", icon: Instagram, prefix: "https://instagram.com/" },
  { value: "email", label: "Email", icon: Mail, prefix: "mailto:" },
  { value: "website", label: "Veb-sayt", icon: Globe, prefix: "https://" },
  { value: "youtube", label: "YouTube", icon: Youtube, prefix: "https://youtube.com/" },
  { value: "facebook", label: "Facebook", icon: Facebook, prefix: "https://facebook.com/" },
] as const;

function channelMeta(type: string) {
  return CHANNEL_TYPES.find((c) => c.value === type) ?? CHANNEL_TYPES[0];
}

function AdminSettings() {
  return (
    <>
      <Topbar title="Sozlamalar" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Platforma sozlamalari</h2>
          <p className="text-sm text-muted-foreground">Aloqa kanallari, to'lov kartalari va tizim parametrlari</p>
        </div>
        <Tabs defaultValue="platform" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="platform"><Cog className="mr-1.5 h-4 w-4" />Platforma</TabsTrigger>
            <TabsTrigger value="cards"><CreditCard className="mr-1.5 h-4 w-4" />Kartalar</TabsTrigger>
            <TabsTrigger value="channels"><Send className="mr-1.5 h-4 w-4" />Aloqa</TabsTrigger>
            <TabsTrigger value="system"><Building2 className="mr-1.5 h-4 w-4" />Tizim</TabsTrigger>
          </TabsList>
          <TabsContent value="platform"><PlatformTab /></TabsContent>
          <TabsContent value="cards"><CardsTab /></TabsContent>
          <TabsContent value="channels"><ChannelsTab /></TabsContent>
          <TabsContent value="system"><SystemTab /></TabsContent>
        </Tabs>
      </main>
    </>
  );
}

function useSetting<T = any>(key: string) {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: async () => {
      const { data } = await supabase.from("platform_settings" as any).select("value").eq("key", key).maybeSingle();
      return ((data as any)?.value ?? {}) as T;
    },
  });
}

function useSaveSetting(key: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (value: any) => {
      const { error } = await supabase.from("platform_settings" as any).upsert({ key, value, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saqlandi");
      qc.invalidateQueries({ queryKey: ["settings", key] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

function PlatformTab() {
  const { data, isLoading } = useSetting<any>("platform");
  const save = useSaveSetting("platform");
  const [form, setForm] = useState<any>({ name: "", tagline: "" });
  useEffect(() => { if (data) setForm({ name: data.name ?? "", tagline: data.tagline ?? "" }); }, [data]);
  if (isLoading) return <Card><CardContent className="p-6 text-muted-foreground">Yuklanmoqda...</CardContent></Card>;
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Asosiy ma'lumotlar</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
          <div className="space-y-2"><Label>Platforma nomi</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="OnlineTalim" /></div>
          <div className="space-y-2"><Label>Shior / Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Online ta'lim platformasi" /></div>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SystemTab() {
  const { data, isLoading } = useSetting<any>("system");
  const save = useSaveSetting("system");
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (data) setForm(data); }, [data]);
  if (isLoading) return <Card><CardContent className="p-6 text-muted-foreground">Yuklanmoqda...</CardContent></Card>;
  const items: { key: string; label: string; desc: string }[] = [
    { key: "allow_registration", label: "Yangi ro'yxatdan o'tishlarga ruxsat", desc: "Yangi o'quvchilar ro'yxatdan o'tishi mumkinmi" },
    { key: "sms_verification", label: "SMS tasdiqlash", desc: "Ro'yxatdan o'tishda SMS kod yuborish" },
    { key: "block_video_download", label: "Video yuklab olishni bloklash", desc: "O'quvchilar videolarni yuklab olmasin" },
    { key: "auto_expire_subscriptions", label: "Avtomatik obuna tugashi", desc: "Muddati tugagan obuna bloklansin" },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="font-display">Tizim parametrlari</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.key} className="flex items-center justify-between rounded-lg border p-4">
            <div><div className="font-medium">{it.label}</div><div className="text-sm text-muted-foreground">{it.desc}</div></div>
            <Switch checked={!!form[it.key]} onCheckedChange={(v) => setForm({ ...form, [it.key]: v })} />
          </div>
        ))}
        <Button onClick={() => save.mutate(form)} disabled={save.isPending}>{save.isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
      </CardContent>
    </Card>
  );
}

// ===== Cards CRUD =====
function CardsTab() {
  const qc = useQueryClient();
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["payment_cards"],
    queryFn: async () => {
      const { data } = await supabase.from("payment_cards" as any).select("*").order("sort_order").order("created_at");
      return (data ?? []) as any[];
    },
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const toggleActive = useMutation({
    mutationFn: async (c: any) => {
      const { error } = await supabase.from("payment_cards" as any).update({ is_active: !c.is_active }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment_cards"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_cards" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ["payment_cards"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle className="font-display">To'lov kartalari</CardTitle><p className="mt-1 text-xs text-muted-foreground">O'quvchilar qaysi kartalarga to'lov qilishi mumkinligini boshqaring</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Qo'shish</Button></DialogTrigger>
          <CardDialog card={editing} onClose={() => { setOpen(false); setEditing(null); }} onSaved={() => { setOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ["payment_cards"] }); }} />
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <div className="text-muted-foreground">Yuklanmoqda...</div>}
        {!isLoading && cards.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Hozircha karta yo'q</div>}
        {cards.map((c: any) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary"><CreditCard className="h-6 w-6" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><span className="font-medium">{c.label}</span>{!c.is_active && <Badge variant="outline" className="text-[10px]">Yashirin</Badge>}</div>
              <div className="font-mono text-sm tracking-wider">{c.card_number}</div>
              <div className="text-xs text-muted-foreground">{c.holder_name}{c.bank ? ` • ${c.bank}` : ""}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" title={c.is_active ? "Yashirish" : "Ko'rsatish"} onClick={() => toggleActive.mutate(c)}>
                {c.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => confirm(`"${c.label}" kartasini o'chirilsinmi?`) && remove.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CardDialog({ card, onClose, onSaved }: { card: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({ label: "", card_number: "", holder_name: "", bank: "", is_active: true, sort_order: 0 });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (card) setForm({ ...card, bank: card.bank ?? "" });
    else setForm({ label: "", card_number: "", holder_name: "", bank: "", is_active: true, sort_order: 0 });
  }, [card]);
  const submit = async () => {
    if (!form.label.trim() || !form.card_number.trim() || !form.holder_name.trim()) {
      toast.error("Majburiy maydonlarni to'ldiring"); return;
    }
    setBusy(true);
    const payload = { label: form.label.trim(), card_number: form.card_number.trim(), holder_name: form.holder_name.trim(), bank: form.bank?.trim() || null, is_active: !!form.is_active, sort_order: Number(form.sort_order) || 0 };
    const { error } = card
      ? await supabase.from("payment_cards" as any).update(payload).eq("id", card.id)
      : await supabase.from("payment_cards" as any).insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(card ? "Yangilandi" : "Qo'shildi");
    onSaved();
  };
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{card ? "Kartani tahrirlash" : "Yangi karta"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5"><Label>Karta nomi *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Asosiy karta" /></div>
        <div className="space-y-1.5"><Label>Karta raqami *</Label><Input value={form.card_number} onChange={(e) => setForm({ ...form, card_number: e.target.value })} placeholder="8600 1234 5678 9012" /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Egasi *</Label><Input value={form.holder_name} onChange={(e) => setForm({ ...form, holder_name: e.target.value })} placeholder="Familiya I.O." /></div>
          <div className="space-y-1.5"><Label>Bank / Turi</Label><Input value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} placeholder="Humo / Uzcard" /></div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Tartib</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><Label>Faol</Label><Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /></div>
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Bekor</Button><Button onClick={submit} disabled={busy}>{busy ? "Saqlanmoqda..." : "Saqlash"}</Button></DialogFooter>
    </DialogContent>
  );
}

// ===== Channels CRUD =====
function ChannelsTab() {
  const qc = useQueryClient();
  const { data: list = [], isLoading } = useQuery({
    queryKey: ["contact_channels"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_channels" as any).select("*").order("sort_order").order("created_at");
      return (data ?? []) as any[];
    },
  });
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const toggleActive = useMutation({
    mutationFn: async (c: any) => {
      const { error } = await supabase.from("contact_channels" as any).update({ is_active: !c.is_active }).eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact_channels"] }),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_channels" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ["contact_channels"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div><CardTitle className="font-display">Aloqa kanallari</CardTitle><p className="mt-1 text-xs text-muted-foreground">Telegram, telefon, ijtimoiy tarmoqlar — bir nechta qo'shish mumkin</p></div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Qo'shish</Button></DialogTrigger>
          <ChannelDialog channel={editing} onClose={() => { setOpen(false); setEditing(null); }} onSaved={() => { setOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ["contact_channels"] }); }} />
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <div className="text-muted-foreground">Yuklanmoqda...</div>}
        {!isLoading && list.length === 0 && <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Hozircha aloqa kanali yo'q</div>}
        {list.map((c: any) => {
          const meta = channelMeta(c.type);
          const Icon = meta.icon;
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">{c.label}</span><Badge variant="secondary" className="text-[10px]">{meta.label}</Badge>{!c.is_active && <Badge variant="outline" className="text-[10px]">Yashirin</Badge>}</div>
                <div className="truncate text-sm">{c.value}</div>
                {c.url && <div className="truncate text-xs text-muted-foreground">{c.url}</div>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => toggleActive.mutate(c)}>{c.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Button>
                <Button size="icon" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => confirm(`"${c.label}" o'chirilsinmi?`) && remove.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ChannelDialog({ channel, onClose, onSaved }: { channel: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({ type: "telegram", label: "", value: "", url: "", is_active: true, sort_order: 0 });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (channel) setForm({ ...channel, url: channel.url ?? "" });
    else setForm({ type: "telegram", label: "", value: "", url: "", is_active: true, sort_order: 0 });
  }, [channel]);

  const submit = async () => {
    if (!form.label.trim() || !form.value.trim()) { toast.error("Nom va qiymat majburiy"); return; }
    setBusy(true);
    const meta = channelMeta(form.type);
    let url = form.url?.trim();
    if (!url) {
      const v = form.value.trim().replace(/^@/, "");
      if (form.type === "phone") url = `tel:${v.replace(/\s+/g, "")}`;
      else if (form.type === "whatsapp") url = `${meta.prefix}${v.replace(/\D+/g, "")}`;
      else if (form.type === "email") url = `mailto:${v}`;
      else if (form.type === "website") url = v.startsWith("http") ? v : `https://${v}`;
      else url = `${meta.prefix}${v}`;
    }
    const payload = { type: form.type, label: form.label.trim(), value: form.value.trim(), url, is_active: !!form.is_active, sort_order: Number(form.sort_order) || 0 };
    const { error } = channel
      ? await supabase.from("contact_channels" as any).update(payload).eq("id", channel.id)
      : await supabase.from("contact_channels" as any).insert(payload);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(channel ? "Yangilandi" : "Qo'shildi");
    onSaved();
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{channel ? "Aloqa kanalini tahrirlash" : "Yangi aloqa kanali"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div className="space-y-1.5"><Label>Turi</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CHANNEL_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Nomi *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Asosiy operator" /></div>
        <div className="space-y-1.5"><Label>Qiymat *</Label><Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="@username yoki +998..." /></div>
        <div className="space-y-1.5"><Label>URL (ixtiyoriy — bo'sh qoldirsangiz avtomatik yaratiladi)</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://t.me/username" /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Tartib</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
          <div className="flex items-center justify-between rounded-lg border p-3"><Label>Faol</Label><Switch checked={!!form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} /></div>
        </div>
      </div>
      <DialogFooter><Button variant="outline" onClick={onClose}>Bekor</Button><Button onClick={submit} disabled={busy}>{busy ? "Saqlanmoqda..." : "Saqlash"}</Button></DialogFooter>
    </DialogContent>
  );
}