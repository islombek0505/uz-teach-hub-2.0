/**
 * Phone-number helpers. The Telegram Gateway API requires E.164 format
 * (a leading "+" followed by up to 15 digits, e.g. +998901234567).
 */

export class PhoneError extends Error {
  override readonly name = "PhoneError";
}

/**
 * Normalizes a user-supplied phone into strict E.164.
 *
 * Accepts inputs with spaces, dashes, parentheses, an optional "+" or "00"
 * international prefix. When the number has no country code and a
 * `defaultCountryCode` is configured, that code is prepended.
 *
 * @example
 *   normalizePhone("+998 90 123 45 67")            // "+998901234567"
 *   normalizePhone("998901234567")                 // "+998901234567"
 *   normalizePhone("901234567", "998")             // "+998901234567"
 *   normalizePhone("0090 90 123 45 67")            // "+9090123456 7" -> validated
 */
export function normalizePhone(raw: string, defaultCountryCode?: string): string {
  if (typeof raw !== "string") throw new PhoneError("Phone must be a string");

  let value = raw.trim();
  if (!value) throw new PhoneError("Phone is empty");

  const hadPlus = value.startsWith("+");
  // "00" is the international dialing prefix in many countries — treat as "+".
  const hadDoubleZero = value.startsWith("00");

  // Keep digits only.
  let digits = value.replace(/\D/g, "");
  if (hadDoubleZero) digits = digits.replace(/^00/, "");

  if (!digits) throw new PhoneError("Phone has no digits");

  // If no explicit international prefix was given and the number looks local,
  // prepend the default country code (when configured and not already present).
  if (!hadPlus && !hadDoubleZero && defaultCountryCode) {
    if (!digits.startsWith(defaultCountryCode)) {
      // Drop a single leading trunk "0" (common in local formats) before adding CC.
      const local = digits.replace(/^0+/, "");
      digits = `${defaultCountryCode}${local}`;
    }
  }

  const e164 = `+${digits}`;
  if (!isValidE164(e164)) {
    throw new PhoneError(`Invalid phone number: "${raw}". Expected E.164 like +998901234567.`);
  }
  return e164;
}

/** Strict E.164 check: "+" then 7–15 digits, first digit non-zero. */
export function isValidE164(value: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(value);
}
