import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { courses, mockUser, formatPrice } from "@/lib/mock-data";
import { BookOpen, Clock, Trophy, TrendingUp, PlayCircle, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = [
    { label: "Ko'rilgan darslar", value: "12", icon: PlayCircle, color: "text-primary bg-primary/10" },
    { label: "Faol kurslar", value: "2", icon: BookOpen, color: "text-accent-foreground bg-accent/40" },
    { label: "Soatlar", value: "8.5", icon: Clock, color: "text-warning bg-warning/15" },
    { label: "O'rtacha ball", value: "91%", icon: Trophy, color: "text-success bg-success/15" },
  ];

  return (
    <>
      <Topbar title="Bosh sahifa" initials="AY" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        {/* Welcome */}
        <div className="overflow-hidden rounded-2xl p-6 text-primary-foreground lg:p-8" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold lg:text-3xl">Assalomu alaykum, {mockUser.name.split(" ")[0]}! 👋</h2>
              <p className="mt-2 text-white/80">Bugun ham yangi bilim olishga tayyormisiz?</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="text-white/80">Obuna faol — {mockUser.subscription.endDate} gacha</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/app/courses/$courseId" params={{ courseId: "c1" }}>Davom etish</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`grid h-12 w-12 place-items-center rounded-lg ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active courses */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Davom etayotgan kurslar</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/courses">Hammasi <TrendingUp className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.slice(0, 2).map((c) => {
              const total = c.modules.reduce((s, m) => s + m.lessons.length, 0);
              const done = c.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);
              const pct = total ? Math.round((done / total) * 100) : 0;
              return (
                <Card key={c.id} className="overflow-hidden">
                  <div className="aspect-[16/7] bg-cover bg-center" style={{ backgroundImage: `url(${c.cover})` }} />
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{c.category}</Badge>
                      <Badge variant={c.mode === "strict" ? "default" : "outline"}>
                        {c.mode === "strict" ? "Qat'iy rejim" : "Erkin rejim"}
                      </Badge>
                    </div>
                    <h4 className="mt-3 font-display text-lg font-semibold leading-snug">{c.title}</h4>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{done}/{total} dars</span>
                      <span>•</span>
                      <span>{c.totalDuration}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground"><span>Taraqqiyot</span><span>{pct}%</span></div>
                      <Progress value={pct} className="mt-1" />
                    </div>
                    <Button asChild className="mt-4 w-full">
                      <Link to="/app/courses/$courseId" params={{ courseId: c.id }}>Davom etish</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Subscription info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Obuna ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Tarif</div>
              <div className="mt-1 font-display text-lg font-semibold">{mockUser.subscription.plan}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Boshlangan</div>
              <div className="mt-1 font-display text-lg font-semibold">{mockUser.subscription.startDate}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">Tugaydi</div>
              <div className="mt-1 font-display text-lg font-semibold text-success">{mockUser.subscription.endDate}</div>
            </div>
            <div className="sm:col-span-3 flex items-center justify-between rounded-lg border bg-muted/40 p-4">
              <div>
                <div className="text-sm font-medium">Oylik to'lov: {formatPrice(mockUser.subscription.amount)}</div>
                <div className="text-xs text-muted-foreground">To'lov muddati: 1 oy</div>
              </div>
              <Button asChild variant="outline"><Link to="/app/subscription">Batafsil</Link></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}