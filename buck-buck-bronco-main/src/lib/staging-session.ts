import { STAGING_COOKIE } from "@/lib/staging";

export { STAGING_COOKIE };

const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const MIN_SECRET_LENGTH = 16;

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

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

async function hmac(secret: string, payload: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return new Uint8Array(signature);
}

/** Compares equal-length digests. Inputs are hashed first so lengths are fixed. */
export async function secretsMatch(left: string, right: string): Promise<boolean> {
  const [a, b] = await Promise.all([sha256(left), sha256(right)]);
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function issueStagingSession(): Promise<string | null> {
  const secret = readSessionSecret();
  if (!secret || !readStagingPassword()) return null;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `v1.${exp}`;
  const signature = bytesToBase64Url(await hmac(secret, payload));
  return `${payload}.${signature}`;
}

export async function stagingSessionValid(token: string | undefined): Promise<boolean> {
  const secret = readSessionSecret();
  if (!secret || !readStagingPassword() || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^\d{1,12}$/.test(parts[1])) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const provided = base64UrlToBytes(parts[2]) ?? new Uint8Array();
  const expected = await hmac(secret, payload);
  let diff = provided.length === expected.length ? 0 : 1;
  for (let i = 0; i < expected.length; i += 1) diff |= expected[i] ^ (provided[i] ?? 0);
  if (diff !== 0) return false;
  const exp = Number(parts[1]);
  const now = Math.floor(Date.now() / 1000);
  return exp > now && exp <= now + MAX_AGE_SECONDS + 60;
}

export const stagingSessionMaxAge = MAX_AGE_SECONDS;
