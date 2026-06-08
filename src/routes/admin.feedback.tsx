import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockFeedback } from "@/lib/mock-data";
import { Reply, Trash2, MessageSquare, Lightbulb, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedback,
});

const typeMeta = {
  suggestion: { icon: Lightbulb, label: "Taklif", color: "bg-warning/15 text-warning-foreground" },
  feedback: { icon: MessageSquare, label: "Fikr", color: "bg-primary/10 text-primary" },
  complaint: { icon: AlertCircle, label: "Shikoyat", color: "bg-destructive/10 text-destructive" },
} as const;

function AdminFeedback() {
  return (
    <>
      <Topbar title="Murojaatlar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Jami</div><div className="mt-1 font-display text-2xl font-bold">{mockFeedback.length}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">O'qilmagan</div><div className="mt-1 font-display text-2xl font-bold text-primary">{mockFeedback.filter(f => !f.read).length}</div></CardContent></Card>
          <Card><CardContent className="p-5"><div className="text-xs uppercase text-muted-foreground">Shikoyatlar</div><div className="mt-1 font-display text-2xl font-bold text-destructive">{mockFeedback.filter(f => f.type === "complaint").length}</div></CardContent></Card>
        </div>

        <div className="space-y-3">
          {mockFeedback.map((f) => {
            const meta = typeMeta[f.type as keyof typeof typeMeta];
            return (
              <Card key={f.id} className={!f.read ? "border-primary/40 bg-primary/5" : ""}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg ${meta.color}`}><meta.icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-display font-semibold">{f.studentName}</div>
                        <Badge variant="outline">{meta.label}</Badge>
                        {!f.read && <Badge>Yangi</Badge>}
                        <span className="ml-auto text-xs text-muted-foreground">{f.date}</span>
                      </div>
                      <div className="mt-1 font-medium">{f.subject}</div>
                      <p className="mt-2 text-sm text-muted-foreground">{f.message}</p>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.success("Javob yuborildi")}><Reply className="mr-1 h-3.5 w-3.5" /> Javob berish</Button>
                        <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="mr-1 h-3.5 w-3.5" /> O'chirish</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}