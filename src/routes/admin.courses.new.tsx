import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [mode, setMode] = useState<"strict" | "free">("strict");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .insert({ title, description, category, mode, price: Number(price) || 0, published: false })
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
                <div className="space-y-2"><Label>Narx (so'm)</Label><Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
              </div>

              <div className="space-y-2">
                <Label>O'qish rejimi *</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as "strict" | "free")} className="grid gap-3 sm:grid-cols-2">
                  <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="strict" className="mt-1" />
                    <div>
                      <div className="font-medium">Qat'iy rejim</div>
                      <div className="mt-1 text-xs text-muted-foreground">Darslar ketma-ket, test 80%+ majburiy</div>
                    </div>
                  </Label>
                  <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <RadioGroupItem value="free" className="mt-1" />
                    <div>
                      <div className="font-medium">Erkin rejim</div>
                      <div className="mt-1 text-xs text-muted-foreground">Barcha darslar ochiq, test ixtiyoriy</div>
                    </div>
                  </Label>
                </RadioGroup>
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