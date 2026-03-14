import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminSessions } from "@/lib/schema";
import { cookieConfig, hashRefreshToken, verifyRefreshToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(cookieConfig.refreshName)?.value;

  if (refreshToken) {
    try {
      const payload = (await verifyRefreshToken(refreshToken)) as { sid?: string };
      if (payload.sid) {
        db.update(adminSessions)
          .set({ revokedAt: new Date() })
          .where(eq(adminSessions.id, payload.sid))
          .run();
      }
    } catch {
      // ignore invalid token on logout
    }
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieConfig.accessName, "", {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: 0,
  });
  response.cookies.set(cookieConfig.refreshName, "", {
    httpOnly: cookieConfig.httpOnly,
    sameSite: cookieConfig.sameSite,
    secure: cookieConfig.secure,
    path: cookieConfig.path,
    maxAge: 0,
  });

  return response;
}
