import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import type { Config } from "./config.js";
import type { OtpService } from "./otpService.js";
import { apiKeyAuth } from "./middleware/apiKey.js";
import { ipRateLimit } from "./middleware/ipRateLimit.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { otpRouter } from "./routes/otp.js";

/** Minimal dependency-free CORS handler driven by config. */
function cors(origins: string[]) {
  const allowAll = origins.includes("*");
  return (req: Request, res: Response, next: NextFunction): void => {
    if (origins.length === 0) return next(); // CORS disabled (server-to-server)
    const origin = req.header("origin");
    if (allowAll) res.setHeader("Access-Control-Allow-Origin", "*");
    else if (origin && origins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key, x-project-id");
    res.setHeader("Access-Control-Max-Age", "600");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  };
}

export function createApp(config: Config, service: OtpService): Express {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(express.json({ limit: "16kb" }));
  app.use(cors(config.CORS_ORIGINS));

  // Public health check (no auth) — handy for uptime monitors / load balancers.
  app.get("/health", (_req: Request, res: Response) =>
    res.json({ ok: true, service: "telegram-verify-service", time: Date.now() }),
  );

  // Authenticated, rate-limited API surface.
  app.use(
    "/v1/otp",
    ipRateLimit(config.IP_RATE_LIMIT_PER_MIN),
    apiKeyAuth(config.API_KEYS),
    otpRouter(service),
  );

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
