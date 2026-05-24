import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, type SeoSetting } from "@/lib/cms";

export const Route = createFileRoute("/admin/seo")({ component: SeoAdmin });

type Form = { page_key: string; title: string; description: string; og_image_url: string; canonical_url: string; noindex: boolean };
const empty: Form = { page_key: "", title: "", description: "", og_image_url: "", canonical_url: "", noindex: false };

function SeoAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","seo"], queryFn: () => fetchAll("seo_settings", { col: "page_key", asc: true }) as Promise<SeoSetting[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const inv = () => qc.invalidateQueries({ queryKey: ["admin","seo"] });
  const save = async () => {
    const payload = { page_key: form.page_key, title: form.title || null, description: form.description || null, og_image_url: form.og_image_url || null, canonical_url: form.canonical_url || null, noindex: form.noindex };
    if (editing === "new") { const { error } = await supabase.from("seo_settings").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("seo_settings").update(payload).eq("id", editing); if (error) return alert(error.message); }
    setEditing(null); inv();
  };
  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Discoverability" title="SEO Settings" subtitle="Per-page meta titles, descriptions, and social images."
        action={<button onClick={() => { setEditing("new"); setForm(empty); }} className="btn-primary">+ New Entry</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Page key</label><input className={inputCls} value={form.page_key} onChange={(e) => setForm({ ...form, page_key: e.target.value })} /></div>
            <div><label className={labelCls}>Canonical URL</label><input className={inputCls} value={form.canonical_url} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Title (≤60)</label><input className={inputCls} maxLength={70} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className={labelCls}>Description (≤160)</label><textarea rows={2} maxLength={180} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className={labelCls}>OG Image URL</label><input className={inputCls} value={form.og_image_url} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.noindex} onChange={(e) => setForm({ ...form, noindex: e.target.checked })} /> <span className="text-[13px]">No-index</span></label>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((s) => (
          <div key={s.id} className="p-5 flex gap-6 items-center">
            <div className="flex-1"><div className="font-serif text-[16px] text-[var(--navy-deep)]">{s.page_key}</div><div className="text-[12px] text-[var(--warm-gray)] truncate">{s.title}</div></div>
            {s.noindex && <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 uppercase">No-index</span>}
            <button onClick={() => { setEditing(s.id); setForm({ page_key: s.page_key, title: s.title ?? "", description: s.description ?? "", og_image_url: s.og_image_url ?? "", canonical_url: s.canonical_url ?? "", noindex: s.noindex }); }} className="text-[12px] uppercase text-[var(--gold-muted)]">Edit</button>
            <button onClick={async () => { if (!confirm("Delete?")) return; await supabase.from("seo_settings").delete().eq("id", s.id); inv(); }} className="text-[12px] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No entries yet.</div>}
      </AdminCard>
    </div>
  );
}