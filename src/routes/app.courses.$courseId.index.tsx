import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, FileText, CheckCircle2, Lock, BookOpen, Upload, CreditCard, Presentation, UserCheck, Send, Instagram, Plus, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PresentationSlidesViewer } from "@/components/presentation-viewer";

export const Route = createFileRoute("/app/courses/$courseId/")({
  component: CourseDetail,
  notFoundComponent: () => <div className="p-10 text-center">Kurs topilmadi</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

const fmt = (n: number) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";

function CourseDetail() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["app", "course", courseId, user?.id],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*, modules(*, lessons(id, title, type, position, has_quiz))")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      if (!course) throw notFound();
      course.modules = (course.modules ?? []).sort((a: any, b: any) => a.position - b.position);
      for (const m of course.modules) m.lessons = (m.lessons ?? []).sort((a: any, b: any) => a.position - b.position);

      // Resolve signed URL for cover if it's a storage path
      if (course.cover_url && !course.cover_url.startsWith("http")) {
        const { data: signed } = await supabase.storage.from("course-covers").createSignedUrl(course.cover_url, 60 * 60);
        course.cover_url = signed?.signedUrl ?? null;
      }

      const { data: sub } = await supabase.from("subscriptions").select("active, expires_at").eq("user_id", user!.id).eq("course_id", courseId).maybeSingle();
      const enrolled = !!sub?.active && (!sub.expires_at || new Date(sub.expires_at) > new Date());
      const { data: subFull } = enrolled
        ? await supabase
            .from("subscriptions")
            .select("tariff, mentor_id")
            .eq("user_id", user!.id)
            .eq("course_id", courseId)
            .maybeSingle()
        : { data: null as any };
      let mentor: any = null;
      if (subFull?.mentor_id) {
        const { data: mp } = await supabase
          .from("profiles")
          .select("id, full_name, telegram_url, instagram_url, phone, bio, headline, expertise, experience_years")
          .eq("id", subFull.mentor_id)
          .maybeSingle();
        mentor = mp ?? null;
      }

      const { data: progress } = await supabase.from("lesson_progress").select("lesson_id, completed").eq("user_id", user!.id).eq("course_id", courseId);
      const completedSet = new Set((progress ?? []).filter((p: any) => p.completed).map((p: any) => p.lesson_id));

      const { data: pending } = await supabase.from("payments").select("id, status, created_at").eq("user_id", user!.id).eq("course_id", courseId).eq("status", "pending").order("created_at", { ascending: false }).limit(1);

      const { data: pres } = await supabase
        .from("course_presentations")
        .select("*")
        .eq("course_id", courseId)
        .order("position");
      const presentations: any[] = pres ?? [];

      return { course, enrolled, completedSet, pendingPayment: pending?.[0] ?? null, presentations, tariff: subFull?.tariff ?? null, mentor };
    },
  });

  if (isLoading || !data) return <main className="flex-1 p-6 text-muted-foreground">Yuklanmoqda...</main>;
  const { course, enrolled, completedSet, pendingPayment, presentations, tariff, mentor } = data;

  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const total = allLessons.length;
  const done = allLessons.filter((l: any) => completedSet.has(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // All lessons are open once enrolled — no strict gating.
  const access: Record<string, "done" | "current"> = {};
  for (const l of allLessons) access[l.id] = completedSet.has(l.id) ? "done" : "current";

  const [activeModuleId, setActiveModuleId] = useState<string | null>(course.modules[0]?.id ?? null);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  // Reset when course changes
  const activeModule = course.modules.find((m: any) => m.id === activeModuleId) ?? course.modules[0];

  return (
    <>
      <Topbar title={course.title} />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/5] bg-muted bg-cover bg-center" style={course.cover_url ? { backgroundImage: `url(${course.cover_url})` } : undefined}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <div className="flex flex-wrap gap-2">
                {course.category && <Badge variant="secondary">{course.category}</Badge>}
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold lg:text-4xl">{course.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">{course.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {total} dars</span>
              </div>
            </div>
          </div>
        </div>

        {!enrolled ? (
          <Card>
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-display text-lg font-semibold">Kursga yozilish</div>
                <p className="text-sm text-muted-foreground">
                  {pendingPayment ? "To'lovingiz tasdiq kutmoqda. Admin tasdiqlagach kurs ochiladi." : "To'lov qiling va chek yuboring — admin tasdiqlagach kurs ochiladi."}
                </p>
              </div>
              {!pendingPayment && <EnrollDialog courseId={courseId} courseTitle={course.title} priceSelf={Number(course.price_self ?? course.price)} priceMentor={Number(course.price_mentor ?? course.price)} userId={user!.id} />}
              {pendingPayment && <Badge className="bg-warning text-warning-foreground">Tasdiq kutilmoqda</Badge>}
            </CardContent>
          </Card>
        ) : (
          <>
          {tariff === "mentor" && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <div className="font-display font-semibold">Mentor yordami bilan o'rganmoqdasiz</div>
                </div>
                {mentor ? (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-medium">{mentor.full_name || "Mentor"}</div>
                        {mentor.headline && (
                          <div className="text-xs text-muted-foreground">{mentor.headline}</div>
                        )}
                        {mentor.experience_years != null && (
                          <div className="text-xs text-muted-foreground">Tajriba: {mentor.experience_years} yil</div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {mentor.telegram_url && (
                          <Button asChild size="sm" variant="outline">
                            <a href={mentor.telegram_url} target="_blank" rel="noreferrer"><Send className="mr-1 h-3.5 w-3.5" /> Telegram</a>
                          </Button>
                        )}
                        {mentor.instagram_url && (
                          <Button asChild size="sm" variant="outline">
                            <a href={mentor.instagram_url} target="_blank" rel="noreferrer"><Instagram className="mr-1 h-3.5 w-3.5" /> Instagram</a>
                          </Button>
                        )}
                      </div>
                    </div>
                    {mentor.bio && (
                      <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                    )}
                    {Array.isArray(mentor.expertise) && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.map((x: string) => (
                          <Badge key={x} variant="secondary" className="text-[10px]">{x}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">Mentor tez orada biriktiriladi. Admin tasdiqlagach kontaktlar shu yerda paydo bo'ladi.</p>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium">Sizning taraqqiyotingiz</div>
                <div className="mt-1 text-xs text-muted-foreground">{done} ta dars yakunlangan, {total - done} ta qoldi</div>
              </div>
              <div className="w-full sm:w-1/2">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{pct}%</span></div>
                <Progress value={pct} className="mt-1" />
              </div>
            </CardContent>
          </Card>
          </>
        )}

        <div>
          <h2 className="mb-4 font-display text-xl font-semibold">Modullar</h2>
          {course.modules.length === 0 && (
            <Card><CardContent className="p-10 text-center text-muted-foreground">Bu kursda hali modullar qo'shilmagan</CardContent></Card>
          )}

          {course.modules.length > 0 && (
            <div className="rounded-2xl border bg-card p-4 sm:p-6">
              {/* Module tabs */}
              <div className="-mx-2 mb-2 flex gap-5 overflow-x-auto px-2 pb-2 sm:gap-8">
                {course.modules.map((m: any, idx: number) => {
                  const isActive = activeModule?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setActiveModuleId(m.id); setExpandedLessonId(null); }}
                      className={`shrink-0 font-display text-lg font-bold tracking-tight transition-colors sm:text-2xl ${
                        isActive ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
                      }`}
                    >
                      {idx + 1}-modul
                    </button>
                  );
                })}
              </div>

              {activeModule && (
                <div className="border-t">
                  {activeModule.lessons.length === 0 && (
                    <div className="py-10 text-center text-sm text-muted-foreground">Bu modulda hali darslar yo'q.</div>
                  )}
                  <ul>
                    {activeModule.lessons.map((l: any, li: number) => {
                      const locked = !enrolled;
                      const done = completedSet.has(l.id);
                      const expanded = expandedLessonId === l.id;
                      const TypeIcon = l.type === "presentation" || l.type === "text" ? FileText : PlayCircle;
                      return (
                        <li key={l.id} className="border-b last:border-b-0">
                          <div className="flex items-center gap-4 py-4">
                            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-bold transition-colors ${
                              done ? "bg-success text-success-foreground" : expanded ? "bg-foreground text-background" : "bg-muted text-foreground"
                            }`}>
                              {done ? <CheckCircle2 className="h-4 w-4" /> : li + 1}
                            </div>
                            <button
                              onClick={() => setExpandedLessonId(expanded ? null : l.id)}
                              className="min-w-0 flex-1 truncate text-left font-display text-base font-semibold sm:text-lg"
                            >
                              {l.title}
                            </button>
                            <button
                              onClick={() => setExpandedLessonId(expanded ? null : l.id)}
                              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-foreground/70 transition-colors hover:bg-muted"
                              aria-label={expanded ? "Yopish" : "Ochish"}
                            >
                              {expanded ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                          </div>
                          {expanded && (
                            <div className="space-y-3 pb-5 pl-[52px]">
                              {l.description && !locked && (
                                <p className="text-sm text-muted-foreground">{l.description}</p>
                              )}
                              <LessonSubRow
                                icon={<TypeIcon className="h-4 w-4" />}
                                label={l.type === "video" ? "Video darslik" : l.type === "presentation" ? "Prezentatsiya" : "Matn darslik"}
                                locked={locked}
                                href={!locked ? { courseId: course.id, lessonId: l.id } : undefined}
                              />
                              {l.has_quiz && (
                                <LessonSubRow
                                  icon={<FileText className="h-4 w-4" />}
                                  label="Yakuniy test"
                                  locked={locked}
                                  href={!locked ? { courseId: course.id, lessonId: l.id } : undefined}
                                />
                              )}
                              {locked && (
                                <p className="text-xs text-muted-foreground">Bu darslikni ochish uchun kursga obuna bo'ling.</p>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {presentations.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Presentation className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-semibold">Takrorlash prezentatsiyalari</h2>
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              {enrolled ? "Bir nechta darsning qisqacha jamlanmasi. Tez takrorlash uchun." : "Obuna bo'lgach takrorlash prezentatsiyalari ochiladi."}
            </p>
            <div className="space-y-4">
              {presentations.map((p: any) => (
                <CoursePresentationCard key={p.id} item={p} locked={!enrolled} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function LessonSubRow({ icon, label, locked, href }: { icon: React.ReactNode; label: string; locked: boolean; href?: { courseId: string; lessonId: string } }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-lg px-3 py-2 transition-colors ${locked ? "opacity-70" : "hover:bg-muted"}`}>
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border">
        {locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : icon}
      </div>
      <div className="min-w-0 flex-1 text-sm font-medium">{label}</div>
    </div>
  );
  if (!locked && href) {
    return <Link to="/app/courses/$courseId/lessons/$lessonId" params={href}>{inner}</Link>;
  }
  return inner;
}

function CoursePresentationCard({ item, locked = false }: { item: any; locked?: boolean }) {
  const [open, setOpen] = useState(false);
  const slides: string[] = Array.isArray(item.slides) ? item.slides : [];
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
            {locked ? <Lock className="h-5 w-5" /> : <Presentation className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold">{item.title}</div>
            {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
          </div>
          <Badge variant="outline">{slides.length} slayd</Badge>
          <Button size="sm" variant={open ? "outline" : "default"} disabled={!slides.length || locked} onClick={() => setOpen((v) => !v)}>
            {locked ? "Yopiq" : open ? "Yopish" : "Ochish"}
          </Button>
        </div>
        {!locked && open && slides.length > 0 && <PresentationSlidesViewer slides={slides} title={item.title} />}
      </CardContent>
    </Card>
  );
}

function EnrollDialog({ courseId, courseTitle, priceSelf, priceMentor, userId }: { courseId: string; courseTitle: string; priceSelf: number; priceMentor: number; userId: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [tariff, setTariff] = useState<"mentor" | "self">("self");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const price = tariff === "mentor" ? priceMentor : priceSelf;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let receipt_url: string | null = null;
      if (file) {
        const path = `${userId}/${courseId}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        receipt_url = path;
      }
      const { error } = await supabase.from("payments").insert({
        user_id: userId,
        course_id: courseId,
        amount: price,
        note: note || null,
        receipt_url,
        tariff,
        status: "pending",
      });
      if (error) throw error;
      toast.success("To'lov yuborildi! Admin tasdiqlashini kuting.");
      qc.invalidateQueries({ queryKey: ["app", "course", courseId] });
      setOpen(false); setFile(null); setNote("");
    } catch (err: any) {
      toast.error(err.message ?? "Xatolik");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg"><CreditCard className="mr-2 h-4 w-4" /> Sotib olish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">{courseTitle} — to'lov</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tarifni tanlang</Label>
            <RadioGroup value={tariff} onValueChange={(v) => setTariff(v as "mentor" | "self")} className="grid gap-2 sm:grid-cols-2">
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="self" className="mt-1" />
                <div>
                  <div className="font-medium">Erkin o'rganish</div>
                  <div className="mt-1 text-xs text-muted-foreground">Faqat video darslar — mentor yo'q</div>
                  <div className="mt-1 font-display text-sm font-bold">{priceSelf > 0 ? fmt(priceSelf) : "Bepul"}</div>
                </div>
              </Label>
              <Label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="mentor" className="mt-1" />
                <div>
                  <div className="font-medium">Mentor yordami bilan</div>
                  <div className="mt-1 text-xs text-muted-foreground">Sizga shaxsiy mentor biriktiriladi va kontaktlari kursda ko'rinadi</div>
                  <div className="mt-1 font-display text-sm font-bold">{priceMentor > 0 ? fmt(priceMentor) : "Bepul"}</div>
                </div>
              </Label>
            </RadioGroup>
          </div>
          <Card><CardContent className="p-4 space-y-1">
            <div className="text-xs uppercase text-muted-foreground">Karta raqami</div>
            <div className="font-display text-xl font-bold tracking-wider">8600 1234 5678 9012</div>
            <div className="text-sm text-muted-foreground">Yusupov A.K. — Humo / Uzcard</div>
          </CardContent></Card>
          <div className="space-y-2">
            <Label>Summa</Label>
            <Input value={fmt(price)} disabled />
          </div>
          <div className="space-y-2">
            <Label>Chek rasmi (ixtiyoriy)</Label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground hover:bg-muted/50">
              <Upload className="h-5 w-5" />
              <span>{file ? file.name : "Chek skrinshotni tanlang"}</span>
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="space-y-2">
            <Label>Eslatma (ixtiyoriy)</Label>
            <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Masalan: transfer raqami yoki Telegram username" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>{busy ? "Yuborilmoqda..." : "Yuborish"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}