import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/** Constant-time check of an incoming key against the allowed list. */
function isAllowed(provided: string, allowed: string[]): boolean {
  const a = Buffer.from(provided);
  let ok = false;
  for (const key of allowed) {
    const b = Buffer.from(key);
    // timingSafeEqual requires equal lengths; compare against a same-length buffer.
    if (a.length === b.length && timingSafeEqual(a, b)) ok = true;
  }
  return ok;
}

/**
 * Requires a valid `x-api-key` header. Reads an optional `x-project-id` header
 * to namespace OTP state + rate limits per consuming project, so one service
 * instance can safely serve many apps.
 */
export function apiKeyAuth(allowedKeys: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const provided = req.header("x-api-key") ?? "";
    if (!provided || !isAllowed(provided, allowedKeys)) {
      res.status(401).json({ ok: false, error: { code: "UNAUTHORIZED", message: "Invalid or missing API key." } });
      return;
    }
    const projectId = (req.header("x-project-id") ?? "default").slice(0, 64).replace(/[^\w.-]/g, "_") || "default";
    res.locals.projectId = projectId;
    next();
  };
}
