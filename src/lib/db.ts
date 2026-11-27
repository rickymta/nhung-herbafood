import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "./schema";
import { seedDatabase } from "./seed";

/**
 * SQLite connection (built-in `node:sqlite`, Node >= 22.13 — no native build step).
 * The DB file lives at DATABASE_PATH (default ./data/app.db). Schema is created and
 * demo data seeded automatically on first connection.
 */
// On Vercel the deployment filesystem is read-only; only /tmp is writable (and it is
// per-instance + ephemeral, so the demo DB re-seeds on each cold start).
const DB_PATH =
  process.env.DATABASE_PATH ||
  (process.env.VERCEL ? "/tmp/tn-app.db" : path.join(process.cwd(), "data", "app.db"));

type GlobalWithDb = typeof globalThis & { __tnDb?: DatabaseSync };
const g = globalThis as GlobalWithDb;

function open(): DatabaseSync {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA_SQL);
  const seeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded_at'").get();
  if (!seeded) seedDatabase(db);
  return db;
}

export function getDb(): DatabaseSync {
  if (!g.__tnDb) g.__tnDb = open();
  return g.__tnDb;
}

type Param = string | number | bigint | null | Uint8Array;
export type Params = Param[] | Record<string, Param>;

function bind(params?: Params): Param[] | [Record<string, Param>] {
  if (!params) return [];
  return Array.isArray(params) ? params : [params];
}

export function all<T>(sql: string, params?: Params): T[] {
  return getDb().prepare(sql).all(...(bind(params) as Param[])) as T[];
}

export function get<T>(sql: string, params?: Params): T | undefined {
  return getDb().prepare(sql).get(...(bind(params) as Param[])) as T | undefined;
}

export function run(sql: string, params?: Params) {
  return getDb().prepare(sql).run(...(bind(params) as Param[]));
}

export function tx<T>(fn: () => T): T {
  const db = getDb();
  db.exec("BEGIN");
  try {
    const out = fn();
    db.exec("COMMIT");
    return out;
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}

export function parseJson<T>(v: unknown, fallback: T): T {
  if (typeof v !== "string" || !v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}
