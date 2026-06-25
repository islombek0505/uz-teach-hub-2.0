import type { NextFunction, Request, Response } from "express";

/**
 * Lightweight fixed-window per-IP rate limiter (no external deps).
 * Protects the send endpoint from a single host hammering many phone numbers.
 * For multi-instance deployments, replace with a Redis-backed limiter.
 */
export function ipRateLimit(maxPerMinute: number) {
  const windowMs = 60_000;
  const hits = new Map<string, { count: number; resetAt: number }>();

  // Periodic cleanup of stale buckets.
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [ip, b] of hits) if (b.resetAt < now) hits.delete(ip);
  }, windowMs);
  timer.unref?.();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const now = Date.now();
    const bucket = hits.get(ip);

    if (!bucket || bucket.resetAt < now) {
      hits.set(ip, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (bucket.count >= maxPerMinute) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      res
        .status(429)
        .json({ ok: false, error: { code: "IP_RATE_LIMITED", message: "Too many requests.", retryAfter } });
      return;
    }
    bucket.count += 1;
    next();
  };
}
