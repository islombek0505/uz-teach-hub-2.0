import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { OtpService } from "../otpService.js";
import { ServiceError } from "../otpService.js";

/** Wraps an async handler so thrown errors reach the central error handler. */
const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

const sendSchema = z.object({
  phone: z.string().min(3).max(32),
});

const verifySchema = z.object({
  phone: z.string().min(3).max(32),
  code: z.string().min(4).max(8),
});

function parse<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const r = schema.safeParse(body);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
    throw new ServiceError("VALIDATION", 400, msg);
  }
  return r.data;
}

export function otpRouter(service: OtpService): Router {
  const router = Router();

  // Send a verification code to the phone's Telegram account.
  router.post(
    "/send",
    asyncHandler(async (req, res) => {
      const { phone } = parse(sendSchema, req.body);
      const projectId = res.locals.projectId as string;
      const result = await service.send({ phone, projectId });
      res.json({
        ok: true,
        data: { requestId: result.requestId, phone: result.phone, expiresIn: result.expiresIn },
      });
    }),
  );

  // Verify the code the user entered.
  router.post(
    "/verify",
    asyncHandler(async (req, res) => {
      const { phone, code } = parse(verifySchema, req.body);
      const projectId = res.locals.projectId as string;
      const result = await service.verify({ phone, code, projectId });
      res.json({ ok: true, data: result });
    }),
  );

  return router;
}
