import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { adminSessions } from "@/lib/schema";
import {
  cookieConfig,
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  tokenConfig,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const now = new Date();
  const sessionId = crypto.randomUUID();
  const refreshToken = await signRefreshToken(sessionId);
  const accessToken = await signAccessToken();

  db.insert(adminSessions).values({
    id: sessionId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    createdAt: now,
    expiresAt: new Date(now.getTime() + tokenConfig.refreshTtlSeconds() * 1000),
  }).run();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieConfig.accessName, accessToken, {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: tokenConfig.accessTtlSeconds(),
  });
  response.cookies.set(cookieConfig.refreshName, refreshToken, {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: tokenConfig.refreshTtlSeconds(),
  });

  return response;
}
