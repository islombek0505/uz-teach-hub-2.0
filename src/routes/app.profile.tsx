import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockUser } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const save = (e: React.FormEvent) => { e.preventDefault(); toast.success("Ma'lumotlar saqlandi"); };

  return (
    <>
      <Topbar title="Mening profilim" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-primary text-2xl font-display font-semibold text-primary-foreground">AY</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground">{mockUser.phone}</p>
              <p className="mt-1 text-xs text-muted-foreground">Ro'yxatdan o'tgan: {mockUser.joinedAt}</p>
            </div>
            <Button variant="outline">Rasm yuklash</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="font-display">Shaxsiy ma'lumotlar</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2"><Label>Ism Familiya</Label><Input defaultValue={mockUser.name} /></div>
                <div className="space-y-2"><Label>Telefon raqam</Label><Input defaultValue={mockUser.phone} disabled /></div>
                <div className="space-y-2"><Label>Email (ixtiyoriy)</Label><Input type="email" placeholder="email@example.com" /></div>
                <div className="space-y-2"><Label>Tug'ilgan sana</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Shahar</Label><Input placeholder="Toshkent" /></div>
                <Button type="submit">Saqlash</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-display">Parolni o'zgartirish</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2"><Label>Joriy parol</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>Yangi parol</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>Tasdiqlang</Label><Input type="password" /></div>
                <Button type="submit">Parolni yangilash</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}