"use server";

import { get, run } from "@/lib/db";
import {
  AFIB_QUESTIONS, GENERAL_QUESTIONS, scoreAfib, scoreGeneral, type Basic, type StoredAnswers,
} from "@/lib/store/assessment";

export type AssessmentInput = {
  type: "general" | "afib";
  basic: { name?: string; phone?: string; birthYear: number; sex: "male" | "female"; heightCm?: number; weightKg?: number };
  answers: Record<string, string>;
};

function newCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 10; i++) {
    let c = "TNA-";
    for (let j = 0; j < 8; j++) c += chars[Math.floor(Math.random() * chars.length)];
    if (!get("SELECT 1 FROM assessments WHERE code = ?", [c])) return c;
  }
  return `TNA-${Date.now()}`;
}

export async function submitAssessment(input: AssessmentInput): Promise<{ code?: string; error?: string }> {
  if (input.type !== "general" && input.type !== "afib") return { error: "Loại bài đánh giá không hợp lệ." };
  const year = Number(input.basic?.birthYear);
  const now = new Date().getFullYear();
  if (!Number.isInteger(year) || year < now - 110 || year > now) return { error: "Năm sinh không hợp lệ." };
  if (input.basic.sex !== "male" && input.basic.sex !== "female") return { error: "Vui lòng chọn giới tính." };
  const qs = input.type === "general" ? GENERAL_QUESTIONS : AFIB_QUESTIONS;
  const answers: Record<string, string> = {};
  for (const q of qs) {
    const v = input.answers?.[q.id];
    if (!q.options.some((o) => o.value === v)) return { error: "Vui lòng trả lời tất cả câu hỏi." };
    answers[q.id] = v;
  }
  const clean = (s?: string, n = 80) => (s ?? "").toString().trim().slice(0, n) || undefined;
  const basic: Basic = {
    name: clean(input.basic.name), phone: clean(input.basic.phone, 20), birthYear: year, sex: input.basic.sex,
    heightCm: input.basic.heightCm && input.basic.heightCm > 100 && input.basic.heightCm < 230 ? Math.round(input.basic.heightCm) : undefined,
    weightKg: input.basic.weightKg && input.basic.weightKg > 25 && input.basic.weightKg < 250 ? Math.round(input.basic.weightKg * 10) / 10 : undefined,
  };
  const stored: StoredAnswers = { basic, answers };
  const res = input.type === "general" ? scoreGeneral(stored) : scoreAfib(stored);
  const code = newCode();
  run("INSERT INTO assessments (code, type, answers, score, risk_level, name, phone) VALUES (?,?,?,?,?,?,?)", [
    code, input.type, JSON.stringify(stored), res.score, res.risk, basic.name ?? null, basic.phone ?? null,
  ]);
  return { code };
}
