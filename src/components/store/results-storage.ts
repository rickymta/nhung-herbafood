export type RecentAssessment = { code: string; type: string; at: number };
const KEY = "tn_assessments_v1";

export function readRecent(): RecentAssessment[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function addRecentAssessment(a: RecentAssessment) {
  try {
    const list = readRecent().filter((x) => x.code !== a.code);
    localStorage.setItem(KEY, JSON.stringify([a, ...list].slice(0, 20)));
  } catch {}
}
