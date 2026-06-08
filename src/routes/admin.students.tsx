import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents } from "@/lib/mock-data";
import { Search, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

function AdminStudents() {
  const statusMap = {
    active: { label: "Faol", className: "bg-success text-success-foreground" },
    expired: { label: "Tugagan", className: "bg-destructive text-destructive-foreground" },
    pending: { label: "Kutilmoqda", className: "bg-warning text-warning-foreground" },
  } as const;

  return (
    <>
      <Topbar title="O'quvchilar" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Barcha o'quvchilar</h2>
            <p className="text-sm text-muted-foreground">{mockStudents.length} ta ro'yxatdan o'tgan</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Ism yoki telefon bo'yicha..." className="pl-9" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Faol kurs</TableHead>
                  <TableHead className="w-48">Taraqqiyot</TableHead>
                  <TableHead>Obuna</TableHead>
                  <TableHead>Tugaydi</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((s) => {
                  const status = statusMap[s.subscriptionStatus as keyof typeof statusMap];
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary text-primary-foreground text-xs">{s.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                          <div>
                            <div className="font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.phone}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.activeCourse}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2"><Progress value={s.progress} className="flex-1" /><span className="text-xs text-muted-foreground w-9 text-right">{s.progress}%</span></div>
                      </TableCell>
                      <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                      <TableCell className="text-sm">{s.subscriptionEnd}</TableCell>
                      <TableCell><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}