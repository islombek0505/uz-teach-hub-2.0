import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Megaphone, Send, Users, User as UserIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

function AdminNotifications() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"all" | "one">("all");
  const [userId, setUserId] = useState<string>("");
  const [link, setLink] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("notifications").select("*").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      const userIds = Array.from(new Set((data ?? []).map((n: any) => n.user_id).filter(Boolean))) as string[];
      const { data: profs } = userIds.length
        ? await supabase.from("profiles").select("id, full_name").in("id", userIds)
        : { data: [] as any[] };
      const map = new Map((profs ?? []).map((p: any) => [p.id, p.full_name]));
      return (data ?? []).map((n: any) => ({ ...n, recipient: n.user_id ? (map.get(n.user_id) || "—") : null }));
    },
  });

  const { data: students = [] } = useQuery({
    queryKey: ["admin", "all-students-min"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) return [];
      const { data } = await supabase.from("profiles").select("id, full_name, phone").in("id", ids);
      return data ?? [];
    },
  });

  const send = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Sarlavhani kiriting");
      const { data: { user } } = await supabase.auth.getUser();
      const payload: any = {
        title: title.trim(),
        body: body.trim() || null,
        type: audience === "all" ? "announcement" : "info",
        link: link.trim() || null,
        created_by: user?.id ?? null,
        user_id: audience === "all" ? null : userId,
      };
      if (audience === "one" && !userId) throw new Error("Foydalanuvchini tanlang");
      const { error } = await (supabase.from as any)("notifications").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Bildirishnoma yuborildi");
      setTitle(""); setBody(""); setLink(""); setUserId("");
      qc.invalidateQueries({ queryKey: ["admin", "notifications"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ["admin", "notifications"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="Bildirishnomalar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2"><Send className="h-4 w-4" /> Yangi bildirishnoma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kimga</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all"><div className="flex items-center gap-2"><Users className="h-4 w-4" /> Hamma o'quvchilarga (e'lon)</div></SelectItem>
                    <SelectItem value="one"><div className="flex items-center gap-2"><UserIcon className="h-4 w-4" /> Bitta o'quvchiga</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {audience === "one" && (
                <div className="space-y-2">
                  <Label>O'quvchi</Label>
                  <Select value={userId} onValueChange={setUserId}>
                    <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                    <SelectContent>
                      {students.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>{s.full_name || s.phone || s.id.slice(0, 8)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Sarlavha</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Yangi kurs ochildi!" maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Matn</Label>
                <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Batafsil ma'lumot..." maxLength={2000} />
              </div>
              <div className="space-y-2">
                <Label>Havola (ixtiyoriy)</Label>
                <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/app/courses" />
              </div>
              <Button onClick={() => send.mutate()} disabled={send.isPending} className="w-full">
                <Send className="mr-2 h-4 w-4" /> {send.isPending ? "Yuborilmoqda..." : "Yuborish"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2"><Megaphone className="h-4 w-4" /> Tarix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading && <div className="text-sm text-muted-foreground">Yuklanmoqda...</div>}
              {!isLoading && items.length === 0 && <div className="text-sm text-muted-foreground">Hozircha bildirishnomalar yo'q</div>}
              {items.map((n: any) => (
                <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium">{n.title}</div>
                      <Badge variant="outline" className="text-[10px]">{n.type}</Badge>
                      {n.user_id === null
                        ? <Badge className="text-[10px]"><Users className="mr-1 h-3 w-3" /> Hammaga</Badge>
                        : <Badge variant="secondary" className="text-[10px]"><UserIcon className="mr-1 h-3 w-3" /> {n.recipient}</Badge>}
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("uz-UZ", { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm("O'chirilsinmi?")) del.mutate(n.id); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}