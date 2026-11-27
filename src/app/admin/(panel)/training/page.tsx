import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { listTrainings } from "@/lib/admin/misc";
import { Badge, Card, Field, Modal, Note, PageHeader, href } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/client";
import { num } from "@/lib/format";
import { type SP, sp1 } from "@/lib/admin/common";
import { deleteTrainingAction, saveTrainingAction } from "./actions";

export default async function TrainingPage({ searchParams }: PageProps<"/admin/training">) {
  const sp = (await searchParams) as SP;
  const rows = listTrainings();
  const e = sp1(sp.edit);
  const edit = e && e !== "new" ? rows.find((r) => r.id === Number(e)) : null;
  const form = edit ?? (e === "new" ? { id: 0, title: "", category: "required", lessons: 4, duration_minutes: 60, description: "", status: "published" } : null);
  const closeHref = href("/admin/training", sp, { edit: null });
  return (
    <>
      <PageHeader title="Đào tạo" sub="Học viện đối tác — nội dung đã được duyệt">
        <Link className="adm-btn p" href={href("/admin/training", sp, { edit: "new" })}><Plus size={16} /> Thêm khóa học</Link>
      </PageHeader>
      <Note>Nội dung quảng cáo thực phẩm bảo vệ sức khỏe phải được người chịu trách nhiệm duyệt và có phiên bản. Không khẳng định công dụng phòng/chữa bệnh.</Note>
      <div className="adm-grid adm-g2">
        {rows.map((t) => (
          <Card key={t.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <Badge tone={t.category === "required" ? "red" : "gray"}>{t.category === "required" ? "Bắt buộc" : "Tự chọn"}</Badge>
                {t.status !== "published" && <Badge tone="amber">Bản nháp</Badge>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Link className="adm-ib" href={href("/admin/training", sp, { edit: t.id })} title="Sửa"><Pencil size={14} /></Link>
                <form action={deleteTrainingAction}><input type="hidden" name="id" value={t.id} /><ConfirmButton className="adm-ib" message="Xóa khóa học này?"><Trash2 size={14} /></ConfirmButton></form>
              </div>
            </div>
            <h3 style={{ margin: "10px 0 4px", fontSize: 17 }}>{t.title}</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>{t.description}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 13, color: "var(--muted)", flexWrap: "wrap" }}>
              <span>{t.lessons} bài học</span><span>{t.duration_minutes} phút</span><span>phiên bản 1.0</span><span>{num(t.enrolled)} học viên</span>
            </div>
            <div style={{ marginTop: 10 }}><div className="adm-prog"><i style={{ width: `${t.completion_rate}%` }} /></div><span style={{ fontSize: 12.5, color: "var(--muted)" }}>Hoàn thành {num(t.completion_rate)}%</span></div>
          </Card>
        ))}
      </div>
      {form && (
        <Modal title={edit ? "Sửa khóa học" : "Thêm khóa học"} closeHref={closeHref}>
          <form action={saveTrainingAction}>
            {edit && <input type="hidden" name="id" value={edit.id} />}
            <div className="adm-fgrid">
              <Field label="Tên khóa học *" full><input className="adm-input" name="title" defaultValue={form.title} required /></Field>
              <Field label="Loại"><select className="adm-select" name="category" defaultValue={form.category}><option value="required">Bắt buộc</option><option value="optional">Tự chọn</option></select></Field>
              <Field label="Trạng thái"><select className="adm-select" name="status" defaultValue={form.status}><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option></select></Field>
              <Field label="Số bài học"><input className="adm-input" type="number" name="lessons" min={1} defaultValue={form.lessons} /></Field>
              <Field label="Thời lượng (phút)"><input className="adm-input" type="number" name="duration" min={5} defaultValue={form.duration_minutes} /></Field>
              <Field label="Mô tả" full><textarea className="adm-textarea" name="description" defaultValue={form.description ?? ""} /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
