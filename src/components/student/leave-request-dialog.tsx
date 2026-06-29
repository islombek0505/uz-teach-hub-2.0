import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

// Darslar boshlangan guruhdan chiqish so'rovi — izoh bilan. Admin tasdiqlaydi.
export function LeaveRequestDialog({
  membershipId,
  groupName,
  leaveRequested,
  invalidateKeys,
}: {
  membershipId: string;
  groupName: string;
  leaveRequested: boolean;
  invalidateKeys: unknown[][];
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const invalidateAll = () => invalidateKeys.forEach((k) => qc.invalidateQueries({ queryKey: k }));

  const submit = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("group_members")
        .update({ leave_requested_at: new Date().toISOString(), leave_note: note.trim() || null })
        .eq("id", membershipId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Chiqish so'rovi yuborildi");
      setOpen(false);
      setNote("");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const withdraw = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("group_members")
        .update({ leave_requested_at: null, leave_note: null })
        .eq("id", membershipId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("So'rov bekor qilindi");
      invalidateAll();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (leaveRequested) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={withdraw.isPending}
        onClick={() => withdraw.mutate()}
      >
        <Clock className="mr-2 h-4 w-4" /> Chiqish so'rovi yuborilgan — bekor qilish
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Guruhdan chiqish uchun so'rov
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">"{groupName}" guruhidan chiqish</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Darslar boshlangan. Chiqish uchun so'rov yuboriladi; admin tasdiqlagandan so'ng guruhdan
            chiqarilasiz.
          </p>
          <div className="space-y-2">
            <Label>Sabab / izoh</Label>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nima uchun chiqmoqchisiz? (ixtiyoriy)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={submit.isPending} onClick={() => submit.mutate()}>
            {submit.isPending ? "Yuborilmoqda..." : "So'rov yuborish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
