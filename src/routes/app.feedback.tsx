import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageSquare, Lightbulb, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const { user } = useAuth();
  const [type, setType] = useState("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase.from("feedback").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setHistory(data ?? []);
  };
  useEffect(() => { loadHistory(); }, [user?.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({
      user_id: user.id, type: type as any, subject, message,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Murojaatingiz yuborildi!");
    setSubject(""); setMessage("");
    loadHistory();
  };

  return (
    <>
      <Topbar title="Takliflar va murojaatlar" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: Lightbulb, label: "Taklif", desc: "Platformani yaxshilash bo'yicha g'oyalaringiz" },
            { icon: MessageSquare, label: "Fikr-mulohaza", desc: "Kurs yoki dars haqida fikringiz" },
            { icon: AlertCircle, label: "Shikoyat", desc: "Texnik muammo yoki noqulaylik" },
          ].map((c) => (
            <Card key={c.label}>
              <CardContent className="p-5">
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
                <div className="font-display font-semibold">{c.label}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="font-display">Murojaat yuborish</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label>Turi</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suggestion">Taklif</SelectItem>
                    <SelectItem value="feedback">Fikr-mulohaza</SelectItem>
                    <SelectItem value="complaint">Shikoyat</SelectItem>
                    <SelectItem value="question">Savol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Mavzu</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Qisqacha mavzu" required /></div>
              <div className="space-y-2"><Label>Xabar</Label><Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Murojaatingizni batafsil yozing..." required /></div>
              <Button type="submit" size="lg" disabled={loading}>{loading ? "Yuborilmoqda..." : "Yuborish"}</Button>
            </form>

            {history.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="font-display font-semibold">Oldingi murojaatlaringiz</h3>
                {history.map((f) => (
                  <div key={f.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{f.type}</Badge>
                      <span className="font-medium">{f.subject}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{f.message}</p>
                    {f.admin_reply && (
                      <div className="mt-3 rounded-md bg-primary/5 p-3 text-sm">
                        <div className="mb-1 text-xs font-semibold text-primary">Admin javobi:</div>
                        {f.admin_reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}