import type { NextFunction, Request, Response } from "express";
import { ServiceError } from "../otpService.js";
import { logger } from "../utils/logger.js";

/** 404 fallback. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ ok: false, error: { code: "NOT_FOUND", message: "Route not found." } });
}

/** Central error formatter — always returns a consistent JSON envelope. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ServiceError) {
    if (err.retryAfter) res.setHeader("Retry-After", String(err.retryAfter));
    res.status(err.httpStatus).json({
      ok: false,
      error: { code: err.code, message: err.message, ...(err.retryAfter ? { retryAfter: err.retryAfter } : {}) },
    });
    return;
  }

  logger.error("unhandled.error", { err: String(err) });
  res.status(500).json({ ok: false, error: { code: "INTERNAL", message: "Internal server error." } });
}
