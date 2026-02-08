import { NextResponse } from "next/server";
import { eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = db
    .update(files)
    .set({ dislikeCount: sql`${files.dislikeCount} + 1` })
    .where(eq(files.id, id))
    .where(isNull(files.deletedAt))
    .run();

  if (!result.changes) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const record = db
    .select({ likeCount: files.likeCount, dislikeCount: files.dislikeCount })
    .from(files)
    .where(eq(files.id, id))
    .get();

  return NextResponse.json({
    likeCount: record?.likeCount ?? 0,
    dislikeCount: record?.dislikeCount ?? 0,
  });
}
