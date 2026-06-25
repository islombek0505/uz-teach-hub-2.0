import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  MessageSquare,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  Send,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/feedback")({
  component: FeedbackPage,
});

const TYPES: {
  value: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tint: string;
  chip: string;
}[] = [
  {
    value: "suggestion",
    label: "Taklif",
    desc: "Platformani yaxshilash g'oyasi",
    icon: Lightbulb,
    tint: "text-warning",
    chip: "bg-warning/15",
  },
  {
    value: "feedback",
    label: "Fikr-mulohaza",
    desc: "Kurs yoki dars haqida fikr",
    icon: MessageSquare,
    tint: "text-primary",
    chip: "bg-primary/10",
  },
  {
    value: "complaint",
    label: "Shikoyat",
    desc: "Texnik muammo yoki noqulaylik",
    icon: AlertCircle,
    tint: "text-destructive",
    chip: "bg-destructive/10",
  },
  {
    value: "question",
    label: "Savol",
    desc: "Bizga savolingiz bormi?",
    icon: HelpCircle,
    tint: "text-success",
    chip: "bg-success/15",
  },
];

function FeedbackPage() {
  const { user } = useAuth();
  const [type, setType] = useState("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setHistory(data ?? []);
  };
  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id,
      type: type as any,
      subject,
      message,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Murojaatingiz yuborildi!");
    setSubject("");
    setMessage("");
    loadHistory();
  };

  const typeLabel = (v: string) => TYPES.find((t) => t.value === v)?.label ?? v;

  return (
    <>
      <Topbar title="Takliflar va murojaatlar" />
      <main className="animate-fade-rise flex-1 space-y-6 p-4 lg:p-6">
        <PageHeader
          icon={MessageSquare}
          title="Takliflar va murojaatlar"
          subtitle="Fikringiz biz uchun muhim — turini tanlang va yozing"
        />

        {/* Type selector */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border/60 bg-card hover:shadow-sm"
                }`}
              >
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl ${t.chip}`}>
                  <t.icon className={`h-5 w-5 ${t.tint}`} />
                </div>
                <div className="font-display font-semibold">{t.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{t.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <Card className="glass rounded-2xl border-transparent lg:col-span-3">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Murojaat yuborish</h3>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Mavzu</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Qisqacha mavzu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Xabar</Label>
                  <Textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Murojaatingizni batafsil yozing..."
                    required
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? (
                    "Yuborilmoqda..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Yuborish
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="glass rounded-2xl border-transparent lg:col-span-2">
            <CardContent className="p-5 lg:p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Murojaatlar tarixi</h3>
              {history.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Hali murojaat yubormagansiz.
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((f) => (
                    <div key={f.id} className="rounded-xl border border-border/60 p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {typeLabel(f.type)}
                        </Badge>
                        <span className="truncate font-medium">{f.subject}</span>
                        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                          {new Date(f.created_at).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{f.message}</p>
                      {f.admin_reply && (
                        <div className="mt-3 rounded-lg border-l-2 border-primary bg-primary/5 p-3 text-sm">
                          <div className="mb-1 text-xs font-semibold text-primary">
                            Admin javobi
                          </div>
                          {f.admin_reply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
