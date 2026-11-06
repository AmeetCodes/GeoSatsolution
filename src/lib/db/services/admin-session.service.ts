import { createHash } from "node:crypto";
import connectDB from "../connection";
import { AdminSession as AdminSessionModel } from "../../models/AdminSession";
import {
  createAdminSession,
  createAdminSessionId,
  signAdminSessionToken,
  type AdminSession,
  type AdminSessionRole,
} from "../../auth/admin-session";
import { SESSION_INACTIVITY_MS } from "../../auth/session-config";

export interface AdminSessionMeta {
  ip?: string | null;
  userAgent?: string | null;
}

export interface IssuedAdminSession {
  token: string;
  session: AdminSession;
}

function hashIp(ip?: string | null): string | undefined {
  const value = ip?.trim();
  if (!value) return undefined;
  return createHash("sha256").update(value).digest("hex");
}

export async function issueAdminSession(
  admin: { email: string; role: AdminSessionRole },
  meta: AdminSessionMeta = {},
): Promise<IssuedAdminSession> {
  await connectDB();

  const now = Date.now();
  const session = createAdminSession(
    admin.email,
    admin.role,
    createAdminSessionId(),
    now,
  );

  await AdminSessionModel.create({
    sessionId: session.sessionId,
    email: session.email,
    role: session.role,
    issuedAt: new Date(session.issuedAt),
    lastActivityAt: new Date(session.lastActivityAt),
    expiresAt: new Date(session.expiresAt),
    ipHash: hashIp(meta.ip),
    userAgent: meta.userAgent?.slice(0, 512),
  });

  return {
    token: signAdminSessionToken(session),
    session,
  };
}

export async function isAdminSessionActive(sessionId: string): Promise<boolean> {
  await connectDB();

  const now = Date.now();
  const session = await AdminSessionModel.exists({
    sessionId,
    revokedAt: null,
    expiresAt: { $gt: new Date(now) },
    lastActivityAt: { $gt: new Date(now - SESSION_INACTIVITY_MS) },
  });

  return Boolean(session);
}

export async function refreshAdminSession(
  session: AdminSession,
): Promise<IssuedAdminSession | null> {
  await connectDB();

  const now = Date.now();
  const record = await AdminSessionModel.findOne({
    sessionId: session.sessionId,
    email: session.email,
    revokedAt: null,
    expiresAt: { $gt: new Date(now) },
  }).exec();

  if (!record) return null;

  const absoluteExpiresAt = record.expiresAt.getTime();
  if (now >= absoluteExpiresAt) return null;

  await AdminSessionModel.updateOne(
    { _id: record._id },
    { $set: { lastActivityAt: new Date(now) } },
  ).exec();

  const refreshed: AdminSession = {
    sessionId: record.sessionId,
    email: record.email,
    role: record.role,
    issuedAt: record.issuedAt.getTime(),
    lastActivityAt: now,
    expiresAt: absoluteExpiresAt,
  };

  return {
    token: signAdminSessionToken(refreshed),
    session: refreshed,
  };
}

export async function revokeAdminSession(sessionId: string): Promise<void> {
  await connectDB();

  await AdminSessionModel.updateOne(
    { sessionId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  ).exec();
}
