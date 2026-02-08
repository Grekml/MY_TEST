import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const record = db
    .select()
    .from(files)
    .where(eq(files.id, id))
    .get();

  if (!record || record.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = await readFile(record.storedPath).catch(() => null);
  if (!buffer) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const disposition = record.isImage ? "inline" : "attachment";
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": record.mimeType,
      "Content-Disposition": `${disposition}; filename="${record.originalName}"`,
    },
  });
}
