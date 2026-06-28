import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, ImageIcon, Newspaper } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/news")({
  component: AdminNews,
});

const categories = [
  { value: "announcement", label: "E'lon" },
  { value: "course", label: "Yangi kurs" },
  { value: "discount", label: "Chegirma" },
  { value: "event", label: "Tadbir" },
];

const catColor = (c: string) =>
  c === "discount" ? "bg-warning text-warning-foreground" :
  c === "course" ? "bg-primary text-primary-foreground" :
  c === "event" ? "bg-accent text-accent-foreground" :
  "bg-secondary text-secondary-foreground";

function AdminNews() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)("news").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const upload = async (file: File) => {
    const path = `news/${Date.now()}_${file.name.replace(/[^a-z0-9.\-_]/gi, "_")}`;
    const { error } = await supabase.storage.from("course-covers").upload(path, file, { upsert: true });
    if (error) throw error;
    return path;
  };

  const save = useMutation({
    mutationFn: async (form: any) => {
      let imagePath = form.image_url ?? null;
      if (form.file) imagePath = await upload(form.file);
      const { data: { user } } = await supabase.auth.getUser();
      const payload: any = {
        title: form.title.trim(),
        body: form.body?.trim() || null,
        category: form.category,
        link: form.link?.trim() || null,
        published: !!form.published,
        image_url: imagePath,
      };
      if (editing?.id) {
        const { error } = await (supabase.from as any)("news").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        payload.created_by = user?.id ?? null;
        const { error } = await (supabase.from as any)("news").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Saqlandi" : "Yangilik qo'shildi");
      setOpen(false); setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "news"] });
      qc.invalidateQueries({ queryKey: ["public", "news"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("O'chirildi"); qc.invalidateQueries({ queryKey: ["admin", "news"] }); qc.invalidateQueries({ queryKey: ["public", "news"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <Topbar title="Yangiliklar" initials="AD" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold flex items-center gap-2"><Newspaper className="h-5 w-5" /> Yangiliklar boshqaruvi</h2>
            <p className="text-sm text-muted-foreground">Kelajakdagi kurslar, chegirmalar va e'lonlar</p>
          </div>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> Yangilik qo'shish</Button>
            </DialogTrigger>
            <NewsForm key={editing?.id ?? "new"} initial={editing} onSubmit={(f) => save.mutate(f)} pending={save.isPending} />
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isLoading && <div className="text-sm text-muted-foreground">Yuklanmoqda...</div>}
          {!isLoading && items.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3"><CardContent className="p-10 text-center text-muted-foreground">Hozircha yangiliklar yo'q</CardContent></Card>
          )}
          {items.map((n: any) => (
            <NewsCard key={n.id} item={n} onEdit={() => { setEditing(n); setOpen(true); }} onDelete={() => { if (confirm("O'chirilsinmi?")) del.mutate(n.id); }} />
          ))}
        </div>
      </main>
    </>
  );
}

function NewsCard({ item, onEdit, onDelete }: { item: any; onEdit: () => void; onDelete: () => void }) {
  const [signed, setSigned] = useState<string | null>(null);
  useEffect(() => {
    if (item.image_url && !item.image_url.startsWith("http")) {
      supabase.storage.from("course-covers").createSignedUrl(item.image_url, 3600).then(({ data }) => setSigned(data?.signedUrl ?? null));
    } else if (item.image_url) setSigned(item.image_url);
  }, [item.image_url]);
  return (
    <Card className="overflow-hidden">
      {signed ? (
        <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${signed})` }} />
      ) : (
        <div className="aspect-[16/9] bg-muted grid place-items-center"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div>
      )}
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={catColor(item.category)}>{categories.find(c => c.value === item.category)?.label ?? item.category}</Badge>
          {!item.published && <Badge variant="outline">Yashirilgan</Badge>}
        </div>
        <h4 className="font-display font-semibold leading-snug">{item.title}</h4>
        {item.body && <p className="line-clamp-2 text-sm text-muted-foreground">{item.body}</p>}
        <div className="text-xs text-muted-foreground">{new Date(item.published_at).toLocaleDateString("uz-UZ")}</div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={onEdit}><Pencil className="mr-1 h-3.5 w-3.5" /> Tahrirlash</Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={onDelete}><Trash2 className="mr-1 h-3.5 w-3.5" /> O'chirish</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsForm({ initial, onSubmit, pending }: { initial: any | null; onSubmit: (f: any) => void; pending: boolean }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [category, setCategory] = useState(initial?.category ?? "announcement");
  const [link, setLink] = useState(initial?.link ?? "");
  const [published, setPublished] = useState(initial ? !!initial.published : true);
  const [file, setFile] = useState<File | null>(null);

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader><DialogTitle className="font-display">{initial ? "Yangilikni tahrirlash" : "Yangi yangilik"}</DialogTitle></DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2"><Label>Sarlavha</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} /></div>
        <div className="space-y-2"><Label>Toifa</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Matn</Label><Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} maxLength={3000} /></div>
        <div className="space-y-2"><Label>Rasm</Label><Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div>
        <div className="space-y-2"><Label>Havola (ixtiyoriy)</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="/app/courses" /></div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div><div className="font-medium text-sm">Chop etilsin</div><div className="text-xs text-muted-foreground">Faqat ko'rinadigan yangiliklar studentlarga ko'rsatiladi</div></div>
          <Switch checked={published} onCheckedChange={setPublished} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => { if (!title.trim()) { toast.error("Sarlavha kerak"); return; } onSubmit({ title, body, category, link, published, file, image_url: initial?.image_url }); }} disabled={pending}>
          {pending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}