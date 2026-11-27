import "server-only";
import { all, get, run } from "../db";
import { VALID, campaignState } from "./common";

export type CampRow = {
  id: number; code: string; name: string; type: string; description: string | null; bonus_rate: number; budget: number;
  start_date: string; end_date: string; status: string; utm_code: string | null; orders: number; gmv: number; commission: number;
};
export function listCampaigns() {
  const rows = all<CampRow>(
    `SELECT c.*,
       (SELECT COUNT(*) FROM orders o WHERE o.campaign_id=c.id AND o.status ${VALID}) orders,
       COALESCE((SELECT SUM(total) FROM orders o WHERE o.campaign_id=c.id AND o.status ${VALID}),0) gmv,
       COALESCE((SELECT SUM(m.amount) FROM commissions m JOIN orders o ON o.id=m.order_id WHERE o.campaign_id=c.id AND m.status!='rejected'),0) commission
     FROM campaigns c ORDER BY c.start_date DESC`,
  );
  return rows.map((r) => ({ ...r, state: campaignState(r) }));
}
export function createCampaign(d: { name: string; start: string; end: string; budget: number; utm: string; bonus: number; type: string; description: string }) {
  let code = "";
  do code = `CP-${d.utm.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "NEW"}${Math.floor(Math.random() * 90 + 10)}`;
  while (get("SELECT 1 FROM campaigns WHERE code=?", [code]));
  run(
    "INSERT INTO campaigns (code,name,type,description,bonus_rate,budget,start_date,end_date,status,utm_code) VALUES (?,?,?,?,?,?,?,?,'active',?)",
    [code, d.name, d.type, d.description || null, d.bonus, d.budget, d.start, d.end, d.utm],
  );
}
export function toggleCampaign(id: number) {
  run("UPDATE campaigns SET status = CASE WHEN status='active' THEN 'paused' ELSE 'active' END WHERE id=?", [id]);
}
export function activeCampaign(): { id: number; bonus_rate: number } | undefined {
  const t = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  return get("SELECT id, bonus_rate FROM campaigns WHERE status='active' AND start_date<=? AND end_date>=? ORDER BY start_date DESC LIMIT 1", [t, t]);
}
