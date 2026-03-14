import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { cookieConfig, verifyAccessToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(cookieConfig.accessName)?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await verifyAccessToken(accessToken);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = db
    .select()
    .from(files)
    .orderBy(desc(files.createdAt))
    .all();

  return NextResponse.json({ items: rows });
}
