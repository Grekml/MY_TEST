import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminSessions } from "@/lib/schema";
import {
  cookieConfig,
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  tokenConfig,
  verifyRefreshToken,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(cookieConfig.refreshName)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });
  }

  let payload: { sid?: string };
  try {
    payload = (await verifyRefreshToken(refreshToken)) as { sid?: string };
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const sessionId = payload.sid;
  if (!sessionId) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const session = db
    .select()
    .from(adminSessions)
    .where(eq(adminSessions.id, sessionId))
    .get();

  const now = new Date();
  if (
    !session ||
    session.refreshTokenHash !== hashRefreshToken(refreshToken) ||
    session.revokedAt ||
    session.expiresAt <= now
  ) {
    return NextResponse.json({ error: "Refresh token expired" }, { status: 401 });
  }

  db.update(adminSessions)
    .set({ revokedAt: now, lastUsedAt: now })
    .where(eq(adminSessions.id, sessionId))
    .run();

  const newSessionId = crypto.randomUUID();
  const newRefreshToken = await signRefreshToken(newSessionId);
  const newAccessToken = await signAccessToken();

  db.insert(adminSessions).values({
    id: newSessionId,
    refreshTokenHash: hashRefreshToken(newRefreshToken),
    createdAt: now,
    expiresAt: new Date(now.getTime() + tokenConfig.refreshTtlSeconds() * 1000),
  }).run();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieConfig.accessName, newAccessToken, {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: tokenConfig.accessTtlSeconds(),
  });
  response.cookies.set(cookieConfig.refreshName, newRefreshToken, {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: tokenConfig.refreshTtlSeconds(),
  });

  return response;
}
