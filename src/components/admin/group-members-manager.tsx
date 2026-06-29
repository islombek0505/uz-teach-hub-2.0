import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X, UserPlus, Search, Trash2, Clock, Users, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { MembershipStatus } from "@/lib/groups";

type MemberRow = {
  id: string;
  user_id: string;
  status: MembershipStatus;
  requested_at: string;
  decided_at: string | null;
  leaveRequestedAt: string | null;
  leaveNote: string | null;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
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

export function GroupMembersManager({ groupId, capacity }: { groupId: string; capacity: number }) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const membersKey = ["admin", "group", groupId, "members"];

  const { data: members = [], isLoading } = useQuery<MemberRow[]>({
    queryKey: membersKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .order("requested_at", { ascending: true });
      if (error) throw error;
      const rows = data ?? [];
      const ids = rows.map((r) => r.user_id);
      const byId = new Map<
        string,
        { full_name: string | null; phone: string | null; avatar_url: string | null }
      >();
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, full_name, phone, avatar_url")
          .in("id", ids);
        for (const p of profs ?? []) byId.set(p.id, p);
      }
      return rows.map((r) => ({
        id: r.id,
        user_id: r.user_id,
        status: r.status,
        requested_at: r.requested_at,
        decided_at: r.decided_at,
        leaveRequestedAt: r.leave_requested_at ?? null,
        leaveNote: r.leave_note ?? null,
        full_name: byId.get(r.user_id)?.full_name ?? "Foydalanuvchi",
        phone: byId.get(r.user_id)?.phone ?? null,
        avatar_url: byId.get(r.user_id)?.avatar_url ?? null,
      }));
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: membersKey });
    qc.invalidateQueries({ queryKey: ["admin", "groups"] });
  };

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: MembershipStatus }) => {
      const { error } = await supabase
        .from("group_members")
        .update({ status, decided_at: new Date().toISOString(), decided_by: user?.id ?? null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  // Chiqish so'rovini rad etish (a'zo guruhda qoladi)
  const rejectLeave = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("group_members")
        .update({ leave_requested_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Chiqish so'rovi rad etildi");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("group_members").upsert(
        {
          group_id: groupId,
          user_id: userId,
          status: "approved",
          decided_at: new Date().toISOString(),
          decided_by: user?.id ?? null,
        },
        { onConflict: "group_id,user_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("O'quvchi guruhga qo'shildi");
      setSearch("");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pending = members.filter((m) => m.status === "pending");
  const approved = members.filter((m) => m.status === "approved");
  const isFull = approved.length >= capacity;
  const pct = capacity > 0 ? Math.min(100, Math.round((approved.length / capacity) * 100)) : 0;

  const activeMemberIds = new Set(
    members.filter((m) => m.status === "pending" || m.status === "approved").map((m) => m.user_id),
  );

  const safeSearch = search.replace(/[,()%]/g, " ").trim();
  const { data: searchResults = [] } = useQuery({
    queryKey: ["admin", "student-search", safeSearch],
    enabled: safeSearch.length >= 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .or(`full_name.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`)
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      {/* Sig'im */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" /> Guruh sig'imi
            </span>
            <span className="font-semibold">
              {approved.length} / {capacity}
              {isFull && <span className="ml-2 text-destructive">To'lgan</span>}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isFull ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Qo'lda qo'shish */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <UserPlus className="h-4 w-4" /> O'quvchini qo'lda qo'shish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism yoki telefon bo'yicha qidiring..."
              className="pl-9"
            />
          </div>
          {safeSearch.length >= 2 && (
            <div className="divide-y rounded-lg border">
              {searchResults.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground">Topilmadi</p>
              )}
              {searchResults.map((p) => {
                const already = activeMemberIds.has(p.id);
                return (
                  <div key={p.id} className="flex items-center justify-between gap-2 p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.full_name ?? "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.phone ?? "—"}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={already || isFull || addMember.isPending}
                      onClick={() => addMember.mutate(p.id)}
                    >
                      {already ? "Ro'yxatda" : "Qo'shish"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kutilayotgan so'rovlar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Clock className="h-4 w-4" /> Kutilayotgan so'rovlar ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>}
          {!isLoading && pending.length === 0 && (
            <p className="text-sm text-muted-foreground">Yangi so'rovlar yo'q.</p>
          )}
          {pending.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-9 w-9">
                  {m.avatar_url ? <AvatarImage src={m.avatar_url} alt={m.full_name} /> : null}
                  <AvatarFallback className="text-xs">{initialsOf(m.full_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.phone ?? "—"} · {new Date(m.requested_at).toLocaleDateString("uz-UZ")}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  disabled={isFull || setStatus.isPending}
                  onClick={() => setStatus.mutate({ id: m.id, status: "approved" })}
                  title={isFull ? "Guruh to'lgan" : "Qabul qilish"}
                >
                  <Check className="mr-1 h-4 w-4" /> Qabul
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  disabled={setStatus.isPending}
                  onClick={() => setStatus.mutate({ id: m.id, status: "rejected" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* A'zolar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Users className="h-4 w-4" /> A'zolar ({approved.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!isLoading && approved.length === 0 && (
            <p className="text-sm text-muted-foreground">Hozircha a'zolar yo'q.</p>
          )}
          {approved.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-9 w-9">
                  {m.avatar_url ? <AvatarImage src={m.avatar_url} alt={m.full_name} /> : null}
                  <AvatarFallback className="text-xs">{initialsOf(m.full_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.phone ?? "—"}</p>
                  {m.leaveRequestedAt && (
                    <div className="mt-1 space-y-1">
                      <Badge variant="outline" className="gap-1 text-amber-600">
                        <LogOut className="h-3 w-3" /> Chiqishni so'radi
                      </Badge>
                      {m.leaveNote && (
                        <p className="text-xs italic text-muted-foreground">"{m.leaveNote}"</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                {m.leaveRequestedAt && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={rejectLeave.isPending}
                    onClick={() => rejectLeave.mutate(m.id)}
                  >
                    Rad etish
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  disabled={setStatus.isPending}
                  onClick={() =>
                    confirm(
                      m.leaveRequestedAt
                        ? `${m.full_name} ning chiqish so'rovini tasdiqlaysizmi?`
                        : `${m.full_name} ni guruhdan chiqarasizmi?`,
                    ) && setStatus.mutate({ id: m.id, status: "cancelled" })
                  }
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Chiqarish
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
