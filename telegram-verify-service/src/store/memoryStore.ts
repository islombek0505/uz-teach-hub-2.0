import type { OtpRecord, OtpStore } from "./types.js";

/**
 * In-memory OtpStore. Fine for a single instance / development. For multiple
 * instances or persistence across restarts, implement OtpStore with Redis.
 *
 * A periodic sweep drops expired records and old send timestamps so memory
 * stays bounded.
 */
export class MemoryStore implements OtpStore {
  private records = new Map<string, OtpRecord>();
  private sends = new Map<string, number[]>();
  private readonly sweepTimer: NodeJS.Timeout;

  constructor(sweepIntervalMs = 5 * 60_000) {
    this.sweepTimer = setInterval(() => this.sweep(), sweepIntervalMs);
    // Don't keep the process alive just for the sweep.
    this.sweepTimer.unref?.();
  }

  private key(namespace: string, phone: string): string {
    return `${namespace}:${phone}`;
  }

  async getRecord(namespace: string, phone: string): Promise<OtpRecord | null> {
    return this.records.get(this.key(namespace, phone)) ?? null;
  }

  async saveRecord(namespace: string, phone: string, record: OtpRecord): Promise<void> {
    this.records.set(this.key(namespace, phone), record);
  }

  async deleteRecord(namespace: string, phone: string): Promise<void> {
    this.records.delete(this.key(namespace, phone));
  }

  async getSendTimestamps(namespace: string, phone: string): Promise<number[]> {
    return this.sends.get(this.key(namespace, phone)) ?? [];
  }

  async recordSend(namespace: string, phone: string, ts: number, windowMs: number): Promise<void> {
    const key = this.key(namespace, phone);
    const cutoff = ts - windowMs;
    const next = (this.sends.get(key) ?? []).filter((t) => t > cutoff);
    next.push(ts);
    this.sends.set(key, next);
  }

  private sweep(): void {
    const now = Date.now();
    for (const [key, rec] of this.records) {
      // Keep verified records briefly so a duplicate verify is idempotent,
      // but drop anything well past expiry.
      if (rec.expiresAt + 60_000 < now) this.records.delete(key);
    }
    const dayAgo = now - 24 * 60 * 60_000;
    for (const [key, list] of this.sends) {
      const kept = list.filter((t) => t > dayAgo);
      if (kept.length === 0) this.sends.delete(key);
      else this.sends.set(key, kept);
    }
  }

  /** For tests / graceful shutdown. */
  stop(): void {
    clearInterval(this.sweepTimer);
  }
}
