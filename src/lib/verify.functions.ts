import { createServerFn } from "@tanstack/react-start";
import { getVerifyClient, verifyErrorToMessage } from "@/lib/verifyClient.server";

// Server-only OTP via the Telegram Verify Service. The API key lives only on
// the server (see verifyClient.server.ts), never in the client bundle.

/** Sends a verification code to the phone's Telegram account. */
export const sendOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string }) => d)
  .handler(async ({ data }): Promise<{ ok: true; expiresIn: number }> => {
    try {
      const res = await getVerifyClient().sendCode(data.phone);
      return { ok: true, expiresIn: res.expiresIn };
    } catch (err) {
      throw new Error(verifyErrorToMessage(err));
    }
  });

/** Verifies the code the user entered. */
export const checkOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { phone: string; code: string }) => d)
  .handler(async ({ data }): Promise<{ verified: boolean; attemptsLeft?: number }> => {
    try {
      const res = await getVerifyClient().verifyCode(data.phone, data.code);
      return { verified: res.verified, attemptsLeft: res.attemptsLeft };
    } catch (err) {
      throw new Error(verifyErrorToMessage(err));
    }
  });
