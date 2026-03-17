import { NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = await db
    .update(files)
    .set({ likeCount: sql`${files.likeCount} + 1` })
    .where(and(eq(files.id, id), isNull(files.deletedAt)))
    .returning({ id: files.id });

  if (updated.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const records = await db
    .select({ likeCount: files.likeCount, dislikeCount: files.dislikeCount })
    .from(files)
    .where(eq(files.id, id));
  const record = records[0];

  return NextResponse.json({
    likeCount: record?.likeCount ?? 0,
    dislikeCount: record?.dislikeCount ?? 0,
  });
}
