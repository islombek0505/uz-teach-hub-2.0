import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Phone, Lock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { phoneToEmail } from "@/lib/auth";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

type Step = "info" | "otp" | "password";

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const sendSms = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D+/g, "");
    if (!digits.startsWith("998") || digits.length !== 12) {
      return toast.error("+998 bilan boshlanadigan 12 raqamli telefon kiriting");
    }
    // TODO(Eskiz): real SMS yuborish. Hozir har qanday 6 raqam qabul qilinadi.
    toast.success("SMS kod yuborildi (demo: istalgan 6 raqam)");
    setStep("otp");
  };
  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("6 xonali kod kiriting");
    if (!/^\d{6}$/.test(otp)) return toast.error("Faqat raqam kiriting");
    toast.success("Kod tasdiqlandi");
    setStep("password");
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
        toast.error(error.message.includes("registered") ? "Bu raqam allaqachon ro'yxatdan o'tgan" : error.message);
        return;
      }
      // Auto sign-in (email confirm o'chirilgan)
      await supabase.auth.signInWithPassword({ email, password });
      toast.success("Ro'yxatdan o'tdingiz!");
      navigate({ to: "/app" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-1 text-xs">
        {(["info", "otp", "password"] as Step[]).map((s, i) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${["info","otp","password"].indexOf(step) >= i ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        {step === "info" && "Ro'yxatdan o'tish"}
        {step === "otp" && "Telefonni tasdiqlang"}
        {step === "password" && "Parol o'rnatish"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {step === "info" && "Birinchi marta ro'yxatdan o'tyapsiz — SMS kod yuboriladi"}
        {step === "otp" && `${phone} raqamiga yuborilgan 6 xonali kodni kiriting`}
        {step === "password" && "O'zingiz uchun ishonchli parol o'ylang"}
      </p>

      {step === "info" && (
        <form onSubmit={sendSms} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ism Familiya</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" placeholder="Akmal Yusupov" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon raqam</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" type="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg">SMS kod yuborish</Button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="mt-8 space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full" size="lg">Tasdiqlash</Button>
          <button type="button" onClick={() => setStep("info")} className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Raqamni o'zgartirish
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={finish} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Yangi parol</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" placeholder="kamida 8 ta belgi" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={8} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Parolni tasdiqlang</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10" required />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Yaratilmoqda..." : "Hisobni yaratish"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz bormi?{" "}
        <Link to="/auth/login" className="font-medium text-primary hover:underline">Kirish</Link>
      </p>
    </div>
  );
}