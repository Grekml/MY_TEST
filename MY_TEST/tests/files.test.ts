import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { isNull } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { files } from "../lib/schema";

describe("files metadata", () => {
  it("filters out soft-deleted files", () => {
    const sqlite = new Database(":memory:");
    sqlite.exec(`
      CREATE TABLE files (
        id TEXT PRIMARY KEY,
        original_name TEXT NOT NULL,
        stored_path TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        is_image INTEGER NOT NULL,
        like_count INTEGER NOT NULL DEFAULT 0,
        dislike_count INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        deleted_at INTEGER
      );
    `);

    const db = drizzle(sqlite, { schema: { files } });
    const now = new Date();

    db.insert(files).values([
      {
        id: "file-1",
        originalName: "a.txt",
        storedPath: "/tmp/a.txt",
        mimeType: "text/plain",
        sizeBytes: 10,
        isImage: false,
        createdAt: now,
        deletedAt: null,
      },
      {
        id: "file-2",
        originalName: "b.txt",
        storedPath: "/tmp/b.txt",
        mimeType: "text/plain",
        sizeBytes: 20,
        isImage: false,
        createdAt: now,
        deletedAt: new Date(now.getTime()),
      },
    ]).run();

    const visible = db
      .select()
      .from(files)
      .where(isNull(files.deletedAt))
      .all();

    expect(visible).toHaveLength(1);
    expect(visible[0]?.id).toBe("file-1");
  });
});
