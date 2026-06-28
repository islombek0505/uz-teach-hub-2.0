import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Reply, Trash2, MessageSquare, Lightbulb, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedback,
});

const typeMeta = {
  suggestion: { icon: Lightbulb, label: "Taklif", color: "bg-warning/15 text-warning-foreground" },
  feedback: { icon: MessageSquare, label: "Fikr", color: "bg-primary/10 text-primary" },
  complaint: { icon: AlertCircle, label: "Shikoyat", color: "bg-destructive/10 text-destructive" },
  question: { icon: MessageSquare, label: "Savol", color: "bg-accent/40 text-accent-foreground" },
} as const;

function AdminFeedback() {
  const [items, setItems] = useState<any[]>([]);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const load = async () => {
    const { data: fb } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    const list = fb ?? [];
    const ids = Array.from(new Set(list.map((f) => f.user_id)));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      list.forEach((f: any) => { f.profile = map.get(f.user_id); });
    }
    setItems(list);
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("feedback").update({ read: true }).eq("id", id);
    load();
  };

  const sendReply = async (id: string) => {
    const { error } = await supabase.from("feedback").update({ admin_reply: replyText, read: true }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Javob yuborildi");
    setReplyId(null); setReplyText("");
    load();
  };

  const del = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("O'chirildi");
    load();
  };

  return (
    <>
      <Topbar title="Murojaatlar" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Jami</div><div className="mt-1 font-display text-2xl font-bold">{items.length}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">O'qilmagan</div><div className="mt-1 font-display text-2xl font-bold text-primary">{items.filter(f => !f.read).length}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Shikoyatlar</div><div className="mt-1 font-display text-2xl font-bold text-destructive">{items.filter(f => f.type === "complaint").length}</div></CardContent></Card>
        </div>

        <div className="space-y-3">
          {items.length === 0 && <div className="text-sm text-muted-foreground">Hozircha murojaatlar yo'q</div>}
          {items.map((f) => {
            const meta = typeMeta[f.type as keyof typeof typeMeta] ?? typeMeta.feedback;
            return (
              <Card key={f.id} className={!f.read ? "border-primary/40 bg-primary/5" : ""} onClick={() => !f.read && markRead(f.id)}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg ${meta.color}`}><meta.icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-display font-semibold">{f.profile?.full_name || "Foydalanuvchi"}</div>
                        {f.profile?.phone && <span className="text-xs text-muted-foreground">{f.profile.phone}</span>}
                        <Badge variant="outline">{meta.label}</Badge>
                        {!f.read && <Badge>Yangi</Badge>}
                        <span className="ml-auto text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-1 font-medium">{f.subject}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{f.message}</p>
                      {f.admin_reply && (
                        <div className="mt-3 rounded-md bg-primary/5 p-3 text-sm">
                          <div className="mb-1 text-xs font-semibold text-primary">Sizning javobingiz:</div>
                          {f.admin_reply}
                        </div>
                      )}
                      {replyId === f.id && (
                        <div className="mt-3 space-y-2">
                          <Textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Javob..." />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => sendReply(f.id)}>Yuborish</Button>
                            <Button size="sm" variant="ghost" onClick={() => { setReplyId(null); setReplyText(""); }}>Bekor</Button>
                          </div>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setReplyId(f.id); setReplyText(f.admin_reply || ""); }}><Reply className="mr-1 h-3.5 w-3.5" /> Javob berish</Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(f.id)}><Trash2 className="mr-1 h-3.5 w-3.5" /> O'chirish</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}