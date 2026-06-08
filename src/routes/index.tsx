import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  PlayCircle,
  Shield,
  Award,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnHub — Online Kurslar Platformasi" },
      { name: "description", content: "Professional online kurslar. Video darslar, testlar, sertifikatlar. Oylik obuna asosida." },
      { property: "og:title", content: "LearnHub — Online Kurslar Platformasi" },
      { property: "og:description", content: "Professional online kurslar. Video darslar, testlar, sertifikatlar." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">LearnHub</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Imkoniyatlar</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Narxlar</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">Savollar</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/auth/login">Kirish</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">Boshlash</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Yangi avlod online ta'lim
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Bilimga to'la yo'l, <br />
              <span className="text-accent">bir joyda</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              Professional video darslar, amaliy testlar va shaxsiy taraqqiyot kuzatuvi. Bir martalik obuna bilan barcha kurslarga ruxsat.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/auth/register">
                  Bepul ro'yxatdan o'tish <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link to="/app">Demo ko'rish</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight">Nima uchun LearnHub?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Bilim olishning eng qulay va samarali yo'li</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: PlayCircle, title: "HD Video Darslar", desc: "Adaptiv sifat, internet trafikni tejaydi" },
            { icon: Shield, title: "Himoyalangan Kontent", desc: "Materiallarni yuklab olish imkoni yo'q" },
            { icon: Award, title: "Testlar va Sertifikat", desc: "Har bir dars yakunida amaliy test" },
            { icon: Smartphone, title: "Istalgan Qurilmada", desc: "Telefon, planshet, kompyuter" },
            { icon: CheckCircle2, title: "Taraqqiyot Kuzatuvi", desc: "Har bir modul bo'yicha statistika" },
            { icon: Sparkles, title: "Doimiy Yangilanish", desc: "Yangi kurslar har oy qo'shiladi" },
          ].map((f) => (
            <Card key={f.title} className="border-border/50 p-6 transition-all hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t bg-secondary/40 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight">Oddiy narxlar</h2>
            <p className="mt-4 text-lg text-muted-foreground">Bir tarif — barcha kurslar uchun to'liq ruxsat</p>
          </div>
          <div className="mx-auto mt-12 max-w-md">
            <Card className="overflow-hidden border-2 border-primary/20 p-8 shadow-[var(--shadow-elegant)]">
              <div className="text-center">
                <div className="text-sm font-medium uppercase tracking-wider text-primary">Standart obuna</div>
                <div className="mt-4">
                  <span className="font-display text-6xl font-bold">299 000</span>
                  <span className="ml-1 text-muted-foreground">so'm / oy</span>
                </div>
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Barcha kurslarga to'liq ruxsat",
                  "HD video darslar",
                  "Prezentatsiya va materiallar",
                  "Testlar va taraqqiyot kuzatuvi",
                  "Texnik qo'llab-quvvatlash",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-8 w-full">
                <Link to="/auth/register">Hozir boshlash</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 LearnHub. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  );
}
