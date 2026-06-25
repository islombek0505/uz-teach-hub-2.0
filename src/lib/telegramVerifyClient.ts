/**
 * Tiny, dependency-free client for the Telegram Verify Service.
 *
 * Copy this single file into any project (Node or browser) to talk to the
 * service. Uses the global `fetch` (Node 18+, all modern browsers).
 *
 * ⚠️ SECURITY: the API key is a secret. Call this from your SERVER
 * (API route / server function / edge function), never directly from
 * browser code where the key would be exposed. From the browser, call
 * your own backend, which in turn calls this client.
 */

export interface TelegramVerifyClientOptions {
  /** Base URL of the running service, e.g. "https://verify.mycompany.com". */
  baseUrl: string;
  /** One of the service's API_KEYS. */
  apiKey: string;
  /** Optional project namespace; isolates rate limits/state per app. */
  projectId?: string;
  /** Request timeout in ms (default 10000). */
  timeoutMs?: number;
}

export interface SendCodeResult {
  requestId: string;
  phone: string;
  expiresIn: number;
}

export interface VerifyCodeResult {
  verified: boolean;
  reason?: "code_invalid";
  attemptsLeft?: number;
}

export class TelegramVerifyError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly httpStatus: number,
    readonly retryAfter?: number,
  ) {
    super(message);
    this.name = "TelegramVerifyError";
  }
}

export class TelegramVerifyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly projectId?: string;
  private readonly timeoutMs: number;

  constructor(opts: TelegramVerifyClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.apiKey = opts.apiKey;
    this.projectId = opts.projectId;
    this.timeoutMs = opts.timeoutMs ?? 10_000;
  }

  /** Sends a verification code to the phone's Telegram account. */
  async sendCode(phone: string): Promise<SendCodeResult> {
    return this.request<SendCodeResult>("/v1/otp/send", { phone });
  }

  /** Checks the code the user entered. Resolves with { verified }. */
  async verifyCode(phone: string, code: string): Promise<VerifyCodeResult> {
    return this.request<VerifyCodeResult>("/v1/otp/verify", { phone, code });
  }

  private async request<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          ...(this.projectId ? { "x-project-id": this.projectId } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const json = (await res.json().catch(() => null)) as
        | { ok: true; data: T }
        | { ok: false; error: { code: string; message: string; retryAfter?: number } }
        | null;

      if (!json) {
        throw new TelegramVerifyError(
          "BAD_RESPONSE",
          "Invalid response from verify service.",
          res.status,
        );
      }
      if (!json.ok) {
        throw new TelegramVerifyError(
          json.error.code,
          json.error.message,
          res.status,
          json.error.retryAfter,
        );
      }
      return json.data;
    } catch (err) {
      if (err instanceof TelegramVerifyError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new TelegramVerifyError("TIMEOUT", "Verify service timed out.", 504);
      }
      throw new TelegramVerifyError("NETWORK", "Could not reach verify service.", 0);
    } finally {
      clearTimeout(timer);
    }
  }
}
