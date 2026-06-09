import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Send, Instagram, Shield, Phone, Mail, MapPin, Calendar, Briefcase } from "lucide-react";
import { AvatarUploader } from "@/components/avatar-uploader";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/profile")({ component: AdminProfile });

function AdminProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data ?? {}));
  }, [user?.id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name ?? "",
        email: profile.email || null,
        birth_date: profile.birth_date || null,
        city: profile.city || null,
        headline: profile.headline || null,
        bio: profile.bio || null,
        telegram_url: profile.telegram_url || null,
        instagram_url: profile.instagram_url || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Ma'lumotlar saqlandi");
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newPass = (form.elements.namedItem("newPass") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirmPass") as HTMLInputElement).value;
    if (newPass.length < 6) {
      toast.error("Parol kamida 6 ta belgi bo'lsin");
      return;
    }
    if (newPass !== confirm) {
      toast.error("Parollar mos emas");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Parol yangilandi");
    form.reset();
  };

  if (!profile)
    return (
      <>
        <Topbar title="Admin profili" />
        <main className="flex-1 p-6"><div className="text-muted-foreground">Yuklanmoqda...</div></main>
      </>
    );

  return (
    <>
      <Topbar title="Admin profili" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
            <AvatarUploader
              userId={user!.id}
              url={profile.avatar_url}
              name={profile.full_name}
              size={104}
              onChange={(u) => setProfile({ ...profile, avatar_url: u })}
            />
            <div className="flex-1">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h2 className="font-display text-2xl font-bold">{profile.full_name || "Administrator"}</h2>
                <Badge className="bg-primary text-primary-foreground"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>
              </div>
              {profile.headline && <p className="mt-1 text-sm text-muted-foreground">{profile.headline}</p>}
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {profile.phone && <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{profile.phone}</span>}
                {profile.email && <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{profile.email}</span>}
                {profile.city && <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{profile.city}</span>}
                {profile.birth_date && <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{profile.birth_date}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="font-display">Shaxsiy ma'lumotlar</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={save} className="space-y-4">
                <div className="space-y-2"><Label>Ism Familiya</Label><Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Telefon</Label><Input value={profile.phone || ""} disabled /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={profile.email || ""} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="admin@learnhub.uz" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Tug'ilgan sana</Label><Input type="date" value={profile.birth_date || ""} onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Shahar</Label><Input value={profile.city || ""} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="Toshkent" /></div>
                </div>
                <div className="space-y-2"><Label className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> Lavozim</Label><Input value={profile.headline || ""} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} placeholder="Bosh administrator" /></div>
                <div className="space-y-2"><Label>Qisqacha</Label><Textarea rows={3} value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="O'zingiz haqingizda" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-1"><Send className="h-3.5 w-3.5" /> Telegram URL</Label><Input value={profile.telegram_url || ""} onChange={(e) => setProfile({ ...profile, telegram_url: e.target.value })} placeholder="https://t.me/username" /></div>
                <div className="space-y-2"><Label className="flex items-center gap-1"><Instagram className="h-3.5 w-3.5" /> Instagram URL</Label><Input value={profile.instagram_url || ""} onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })} placeholder="https://instagram.com/username" /></div>
                <Button type="submit" disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-display">Parolni o'zgartirish</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={changePassword} className="space-y-4">
                <div className="space-y-2"><Label>Yangi parol</Label><Input name="newPass" type="password" required /></div>
                <div className="space-y-2"><Label>Tasdiqlang</Label><Input name="confirmPass" type="password" required /></div>
                <Button type="submit">Parolni yangilash</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}