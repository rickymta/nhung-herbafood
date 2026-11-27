import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getArticle, getVideo, listArticles, listVideos } from "@/lib/admin/misc";
import { Badge, Card, Field, Modal, PageHeader, Tabs, href } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/client";
import { dateVN } from "@/lib/format";
import { type SP, sp1 } from "@/lib/admin/common";
import { deleteArticleAction, deleteVideoAction, saveArticleAction, saveVideoAction } from "./actions";

export default async function ContentPage({ searchParams }: PageProps<"/admin/content">) {
  const sp = (await searchParams) as SP;
  const tab = sp1(sp.tab) === "videos" ? "videos" : "articles";
  const base = "/admin/content";
  const e = sp1(sp.edit);
  const closeHref = href(base, sp, { edit: null });
  const articles = tab === "articles" ? listArticles() : [];
  const videos = tab === "videos" ? listVideos() : [];
  const art = tab === "articles" && e ? (e === "new" ? { id: 0, title: "", topic: "general", topic_label: "", excerpt: "", image: "", author: "", status: "published", read_minutes: 5, body: "" } : getArticle(Number(e))) : null;
  const vid = tab === "videos" && e ? (e === "new" ? { id: 0, title: "", tag: "", overlay_title: "", overlay_subtitle: "", image: "", url: "", sort: 0 } : getVideo(Number(e))) : null;
  return (
    <>
      <PageHeader title="Nội dung cửa hàng" sub="Quản lý bài viết Góc sức khỏe & video hiển thị trên storefront">
        <Link className="adm-btn p" href={href(base, sp, { edit: "new" })}><Plus size={16} /> {tab === "articles" ? "Thêm bài viết" : "Thêm video"}</Link>
      </PageHeader>
      <Tabs items={[{ key: "articles", label: "Bài viết" }, { key: "videos", label: "Video" }]} active={tab} base={base} sp={{ ...sp, edit: undefined }} />

      {tab === "articles" && (
        <Card flush title={`Bài viết (${articles.length})`}>
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Tiêu đề</th><th>Chủ đề</th><th>Tác giả</th><th>Trạng thái</th><th>Ngày đăng</th><th /></tr></thead>
            <tbody>{articles.map((a) => (
              <tr key={a.id}><td style={{ maxWidth: 380 }}><b>{a.title}</b></td><td>{a.topic_label || a.topic}</td><td>{a.author ?? "—"}</td>
                <td><Badge tone={a.status === "published" ? "green" : "amber"}>{a.status === "published" ? "Đã đăng" : "Bản nháp"}</Badge></td><td>{dateVN(a.published_at)}</td>
                <td><div style={{ display: "flex", gap: 6 }}><Link className="adm-ib" href={href(base, sp, { edit: a.id })} title="Sửa"><Pencil size={14} /></Link>
                  <form action={deleteArticleAction}><input type="hidden" name="id" value={a.id} /><ConfirmButton className="adm-ib" message="Xóa bài viết này?"><Trash2 size={14} /></ConfirmButton></form></div></td></tr>))}
              {!articles.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Chưa có bài viết.</td></tr>}</tbody></table></div>
        </Card>
      )}
      {tab === "videos" && (
        <Card flush title={`Video (${videos.length})`}>
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Tiêu đề</th><th>Tag</th><th>Overlay</th><th>URL</th><th className="r">Thứ tự</th><th /></tr></thead>
            <tbody>{videos.map((v) => (
              <tr key={v.id}><td><b>{v.title}</b></td><td>{v.tag}</td><td>{v.overlay_title}</td><td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.url}</td><td className="r">{v.sort}</td>
                <td><div style={{ display: "flex", gap: 6 }}><Link className="adm-ib" href={href(base, sp, { edit: v.id })}><Pencil size={14} /></Link>
                  <form action={deleteVideoAction}><input type="hidden" name="id" value={v.id} /><ConfirmButton className="adm-ib" message="Xóa video này?"><Trash2 size={14} /></ConfirmButton></form></div></td></tr>))}
              {!videos.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Chưa có video.</td></tr>}</tbody></table></div>
        </Card>
      )}

      {art && (
        <Modal title={art.id ? "Sửa bài viết" : "Thêm bài viết"} closeHref={closeHref} wide>
          <form action={saveArticleAction}>
            {art.id ? <input type="hidden" name="id" value={art.id} /> : null}
            <div className="adm-fgrid">
              <Field label="Tiêu đề *" full><input className="adm-input" name="title" defaultValue={art.title} required /></Field>
              <Field label="Mã chủ đề"><input className="adm-input" name="topic" defaultValue={art.topic} /></Field>
              <Field label="Nhãn chủ đề"><input className="adm-input" name="topic_label" defaultValue={art.topic_label} /></Field>
              <Field label="Tác giả"><input className="adm-input" name="author" defaultValue={art.author ?? ""} /></Field>
              <Field label="Thời gian đọc (phút)"><input className="adm-input" type="number" name="read_minutes" defaultValue={art.read_minutes} /></Field>
              <Field label="Trạng thái"><select className="adm-select" name="status" defaultValue={art.status}><option value="published">Đã đăng</option><option value="draft">Bản nháp</option></select></Field>
              <Field label="URL ảnh"><input className="adm-input" name="image" defaultValue={art.image ?? ""} /></Field>
              <Field label="Tóm tắt" full><textarea className="adm-textarea" name="excerpt" defaultValue={art.excerpt ?? ""} /></Field>
              <Field label="Nội dung" full><textarea className="adm-textarea" style={{ minHeight: 180 }} name="body" defaultValue={art.body ?? ""} /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
          </form>
        </Modal>
      )}
      {vid && (
        <Modal title={vid.id ? "Sửa video" : "Thêm video"} closeHref={closeHref}>
          <form action={saveVideoAction}>
            {vid.id ? <input type="hidden" name="id" value={vid.id} /> : null}
            <div className="adm-fgrid">
              <Field label="Tiêu đề *" full><input className="adm-input" name="title" defaultValue={vid.title} required /></Field>
              <Field label="Tag"><input className="adm-input" name="tag" defaultValue={vid.tag ?? ""} /></Field>
              <Field label="Thứ tự"><input className="adm-input" type="number" name="sort" defaultValue={vid.sort} /></Field>
              <Field label="Overlay – tiêu đề" full><input className="adm-input" name="overlay_title" defaultValue={vid.overlay_title ?? ""} /></Field>
              <Field label="Overlay – phụ đề" full><input className="adm-input" name="overlay_subtitle" defaultValue={vid.overlay_subtitle ?? ""} /></Field>
              <Field label="URL ảnh thumbnail" full><input className="adm-input" name="image" defaultValue={vid.image ?? ""} /></Field>
              <Field label="URL video" full><input className="adm-input" name="url" defaultValue={vid.url ?? ""} /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
