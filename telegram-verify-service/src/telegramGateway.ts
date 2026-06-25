/**
 * Thin, typed client for the Telegram Gateway API.
 * Docs: https://core.telegram.org/gateway/api
 *
 * Every call returns the `result` payload on success or throws a
 * `TelegramGatewayError` carrying the upstream error code (e.g.
 * ACCESS_TOKEN_INVALID, PHONE_NUMBER_INVALID, BALANCE_NOT_ENOUGH).
 */

const BASE_URL = "https://gatewayapi.telegram.org";

export type DeliveryStatus = {
  status: "sent" | "delivered" | "read" | "expired" | "revoked";
  updated_at: number;
};

export type VerificationStatus = {
  status: "code_valid" | "code_invalid" | "code_max_attempts_exceeded" | "expired";
  updated_at: number;
  code_entered?: string;
};

export type RequestStatus = {
  request_id: string;
  phone_number: string;
  request_cost: number;
  is_refunded?: boolean;
  remaining_balance?: number;
  delivery_status?: DeliveryStatus;
  verification_status?: VerificationStatus;
  payload?: string;
};

type ApiResponse<T> = { ok: true; result: T } | { ok: false; error: string };

export class TelegramGatewayError extends Error {
  override readonly name = "TelegramGatewayError";
  constructor(
    /** Upstream error code, e.g. "PHONE_NUMBER_INVALID". */
    readonly code: string,
    /** HTTP status from the Gateway, if any. */
    readonly httpStatus?: number,
  ) {
    super(`Telegram Gateway error: ${code}`);
  }
}

export interface SendVerificationParams {
  phoneNumber: string;
  /** Reuse a request_id from checkSendAbility to make the send free of charge. */
  requestId?: string;
  /** Provide your own numeric code (4–8 digits). Mutually exclusive with codeLength. */
  code?: string;
  /** Ask Telegram to generate a code of this length (4–8). */
  codeLength?: number;
  /** Verified channel username (no @) the code is shown as sent from. */
  senderUsername?: string;
  /** Delivery TTL in seconds (30–3600); fee refunded if not delivered in time. */
  ttl?: number;
  /** Internal payload echoed back in delivery reports (≤128 bytes). */
  payload?: string;
  /** HTTPS callback URL for delivery reports. */
  callbackUrl?: string;
}

export class TelegramGatewayClient {
  constructor(
    private readonly token: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  /** Optional free pre-check; returns a request_id you can reuse in send. */
  async checkSendAbility(phoneNumber: string): Promise<RequestStatus> {
    return this.call<RequestStatus>("checkSendAbility", { phone_number: phoneNumber });
  }

  /** Sends (or reuses a pre-checked) verification message. */
  async sendVerificationMessage(params: SendVerificationParams): Promise<RequestStatus> {
    const body: Record<string, unknown> = { phone_number: params.phoneNumber };
    if (params.requestId) body.request_id = params.requestId;
    if (params.code) body.code = params.code;
    else if (params.codeLength) body.code_length = params.codeLength;
    if (params.senderUsername) body.sender_username = params.senderUsername;
    if (params.ttl) body.ttl = params.ttl;
    if (params.payload) body.payload = params.payload;
    if (params.callbackUrl) body.callback_url = params.callbackUrl;
    return this.call<RequestStatus>("sendVerificationMessage", body);
  }

  /** Asks Telegram to validate the code the user entered. */
  async checkVerificationStatus(requestId: string, code?: string): Promise<RequestStatus> {
    const body: Record<string, unknown> = { request_id: requestId };
    if (code !== undefined) body.code = code;
    return this.call<RequestStatus>("checkVerificationStatus", body);
  }

  /** Best-effort revoke of a previously sent message. */
  async revokeVerificationMessage(requestId: string): Promise<boolean> {
    return this.call<boolean>("revokeVerificationMessage", { request_id: requestId });
  }

  private async call<T>(method: string, body: Record<string, unknown>): Promise<T> {
    let res: Response;
    try {
      res = await this.fetchImpl(`${BASE_URL}/${method}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new TelegramGatewayError("NETWORK_ERROR");
    }

    let json: ApiResponse<T>;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      throw new TelegramGatewayError("INVALID_RESPONSE", res.status);
    }

    if (!json.ok) {
      throw new TelegramGatewayError(json.error || "UNKNOWN_ERROR", res.status);
    }
    return json.result;
  }
}
