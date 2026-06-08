import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/courses/new")({
  component: NewCourse,
});

function NewCourse() {
  const navigate = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Kurs yaratildi!"); navigate({ to: "/admin/courses" }); };

  return (
    <>
      <Topbar title="Yangi kurs" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Link to="/admin/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /> Kurslarga qaytish</Link>

        <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader><CardTitle className="font-display">Kurs ma'lumotlari</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Kurs nomi *</Label><Input placeholder="Masalan: Python asoslari" required /></div>
              <div className="space-y-2"><Label>Tavsif *</Label><Textarea rows={4} placeholder="Kurs haqida batafsil ma'lumot..." required /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kategoriya</Label>
                  <Select defaultValue="dasturlash">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dasturlash">Dasturlash</SelectItem>
                      <SelectItem value="dizayn">Dizayn</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="biznes">Biznes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Davomiyligi</Label><Input placeholder="masalan: 18 soat" /></div>
              </div>

              <div className="space-y-2">
                <Label>O'qish rejimi *</Label>
                <RadioGroup defaultValue="strict" className="grid gap-3 sm:grid-cols-2">
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
              <CardHeader><CardTitle className="font-display">Muqova rasmi</CardTitle></CardHeader>
              <CardContent>
                <div className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center text-muted-foreground transition-colors hover:bg-muted/50">
                  <Upload className="h-8 w-8" />
                  <div className="text-sm">Rasm yuklash</div>
                  <div className="text-xs">1280×720, JPG/PNG</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Button type="submit" className="w-full" size="lg">Kursni yaratish</Button>
                <Button type="button" variant="outline" className="mt-2 w-full">Qoralama saqlash</Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </>
  );
}