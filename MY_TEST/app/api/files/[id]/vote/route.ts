import { NextResponse } from "next/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type VoteValue = "like" | "dislike" | "none";

const toDelta = (prevVote: VoteValue, nextVote: VoteValue) => {
  let likeDelta = 0;
  let dislikeDelta = 0;

  if (prevVote === "like") likeDelta -= 1;
  if (prevVote === "dislike") dislikeDelta -= 1;

  if (nextVote === "like") likeDelta += 1;
  if (nextVote === "dislike") dislikeDelta += 1;

  return { likeDelta, dislikeDelta };
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { prevVote = "none", nextVote = "none" } =
    (await request.json().catch(() => ({}))) as {
      prevVote?: VoteValue;
      nextVote?: VoteValue;
    };

  const { likeDelta, dislikeDelta } = toDelta(prevVote, nextVote);

  if (likeDelta === 0 && dislikeDelta === 0) {
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

  const updated = await db
    .update(files)
    .set({
      likeCount: sql`greatest(${files.likeCount} + ${likeDelta}, 0)`,
      dislikeCount: sql`greatest(${files.dislikeCount} + ${dislikeDelta}, 0)`,
    })
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
