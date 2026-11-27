import "server-only";
import { all, get, run } from "../db";
import { VALID, paginate, type SP, sp1, spInt } from "./common";

export function logActivity(actor: string, action: string, target: string) {
  run("INSERT INTO activity_logs (actor,action,target) VALUES (?,?,?)", [actor, action, target]);
}
export function recentLogs(limit = 30) {
  return all<{ id: number; actor: string; action: string; target: string | null; created_at: string }>("SELECT * FROM activity_logs ORDER BY created_at DESC, id DESC LIMIT ?", [limit]);
}

/* settings */
export function allSettings(): Record<string, string> {
  const rows = all<{ key: string; value: string }>("SELECT key,value FROM settings");
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
export function setSetting(key: string, value: string) {
  run("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", [key, value]);
}
export function adminUsers() {
  return all<{ id: number; email: string; name: string; role: string; created_at: string }>("SELECT id,email,name,role,created_at FROM admin_users ORDER BY id");
}

/* training */
export function listTrainings() {
  return all<{ id: number; title: string; category: string; level: string; format: string; duration_minutes: number; lessons: number; enrolled: number; completion_rate: number; status: string; description: string | null }>(
    "SELECT * FROM trainings ORDER BY (category='required') DESC, id");
}
export function saveTraining(id: number | null, d: { title: string; category: string; lessons: number; duration: number; description: string; status: string }) {
  if (id) run("UPDATE trainings SET title=?, category=?, lessons=?, duration_minutes=?, description=?, status=? WHERE id=?", [d.title, d.category, d.lessons, d.duration, d.description, d.status, id]);
  else run("INSERT INTO trainings (title,category,lessons,duration_minutes,description,status) VALUES (?,?,?,?,?,?)", [d.title, d.category, d.lessons, d.duration, d.description, d.status]);
}

/* integration */
export function integrationInfo() {
  const orders = get<{ n: number }>("SELECT COUNT(*) n FROM orders")!.n;
  const products = get<{ n: number }>("SELECT COUNT(*) n FROM products")!.n;
  const events = get<{ n: number }>("SELECT COUNT(*) n FROM webhook_logs WHERE status='success'")!.n;
  const logs = all<{ id: number; event: string; status: string; message: string | null; created_at: string }>("SELECT * FROM webhook_logs ORDER BY created_at DESC, id DESC LIMIT 40");
  return { orders, products, events, logs };
}
export function addWebhook(event: string, status: string, message: string) {
  run("INSERT INTO webhook_logs (event,status,message) VALUES (?,?,?)", [event, status, message]);
}

/* assessments */
export function listAssessments(sp: SP, per = 15) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (sp1(sp.type)) { where.push("type=?"); params.push(sp1(sp.type)); }
  if (sp1(sp.risk)) { where.push("risk_level=?"); params.push(sp1(sp.risk)); }
  if (sp1(sp.q)) { where.push("(name LIKE ? OR phone LIKE ? OR code LIKE ?)"); params.push(...Array(3).fill(`%${sp1(sp.q)}%`)); }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM assessments ${w}`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const rows = all<{ id: number; code: string; type: string; score: number; risk_level: string; name: string | null; phone: string | null; created_at: string }>(
    `SELECT id,code,type,score,risk_level,name,phone,created_at FROM assessments ${w} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, [...params, per, pg.offset]);
  const dist = all<{ k: string; n: number }>("SELECT risk_level k, COUNT(*) n FROM assessments GROUP BY k");
  const byType = all<{ k: string; n: number }>("SELECT type k, COUNT(*) n FROM assessments GROUP BY k");
  return { rows, pg, dist, byType, total: get<{ n: number }>("SELECT COUNT(*) n FROM assessments")!.n };
}

/* content */
export function listArticles() {
  return all<{ id: number; slug: string; title: string; topic: string; topic_label: string; excerpt: string | null; image: string | null; author: string | null; status: string; published_at: string; read_minutes: number; body: string | null }>(
    "SELECT id,slug,title,topic,topic_label,excerpt,image,author,status,published_at,read_minutes,body FROM articles ORDER BY published_at DESC, id DESC");
}
export function getArticle(id: number) {
  return get<{ id: number; title: string; topic: string; topic_label: string; excerpt: string | null; image: string | null; author: string | null; status: string; read_minutes: number; body: string | null }>(
    "SELECT id,title,topic,topic_label,excerpt,image,author,status,read_minutes,body FROM articles WHERE id=?", [id]);
}
export function listVideos() {
  return all<{ id: number; title: string; tag: string | null; overlay_title: string | null; overlay_subtitle: string | null; image: string | null; url: string | null; sort: number }>("SELECT * FROM videos ORDER BY sort, id");
}
export function getVideo(id: number) {
  return get<{ id: number; title: string; tag: string | null; overlay_title: string | null; overlay_subtitle: string | null; image: string | null; url: string | null; sort: number }>("SELECT * FROM videos WHERE id=?", [id]);
}
export { VALID };
