/**
 * Assessment content + scoring (client-safe, pure functions).
 *
 * General: heuristic stroke-risk model inspired by Framingham Stroke Profile (points -> 10y %),
 *          AHA Life's Essential 8 (0-100) and the INTERSTROKE modifiable-factor count.
 *          It is a screening aid, NOT a validated diagnostic calculator.
 * AFib:    CHA2DS2-VASc, standard clinical scoring (ESC).
 */

export type Sex = "male" | "female";
export type RiskLevel = "low" | "moderate" | "high";

export type Question = {
  id: string;
  group: string;
  text: string;
  hint?: string;
  options: { value: string; label: string }[];
};

export const GENERAL_QUESTIONS: Question[] = [
  { id: "sbp", group: "Huyết áp & tim mạch", text: "Huyết áp tâm thu (số trên) gần nhất của bạn?", hint: "Nếu không nhớ, hãy chọn \"Không rõ\" - nên đo lại sớm.", options: [
    { value: "lt120", label: "Dưới 120 mmHg" }, { value: "120", label: "120 – 129 mmHg" }, { value: "130", label: "130 – 139 mmHg" },
    { value: "140", label: "140 – 159 mmHg" }, { value: "160", label: "Từ 160 mmHg trở lên" }, { value: "unknown", label: "Không rõ" } ] },
  { id: "bpMeds", group: "Huyết áp & tim mạch", text: "Bạn có đang dùng thuốc hạ huyết áp?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có" }] },
  { id: "afib", group: "Huyết áp & tim mạch", text: "Bạn đã từng được chẩn đoán Rung nhĩ hoặc rối loạn nhịp tim?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có" }] },
  { id: "heart", group: "Huyết áp & tim mạch", text: "Bạn có bệnh mạch vành, nhồi máu cơ tim hoặc suy tim?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có" }] },
  { id: "priorStroke", group: "Tiền sử", text: "Bạn đã từng bị đột quỵ hoặc cơn thiếu máu não thoáng qua (TIA)?", options: [{ value: "no", label: "Chưa bao giờ" }, { value: "yes", label: "Đã từng" }] },
  { id: "family", group: "Tiền sử", text: "Cha mẹ hoặc anh chị em ruột có người bị đột quỵ trước 65 tuổi?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có" }] },
  { id: "diabetes", group: "Chuyển hóa", text: "Tình trạng đường huyết của bạn?", options: [
    { value: "normal", label: "Bình thường" }, { value: "pre", label: "Tiền đái tháo đường" }, { value: "dm", label: "Đã chẩn đoán đái tháo đường" }, { value: "unknown", label: "Chưa kiểm tra" } ] },
  { id: "lipid", group: "Chuyển hóa", text: "Mỡ máu (cholesterol) của bạn?", options: [
    { value: "normal", label: "Bình thường" }, { value: "high", label: "Cao / đang điều trị" }, { value: "unknown", label: "Chưa kiểm tra" } ] },
  { id: "smoking", group: "Lối sống", text: "Bạn có hút thuốc lá (kể cả thuốc lá điện tử)?", options: [
    { value: "never", label: "Chưa bao giờ" }, { value: "former", label: "Đã bỏ trên 1 năm" }, { value: "current", label: "Đang hút hoặc bỏ dưới 1 năm" } ] },
  { id: "alcohol", group: "Lối sống", text: "Mức độ uống rượu bia?", options: [
    { value: "none", label: "Không / rất hiếm" }, { value: "moderate", label: "Vừa phải (≤ 1–2 ly/ngày)" }, { value: "heavy", label: "Nhiều (thường xuyên say, > 2 ly/ngày)" } ] },
  { id: "activity", group: "Lối sống", text: "Thời gian vận động thể lực cường độ vừa mỗi tuần?", options: [
    { value: "ge150", label: "Từ 150 phút trở lên" }, { value: "75", label: "75 – 149 phút" }, { value: "lt75", label: "Dưới 75 phút" } ] },
  { id: "diet", group: "Lối sống", text: "Chế độ ăn của bạn (rau, cá, ít muối, ít đồ chiên rán)?", options: [
    { value: "good", label: "Tốt, theo chế độ ăn nhạt – nhiều rau" }, { value: "average", label: "Trung bình" }, { value: "poor", label: "Nhiều muối, đồ chiên, thịt chế biến" } ] },
  { id: "sleep", group: "Lối sống", text: "Thời gian ngủ trung bình mỗi đêm?", options: [
    { value: "7-9", label: "7 – 9 giờ" }, { value: "6-7", label: "6 – dưới 7 giờ" }, { value: "lt6", label: "Dưới 6 giờ" }, { value: "gt9", label: "Trên 9 giờ" } ] },
];

export const AFIB_QUESTIONS: Question[] = [
  { id: "chf", group: "C", text: "Bạn có suy tim sung huyết hoặc giảm chức năng tâm thu thất trái?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có (+1 điểm)" }] },
  { id: "htn", group: "H", text: "Bạn có tăng huyết áp (đang điều trị hoặc huyết áp ≥ 140/90 mmHg)?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có (+1 điểm)" }] },
  { id: "dm", group: "D", text: "Bạn có đái tháo đường?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có (+1 điểm)" }] },
  { id: "stroke", group: "S₂", text: "Bạn đã từng bị đột quỵ, TIA hoặc thuyên tắc mạch hệ thống?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có (+2 điểm)" }] },
  { id: "vascular", group: "V", text: "Bạn có bệnh mạch máu (nhồi máu cơ tim cũ, bệnh động mạch ngoại biên, mảng xơ vữa động mạch chủ)?", options: [{ value: "no", label: "Không" }, { value: "yes", label: "Có (+1 điểm)" }] },
];

export type Basic = { name?: string; phone?: string; birthYear: number; sex: Sex; heightCm?: number; weightKg?: number };
export type StoredAnswers = { basic: Basic; answers: Record<string, string> };

export function ageFrom(birthYear: number, now = new Date()) {
  return now.getFullYear() - birthYear;
}

export type GeneralResult = {
  type: "general";
  age: number;
  framingham: { points: number; probability: number };
  le8: { score: number; parts: { label: string; score: number }[] };
  interstroke: { count: number; total: number; factors: { label: string; present: boolean }[] };
  bmi: number | null;
  score: number; // 10-year probability %
  risk: RiskLevel;
  advice: string[];
};

export function scoreGeneral(data: StoredAnswers): GeneralResult {
  const { basic, answers: a } = data;
  const age = ageFrom(basic.birthYear);
  const male = basic.sex === "male";

  // --- Framingham-inspired points ---
  let pts = 0;
  const ageBand = age < 45 ? 0 : age < 50 ? 1 : age < 55 ? 2 : age < 60 ? 3 : age < 65 ? 4 : age < 70 ? 5 : age < 75 ? 6 : 7;
  pts += male ? ageBand : Math.max(ageBand - 1, 0);
  const sbpPts: Record<string, number> = { lt120: 0, "120": 1, "130": 2, "140": 3, "160": 5, unknown: 2 };
  pts += sbpPts[a.sbp] ?? 0;
  if (a.bpMeds === "yes") pts += 2;
  if (a.diabetes === "dm") pts += 3;
  else if (a.diabetes === "pre") pts += 1;
  if (a.smoking === "current") pts += 3;
  else if (a.smoking === "former") pts += 1;
  if (a.heart === "yes") pts += 3;
  if (a.afib === "yes") pts += 4;
  if (a.family === "yes") pts += 1;
  if (a.lipid === "high") pts += 1;
  if (a.priorStroke === "yes") pts += 6;
  const probability = Math.min(60, Math.round(1.1 * Math.exp(0.17 * pts) * 10) / 10);

  // --- BMI ---
  const bmi = basic.heightCm && basic.weightKg ? Math.round((basic.weightKg / (basic.heightCm / 100) ** 2) * 10) / 10 : null;

  // --- AHA LE8 sub-scores (simplified) ---
  const dietS = { good: 90, average: 55, poor: 20 }[a.diet as "good"] ?? 50;
  const actS = { ge150: 100, "75": 60, lt75: 15 }[a.activity as "ge150"] ?? 50;
  const nicS = { never: 100, former: 75, current: 0 }[a.smoking as "never"] ?? 50;
  const sleepS = { "7-9": 100, "6-7": 70, lt6: 30, gt9: 70 }[a.sleep as "7-9"] ?? 50;
  const bmiS = bmi === null ? 60 : bmi < 23 ? 100 : bmi < 25 ? 85 : bmi < 27.5 ? 60 : bmi < 30 ? 30 : 10;
  const lipS = { normal: 100, high: 40, unknown: 60 }[a.lipid as "normal"] ?? 60;
  const gluS = { normal: 100, pre: 60, dm: 30, unknown: 65 }[a.diabetes as "normal"] ?? 60;
  const bpS = ({ lt120: 100, "120": 75, "130": 50, "140": 25, "160": 0, unknown: 50 } as Record<string, number>)[a.sbp] ?? 50;
  const parts = [
    { label: "Chế độ ăn", score: dietS }, { label: "Vận động", score: actS }, { label: "Không thuốc lá", score: nicS },
    { label: "Giấc ngủ", score: sleepS }, { label: "Cân nặng (BMI)", score: bmiS }, { label: "Mỡ máu", score: lipS },
    { label: "Đường huyết", score: gluS }, { label: "Huyết áp", score: a.bpMeds === "yes" ? Math.max(bpS - 15, 0) : bpS },
  ];
  const le8 = Math.round(parts.reduce((s, p) => s + p.score, 0) / parts.length);

  // --- INTERSTROKE modifiable factors ---
  const factors = [
    { label: "Tăng huyết áp", present: ["140", "160"].includes(a.sbp) || a.bpMeds === "yes" },
    { label: "Hút thuốc lá", present: a.smoking === "current" },
    { label: "Ít vận động", present: a.activity === "lt75" },
    { label: "Chế độ ăn kém lành mạnh", present: a.diet === "poor" },
    { label: "Béo phì / thừa cân", present: bmi !== null && bmi >= 27.5 },
    { label: "Uống nhiều rượu bia", present: a.alcohol === "heavy" },
    { label: "Bệnh tim / rung nhĩ", present: a.afib === "yes" || a.heart === "yes" },
    { label: "Đái tháo đường", present: a.diabetes === "dm" },
    { label: "Rối loạn mỡ máu", present: a.lipid === "high" },
  ];
  const count = factors.filter((f) => f.present).length;

  let risk: RiskLevel = "low";
  if (probability >= 15 || a.priorStroke === "yes" || le8 < 50 || count >= 4) risk = "high";
  else if (probability >= 7 || le8 < 70 || count >= 2) risk = "moderate";

  const advice: string[] = [];
  if (a.priorStroke === "yes") advice.push("Bạn từng bị đột quỵ/TIA: cần tái khám chuyên khoa thần kinh - tim mạch định kỳ và dùng thuốc dự phòng theo chỉ định.");
  if (["140", "160", "unknown"].includes(a.sbp)) advice.push("Hãy đo huyết áp tại nhà 2 lần/ngày và gặp bác sĩ để có mục tiêu huyết áp phù hợp (thường dưới 130/80 mmHg).");
  if (a.smoking === "current") advice.push("Bỏ thuốc lá là việc đơn lẻ có hiệu quả nhất để giảm nguy cơ đột quỵ - hãy nhờ tư vấn cai thuốc.");
  if (a.activity === "lt75") advice.push("Tăng dần lên 150 phút vận động vừa mỗi tuần (đi bộ nhanh 30 phút, 5 ngày).");
  if (a.diet !== "good") advice.push("Giảm muối dưới 5 g/ngày, tăng rau xanh, cá, ngũ cốc nguyên hạt theo chế độ DASH.");
  if (a.diabetes === "unknown" || a.lipid === "unknown") advice.push("Xét nghiệm đường huyết đói/HbA1c và mỡ máu để biết chính xác chỉ số.");
  if (a.afib === "yes") advice.push("Bạn có rối loạn nhịp: hãy làm thêm bài Tầm soát Rung nhĩ (CHA₂DS₂-VASc) và hỏi bác sĩ về thuốc chống đông.");
  if (bmi !== null && bmi >= 25) advice.push("Duy trì cân nặng hợp lý (BMI dưới 23–25 với người châu Á).");
  if (!advice.length) advice.push("Chúc mừng, lối sống của bạn khá tốt. Hãy duy trì và kiểm tra sức khỏe định kỳ mỗi năm.");

  return { type: "general", age, framingham: { points: pts, probability }, le8: { score: le8, parts }, interstroke: { count, total: factors.length, factors }, bmi, score: probability, risk, advice };
}

export type AfibResult = {
  type: "afib";
  age: number;
  score: number;
  breakdown: { key: string; label: string; points: number }[];
  annualRisk: number;
  risk: RiskLevel;
  recommendation: string;
};

const ANNUAL: number[] = [0.2, 0.6, 2.2, 3.2, 4.8, 7.2, 9.7, 11.2, 10.8, 12.2];

export function scoreAfib(data: StoredAnswers): AfibResult {
  const { basic, answers: a } = data;
  const age = ageFrom(basic.birthYear);
  const female = basic.sex === "female";
  const breakdown = [
    { key: "C", label: "Suy tim sung huyết", points: a.chf === "yes" ? 1 : 0 },
    { key: "H", label: "Tăng huyết áp", points: a.htn === "yes" ? 1 : 0 },
    { key: "A₂", label: "Tuổi ≥ 75", points: age >= 75 ? 2 : 0 },
    { key: "D", label: "Đái tháo đường", points: a.dm === "yes" ? 1 : 0 },
    { key: "S₂", label: "Tiền sử đột quỵ / TIA", points: a.stroke === "yes" ? 2 : 0 },
    { key: "V", label: "Bệnh mạch máu", points: a.vascular === "yes" ? 1 : 0 },
    { key: "A", label: "Tuổi 65 – 74", points: age >= 65 && age < 75 ? 1 : 0 },
    { key: "Sc", label: "Giới nữ", points: female ? 1 : 0 },
  ];
  const score = breakdown.reduce((s, b) => s + b.points, 0);
  const eff = female ? score - 1 : score; // non-sex score
  let risk: RiskLevel;
  let recommendation: string;
  if (eff <= 0) {
    risk = "low";
    recommendation = "Nguy cơ huyết khối thấp, thường chưa cần thuốc chống đông. Bác sĩ sẽ đánh giá thêm theo từng trường hợp.";
  } else if (eff === 1) {
    risk = "moderate";
    recommendation = "Nguy cơ trung bình: bác sĩ có thể cân nhắc thuốc chống đông đường uống tùy vào nguy cơ chảy máu và mong muốn của bạn.";
  } else {
    risk = "high";
    recommendation = "Nguy cơ cao: theo khuyến cáo ESC, thường nên dùng thuốc chống đông đường uống. Hãy gặp bác sĩ tim mạch sớm để được chỉ định đúng.";
  }
  return { type: "afib", age, score, breakdown, annualRisk: ANNUAL[Math.min(score, 9)], risk, recommendation };
}

export const RISK_LABEL: Record<RiskLevel, string> = { low: "Nguy cơ thấp", moderate: "Nguy cơ trung bình", high: "Nguy cơ cao" };
export const TYPE_LABEL: Record<string, string> = { general: "Đánh giá Toàn diện 10 năm", afib: "Tầm soát Rung nhĩ (CHA₂DS₂-VASc)" };
