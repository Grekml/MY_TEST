import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dataDir = process.env.DATA_DIR ?? "./data";
const dbPath = `${dataDir.replace(/\/$/, "")}/db.sqlite`;

mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
