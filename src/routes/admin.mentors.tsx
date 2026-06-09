import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarUploader } from "@/components/avatar-uploader";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Instagram,
  Plus,
  Trash2,
  Search,
  Users,
  BookOpen,
  UserCheck,
  Edit3,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/mentors")({ component: AdminMentors });

type Mentor = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  birth_date: string | null;
  telegram_url: string | null;
  instagram_url: string | null;
  bio: string | null;
  headline: string | null;
  expertise: string[] | null;
  experience_years: number | null;
  avatar_url: string | null;
  created_at: string;
};

function AdminMentors() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);

  const { data: mentors = [], isLoading } = useQuery({
    queryKey: ["admin", "mentors", "full"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "mentor" as any);
      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) return [] as Mentor[];
      const { data: profs } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);
      return ((profs ?? []) as any[]) as Mentor[];
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["admin", "mentors", "assignments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("user_id, mentor_id, course_id, active, expires_at, courses(title)")
        .not("mentor_id", "is", null);
      return data ?? [];
    },
  });

  const { data: mentorCourses = [] } = useQuery({
    queryKey: ["admin", "mentor_courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("mentor_courses" as any)
        .select("mentor_id, course_id, courses(title)");
      return (data ?? []) as any[];
    },
  });

  const removeMentor = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "mentor" as any);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Mentor rolidan olib tashlandi");
      qc.invalidateQueries({ queryKey: ["admin", "mentors", "full"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return mentors;
    return mentors.filter(
      (m) =>
        (m.full_name ?? "").toLowerCase().includes(t) ||
        (m.phone ?? "").includes(t) ||
        (m.headline ?? "").toLowerCase().includes(t) ||
        (m.expertise ?? []).some((x) => x.toLowerCase().includes(t)),
    );
  }, [mentors, q]);

  const studentsByMentor = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const a of assignments as any[]) {
      if (!a.mentor_id) continue;
      const arr = map.get(a.mentor_id) ?? [];
      arr.push(a);
      map.set(a.mentor_id, arr);
    }
    return map;
  }, [assignments]);

  const coursesByMentor = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const c of mentorCourses) {
      const arr = map.get(c.mentor_id) ?? [];
      arr.push(c);
      map.set(c.mentor_id, arr);
    }
    return map;
  }, [mentorCourses]);

  const totalStudents = assignments.filter((a: any) => a.active).length;
  const totalLinks = mentorCourses.length;

  return (
    <>
      <Topbar title="Mentorlar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={UserCheck} label="Mentorlar" value={mentors.length} />
          <StatCard icon={Users} label="Faol o'quvchilar" value={totalStudents} />
          <StatCard icon={BookOpen} label="Mentor-kurs ulanmalari" value={totalLinks} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Mentor jamoasi</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Yuklanmoqda..." : `${filtered.length} / ${mentors.length} ta mentor`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ism, telefon, soha..."
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <AddMentorDialog
              onAdded={() =>
                qc.invalidateQueries({ queryKey: ["admin", "mentors", "full"] })
              }
            />
          </div>
        </div>

        {filtered.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Hozircha mentorlar yo'q. Mavjud o'quvchiga mentor roli berish uchun telefon raqami orqali qo'shing.
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => {
            const students = studentsByMentor.get(m.id) ?? [];
            const activeStudents = students.filter((s: any) => s.active).length;
            const linked = coursesByMentor.get(m.id) ?? [];
            return (
              <Card key={m.id} className="flex flex-col">
                <CardContent className="flex-1 space-y-3 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-14 w-14">
                      {m.avatar_url ? <AvatarImage src={m.avatar_url} alt={m.full_name ?? ""} /> : null}
                      <AvatarFallback className="bg-primary text-base font-display font-semibold text-primary-foreground">
                        {(m.full_name || "M").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold truncate">
                        {m.full_name || "—"}
                      </div>
                      {m.headline && (
                        <div className="text-xs text-muted-foreground truncate">
                          {m.headline}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground truncate">
                        {m.phone || "—"}
                      </div>
                    </div>
                    <Badge>Mentor</Badge>
                  </div>

                  {m.bio && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{m.bio}</p>
                  )}

                  {(m.expertise ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(m.expertise ?? []).slice(0, 4).map((x) => (
                        <Badge key={x} variant="secondary" className="text-[10px]">
                          {x}
                        </Badge>
                      ))}
                      {(m.expertise ?? []).length > 4 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{(m.expertise ?? []).length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-3 text-center">
                    <Mini label="O'quvchilar" value={activeStudents} />
                    <Mini label="Kurslar" value={linked.length} />
                    <Mini label="Tajriba" value={m.experience_years ? `${m.experience_years}y` : "—"} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {m.telegram_url && (
                      <a
                        href={m.telegram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                      >
                        <Send className="h-3 w-3" /> Telegram
                      </a>
                    )}
                    {m.instagram_url && (
                      <a
                        href={m.instagram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                      >
                        <Instagram className="h-3 w-3" /> Instagram
                      </a>
                    )}
                  </div>
                </CardContent>
                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setActiveMentor(m)}
                    >
                      Batafsil <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        confirm(
                          `${m.full_name || "Mentor"} mentor rolidan olib tashlansinmi?`,
                        ) && removeMentor.mutate(m.id)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {activeMentor && (
          <MentorDetailDialog
            mentor={activeMentor}
            students={studentsByMentor.get(activeMentor.id) ?? []}
            mentorCourses={coursesByMentor.get(activeMentor.id) ?? []}
            onClose={() => setActiveMentor(null)}
            onChanged={() => {
              qc.invalidateQueries({ queryKey: ["admin", "mentors", "full"] });
              qc.invalidateQueries({ queryKey: ["admin", "mentor_courses"] });
            }}
          />
        )}
      </main>
    </>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-5">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="font-display text-xl font-bold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="font-display text-base font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

function MentorDetailDialog({
  mentor,
  students,
  mentorCourses,
  onClose,
  onChanged,
}: {
  mentor: Mentor;
  students: any[];
  mentorCourses: any[];
  onClose: () => void;
  onChanged: () => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {mentor.avatar_url ? <AvatarImage src={mentor.avatar_url} alt={mentor.full_name ?? ""} /> : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(mentor.full_name || "M").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>{mentor.full_name || "Mentor"}</div>
              {mentor.headline && (
                <div className="text-xs font-normal text-muted-foreground">
                  {mentor.headline}
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Umumiy</TabsTrigger>
            <TabsTrigger value="edit">Tahrirlash</TabsTrigger>
            <TabsTrigger value="courses">Kurslar ({mentorCourses.length})</TabsTrigger>
            <TabsTrigger value="students">O'quvchilar ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <InfoGrid>
              <Info icon={Phone} label="Telefon" value={mentor.phone || "—"} />
              <Info icon={Mail} label="Email" value={mentor.email || "—"} />
              <Info icon={Calendar} label="Tug'ilgan" value={mentor.birth_date || "—"} />
              <Info icon={Briefcase} label="Tajriba" value={mentor.experience_years ? `${mentor.experience_years} yil` : "—"} />
              <Info icon={GraduationCap} label="Shahar" value={mentor.city || "—"} />
              <Info icon={Calendar} label="Qo'shilgan" value={new Date(mentor.created_at).toLocaleDateString("uz-UZ")} />
            </InfoGrid>
            {mentor.bio && (
              <div>
                <div className="mb-1 text-xs uppercase text-muted-foreground">Bio</div>
                <p className="text-sm">{mentor.bio}</p>
              </div>
            )}
            {(mentor.expertise ?? []).length > 0 && (
              <div>
                <div className="mb-1 text-xs uppercase text-muted-foreground">Mutaxassislik</div>
                <div className="flex flex-wrap gap-1">
                  {(mentor.expertise ?? []).map((x) => (
                    <Badge key={x} variant="secondary">{x}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {mentor.telegram_url && (
                <Button asChild size="sm" variant="outline">
                  <a href={mentor.telegram_url} target="_blank" rel="noreferrer">
                    <Send className="mr-1 h-3.5 w-3.5" /> Telegram
                  </a>
                </Button>
              )}
              {mentor.instagram_url && (
                <Button asChild size="sm" variant="outline">
                  <a href={mentor.instagram_url} target="_blank" rel="noreferrer">
                    <Instagram className="mr-1 h-3.5 w-3.5" /> Instagram
                  </a>
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="edit" className="pt-4">
            <MentorEditForm mentor={mentor} onSaved={onChanged} />
          </TabsContent>

          <TabsContent value="courses" className="pt-4">
            <MentorCoursesEditor mentorId={mentor.id} linked={mentorCourses} onChanged={onChanged} />
          </TabsContent>

          <TabsContent value="students" className="pt-4">
            <MentorStudentsList students={students} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function MentorEditForm({ mentor, onSaved }: { mentor: Mentor; onSaved: () => void }) {
  const [form, setForm] = useState({
    full_name: mentor.full_name || "",
    headline: mentor.headline || "",
    bio: mentor.bio || "",
    expertiseText: (mentor.expertise ?? []).join(", "),
    experience_years: mentor.experience_years ?? "",
    telegram_url: mentor.telegram_url || "",
    instagram_url: mentor.instagram_url || "",
    email: mentor.email || "",
    city: mentor.city || "",
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const expertise = form.expertiseText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        headline: form.headline || null,
        bio: form.bio || null,
        expertise,
        experience_years: form.experience_years === "" ? null : Number(form.experience_years),
        telegram_url: form.telegram_url || null,
        instagram_url: form.instagram_url || null,
        email: form.email || null,
        city: form.city || null,
      } as any)
      .eq("id", mentor.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saqlandi");
    onSaved();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Ism Familiya">
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </Field>
        <Field label="Kasbiy unvon">
          <Input
            placeholder="Senior Frontend Mentor"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Shahar">
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </Field>
        <Field label="Tajriba (yil)">
          <Input
            type="number"
            value={form.experience_years as any}
            onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
          />
        </Field>
        <Field label="Mutaxassislik (vergul bilan)">
          <Input
            placeholder="Frontend, React, UI/UX"
            value={form.expertiseText}
            onChange={(e) => setForm({ ...form, expertiseText: e.target.value })}
          />
        </Field>
        <Field label="Telegram URL">
          <Input
            placeholder="https://t.me/username"
            value={form.telegram_url}
            onChange={(e) => setForm({ ...form, telegram_url: e.target.value })}
          />
        </Field>
        <Field label="Instagram URL">
          <Input
            placeholder="https://instagram.com/username"
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Bio">
        <Textarea
          rows={4}
          placeholder="Mentor haqida qisqacha..."
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
      </Field>
      <Button onClick={save} disabled={busy}>
        {busy ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function MentorCoursesEditor({
  mentorId,
  linked,
  onChanged,
}: {
  mentorId: string;
  linked: any[];
  onChanged: () => void;
}) {
  const { data: allCourses = [] } = useQuery({
    queryKey: ["admin", "courses-all"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, title").order("title");
      return data ?? [];
    },
  });
  const linkedIds = new Set(linked.map((l) => l.course_id));

  const toggle = async (courseId: string, on: boolean) => {
    if (on) {
      const { error } = await supabase
        .from("mentor_courses" as any)
        .insert({ mentor_id: mentorId, course_id: courseId });
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase
        .from("mentor_courses" as any)
        .delete()
        .eq("mentor_id", mentorId)
        .eq("course_id", courseId);
      if (error) return toast.error(error.message);
    }
    onChanged();
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Mentor qaysi kurslar bo'yicha o'quvchilarga yordam bera olishini belgilang.
      </p>
      {allCourses.length === 0 && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Hozircha kurslar yo'q
        </div>
      )}
      <div className="space-y-1">
        {allCourses.map((c: any) => {
          const on = linkedIds.has(c.id);
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="font-medium text-sm">{c.title}</div>
              <Button
                size="sm"
                variant={on ? "default" : "outline"}
                onClick={() => toggle(c.id, !on)}
              >
                {on ? "Biriktirilgan" : "Biriktirish"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MentorStudentsList({ students }: { students: any[] }) {
  const [details, setDetails] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const ids = Array.from(new Set(students.map((s) => s.user_id)));
      if (!ids.length) return setDetails([]);
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", ids);
      const map = new Map((data ?? []).map((p: any) => [p.id, p]));
      setDetails(
        students.map((s) => ({ ...s, profile: map.get(s.user_id) })),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  if (!students.length) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        Bu mentorga hali o'quvchi biriktirilmagan
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {details.map((s) => (
        <div
          key={`${s.user_id}-${s.course_id}`}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {(s.profile?.full_name || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{s.profile?.full_name || "—"}</div>
              <div className="text-xs text-muted-foreground">
                {s.profile?.phone || "—"} • {s.courses?.title || "—"}
              </div>
            </div>
          </div>
          {s.active ? (
            <Badge className="bg-success text-success-foreground">Faol</Badge>
          ) : (
            <Badge variant="outline">Yopiq</Badge>
          )}
        </div>
      ))}
    </div>
  );
}

function AddMentorDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    const digits = phone.replace(/\D+/g, "");
    if (!digits) return toast.error("Telefon raqamini kiriting");
    setBusy(true);
    try {
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("phone", digits)
        .maybeSingle();
      if (error) throw error;
      if (!prof) {
        toast.error("Bu raqam bilan foydalanuvchi topilmadi");
        return;
      }
      const { error: e2 } = await supabase
        .from("user_roles")
        .insert({ user_id: prof.id, role: "mentor" as any });
      if (e2 && !String(e2.message).includes("duplicate")) throw e2;
      toast.success(`${prof.full_name || "Foydalanuvchi"} mentor sifatida qo'shildi`);
      setOpen(false);
      setPhone("");
      onAdded();
    } catch (e: any) {
      toast.error(e.message ?? "Xatolik");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Mentor qo'shish
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Mentor qo'shish</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Foydalanuvchi ro'yxatdan o'tgan bo'lishi kerak. Uning telefon raqamini kiriting.
        </p>
        <div className="space-y-2">
          <Label>Telefon raqam</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="998901234567"
          />
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={busy}>
            {busy ? "Qo'shilmoqda..." : "Qo'shish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}