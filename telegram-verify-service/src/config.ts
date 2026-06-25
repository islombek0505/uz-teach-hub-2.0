import "dotenv/config";
import { z } from "zod";

/**
 * Parses and validates all environment configuration once at startup.
 * If anything required is missing/invalid, the process exits with a clear error
 * instead of failing later at request time.
 */

const bool = (def: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? def : v.toLowerCase() === "true" || v === "1"));

const intIn = (def: number, min: number, max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? def : Number(v)))
    .pipe(z.number().int().min(min).max(max));

const csv = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

const schema = z.object({
  PORT: intIn(8787, 1, 65535),
  NODE_ENV: z.string().optional().default("development"),

  TELEGRAM_GATEWAY_TOKEN: z.string().min(1, "TELEGRAM_GATEWAY_TOKEN is required"),
  API_KEYS: csv.refine((arr) => arr.length > 0, "At least one API key is required in API_KEYS"),

  CODE_LENGTH: intIn(6, 4, 8),
  CODE_TTL_SECONDS: intIn(300, 30, 3600),
  MAX_VERIFY_ATTEMPTS: intIn(5, 1, 20),

  SEND_COOLDOWN_SECONDS: intIn(60, 0, 3600),
  MAX_SENDS_PER_WINDOW: intIn(5, 1, 100),
  SEND_WINDOW_SECONDS: intIn(3600, 1, 86400),
  IP_RATE_LIMIT_PER_MIN: intIn(30, 1, 1000),

  CHECK_SEND_ABILITY: bool(true),
  SENDER_USERNAME: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/^@/, "").trim() : undefined)),
  DELIVERY_TTL_SECONDS: z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === "" ? undefined : Number(v)))
    .pipe(z.number().int().min(30).max(3600).optional()),

  DEFAULT_COUNTRY_CODE: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, "") : undefined)),

  CORS_ORIGINS: csv,
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
  // eslint-disable-next-line no-console
  console.error(`\n[config] Invalid environment configuration:\n${issues}\n`);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
