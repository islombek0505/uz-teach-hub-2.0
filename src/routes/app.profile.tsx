import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Send, Instagram, User, Lock, Phone, Calendar, MapPin } from "lucide-react";
import { AvatarUploader } from "@/components/avatar-uploader";
import { Sk } from "@/components/student/loaders";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data ?? {}));
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setIsMentor((data ?? []).some((r: any) => r.role === "mentor"));
      });
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
        ...(isMentor
          ? {
              telegram_url: profile.telegram_url || null,
              instagram_url: profile.instagram_url || null,
              headline: profile.headline || null,
              bio: profile.bio || null,
              experience_years:
                profile.experience_years === "" || profile.experience_years == null
                  ? null
                  : Number(profile.experience_years),
              expertise:
                typeof profile.expertiseText === "string"
                  ? profile.expertiseText
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                  : (profile.expertise ?? []),
            }
          : {}),
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
        <Topbar title="Mening profilim" />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <Sk className="h-44 rounded-2xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Sk className="h-64 rounded-2xl" />
            <Sk className="h-64 rounded-2xl" />
          </div>
        </main>
      </>
    );

  return (
    <>
      <Topbar title="Mening profilim" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        {/* Profile header */}
        <Card className="glass overflow-hidden rounded-2xl border-transparent">
          <div className="h-28" style={{ background: "var(--gradient-hero)" }} />
          <CardContent className="p-5 lg:p-6">
            <div className="-mt-16 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:text-left">
              <div className="rounded-full ring-4 ring-card">
                <AvatarUploader
                  userId={user!.id}
                  url={profile.avatar_url}
                  name={profile.full_name}
                  size={96}
                  onChange={(u) => setProfile({ ...profile, avatar_url: u })}
                />
              </div>
              <div className="flex-1 pb-1 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <h2 className="font-display text-2xl font-bold">
                    {profile.full_name || "Foydalanuvchi"}
                  </h2>
                  <Badge variant="secondary">{isMentor ? "Mentor" : "O'quvchi"}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:justify-start">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {profile.phone || "—"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Ro'yxatdan o'tildi:{" "}
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString("uz-UZ")
                      : "—"}
                  </span>
                  {profile.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {profile.city}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Personal info */}
          <Card className="glass rounded-2xl border-transparent lg:col-span-3">
            <CardContent className="p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2">
                {/* <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div> */}
                <h3 className="font-display text-lg font-semibold">Shaxsiy ma'lumotlar</h3>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ism Familiya</Label>
                    <Input
                      value={profile.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon raqam</Label>
                    <Input value={profile.phone || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Email (ixtiyoriy)</Label>
                    <Input
                      type="email"
                      value={profile.email || ""}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tug'ilgan sana</Label>
                    <Input
                      type="date"
                      value={profile.birth_date || ""}
                      onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Shahar</Label>
                    <Input
                      value={profile.city || ""}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      placeholder="Toshkent"
                    />
                  </div>
                </div>

                {isMentor && (
                  <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Kasbiy unvon</Label>
                      <Input
                        value={profile.headline || ""}
                        onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                        placeholder="Senior Frontend Mentor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tajriba (yil)</Label>
                      <Input
                        type="number"
                        value={profile.experience_years ?? ""}
                        onChange={(e) =>
                          setProfile({ ...profile, experience_years: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Mutaxassislik (vergul bilan)</Label>
                      <Input
                        value={
                          profile.expertiseText ??
                          (Array.isArray(profile.expertise) ? profile.expertise.join(", ") : "")
                        }
                        onChange={(e) => setProfile({ ...profile, expertiseText: e.target.value })}
                        placeholder="Frontend, React, UI/UX"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Bio</Label>
                      <Textarea
                        rows={4}
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="O'zingiz haqingizda qisqacha"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Send className="h-3.5 w-3.5" /> Telegram URL
                      </Label>
                      <Input
                        value={profile.telegram_url || ""}
                        onChange={(e) => setProfile({ ...profile, telegram_url: e.target.value })}
                        placeholder="https://t.me/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Instagram className="h-3.5 w-3.5" /> Instagram URL
                      </Label>
                      <Input
                        value={profile.instagram_url || ""}
                        onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>
                )}
                <Button type="submit" disabled={saving}>
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="glass h-fit rounded-2xl border-transparent lg:col-span-2">
            <CardContent className="p-5 lg:p-6">
              <div className="mb-4 flex items-center gap-2">
                {/* <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/15 text-warning">
                  <Lock className="h-4 w-4" />
                </div> */}
                <h3 className="font-display text-lg font-semibold">Parolni o'zgartirish</h3>
              </div>
              <form onSubmit={changePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>Yangi parol</Label>
                  <Input name="newPass" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label>Tasdiqlang</Label>
                  <Input name="confirmPass" type="password" required />
                </div>
                <Button type="submit" variant="outline" className="w-full">
                  Parolni yangilash
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
