import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, Clock, LogOut, UserPlus, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth";

type RequestRow = {
  id: string;
  kind: "join" | "leave";
  groupName: string;
  studentName: string;
  phone: string | null;
  at: string | null;
  leaveNote: string | null;
};

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "O"
  );
}

// Barcha guruhlardagi kirish + chiqish so'rovlarini bitta joyda ko'rsatadi —
// qaysi o'quvchidan, qaysi guruhga ekanligini bir qarashda bilish uchun.
export function GroupRequestsInbox() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: rows = [], isLoading } = useQuery<RequestRow[]>({
    queryKey: ["admin", "group-requests-inbox"],
    queryFn: async () => {
      const { data: members } = await supabase
        .from("group_members")
        .select("*")
        .in("status", ["pending", "approved"])
        .order("requested_at", { ascending: true });
      const reqs = (members ?? []).filter(
        (m) => m.status === "pending" || (m.status === "approved" && m.leave_requested_at),
      );
      if (reqs.length === 0) return [];

      const gIds = Array.from(new Set(reqs.map((r) => r.group_id)));
      const uIds = Array.from(new Set(reqs.map((r) => r.user_id)));
      const [{ data: grps }, { data: profs }] = await Promise.all([
        supabase.from("groups").select("id, name").in("id", gIds),
        supabase.from("profiles").select("id, full_name, phone").in("id", uIds),
      ]);
      const gmap = new Map((grps ?? []).map((g) => [g.id, g.name]));
      const pmap = new Map((profs ?? []).map((p) => [p.id, p]));

      return reqs.map((r) => ({
        id: r.id,
        kind: r.status === "pending" ? ("join" as const) : ("leave" as const),
        groupName: gmap.get(r.group_id) ?? "—",
        studentName: pmap.get(r.user_id)?.full_name ?? "Foydalanuvchi",
        phone: pmap.get(r.user_id)?.phone ?? null,
        at: r.status === "pending" ? r.requested_at : r.leave_requested_at,
        leaveNote: r.leave_note ?? null,
      }));
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["admin-sidebar"] });
  };

  const act = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: TablesUpdate<"group_members"> }) => {
      const { error } = await supabase.from("group_members").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const now = () => new Date().toISOString();
  const approveJoin = (id: string) =>
    act.mutate(
      { id, patch: { status: "approved", decided_at: now(), decided_by: user?.id ?? null } },
      { onSuccess: () => toast.success("Qabul qilindi") },
    );
  const rejectJoin = (id: string) =>
    act.mutate(
      { id, patch: { status: "rejected", decided_at: now(), decided_by: user?.id ?? null } },
      { onSuccess: () => toast.success("Rad etildi") },
    );
  const approveLeave = (id: string, name: string) => {
    if (!confirm(`${name} ning chiqish so'rovini tasdiqlaysizmi? Guruhdan chiqariladi.`)) return;
    act.mutate(
      { id, patch: { status: "cancelled", decided_at: now(), decided_by: user?.id ?? null } },
      { onSuccess: () => toast.success("Guruhdan chiqarildi") },
    );
  };
  const rejectLeave = (id: string) =>
    act.mutate(
      { id, patch: { leave_requested_at: null, leave_note: null } },
      { onSuccess: () => toast.success("Chiqish so'rovi rad etildi") },
    );

  if (isLoading || rows.length === 0) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/[0.03]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-display">
          <Inbox className="h-4 w-4" /> Yangi so'rovlar
          <Badge variant="outline" className="ml-1">
            {rows.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs">{initialsOf(r.studentName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium">{r.studentName}</span>
                  {r.kind === "join" ? (
                    <Badge variant="outline" className="gap-1 text-emerald-600">
                      <UserPlus className="h-3 w-3" /> Qo'shilish
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-amber-600">
                      <LogOut className="h-3 w-3" /> Chiqish
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/70">{r.groupName}</span>
                  <span>·</span>
                  <span>{r.phone ?? "—"}</span>
                  {r.at && (
                    <>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      {new Date(r.at).toLocaleDateString("uz-UZ")}
                    </>
                  )}
                </div>
                {r.kind === "leave" && r.leaveNote && (
                  <p className="mt-0.5 text-xs italic text-muted-foreground">"{r.leaveNote}"</p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              {r.kind === "join" ? (
                <>
                  <Button
                    size="sm"
                    disabled={act.isPending}
                    onClick={() => approveJoin(r.id)}
                    className="bg-success text-success-foreground hover:bg-success/90"
                  >
                    <Check className="mr-1 h-4 w-4" /> Qabul
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    disabled={act.isPending}
                    onClick={() => rejectJoin(r.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    disabled={act.isPending}
                    onClick={() => approveLeave(r.id, r.studentName)}
                  >
                    <LogOut className="mr-1 h-4 w-4" /> Chiqarish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={act.isPending}
                    onClick={() => rejectLeave(r.id)}
                  >
                    Rad etish
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
