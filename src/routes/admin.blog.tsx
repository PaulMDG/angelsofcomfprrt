import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, StatusPill, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, slugify, uploadMedia, type BlogPost } from "@/lib/cms";
import { RichEditor } from "@/components/admin/RichEditor";

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

type Form = { slug: string; title: string; excerpt: string; body_html: string; cover_image_url: string; tags: string; author: string; published: boolean };
const empty: Form = { slug: "", title: "", excerpt: "", body_html: "", cover_image_url: "", tags: "", author: "", published: false };

function BlogAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","blog"], queryFn: () => fetchAll("blog_posts") as Promise<BlogPost[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin","blog"] }); qc.invalidateQueries({ queryKey: ["public","blog"] }); };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const startEdit = (p: BlogPost) => { setEditing(p.id); setForm({ slug: p.slug, title: p.title, excerpt: p.excerpt ?? "", body_html: p.body_html ?? "", cover_image_url: p.cover_image_url ?? "", tags: (p.tags ?? []).join(", "), author: p.author ?? "", published: p.published }); };
  const cancel = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    const slug = form.slug || slugify(form.title);
    const payload = {
      slug, title: form.title, excerpt: form.excerpt || null, body_html: form.body_html || null,
      cover_image_url: form.cover_image_url || null, author: form.author || null,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    };
    if (editing === "new") { const { error } = await supabase.from("blog_posts").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing); if (error) return alert(error.message); }
    cancel(); inv();
  };
  const remove = async (id: string) => { if (!confirm("Delete post?")) return; await supabase.from("blog_posts").delete().eq("id", id); inv(); };
  const togglePub = async (p: BlogPost) => { await supabase.from("blog_posts").update({ published: !p.published, published_at: !p.published ? new Date().toISOString() : p.published_at }).eq("id", p.id); inv(); };
  const uploadCover = async (file: File) => { try { const { url } = await uploadMedia(file, "blog"); setForm((f) => ({ ...f, cover_image_url: url })); } catch (e) { alert((e as Error).message); } };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Journal" title="Blog Posts" subtitle="Long-form writing for families."
        action={<button onClick={startNew} className="btn-primary">+ New Post</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} /></div>
            <div><label className={labelCls}>Slug</label><input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Excerpt</label><textarea rows={2} className={inputCls} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
          <div>
            <label className={labelCls}>Cover image</label>
            <div className="flex gap-3 items-center">
              <input className={inputCls} value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} placeholder="https://…" />
              <label className="btn-outline cursor-pointer whitespace-nowrap"><input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />Upload</label>
            </div>
            {form.cover_image_url && <img src={form.cover_image_url} alt="" className="mt-3 h-32 object-cover rounded" />}
          </div>
          <div><label className={labelCls}>Body</label><RichEditor value={form.body_html} onChange={(html) => setForm({ ...form, body_html: html })} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={labelCls}>Author</label><input className={inputCls} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            <div><label className={labelCls}>Tags (comma-separated)</label><input className={inputCls} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> <span className="text-[13px]">Published</span></label>
          </div>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={cancel} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((p) => (
          <div key={p.id} className="p-5 flex gap-6 items-center">
            {p.cover_image_url && <img src={p.cover_image_url} alt="" className="w-20 h-20 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-serif text-[18px] text-[var(--navy-deep)]">{p.title}</div>
              <div className="text-[11px] text-[var(--warm-gray)]">/{p.slug} · {p.author}</div>
              {p.excerpt && <p className="text-[13px] text-[var(--warm-gray)] mt-1 line-clamp-1">{p.excerpt}</p>}
            </div>
            <StatusPill on={p.published} onClick={() => togglePub(p)} />
            <button onClick={() => startEdit(p)} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Edit</button>
            <button onClick={() => remove(p.id)} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No posts yet.</div>}
      </AdminCard>
    </div>
  );
}