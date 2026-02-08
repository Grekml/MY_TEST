import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { cookieConfig, verifyAccessToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxFileSize = 50 * 1024 * 1024;

const sanitizeName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "_");

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const guessMimeType = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
};

export async function POST(request: Request) {
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

  const formData = await request.formData();
  const uploads = formData.getAll("files");

  if (!uploads.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const dataDir = process.env.DATA_DIR ?? "./data";
  const uploadsDir = path.join(dataDir, "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const now = new Date();
  const inserted: Array<typeof files.$inferInsert> = [];

  for (const entry of uploads) {
    if (!(entry instanceof File)) {
      continue;
    }

    if (entry.size > maxFileSize) {
      return NextResponse.json(
        { error: `File too large: ${entry.name}` },
        { status: 413 }
      );
    }

    const fileId = crypto.randomUUID();
    const safeName = sanitizeName(entry.name || "file");
    const storedFileName = `${fileId}-${safeName}`;
    const storedPath = path.join(uploadsDir, storedFileName);

    const arrayBuffer = await entry.arrayBuffer();
    await writeFile(storedPath, Buffer.from(arrayBuffer));

    const mimeType = entry.type || guessMimeType(entry.name || storedFileName);
    const isImage = imageMimeTypes.has(mimeType);

    inserted.push({
      id: fileId,
      originalName: entry.name || storedFileName,
      storedPath,
      mimeType,
      sizeBytes: entry.size,
      isImage,
      createdAt: now,
    });
  }

  if (inserted.length) {
    db.insert(files).values(inserted).run();
  }

  return NextResponse.json({ items: inserted });
}
