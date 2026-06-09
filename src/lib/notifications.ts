import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type AppNotification = {
  id: string;
  user_id: string | null;
  title: string;
  body: string | null;
  type: string;
  link: string | null;
  created_at: string;
  is_read?: boolean;
};

export function useNotifications(limit = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["notifications", user?.id, limit],
    enabled: !!user,
    refetchInterval: 30_000,
    queryFn: async (): Promise<AppNotification[]> => {
      if (!user) return [];
      const [notifsRes, readsRes] = await Promise.all([
        (supabase.from as any)("notifications")
          .select("*")
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order("created_at", { ascending: false })
          .limit(limit),
        (supabase.from as any)("notification_reads")
          .select("notification_id")
          .eq("user_id", user.id),
      ]);
      if (notifsRes.error) throw notifsRes.error;
      const readSet = new Set(((readsRes.data ?? []) as any[]).map((r) => r.notification_id));
      return ((notifsRes.data ?? []) as AppNotification[]).map((n) => ({
        ...n,
        is_read: n.user_id === user.id ? !!readSet.has(n.id) : readSet.has(n.id),
      }));
    },
  });
}

export function useMarkRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) return;
      await (supabase.from as any)("notification_reads").upsert(
        { notification_id: notificationId, user_id: user.id },
        { onConflict: "notification_id,user_id" },
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllRead() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      if (!user || !ids.length) return;
      const rows = ids.map((id) => ({ notification_id: id, user_id: user.id }));
      await (supabase.from as any)("notification_reads").upsert(rows, { onConflict: "notification_id,user_id" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}