import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success("Sozlamalar saqlandi"); };

  return (
    <>
      <Topbar title="Sozlamalar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="font-display">Platforma sozlamalari</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2"><Label>Platforma nomi</Label><Input defaultValue="LearnHub" /></div>
                <div className="space-y-2"><Label>Aloqa telefoni</Label><Input defaultValue="+998 90 123 45 67" /></div>
                <div className="space-y-2"><Label>Telegram username</Label><Input defaultValue="@learnhub_uz" /></div>
                <Button type="submit">Saqlash</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-display">To'lov sozlamalari</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2"><Label>Karta raqami</Label><Input defaultValue="8600 1234 5678 9012" /></div>
                <div className="space-y-2"><Label>Karta egasi</Label><Input defaultValue="Yusupov A.K." /></div>
                <div className="space-y-2"><Label>Oylik tarif narxi (so'm)</Label><Input type="number" defaultValue={299000} /></div>
                <Button type="submit">Saqlash</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="font-display">Tizim sozlamalari</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Yangi ro'yxatdan o'tishlarga ruxsat", desc: "Yangi o'quvchilar ro'yxatdan o'tishi mumkinmi", on: true },
                { label: "SMS tasdiqlash", desc: "Birinchi marta ro'yxatdan o'tishda SMS kod yuborish", on: true },
                { label: "Video yuklab olishni bloklash", desc: "O'quvchilar videolarni yuklab olmasin", on: true },
                { label: "Avtomatik obuna tugashi", desc: "Muddati tugagan obuna avtomatik bloklansin", on: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-lg border p-4">
                  <div><div className="font-medium">{s.label}</div><div className="text-sm text-muted-foreground">{s.desc}</div></div>
                  <Switch defaultChecked={s.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}