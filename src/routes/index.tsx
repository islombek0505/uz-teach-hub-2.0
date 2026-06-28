import { type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroVisual } from "@/components/landing/hero-visual";
import { Reveal } from "@/components/landing/reveal";
import {
  GraduationCap,
  PlayCircle,
  Shield,
  Award,
  Smartphone,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  UserPlus,
  Clock,
  CreditCard,
  Rocket,
  MessagesSquare,
  Video,
  ThumbsUp,
  Star,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () =>
    seo({
      // Home page targets the brand + primary keywords for ranking.
      title: undefined, // uses the full default title
      description:
        "OnlineTalim — professional onlayn kurslar platformasi. HD video darslar, interaktiv testlar va sertifikatlar. 7 kun bepul sinab ko‘ring, keyin bitta tarif bilan barcha kurslarni oching.",
      path: "/",
    }),
  component: Index,
});

const FEATURES = [
  {
    icon: PlayCircle,
    title: "HD Video Darslar",
    desc: "Adaptiv sifat — internet trafikni tejaydi, har bir tushuncha aniq va ravon.",
  },
  {
    icon: Shield,
    title: "Himoyalangan Kontent",
    desc: "Darsliklar faqat platforma orqali ko'riladi, yuklab olib bo'lmaydi.",
  },
  {
    icon: Award,
    title: "Testlar va Sertifikat",
    desc: "Har dars yakunida amaliy test, kurs oxirida raqamli sertifikat.",
  },
  {
    icon: Smartphone,
    title: "Istalgan Qurilmada",
    desc: "Telefon, planshet yoki kompyuter — istalgan brauzerda muammosiz.",
  },
  {
    icon: BarChart3,
    title: "Taraqqiyot Kuzatuvi",
    desc: "Har bir modul bo'yicha statistika va shaxsiy o'sish tarixi.",
  },
  {
    icon: RefreshCw,
    title: "Doimiy Yangilanish",
    desc: "Darsliklar muntazam yangilanadi — aynan sizning fikringiz asosida.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Ro'yxatdan o'ting",
    desc: "Akkount yarating va profilingizni ma'lumotlar bilan to'ldiring.",
  },
  {
    icon: Clock,
    title: "7 kun bepul sinang",
    desc: "Sinov muddatini aktivlashtiring — bir hafta hammasi tekin ochiq.",
  },
  {
    icon: CreditCard,
    title: "Tarifni tanlang",
    desc: "Yoqsa, bitta tarif sotib oling. Murakkab rejalar yo'q.",
  },
  {
    icon: Rocket,
    title: "Cheksiz o'rganing",
    desc: "Platformadagi barcha kurslarga to'liq kirish ochiladi.",
  },
];

const COMMUNITY = [
  {
    icon: MessagesSquare,
    title: "Yopiq Telegram guruhlar",
    desc: "Savol va qiyinchiliklaringizga tezkor javob, o'quvchilar bilan jonli muloqot.",
  },
  {
    icon: Video,
    title: "Jonli onlayn uchrashuvlar",
    desc: "Qiynalgan mavzular birga tahlil qilinadi — real vaqtda, jonli darslar bilan.",
  },
  {
    icon: ThumbsUp,
    title: "Fikringiz muhim",
    desc: "Takliflaringiz muntazam so'raladi va platforma shu asosda takomillashadi.",
  },
];

const PLAN_FEATURES = [
  "Platformadagi barcha kurslarga to'liq ruxsat",
  "HD video darslar va prezentatsiyalar",
  "Amaliy testlar va taraqqiyot kuzatuvi",
  "Yopiq Telegram guruh va onlayn uchrashuvlar",
  "Yangi kurslar — qo'shimcha to'lovsiz",
  "Texnik qo'llab-quvvatlash",
];

const FAQ = [
  {
    q: "7 kunlik bepul sinov qanday ishlaydi?",
    a: "Ro'yxatdan o'tib sinov muddatini aktivlashtirasiz va 7 kun davomida platformadagi darsliklardan to'liq, hech qanday to'lovsiz foydalanasiz. Karta ma'lumotlari talab qilinmaydi.",
  },
  {
    q: "Tarif qanday ishlaydi?",
    a: "Bitta tarif sotib olganingizdan so'ng platformadagi barcha kurslarga to'liq ruxsat olasiz. Sinov tugagach, darslaringizni tarif bilan davom ettirasiz.",
  },
  {
    q: "To'lovni qanday amalga oshiraman?",
    a: "Obuna sahifasidan platforma kartalariga to'lov o'tkazib, chekni yuklaysiz. Admin tasdiqlagach kurslar darhol ochiladi.",
  },
  {
    q: "Video darslarni yuklab olsa bo'ladimi?",
    a: "Yo'q. Mualliflik huquqlarini himoya qilish maqsadida darslar faqat platforma orqali ko'riladi.",
  },
  {
    q: "Qiynalgan joyimda yordam beriladimi?",
    a: "Albatta. Yopiq Telegram guruhlarda savollaringizga javob beriladi, qiyin mavzular esa jonli onlayn uchrashuvlarda birga tahlil qilinadi.",
  },
  {
    q: "Qanday qurilmalarda ishlaydi?",
    a: "OnlineTalim telefon, planshet va kompyuterda — istalgan zamonaviy brauzerda muammosiz ishlaydi.",
  },
];

const STATS = [
  { value: "500+", label: "Video dars" },
  { value: "20+", label: "Kurs yo'nalishi" },
  { value: "7 kun", label: "Bepul sinov" },
  { value: "24/7", label: "Qo'llab-quvvatlash" },
];

function Index() {
  return (
    <div className="landing-root dark relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ============================== NAV ============================== */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[oklch(0.15_0.04_245_/_0.72)] backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-accent)] text-[oklch(0.15_0.05_245)] shadow-[0_6px_20px_-6px_oklch(0.7_0.12_195_/_0.7)]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight">OnlineTalim</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Imkoniyatlar
            </a>
            <a href="#how" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Qanday ishlaydi
            </a>
            <a href="#pricing" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Narxlar
            </a>
            <a href="#faq" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              Savollar
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white">
              <Link to="/auth/login">Kirish</Link>
            </Button>
            <Button asChild className="lc-btn-glow border-0 text-[oklch(0.15_0.05_245)]">
              <Link to="/auth/register">Boshlash</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ============================== HERO ============================== */}
      <section className="relative isolate overflow-hidden">
        <div className="landing-aurora" aria-hidden="true" />
        <div className="landing-grid" aria-hidden="true" />

        <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          {/* copy */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.12_195)]" />
              Yangi avlod onlayn ta'lim platformasi
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Bilimga <span className="text-gradient">cheksiz</span> yo'l —
              <br />
              bir joyda.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              Professional video darslar, amaliy testlar va jonli mentorlik. 7 kun bepul sinab
              ko'ring — keyin <span className="font-semibold text-white">bitta tarif</span> bilan
              platformadagi barcha kurslarni oching.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="lc-btn-glow group h-12 border-0 px-6 text-base text-[oklch(0.15_0.05_245)]"
              >
                <Link to="/auth/register">
                  7 kun bepul boshlash
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/5 px-6 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                <Link to="/app">Demo ko'rish</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-white/60">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-[image:var(--gradient-primary)] text-[10px] font-semibold text-white"
                  >
                    {["A", "M", "S", "D"][i]}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[oklch(0.82_0.14_85)] text-[oklch(0.82_0.14_85)]" />
                  ))}
                </span>
                <span>Minglab o'quvchilar ishonchi</span>
              </div>
            </div>
          </div>

          {/* 3D visual */}
          <div className="relative h-[420px] w-full sm:h-[480px] lg:h-[560px]">
            <HeroVisual />
          </div>
        </div>

        {/* stats strip */}
        <div className="container relative z-10 mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[oklch(0.17_0.04_245_/_0.4)] px-6 py-6 text-center">
                <div className="font-display text-3xl font-bold text-gradient">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURES ============================ */}
      <section id="features" className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionTag>Imkoniyatlar</SectionTag>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Nima uchun <span className="text-gradient">OnlineTalim?</span>
            </h2>
            <p className="mt-4 text-lg text-white/60">Bilim olishning eng qulay va samarali yo'li.</p>
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <article className="lc-card lc-tilt group h-full p-6">
                  <div className="lc-icon mb-5">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== HOW IT WORKS ========================== */}
      <section id="how" className="relative overflow-hidden border-t border-white/5 py-24">
        <div className="landing-soft-glow" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionTag>Qanday ishlaydi</SectionTag>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              To'rt qadamda <span className="text-gradient">boshlang</span>
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Sinab ko'ring, yoqsa — qoling. Hammasi shunchaki oson.
            </p>
          </Reveal>

          <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="lc-card h-full p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="lc-icon">
                      <s.icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-5xl font-bold leading-none text-white/10">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== TRIAL BANNER ========================== */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="lc-trial relative overflow-hidden rounded-3xl p-8 md:p-12">
              <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    <Clock className="h-3.5 w-3.5" />
                    Bepul sinov muddati
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
                    7 kun. To'liq bepul.
                  </h3>
                  <p className="mt-2 text-white/75">
                    Karta talab qilinmaydi. Ro'yxatdan o'ting, sinab ko'ring va o'zingiz qaror qiling.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="h-12 shrink-0 border-0 bg-white px-7 text-base font-semibold text-[oklch(0.2_0.06_245)] hover:bg-white/90"
                >
                  <Link to="/auth/register">
                    Hozir boshlash <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ COMMUNITY =========================== */}
      <section className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionTag>Jamoa va qo'llab-quvvatlash</SectionTag>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Yolg'iz emassiz
            </h2>
            <p className="mt-4 text-lg text-white/60">
              O'rganish jarayonida doimo yoningizdamiz — jonli muloqot va jonli darslar bilan.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {COMMUNITY.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <article className="lc-card lc-tilt h-full p-7">
                  <div className="lc-icon lc-icon-lg mb-5">
                    <c.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{c.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= PRICING ============================ */}
      <section id="pricing" className="relative overflow-hidden border-t border-white/5 py-24">
        <div className="landing-soft-glow landing-soft-glow-right" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionTag>Narxlar</SectionTag>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Bitta tarif — <span className="text-gradient">barcha kurslar</span>
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Murakkab rejalar yo'q. Bitta narx — to'liq platforma.
            </p>
          </Reveal>

          <Reveal className="mx-auto mt-14 max-w-md">
            <div className="lc-price relative overflow-hidden rounded-3xl p-8">
              <div className="absolute right-5 top-5 rounded-full border border-[oklch(0.82_0.12_195_/_0.4)] bg-[oklch(0.82_0.12_195_/_0.12)] px-3 py-1 text-xs font-semibold text-[oklch(0.85_0.12_195)]">
                Eng ommabop
              </div>
              <div className="text-sm font-semibold uppercase tracking-wider text-[oklch(0.82_0.12_195)]">
                Standart obuna
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-5xl font-bold text-white">299 000</span>
                <span className="pb-1.5 text-white/55">so'm / oy</span>
              </div>
              <p className="mt-2 text-sm text-white/55">Avval 7 kun bepul — keyin to'lov.</p>

              <ul className="mt-8 space-y-3">
                {PLAN_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[oklch(0.7_0.15_155)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="lc-btn-glow mt-8 h-12 w-full border-0 text-base text-[oklch(0.15_0.05_245)]"
              >
                <Link to="/auth/register">Bepul sinovni boshlash</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =============================== FAQ ============================== */}
      <section id="faq" className="relative border-t border-white/5 py-24">
        <div className="container mx-auto px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
              <HelpCircle className="h-3.5 w-3.5" />
              Tez-tez beriladigan savollar
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Savollaringiz bormi?
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Eng ko'p so'raladigan savollarga javoblar shu yerda.
            </p>
          </Reveal>

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="lc-card overflow-hidden border-white/10 px-5 data-[state=open]:border-[oklch(0.6_0.13_215_/_0.5)]"
                >
                  <AccordionTrigger className="py-5 text-left font-display text-base font-semibold text-white hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-white/65">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ============================ FINAL CTA =========================== */}
      <section className="relative overflow-hidden py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="lc-finalcta relative overflow-hidden rounded-[2rem] px-6 py-16 text-center md:py-20">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Bugun boshlang.
                  <br />
                  Birinchi 7 kun <span className="text-gradient">bizdan.</span>
                </h2>
                <p className="mt-5 text-lg text-white/70">
                  Ro'yxatdan o'ting, darsliklarni sinab ko'ring va o'zingizga ishonch hosil qiling.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="lc-btn-glow h-12 border-0 px-7 text-base text-[oklch(0.15_0.05_245)]"
                  >
                    <Link to="/auth/register">
                      Bepul ro'yxatdan o'tish <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/20 bg-white/5 px-7 text-base text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/auth/login">Akkountga kirish</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== FOOTER ============================= */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-accent)] text-[oklch(0.15_0.05_245)]">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold">OnlineTalim</span>
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-white/60">
              <a href="#features" className="hover:text-white">Imkoniyatlar</a>
              <a href="#how" className="hover:text-white">Qanday ishlaydi</a>
              <a href="#pricing" className="hover:text-white">Narxlar</a>
              <a href="#faq" className="hover:text-white">Savollar</a>
              <Link to="/auth/login" className="hover:text-white">Kirish</Link>
            </nav>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-white/45">
            © 2026 OnlineTalim. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.6_0.13_215_/_0.35)] bg-[oklch(0.6_0.13_215_/_0.1)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[oklch(0.82_0.12_195)]">
      {children}
    </span>
  );
}
