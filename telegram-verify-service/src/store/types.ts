/**
 * Storage abstraction. The default implementation is in-memory (memoryStore.ts).
 * Implement this interface against Redis/Postgres for multi-instance / persistent
 * deployments — the rest of the service is storage-agnostic.
 */

export interface OtpRecord {
  /** Telegram Gateway request_id used to verify the code. */
  requestId: string;
  /** Normalized E.164 phone. */
  phone: string;
  /** ms epoch when the code was issued. */
  createdAt: number;
  /** ms epoch after which the code is considered expired on our side. */
  expiresAt: number;
  /** Number of failed verification attempts so far. */
  attempts: number;
  /** Whether this code has already been successfully verified. */
  verified: boolean;
}

export interface OtpStore {
  /** Returns the active record for a phone within a project namespace. */
  getRecord(namespace: string, phone: string): Promise<OtpRecord | null>;
  /** Creates/replaces the active record for a phone. */
  saveRecord(namespace: string, phone: string, record: OtpRecord): Promise<void>;
  /** Removes the active record (e.g. after success or revoke). */
  deleteRecord(namespace: string, phone: string): Promise<void>;

  /** Send timestamps (ms epoch) for a phone, used for rate limiting. */
  getSendTimestamps(namespace: string, phone: string): Promise<number[]>;
  /** Records a new send timestamp, keeping only those within `windowMs`. */
  recordSend(namespace: string, phone: string, ts: number, windowMs: number): Promise<void>;
}
