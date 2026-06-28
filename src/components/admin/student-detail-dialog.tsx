import { useState } from "react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentDetailView } from "./student-detail-view";

export function StudentDetailDialog({
  studentId,
  name,
  trigger,
}: {
  studentId: string;
  name?: string | null;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 px-6 py-4">
          <DialogTitle className="font-display">{name || "O'quvchi tafsilotlari"}</DialogTitle>
        </DialogHeader>
        <div className="admin-surface max-h-[calc(92vh-4.5rem)] overflow-y-auto p-6">
          {open && <StudentDetailView studentId={studentId} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
