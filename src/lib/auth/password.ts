import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function deriveKey(password: string, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await deriveKey(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  if (/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(encodedHash)) {
    try {
      return await bcrypt.compare(password, encodedHash);
    } catch {
      return false;
    }
  }

  const [algorithm, saltValue, hashValue, extra] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !saltValue || !hashValue || extra !== undefined) return false;

  try {
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(hashValue, "base64url");
    if (salt.length !== 16 || expected.length !== KEY_LENGTH) return false;

    const actual = await deriveKey(password, salt, expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function needsPasswordRehash(encodedHash: string): boolean {
  return !encodedHash.startsWith("scrypt$");
}