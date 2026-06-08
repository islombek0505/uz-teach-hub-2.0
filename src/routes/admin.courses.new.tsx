import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/courses/new")({
  component: NewCourse,
});

function NewCourse() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("dasturlash");
  const [priceSelf, setPriceSelf] = useState("0");
  const [priceMentor, setPriceMentor] = useState("0");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        category,
        price: Number(priceSelf) || 0,
        price_self: Number(priceSelf) || 0,
        price_mentor: Number(priceMentor) || 0,
        published: false,
      })
      .select("id")
      .single();
    setLoading(false);
    if (error || !data) return toast.error(error?.message ?? "Xatolik");
    toast.success("Kurs yaratildi! Endi modul va darslar qo'shing.");
    navigate({ to: "/admin/courses/$courseId", params: { courseId: data.id } });
  };

  return (
    <>
      <Topbar title="Yangi kurs" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link to="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Kurslarga qaytish</Link>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader><CardTitle className="font-display">Kurs ma'lumotlari</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Kurs nomi *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Python asoslari" required /></div>
              <div className="space-y-2"><Label>Tavsif</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kurs haqida batafsil ma'lumot..." /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kategoriya</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dasturlash">Dasturlash</SelectItem>
                      <SelectItem value="dizayn">Dizayn</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="biznes">Biznes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Erkin o'rganish narxi (so'm)</Label><Input type="number" min="0" value={priceSelf} onChange={(e) => setPriceSelf(e.target.value)} /></div>
                <div className="space-y-2"><Label>Mentor yordami narxi (so'm)</Label><Input type="number" min="0" value={priceMentor} onChange={(e) => setPriceMentor(e.target.value)} /></div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Yaratilmoqda..." : "Kursni yaratish"}</Button>
                <p className="mt-3 text-xs text-muted-foreground">Yaratilgandan so'ng modul va darslar qo'shasiz.</p>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </>
  );
}