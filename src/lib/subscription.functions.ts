import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Trial activation runs on the server with the service-role client. The client
// can no longer write to user_plan directly (RLS insert policy was removed), so
// the expiry and the one-trial-per-user rule are enforced here and cannot be
// bypassed by calling the database API directly.
export const activateTrial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: true; expiresAt: string }> => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("trial_activated_at")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) throw new Error("Profilni o'qib bo'lmadi.");
    if (profile?.trial_activated_at) {
      throw new Error("Sinov muddati allaqachon ishlatilgan.");
    }

    // Don't let a trial overwrite an already-active (paid) plan.
    const { data: existing } = await supabaseAdmin
      .from("user_plan")
      .select("expires_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing && (!existing.expires_at || new Date(existing.expires_at) > new Date())) {
      throw new Error("Sizda allaqachon faol tarif bor.");
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { error: e1 } = await supabaseAdmin
      .from("profiles")
      .update({ trial_activated_at: now.toISOString() })
      .eq("id", userId);
    if (e1) throw new Error("Sinovni aktivlashtirib bo'lmadi.");

    const { error: e2 } = await supabaseAdmin.from("user_plan").upsert(
      {
        user_id: userId,
        plan_id: null,
        is_trial: true,
        started_at: now.toISOString(),
        expires_at: expires.toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (e2) throw new Error("Sinovni aktivlashtirib bo'lmadi.");

    return { ok: true, expiresAt: expires.toISOString() };
  });
