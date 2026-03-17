import { newDb } from "pg-mem";
import { describe, expect, it } from "vitest";

describe("files metadata", () => {
  it("filters out soft-deleted files", async () => {
    const mem = newDb();
    const now = new Date();
    const db = mem.public;
    const nowIso = now.toISOString();

    db.none(`
      CREATE TABLE files (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        original_name TEXT NOT NULL,
        stored_path TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL,
        is_image INTEGER NOT NULL,
        like_count INTEGER NOT NULL DEFAULT 0,
        dislike_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);

    db.none(`
      INSERT INTO files (
        id,
        title,
        description,
        original_name,
        stored_path,
        mime_type,
        size_bytes,
        is_image,
        created_at,
        deleted_at
      ) VALUES
        ('file-1', 'a.txt', 'a.txt', 'a.txt', '/tmp/a.txt', 'text/plain', 10, 0, '${nowIso}', NULL),
        ('file-2', 'b.txt', 'b.txt', 'b.txt', '/tmp/b.txt', 'text/plain', 20, 0, '${nowIso}', '${nowIso}');
    `);

    const visible = db.many(
      "SELECT id FROM files WHERE deleted_at IS NULL ORDER BY id"
    );

    expect(visible).toHaveLength(1);
    expect(visible[0]?.id).toBe("file-1");
  });
});
