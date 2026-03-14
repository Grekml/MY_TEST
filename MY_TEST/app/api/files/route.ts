import { NextResponse } from "next/server";
import { desc, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "50");

  const rows = db
    .select()
    .from(files)
    .where(isNull(files.deletedAt))
    .orderBy(desc(files.createdAt))
    .limit(Number.isFinite(limit) ? Math.min(limit, 200) : 50)
    .all();

  return NextResponse.json({ items: rows });
}
