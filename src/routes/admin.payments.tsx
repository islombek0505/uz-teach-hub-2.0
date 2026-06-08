import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Topbar } from "@/components/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mockPayments, formatPrice } from "@/lib/mock-data";
import { Plus, CheckCircle2, X, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

function AdminPayments() {
  const [filter, setFilter] = useState<string>("all");
  const list = filter === "all" ? mockPayments : mockPayments.filter(p => p.status === filter);

  return (
    <>
      <Topbar title="To'lovlar boshqaruvi" initials="AD" />
      <main className="flex-1 space-y-6 p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">Hammasi</TabsTrigger>
              <TabsTrigger value="pending">Kutilmoqda</TabsTrigger>
              <TabsTrigger value="approved">Tasdiqlangan</TabsTrigger>
              <TabsTrigger value="expired">Tugagan</TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Yangi to'lov</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Qo'lda to'lov qo'shish</DialogTitle>
                <DialogDescription>O'quvchidan kelgan to'lovni ro'yxatdan o'tkazing va tasdiqlang</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>O'quvchi (telefon)</Label><Input placeholder="+998 90 123 45 67" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>Summa (so'm)</Label><Input type="number" defaultValue={299000} /></div>
                  <div className="space-y-2"><Label>To'lov usuli</Label><Input placeholder="Humo / Uzcard" /></div>
                </div>
                <div className="space-y-2"><Label>Sana</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Eslatma (ixtiyoriy)</Label><Textarea rows={3} placeholder="Telegram orqali tasdiqlandi..." /></div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast.success("To'lov qo'shildi va obuna faollashtirildi")}>Saqlash va tasdiqlash</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>O'quvchi</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Usul</TableHead>
                  <TableHead>Sana</TableHead>
                  <TableHead>Holat</TableHead>
                  <TableHead className="w-32">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="font-medium">{p.studentName}</div>
                      <div className="text-xs text-muted-foreground">{p.phone}</div>
                    </TableCell>
                    <TableCell className="font-display font-semibold">{formatPrice(p.amount)}</TableCell>
                    <TableCell className="text-sm">{p.method}</TableCell>
                    <TableCell className="text-sm">{p.date}</TableCell>
                    <TableCell>
                      {p.status === "approved" && <Badge className="bg-success text-success-foreground">Tasdiqlangan</Badge>}
                      {p.status === "pending" && <Badge className="bg-warning text-warning-foreground">Kutilmoqda</Badge>}
                      {p.status === "expired" && <Badge variant="destructive">Tugagan</Badge>}
                    </TableCell>
                    <TableCell>
                      {p.status === "pending" ? (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="text-success" onClick={() => toast.success("Tasdiqlandi")}><CheckCircle2 className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => toast.error("Rad etildi")}><X className="h-4 w-4" /></Button>
                        </div>
                      ) : (
                        <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}