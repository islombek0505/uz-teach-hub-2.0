import { createFileRoute, Link } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminStats, progressChart, mockPayments, mockFeedback, formatPrice } from "@/lib/mock-data";
import { Users, CreditCard, DollarSign, BookOpen, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = [
    { label: "Jami o'quvchilar", value: adminStats.totalStudents, icon: Users, color: "text-primary bg-primary/10", trend: "+12%" },
    { label: "Faol obunalar", value: adminStats.activeSubscriptions, icon: CreditCard, color: "text-success bg-success/15", trend: "+8%" },
    { label: "Oylik daromad", value: formatPrice(adminStats.monthlyRevenue), icon: DollarSign, color: "text-warning bg-warning/15", trend: "+17%" },
    { label: "Kurslar", value: adminStats.totalCourses, icon: BookOpen, color: "text-accent-foreground bg-accent/40", trend: `${adminStats.totalLessons} dars` },
  ];
  const pending = mockPayments.filter(p => p.status === "pending");
  const unread = mockFeedback.filter(f => !f.read);

  return (
    <>
      <Topbar title="Admin Dashboard" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className={`grid h-11 w-11 place-items-center rounded-lg ${s.color}`}><s.icon className="h-5 w-5" /></div>
                  <Badge variant="outline" className="text-xs">{s.trend}</Badge>
                </div>
                <div className="mt-4 font-display text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="font-display flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Daromad va o'sish</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={progressChart}>
                    <defs>
                      <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="students" stroke="var(--primary)" fill="url(#r)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-display text-base">Tasdiqlash kutilmoqda</CardTitle>
                <Badge variant="destructive">{pending.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {pending.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium">{p.studentName}</div>
                      <div className="text-xs text-muted-foreground">{formatPrice(p.amount)}</div>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full"><Link to="/admin/payments">Hammasi</Link></Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="font-display text-base">Yangi murojaatlar</CardTitle>
                <Badge>{unread.length}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {unread.map((f) => (
                  <div key={f.id} className="rounded-lg border p-3">
                    <div className="text-sm font-medium">{f.studentName}</div>
                    <div className="truncate text-xs text-muted-foreground">{f.subject}</div>
                  </div>
                ))}
                <Button asChild variant="outline" size="sm" className="w-full"><Link to="/admin/feedback">Hammasi</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}