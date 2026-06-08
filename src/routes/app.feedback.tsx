import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageSquare, Lightbulb, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/app/feedback")({
  component: FeedbackPage,
});

function FeedbackPage() {
  const [type, setType] = useState("suggestion");
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Murojaatingiz yuborildi! Tez orada javob beramiz."); };

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
              <div className="space-y-2"><Label>Mavzu</Label><Input placeholder="Qisqacha mavzu" required /></div>
              <div className="space-y-2"><Label>Xabar</Label><Textarea rows={6} placeholder="Murojaatingizni batafsil yozing..." required /></div>
              <Button type="submit" size="lg">Yuborish</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}