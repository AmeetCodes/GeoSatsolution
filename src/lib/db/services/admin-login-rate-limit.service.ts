import { createHash } from "node:crypto";
import connectDB from "../connection";
import { AdminLoginAttempt } from "../../models/AdminLoginAttempt";
import {
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  LOGIN_RATE_LIMIT_WINDOW_MS,
} from "../../auth/session-config";

export interface LoginRateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function getAttemptKey(ip: string): string {
  return createHash("sha256").update(ip.trim() || "unknown").digest("hex");
}

async function incrementAttempt(key: string, now: number) {
  const nowDate = new Date(now);
  const nextExpiry = new Date(now + LOGIN_RATE_LIMIT_WINDOW_MS);

  return AdminLoginAttempt.findOneAndUpdate(
    { key },
    [
      {
        $set: {
          count: {
            $cond: [
              { $gt: ["$expiresAt", nowDate] },
              { $add: [{ $ifNull: ["$count", 0] }, 1] },
              1,
            ],
          },
          expiresAt: {
            $cond: [{ $gt: ["$expiresAt", nowDate] }, "$expiresAt", nextExpiry],
          },
          createdAt: { $ifNull: ["$createdAt", nowDate] },
          updatedAt: nowDate,
        },
      },
    ],
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      updatePipeline: true,
    },
  )
    .lean()
    .exec();
}

export async function consumeAdminLoginAttempt(ip: string): Promise<LoginRateLimitResult> {
  await connectDB();

  const now = Date.now();
  const key = getAttemptKey(ip);

  const attempt = await incrementAttempt(key, now);
  const count = attempt?.count ?? 1;
  const expiresAt = attempt?.expiresAt?.getTime() ?? now + LOGIN_RATE_LIMIT_WINDOW_MS;

  return {
    allowed: count <= LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    remaining: Math.max(0, LOGIN_RATE_LIMIT_MAX_ATTEMPTS - count),
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
  };
}

export async function resetAdminLoginAttempts(ip: string): Promise<void> {
  await connectDB();

  const key = getAttemptKey(ip);
  await AdminLoginAttempt.deleteOne({ key }).exec();
}
