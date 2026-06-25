import Link from "next/link"
import type { Metadata } from "next"
import {
  GraduationCap,
  PlayCircle,
  Shield,
  Award,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buildMetadata } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  path: "/",
  description:
    "OnlineTalim — professional onlayn kurslar platformasi. Video darslar, interaktiv testlar va sertifikatlar. Oylik obuna asosida istalgan vaqtda o'rganing.",
})

const features = [
  { icon: PlayCircle, title: "HD Video Darslar", desc: "Adaptiv sifat, internet trafikni tejaydi" },
  { icon: Shield, title: "Himoyalangan Kontent", desc: "Materiallarni yuklab olish imkoni yo'q" },
  { icon: Award, title: "Testlar va Sertifikat", desc: "Har bir dars yakunida amaliy test" },
  { icon: Smartphone, title: "Istalgan Qurilmada", desc: "Telefon, planshet, kompyuter" },
  { icon: CheckCircle2, title: "Taraqqiyot Kuzatuvi", desc: "Har bir modul bo'yicha statistika" },
  { icon: Sparkles, title: "Doimiy Yangilanish", desc: "Yangi kurslar har oy qo'shiladi" },
]

const faq = [
  { q: "Obuna qanday ishlaydi?", a: "Oylik obuna sotib olganingizdan so'ng platformadagi barcha kurslarga to'liq ruxsat olasiz. Obuna muddati tugagach uni yangilashingiz mumkin." },
  { q: "To'lovni qanday amalga oshiraman?", a: "Ro'yxatdan o'tib, obuna sahifasidan platforma kartalariga to'lov o'tkazasiz va chekni yuklab yuborasiz. Admin tasdiqlagandan keyin kurs ochiladi." },
  { q: "Video darslarni yuklab olsa bo'ladimi?", a: "Yo'q. Mualliflik huquqlarini himoya qilish maqsadida darslar faqat platforma orqali ko'riladi." },
  { q: "Sertifikat beriladimi?", a: "Ha, kursni to'liq tugatib testlardan o'tgan o'quvchilarga raqamli sertifikat beriladi." },
  { q: "Qanday qurilmalarda ishlaydi?", a: "OnlineTalim telefon, planshet va kompyuterda — istalgan zamonaviy brauzerda muammosiz ishlaydi." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-xl font-bold">OnlineTalim</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">Imkoniyatlar</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">Narxlar</a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">Savollar</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Kirish</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Boshlash</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="size-3.5" /> Yangi avlod online ta'lim
            </div>
            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Bilimga to'la yo'l, <span className="opacity-80">bir joyda</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              Professional video darslar, amaliy testlar va shaxsiy taraqqiyot kuzatuvi. Bir martalik
              obuna bilan barcha kurslarga ruxsat.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/auth/register">
                  Bepul ro'yxatdan o'tish <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/auth/login">Kirish</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">Nima uchun OnlineTalim?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Bilim olishning eng qulay va samarali yo'li</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border/50 p-6 transition-all hover:shadow-md">
              <div className="mb-4 grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Oddiy narxlar</h2>
            <p className="mt-4 text-lg text-muted-foreground">Bir tarif — barcha kurslar uchun to'liq ruxsat</p>
          </div>
          <div className="mx-auto mt-12 max-w-md">
            <Card className="overflow-hidden border-2 border-primary/20 p-8 shadow-md">
              <div className="text-center">
                <div className="text-sm font-medium uppercase tracking-wider text-primary">Standart obuna</div>
                <div className="mt-4">
                  <span className="text-6xl font-bold">299 000</span>
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
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-8 w-full">
                <Link href="/auth/register">Hozir boshlash</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight">Savollaringiz bormi?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Eng ko'p so'raladigan savollarga javoblarni shu yerdan topasiz
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {faq.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border/60 bg-card px-5"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="border-t bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OnlineTalim. Barcha huquqlar himoyalangan.
        </div>
      </footer>
    </div>
  )
}
