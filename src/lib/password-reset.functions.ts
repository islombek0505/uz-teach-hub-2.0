import { createServerFn } from "@tanstack/react-start";
import { getVerifyClient, verifyErrorToMessage } from "@/lib/verifyClient.server";

// "Forgot password" flow for phone-based accounts.
//
// Because the user is NOT logged in, the password can only be changed with the
// service-role (admin) client on the server — and ONLY after the Telegram code
// is verified. The flow is:
//   1. requestPasswordReset(phone)  → if the phone belongs to a real account,
//      a Telegram code is sent. The response is always generic so a stranger
//      can't probe which numbers are registered (and we don't pay to send codes
//      to non-existent users).
//   2. confirmPasswordReset(phone, code, newPassword) → verify code, then set
//      the new password.

/** Phone (any format) → "998901234567" digits as stored in profiles. */
function toDigits(phone: string): string {
  let digits = (phone ?? "").replace(/\D/g, "");
  // Local Uzbek number without country code → prepend 998.
  if (!digits.startsWith("998") && digits.length === 9) digits = `998${digits}`;
  return digits;
}

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const digits = toDigits(data.phone);
    if (digits.length < 11) {
      // Don't reveal validity; just no-op for obviously malformed input.
      return { ok: true };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("phone", digits)
      .maybeSingle();

    // Only send (and only pay) when the account actually exists.
    if (profile) {
      try {
        await getVerifyClient().sendCode(`+${digits}`);
      } catch (err) {
        // Surface real send problems (e.g. no Telegram on this number).
        throw new Error(verifyErrorToMessage(err));
      }
    }
    return { ok: true };
  });

export const confirmPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; code: string; newPassword: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    if (!data.newPassword || data.newPassword.length < 8) {
      throw new Error("Parol kamida 8 ta belgi bo'lsin.");
    }
    const digits = toDigits(data.phone);

    // 1. Verify the Telegram code FIRST.
    let verified = false;
    try {
      const res = await getVerifyClient().verifyCode(`+${digits}`, data.code);
      verified = res.verified;
    } catch (err) {
      throw new Error(verifyErrorToMessage(err));
    }
    if (!verified) throw new Error("Kod noto'g'ri yoki muddati o'tgan.");

    // 2. Find the account and set the new password via the admin client.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("phone", digits)
      .maybeSingle();
    if (!profile) throw new Error("Bu raqam bo'yicha hisob topilmadi.");

    const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      password: data.newPassword,
    });
    if (error) throw new Error("Parolni yangilab bo'lmadi. Keyinroq urinib ko'ring.");

    return { ok: true };
  });
