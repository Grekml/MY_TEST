import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { files } from "@/lib/schema";
import { cookieConfig, verifyAccessToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ensureAuth = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(cookieConfig.accessName)?.value;
  if (!accessToken) return false;
  try {
    await verifyAccessToken(accessToken);
    return true;
  } catch {
    return false;
  }
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const record = db
    .select()
    .from(files)
    .where(eq(files.id, id))
    .get();

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ item: record });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await ensureAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { title, description } = (await request.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
  };

  if (!title || !description) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  db.update(files)
    .set({ title, description })
    .where(eq(files.id, id))
    .run();

  return NextResponse.json({ ok: true });
}
