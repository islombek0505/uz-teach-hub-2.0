import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Phone, Lock, User, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { phoneToEmail } from "@/lib/auth";
import { sendOtp, checkOtp } from "@/lib/verify.functions";
import { seo } from "@/lib/seo";
import { AuthField, PasswordField, otpSlotClass } from "@/components/auth/auth-ui";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  head: () =>
    seo({
      title: "Ro‘yxatdan o‘tish",
      description:
        "OnlineTalim'da bepul ro‘yxatdan o‘ting va onlayn video kurslarni boshlang. 1 haftalik bepul sinov.",
      path: "/auth/register",
    }),
});

type Step = "info" | "otp" | "password";
const STEPS: { key: Step; label: string }[] = [
  { key: "info", label: "Ma'lumot" },
  { key: "otp", label: "Tasdiqlash" },
  { key: "password", label: "Parol" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const requestOtp = useServerFn(sendOtp);
  const confirmOtp = useServerFn(checkOtp);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const sendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D+/g, "");
    if (!digits.startsWith("998") || digits.length !== 12) {
      return toast.error("+998 bilan boshlanadigan 12 raqamli telefon kiriting");
    }
    setLoading(true);
    try {
      await requestOtp({ data: { phone } });
      toast.success("Tasdiqlash kodi Telegramga yuborildi");
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kod yuborib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return toast.error("6 xonali kod kiriting");
    setLoading(true);
    try {
      const { verified } = await confirmOtp({ data: { phone, code: otp } });
      if (!verified) {
        toast.error("Kod noto'g'ri");
        return;
      }
      toast.success("Kod tasdiqlandi");
      setStep("password");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tasdiqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };
  const finish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Parol kamida 8 ta belgi bo'lsin");
    if (password !== confirm) return toast.error("Parollar mos kelmadi");
    setLoading(true);
    try {
      const email = phoneToEmail(phone);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: { full_name: name, phone: phone.replace(/\D+/g, "") },
        },
      });
      if (error) {
        toast.error(
          error.message.includes("registered")
            ? "Bu raqam allaqachon ro'yxatdan o'tgan"
            : error.message,
        );
        return;
      }
      await supabase.auth.signInWithPassword({ email, password });
      toast.success("Ro'yxatdan o'tdingiz!");
      navigate({ to: "/app" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-rise">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s.key} className="flex flex-1 items-center gap-2">
              <div
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-success text-success-foreground"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/10 text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={`hidden text-xs font-medium sm:inline ${active || done ? "text-foreground/80" : "text-muted-foreground"}`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-colors ${done ? "bg-success" : "bg-foreground/10"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
        {step === "info" && "Hisob yaratish"}
        {step === "otp" && "Telefonni tasdiqlang"}
        {step === "password" && "Parol o'rnatish"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {step === "info" &&
          "Birinchi marta ro'yxatdan o'tyapsiz - Telegram orqali tasdiqlash kodi yuboriladi."}
        {step === "otp" && `${phone} raqamidagi Telegramga yuborilgan 6 xonali kodni kiriting.`}
        {step === "password" && "O'zingiz uchun ishonchli parol o'ylang."}
      </p>

      {step === "info" && (
        <form onSubmit={sendSms} className="mt-7 space-y-4">
          <AuthField
            id="name"
            label="Ism Familiya"
            icon={User}
            autoComplete="name"
            placeholder="Akmal Yusupov"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <AuthField
            id="phone"
            label="Telefon raqam"
            icon={Phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
          >
            {loading ? (
              "Yuborilmoqda..."
            ) : (
              <>
                Telegramga kod yuborish <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="mt-7 space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className={otpSlotClass} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
          >
            {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
          </button>
          <button
            type="button"
            onClick={() => setStep("info")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <ArrowLeft className="h-3 w-3" /> Raqamni o'zgartirish
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={finish} className="mt-7 space-y-4">
          <PasswordField
            id="password"
            label="Yangi parol"
            icon={Lock}
            autoComplete="new-password"
            placeholder="kamida 8 ta belgi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <PasswordField
            id="confirm"
            label="Parolni tasdiqlang"
            icon={Lock}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
          >
            {loading ? "Yaratilmoqda..." : "Hisobni yaratish"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Kirish
        </Link>
      </p>
    </div>
  );
}
