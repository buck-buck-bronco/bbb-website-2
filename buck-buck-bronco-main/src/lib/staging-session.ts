import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { STAGING_COOKIE } from "@/lib/staging";

export { STAGING_COOKIE };

const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const MIN_SECRET_LENGTH = 16;
const HMAC_BYTES = 32;
const HMAC_B64URL_LENGTH = 43;

/** Host env only. Missing or blank configuration fails closed. */
export function readStagingPassword(): string | null {
  const value = process.env.STAGING_PASSWORD?.trim() ?? "";
  return value.length > 0 ? value : null;
}

/** Host env only. Used to sign the session cookie. Never the password itself. */
export function readSessionSecret(): string | null {
  const value = process.env.STAGING_SESSION_SECRET?.trim() ?? "";
  return value.length >= MIN_SECRET_LENGTH ? value : null;
}

export function stagingSecretsReady(): boolean {
  return readStagingPassword() !== null && readSessionSecret() !== null;
}

function equalDigest(left: Buffer, right: Buffer): boolean {
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/** SHA-256 digests are equal length, then compared with the native primitive. */
export async function secretsMatch(left: string, right: string): Promise<boolean> {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return equalDigest(a, b);
}

function sign(secret: string, payload: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

function fromSignature(value: string): Buffer | null {
  if (value.length !== HMAC_B64URL_LENGTH || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    if (bytes.length !== HMAC_BYTES) return null;
    return bytes;
  } catch {
    return null;
  }
}

export async function issueStagingSession(): Promise<string | null> {
  try {
    const secret = readSessionSecret();
    if (!secret || !readStagingPassword()) return null;
    const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
    const payload = `v1.${exp}`;
    return `${payload}.${sign(secret, payload).toString("base64url")}`;
  } catch {
    return null;
  }
}

export async function stagingSessionValid(token: string | undefined): Promise<boolean> {
  try {
    const secret = readSessionSecret();
    if (!secret || !readStagingPassword() || !token) return false;
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== "v1" || !/^\d{1,12}$/.test(parts[1])) return false;
    const provided = fromSignature(parts[2]);
    if (!provided) return false;
    const expected = sign(secret, `${parts[0]}.${parts[1]}`);
    if (!equalDigest(provided, expected)) return false;
    const exp = Number(parts[1]);
    if (!Number.isFinite(exp)) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp > now && exp <= now + MAX_AGE_SECONDS + 60;
  } catch {
    return false;
  }
}

export const stagingSessionMaxAge = MAX_AGE_SECONDS;
