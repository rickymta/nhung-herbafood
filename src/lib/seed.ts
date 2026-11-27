import type { DatabaseSync } from "node:sqlite";
import { seedStore } from "./seed/store";
import { seedAdmin } from "./seed/admin";
import { hashPassword } from "./auth-hash";

/**
 * Runs once when the DB is empty (see db.ts). Order matters:
 * store catalogue first (products/articles), then affiliate data that references it.
 */
export function seedDatabase(db: DatabaseSync) {
  db.exec("BEGIN");
  try {
    const email = process.env.ADMIN_EMAIL || "admin@tnstrokeguard.local";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    db.prepare("INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, 'owner', ?)").run(
      email,
      process.env.ADMIN_NAME || "CEO Triệu Nhung",
      hashPassword(password),
    );
    seedStore(db);
    seedAdmin(db);
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('seeded_at', datetime('now'))").run();
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
