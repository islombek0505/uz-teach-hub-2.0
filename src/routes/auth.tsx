import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { GraduationCap, PlayCircle, ShieldCheck, Award, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

const FEATURES = [
  { icon: PlayCircle, title: "HD video darslar", desc: "Adaptiv sifat, uzluksiz oqim" },
  { icon: Award, title: "Testlar va sertifikat", desc: "Har dars yakunida amaliy test" },
  { icon: ShieldCheck, title: "Himoyalangan kontent", desc: "Materiallar faqat siz uchun" },
];

function AuthLayout() {
  return (
    <div className="auth-bg grid min-h-screen place-items-center p-4 sm:p-6">
      {/* Decorative drifting orbs */}
      <div
        className="auth-orb animate-float-a"
        style={{
          width: 340,
          height: 340,
          top: "-4rem",
          left: "-3rem",
          background: "oklch(0.7 0.12 195 / 0.6)",
        }}
        aria-hidden
      />
      <div
        className="auth-orb animate-float-b"
        style={{
          width: 300,
          height: 300,
          bottom: "-5rem",
          right: "-3rem",
          background: "oklch(0.55 0.13 220 / 0.6)",
        }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-4xl">
        <div className="glass-strong grid overflow-hidden rounded-[1.75rem] border-white/30 shadow-2xl lg:grid-cols-[0.82fr_1fr]">
          {/* Brand showcase (desktop only) */}
          <aside
            className="relative hidden flex-col justify-between overflow-hidden p-9 text-white lg:flex"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-[oklch(0.78_0.1_195/0.3)] blur-2xl"
              aria-hidden
            />

            <Link to="/" className="relative flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">OnlineTalim</span>
            </Link>

            <div className="relative">
              <h2 className="font-display text-[1.7rem] font-bold leading-tight">
                Bilim sari eng qulay yo‘l
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Bir martalik obuna bilan barcha kurslar, video darslar va testlarga to‘liq ruxsat.
              </p>

              <ul className="mt-7 space-y-4">
                {FEATURES.map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/12 backdrop-blur-sm ring-1 ring-white/15">
                      <f.icon className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{f.title}</div>
                      <div className="text-xs text-white/60">{f.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex gap-6 border-t border-white/15 pt-5 text-xs text-white/65">
              <div>
                <span className="font-display text-xl font-bold text-white">287+</span>
                <br />
                o‘quvchi
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">60+</span>
                <br />
                darslik
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white">3+</span>
                <br />
                kurslar
              </div>
            </div>
          </aside>

          {/* Form pane */}
          <div className="p-6 sm:p-9 lg:p-10">
            {/* Compact brand header on mobile */}
            <Link to="/" className="mb-7 flex items-center gap-2.5 lg:hidden">
              <div
                className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm"
                style={{ background: "var(--gradient-accent)" }}
              >
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">OnlineTalim</span>
            </Link>

            <Outlet />
          </div>
        </div>

        <Link
          to="/"
          className="mx-auto mt-5 flex w-fit items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
