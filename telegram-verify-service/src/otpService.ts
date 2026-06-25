import type { Config } from "./config.js";
import { TelegramGatewayClient, TelegramGatewayError } from "./telegramGateway.js";
import type { OtpStore } from "./store/types.js";
import { normalizePhone, PhoneError } from "./utils/phone.js";
import { logger, maskPhone } from "./utils/logger.js";

/** Error with a stable machine code + HTTP status for the API layer. */
export class ServiceError extends Error {
  override readonly name = "ServiceError";
  constructor(
    readonly code: string,
    readonly httpStatus: number,
    message: string,
    /** Optional seconds the caller should wait before retrying. */
    readonly retryAfter?: number,
  ) {
    super(message);
  }
}

export interface SendInput {
  phone: string;
  projectId: string;
}

export interface SendResult {
  requestId: string;
  phone: string;
  expiresIn: number;
  cost: number;
  remainingBalance?: number;
}

export interface VerifyInput {
  phone: string;
  code: string;
  projectId: string;
}

export interface VerifyResult {
  verified: boolean;
  reason?: "code_invalid";
  attemptsLeft?: number;
}

export class OtpService {
  constructor(
    private readonly config: Config,
    private readonly gateway: TelegramGatewayClient,
    private readonly store: OtpStore,
  ) {}

  private normalize(phone: string): string {
    try {
      return normalizePhone(phone, this.config.DEFAULT_COUNTRY_CODE);
    } catch (err) {
      const msg = err instanceof PhoneError ? err.message : "Invalid phone number";
      throw new ServiceError("PHONE_INVALID", 400, msg);
    }
  }

  async send(input: SendInput): Promise<SendResult> {
    const phone = this.normalize(input.phone);
    const ns = input.projectId;
    const now = Date.now();

    // ── Rate limiting ───────────────────────────────────────────────
    const windowMs = this.config.SEND_WINDOW_SECONDS * 1000;
    const timestamps = await this.store.getSendTimestamps(ns, phone);
    const recent = timestamps.filter((t) => t > now - windowMs);

    const last = recent[recent.length - 1];
    if (last !== undefined) {
      const sinceLast = (now - last) / 1000;
      if (sinceLast < this.config.SEND_COOLDOWN_SECONDS) {
        const retryAfter = Math.ceil(this.config.SEND_COOLDOWN_SECONDS - sinceLast);
        throw new ServiceError(
          "COOLDOWN",
          429,
          `Please wait ${retryAfter}s before requesting another code.`,
          retryAfter,
        );
      }
    }
    if (recent.length >= this.config.MAX_SENDS_PER_WINDOW) {
      throw new ServiceError(
        "RATE_LIMITED",
        429,
        "Too many code requests for this number. Try again later.",
        this.config.SEND_WINDOW_SECONDS,
      );
    }

    // ── Optional free deliverability pre-check ──────────────────────
    let requestId: string | undefined;
    if (this.config.CHECK_SEND_ABILITY) {
      try {
        const ability = await this.gateway.checkSendAbility(phone);
        requestId = ability.request_id;
      } catch (err) {
        throw this.mapGatewayError(err, phone);
      }
    }

    // ── Send (Telegram generates the code; we never see it) ─────────
    try {
      const result = await this.gateway.sendVerificationMessage({
        phoneNumber: phone,
        requestId,
        codeLength: this.config.CODE_LENGTH,
        senderUsername: this.config.SENDER_USERNAME,
        ttl: this.config.DELIVERY_TTL_SECONDS,
        payload: ns.slice(0, 128),
      });

      await this.store.saveRecord(ns, phone, {
        requestId: result.request_id,
        phone,
        createdAt: now,
        expiresAt: now + this.config.CODE_TTL_SECONDS * 1000,
        attempts: 0,
        verified: false,
      });
      await this.store.recordSend(ns, phone, now, windowMs);

      logger.info("otp.sent", { ns, phone: maskPhone(phone), requestId: result.request_id });
      return {
        requestId: result.request_id,
        phone,
        expiresIn: this.config.CODE_TTL_SECONDS,
        cost: result.request_cost,
        remainingBalance: result.remaining_balance,
      };
    } catch (err) {
      throw this.mapGatewayError(err, phone);
    }
  }

  async verify(input: VerifyInput): Promise<VerifyResult> {
    const phone = this.normalize(input.phone);
    const ns = input.projectId;
    const code = (input.code ?? "").trim();
    if (!/^\d{4,8}$/.test(code)) {
      throw new ServiceError("CODE_FORMAT", 400, "Code must be 4–8 digits.");
    }

    const record = await this.store.getRecord(ns, phone);
    if (!record) {
      throw new ServiceError("NO_ACTIVE_CODE", 404, "No active code for this number. Request a new one.");
    }
    if (record.verified) {
      // Idempotent success for double submits.
      return { verified: true };
    }
    if (Date.now() > record.expiresAt) {
      await this.store.deleteRecord(ns, phone);
      throw new ServiceError("CODE_EXPIRED", 410, "The code has expired. Request a new one.");
    }
    if (record.attempts >= this.config.MAX_VERIFY_ATTEMPTS) {
      await this.store.deleteRecord(ns, phone);
      throw new ServiceError("MAX_ATTEMPTS", 429, "Too many wrong attempts. Request a new code.");
    }

    let status: string | undefined;
    try {
      const result = await this.gateway.checkVerificationStatus(record.requestId, code);
      status = result.verification_status?.status;
    } catch (err) {
      throw this.mapGatewayError(err, phone);
    }

    if (status === "code_valid") {
      await this.store.saveRecord(ns, phone, { ...record, verified: true });
      logger.info("otp.verified", { ns, phone: maskPhone(phone) });
      return { verified: true };
    }

    if (status === "code_max_attempts_exceeded") {
      await this.store.deleteRecord(ns, phone);
      throw new ServiceError("MAX_ATTEMPTS", 429, "Too many wrong attempts. Request a new code.");
    }
    if (status === "expired") {
      await this.store.deleteRecord(ns, phone);
      throw new ServiceError("CODE_EXPIRED", 410, "The code has expired. Request a new one.");
    }

    // code_invalid (or unknown) → count the attempt.
    const attempts = record.attempts + 1;
    await this.store.saveRecord(ns, phone, { ...record, attempts });
    return { verified: false, reason: "code_invalid", attemptsLeft: Math.max(0, this.config.MAX_VERIFY_ATTEMPTS - attempts) };
  }

  /** Translates Telegram/network errors into client-facing ServiceErrors. */
  private mapGatewayError(err: unknown, phone: string): ServiceError {
    if (err instanceof ServiceError) return err;
    if (err instanceof TelegramGatewayError) {
      logger.warn("gateway.error", { code: err.code, phone: maskPhone(phone) });
      switch (err.code) {
        case "PHONE_NUMBER_INVALID":
          return new ServiceError("PHONE_INVALID", 400, "Invalid phone number.");
        case "PHONE_NUMBER_NOT_FOUND":
        case "PHONE_NUMBER_NO_TELEGRAM":
        case "SEND_ABILITY_FAILED":
          return new ServiceError("PHONE_NO_TELEGRAM", 422, "This number can't receive a Telegram code.");
        case "BALANCE_NOT_ENOUGH":
          return new ServiceError("UPSTREAM_UNAVAILABLE", 503, "Verification temporarily unavailable.");
        case "FLOOD_WAIT":
          return new ServiceError("RATE_LIMITED", 429, "Too many requests. Try again shortly.");
        case "ACCESS_TOKEN_INVALID":
        case "ACCESS_TOKEN_REQUIRED":
          return new ServiceError("MISCONFIGURED", 500, "Verification service is misconfigured.");
        case "NETWORK_ERROR":
          return new ServiceError("UPSTREAM_UNAVAILABLE", 503, "Verification provider unreachable.");
        default:
          return new ServiceError("UPSTREAM_ERROR", 502, "Verification provider error.");
      }
    }
    logger.error("otp.unexpected", { err: String(err) });
    return new ServiceError("INTERNAL", 500, "Unexpected error.");
  }
}
