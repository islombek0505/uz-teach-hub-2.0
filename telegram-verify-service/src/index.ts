import { config } from "./config.js";
import { TelegramGatewayClient } from "./telegramGateway.js";
import { MemoryStore } from "./store/memoryStore.js";
import { OtpService } from "./otpService.js";
import { createApp } from "./server.js";
import { logger } from "./utils/logger.js";

/**
 * Composition root: wire the pieces together and start the HTTP server.
 * To use Redis/Postgres instead of memory, swap `MemoryStore` for your own
 * `OtpStore` implementation here — nothing else changes.
 */
const gateway = new TelegramGatewayClient(config.TELEGRAM_GATEWAY_TOKEN);
const store = new MemoryStore();
const service = new OtpService(config, gateway, store);
const app = createApp(config, service);

const server = app.listen(config.PORT, () => {
  logger.info("server.started", {
    port: config.PORT,
    env: config.NODE_ENV,
    checkSendAbility: config.CHECK_SEND_ABILITY,
    apiKeys: config.API_KEYS.length,
  });
});

// Graceful shutdown.
for (const sig of ["SIGINT", "SIGTERM"] as const) {
  process.on(sig, () => {
    logger.info("server.stopping", { sig });
    server.close(() => {
      store.stop();
      process.exit(0);
    });
  });
}
