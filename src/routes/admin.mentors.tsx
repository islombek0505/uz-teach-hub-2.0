import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Instagram, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/mentors")({ component: AdminMentors });

function AdminMentors() {
  const qc = useQueryClient();

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["admin", "mentors"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "mentor" as any);
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) return [];
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone, telegram_url, instagram_url").in("id", ids);
      return profs ?? [];
    },
  });

  const removeMentor = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "mentor" as any);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Mentor rolidan olib tashlandi"); qc.invalidateQueries({ queryKey: ["admin", "mentors"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="Mentorlar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Mentor jamoasi</h2>
            <p className="text-sm text-muted-foreground">{isLoading ? "Yuklanmoqda..." : `${mentors.length} ta mentor`}</p>
          </div>
          <AddMentorDialog onAdded={() => qc.invalidateQueries({ queryKey: ["admin", "mentors"] })} />
        </div>

        {mentors.length === 0 && !isLoading && (
          <Card><CardContent className="p-10 text-center text-muted-foreground">Hozircha mentorlar yo'q. Mavjud o'quvchiga mentor roli berish uchun telefon raqami orqali qo'shing.</CardContent></Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m: any) => (
            <Card key={m.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary text-primary-foreground">{(m.full_name || "M").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="font-display font-semibold">{m.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{m.phone || "—"}</div>
                  </div>
                  <Badge>Mentor</Badge>
                </div>
                <MentorContactsEditor mentor={m} onSaved={() => qc.invalidateQueries({ queryKey: ["admin", "mentors"] })} />
                <Button variant="ghost" size="sm" className="text-destructive w-full" onClick={() => confirm(`${m.full_name || "Mentor"} mentor rolidan olib tashlansinmi?`) && removeMentor.mutate(m.id)}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Mentor rolini olib tashlash
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

function MentorContactsEditor({ mentor, onSaved }: { mentor: any; onSaved: () => void }) {
  const [telegram, setTelegram] = useState(mentor.telegram_url || "");
  const [instagram, setInstagram] = useState(mentor.instagram_url || "");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ telegram_url: telegram || null, instagram_url: instagram || null }).eq("id", mentor.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi"); onSaved();
  };
  return (
    <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1">
        <Label className="text-xs flex items-center gap-1"><Send className="h-3 w-3" /> Telegram URL</Label>
        <Input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="https://t.me/username" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram URL</Label>
        <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/username" />
      </div>
      <Button size="sm" onClick={save} disabled={busy} className="w-full">{busy ? "Saqlanmoqda..." : "Saqlash"}</Button>
    </div>
  );
}

function AddMentorDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    const digits = phone.replace(/\D+/g, "");
    if (!digits) return toast.error("Telefon raqamini kiriting");
    setBusy(true);
    try {
      const { data: prof, error } = await supabase.from("profiles").select("id, full_name").eq("phone", digits).maybeSingle();
      if (error) throw error;
      if (!prof) { toast.error("Bu raqam bilan foydalanuvchi topilmadi"); return; }
      const { error: e2 } = await supabase.from("user_roles").insert({ user_id: prof.id, role: "mentor" as any });
      if (e2 && !String(e2.message).includes("duplicate")) throw e2;
      toast.success(`${prof.full_name || "Foydalanuvchi"} mentor sifatida qo'shildi`);
      setOpen(false); setPhone("");
      onAdded();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally { setBusy(false); }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Mentor qo'shish</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">Mentor qo'shish</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Foydalanuvchi ro'yxatdan o'tgan bo'lishi kerak. Uning telefon raqamini kiriting.</p>
        <div className="space-y-2"><Label>Telefon raqam</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="998901234567" /></div>
        <DialogFooter><Button onClick={submit} disabled={busy}>{busy ? "Qo'shilmoqda..." : "Qo'shish"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}