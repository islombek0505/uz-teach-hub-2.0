import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Phone, Lock } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tizimga kirildi!");
    setTimeout(() => navigate({ to: "/app" }), 600);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Xush kelibsiz!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Telefon raqam va parol bilan kiring</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon raqam</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="phone" type="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" required />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Parol</Label>
            <Link to="/auth/login" className="text-xs text-primary hover:underline">Parolni unutdingizmi?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg">Kirish</Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hisobingiz yo'qmi?{" "}
        <Link to="/auth/register" className="font-medium text-primary hover:underline">Ro'yxatdan o'tish</Link>
      </p>

      <div className="mt-8 rounded-lg border border-dashed bg-muted/40 p-3 text-xs text-muted-foreground">
        <strong>Demo:</strong> O'quvchi sifatida — istalgan ma'lumot kiriting,{" "}
        <Link to="/admin" className="font-medium text-primary underline">admin paneli</Link>
      </div>
    </div>
  );
}