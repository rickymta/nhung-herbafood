"use server";
import { requireAdmin } from "@/lib/auth";
import { logActivity, saveTraining } from "@/lib/admin/misc";
import { run } from "@/lib/db";
import { backOf, finish, int, str } from "@/lib/admin/action-utils";

export async function saveTrainingAction(fd: FormData) {
  const u = await requireAdmin();
  const title = str(fd, "title");
  if (!title) finish("/admin/training", "Vui lòng nhập tên khóa học");
  const id = str(fd, "id") ? int(fd, "id") : null;
  saveTraining(id, { title, category: str(fd, "category") === "optional" ? "optional" : "required", lessons: Math.max(1, int(fd, "lessons", 1)), duration: Math.max(5, int(fd, "duration", 30)), description: str(fd, "description"), status: str(fd, "status") === "draft" ? "draft" : "published" });
  logActivity(u.name, id ? "training.update" : "training.create", `${id ? "Cập nhật" : "Tạo"} khóa học ${title}`);
  finish("/admin/training", "Đã lưu khóa học");
}
export async function deleteTrainingAction(fd: FormData) {
  const u = await requireAdmin();
  run("DELETE FROM trainings WHERE id=?", [int(fd, "id")]);
  logActivity(u.name, "training.delete", `Xóa khóa học #${int(fd, "id")}`);
  finish(backOf(fd, "/admin/training"), "Đã xóa khóa học");
}
