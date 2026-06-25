// Server-only helper for talking to the Telegram Verify Service.
// The .server.ts suffix keeps the API key out of the client bundle.
import { TelegramVerifyClient, TelegramVerifyError } from "@/lib/telegramVerifyClient";

export { TelegramVerifyError };

/** Builds a verify client per call (env is read at request time). */
export function getVerifyClient(): TelegramVerifyClient {
  const baseUrl = process.env.VERIFY_BASE_URL || "http://localhost:8787";
  const apiKey = process.env.VERIFY_API_KEY;
  if (!apiKey) {
    throw new Error("VERIFY_API_KEY o'rnatilmagan (telegram-verify-service API kaliti).");
  }
  return new TelegramVerifyClient({ baseUrl, apiKey, projectId: "uz-teach-hub" });
}

/** Maps verify-service error codes to Uzbek messages shown to the user. */
export function verifyErrorToMessage(err: unknown): string {
  if (err instanceof TelegramVerifyError) {
    switch (err.code) {
      case "PHONE_INVALID":
        return "Telefon raqami noto'g'ri.";
      case "PHONE_NO_TELEGRAM":
        return "Bu raqamda Telegram yo'q yoki kod yetkazib bo'lmadi.";
      case "COOLDOWN":
        return `Biroz kuting${err.retryAfter ? ` (${err.retryAfter}s)` : ""} va qayta urinib ko'ring.`;
      case "RATE_LIMITED":
      case "IP_RATE_LIMITED":
        return "Juda ko'p urinish. Birozdan so'ng qayta urinib ko'ring.";
      case "NO_ACTIVE_CODE":
        return "Aktiv kod topilmadi. Yangi kod so'rang.";
      case "CODE_EXPIRED":
        return "Kod muddati tugadi. Yangi kod so'rang.";
      case "MAX_ATTEMPTS":
        return "Juda ko'p xato urinish. Yangi kod so'rang.";
      case "TIMEOUT":
      case "NETWORK":
      case "UPSTREAM_UNAVAILABLE":
        return "Tasdiqlash xizmatiga ulanib bo'lmadi. Keyinroq urinib ko'ring.";
      default:
        return err.message || "Tasdiqlashda xatolik.";
    }
  }
  return "Tasdiqlashda xatolik yuz berdi.";
}
