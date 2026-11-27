"use server";
import { requireAdmin } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { logActivity } from "@/lib/admin/misc";
import { slugify } from "@/lib/format";
import { finish, int, str } from "@/lib/admin/action-utils";

export async function saveArticleAction(fd: FormData) {
  const u = await requireAdmin();
  const title = str(fd, "title");
  const id = str(fd, "id") ? int(fd, "id") : null;
  if (!title) finish("/admin/content?edit=" + (id ?? "new"), "Vui lòng nhập tiêu đề");
  const vals = [title, str(fd, "topic") || "general", str(fd, "topic_label"), str(fd, "excerpt") || null, str(fd, "image") || null, str(fd, "author") || null, str(fd, "status") === "draft" ? "draft" : "published", Math.max(1, int(fd, "read_minutes", 5)), str(fd, "body") || null];
  if (id) run("UPDATE articles SET title=?, topic=?, topic_label=?, excerpt=?, image=?, author=?, status=?, read_minutes=?, body=? WHERE id=?", [...vals, id]);
  else {
    let slug = slugify(title) || "bai-viet";
    while (get("SELECT 1 FROM articles WHERE slug=?", [slug])) slug += `-${Math.floor(Math.random() * 900 + 100)}`;
    run("INSERT INTO articles (title,topic,topic_label,excerpt,image,author,status,read_minutes,body,slug) VALUES (?,?,?,?,?,?,?,?,?,?)", [...vals, slug]);
  }
  logActivity(u.name, id ? "article.update" : "article.create", `${id ? "Cập nhật" : "Tạo"} bài viết ${title}`);
  finish("/admin/content", "Đã lưu bài viết", true);
}
export async function deleteArticleAction(fd: FormData) {
  const u = await requireAdmin();
  run("DELETE FROM articles WHERE id=?", [int(fd, "id")]);
  logActivity(u.name, "article.delete", `Xóa bài viết #${int(fd, "id")}`);
  finish("/admin/content", "Đã xóa bài viết", true);
}
export async function saveVideoAction(fd: FormData) {
  const u = await requireAdmin();
  const title = str(fd, "title");
  const id = str(fd, "id") ? int(fd, "id") : null;
  if (!title) finish("/admin/content?tab=videos&edit=" + (id ?? "new"), "Vui lòng nhập tiêu đề");
  const v = [title, str(fd, "tag") || null, str(fd, "overlay_title") || null, str(fd, "overlay_subtitle") || null, str(fd, "image") || null, str(fd, "url") || null, int(fd, "sort")];
  if (id) run("UPDATE videos SET title=?, tag=?, overlay_title=?, overlay_subtitle=?, image=?, url=?, sort=? WHERE id=?", [...v, id]);
  else run("INSERT INTO videos (title,tag,overlay_title,overlay_subtitle,image,url,sort) VALUES (?,?,?,?,?,?,?)", v);
  logActivity(u.name, id ? "video.update" : "video.create", `${id ? "Cập nhật" : "Tạo"} video ${title}`);
  finish("/admin/content?tab=videos", "Đã lưu video", true);
}
export async function deleteVideoAction(fd: FormData) {
  const u = await requireAdmin();
  run("DELETE FROM videos WHERE id=?", [int(fd, "id")]);
  logActivity(u.name, "video.delete", `Xóa video #${int(fd, "id")}`);
  finish("/admin/content?tab=videos", "Đã xóa video", true);
}
