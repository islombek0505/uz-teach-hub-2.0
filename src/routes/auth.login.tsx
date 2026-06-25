import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Phone, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { phoneToEmail } from "@/lib/auth";
import { requestPasswordReset, confirmPasswordReset } from "@/lib/password-reset.functions";
import { seo } from "@/lib/seo";
import { AuthField, PasswordField, otpSlotClass } from "@/components/auth/auth-ui";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  head: () =>
    seo({
      title: "Kirish",
      description: "OnlineTalim hisobingizga kiring — onlayn video kurslar, darslar va testlar.",
      path: "/auth/login",
    }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = phoneToEmail(phone);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        toast.error("Telefon yoki parol noto'g'ri");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      toast.success("Tizimga kirildi!");
      navigate({ to: isAdmin ? "/admin" : "/app" });
    } finally {
      setLoading(false);
    }
  };

  if (mode === "reset") {
    return <ResetPasswordFlow initialPhone={phone} onBack={() => setMode("login")} />;
  }

  return (
    <div className="animate-fade-rise">
      <h1 className="font-display text-3xl font-bold tracking-tight">Xush kelibsiz!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Davom etish uchun telefon raqam va parolingiz bilan kiring.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4">
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/90">Parol</span>
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Parolni unutdingizmi?
            </button>
          </div>
          <PasswordField
            id="password"
            icon={Lock}
            aria-label="Parol"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
        >
          {loading ? (
            "Kiritilmoqda..."
          ) : (
            <>
              Kirish <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz yo'qmi?{" "}
        <Link to="/auth/register" className="font-semibold text-primary hover:underline">
          Ro'yxatdan o'tish
        </Link>
      </p>

      <div className="mt-7 flex items-start gap-2.5 rounded-xl border border-white/30 bg-white/30 p-3 text-xs text-muted-foreground backdrop-blur-sm dark:bg-white/5">
        <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>
          Telefon raqamingiz <strong className="text-foreground/80">+998</strong> bilan boshlanishi
          shart. Raqamlardan tashqari belgilar e'tiborga olinmaydi.
        </span>
      </div>
    </div>
  );
}

function ResetPasswordFlow({ initialPhone, onBack }: { initialPhone: string; onBack: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const requestReset = useServerFn(requestPasswordReset);
  const confirmReset = useServerFn(confirmPasswordReset);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D+/g, "");
    if (!digits.startsWith("998") || digits.length !== 12) {
      return toast.error("+998 bilan boshlanadigan 12 raqamli telefon kiriting");
    }
    setLoading(true);
    try {
      await requestReset({ data: { phone } });
      toast.success("Agar raqam ro'yxatdan o'tgan bo'lsa, Telegramga kod yuborildi");
      setStep("code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kod yuborib bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return toast.error("6 xonali kodni kiriting");
    if (password.length < 8) return toast.error("Parol kamida 8 ta belgi bo'lsin");
    if (password !== confirm) return toast.error("Parollar mos kelmadi");
    setLoading(true);
    try {
      await confirmReset({ data: { phone, code, newPassword: password } });
      const email = phoneToEmail(phone);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      toast.success("Parol yangilandi!");
      if (error || !data.user) {
        onBack();
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const isAdmin = (roles ?? []).some((r) => r.role === "admin");
      navigate({ to: isAdmin ? "/admin" : "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Parolni tiklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-rise">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kirishga qaytish
      </button>
      <h1 className="font-display text-3xl font-bold tracking-tight">Parolni tiklash</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {step === "phone"
          ? "Raqamingizni kiriting — Telegramga tasdiqlash kodi yuboriladi."
          : `${phone} raqamidagi Telegramga yuborilgan kodni kiriting va yangi parol o'rnating.`}
      </p>

      {step === "phone" ? (
        <form onSubmit={sendCode} className="mt-7 space-y-4">
          <AuthField
            id="reset-phone"
            label="Telefon raqam"
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
          >
            {loading ? "Yuborilmoqda..." : "Kod yuborish"}
          </button>
        </form>
      ) : (
        <form onSubmit={doReset} className="mt-7 space-y-5">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} className={otpSlotClass} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <PasswordField
            id="reset-password"
            label="Yangi parol"
            icon={Lock}
            placeholder="kamida 8 ta belgi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <PasswordField
            id="reset-confirm"
            label="Parolni tasdiqlang"
            icon={Lock}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none"
          >
            {loading ? "Saqlanmoqda..." : "Parolni yangilash"}
          </button>
          <button
            type="button"
            onClick={() => setStep("phone")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <ArrowLeft className="h-3 w-3" /> Raqamni o'zgartirish
          </button>
        </form>
      )}
    </div>
  );
}
