import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, StatusPill, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, slugify, type ServiceArea } from "@/lib/cms";

export const Route = createFileRoute("/admin/service-areas")({ component: AreasAdmin });

type Form = { slug: string; name: string; description: string; body_html: string; zip_codes: string; sort_order: number; published: boolean };
const empty: Form = { slug: "", name: "", description: "", body_html: "", zip_codes: "", sort_order: 0, published: true };

function AreasAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","areas"], queryFn: () => fetchAll("service_areas", { col: "sort_order", asc: true }) as Promise<ServiceArea[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin","areas"] }); qc.invalidateQueries({ queryKey: ["public","areas"] }); };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const startEdit = (a: ServiceArea) => { setEditing(a.id); setForm({ slug: a.slug, name: a.name, description: a.description ?? "", body_html: a.body_html ?? "", zip_codes: (a.zip_codes ?? []).join(", "), sort_order: a.sort_order, published: a.published }); };
  const cancel = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    const payload = { slug: form.slug || slugify(form.name), name: form.name, description: form.description || null, body_html: form.body_html || null, zip_codes: form.zip_codes.split(",").map((s) => s.trim()).filter(Boolean), sort_order: form.sort_order, published: form.published };
    if (editing === "new") { const { error } = await supabase.from("service_areas").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("service_areas").update(payload).eq("id", editing); if (error) return alert(error.message); }
    cancel(); inv();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("service_areas").delete().eq("id", id); inv(); };
  const togglePub = async (a: ServiceArea) => { await supabase.from("service_areas").update({ published: !a.published }).eq("id", a.id); inv(); };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Geography" title="Service Areas" subtitle="Counties and ZIPs you serve."
        action={<button onClick={startNew} className="btn-primary">+ New Area</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} /></div>
            <div><label className={labelCls}>Slug</label><input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Short description</label><textarea rows={2} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><label className={labelCls}>Body (HTML)</label><textarea rows={6} className={inputCls} value={form.body_html} onChange={(e) => setForm({ ...form, body_html: e.target.value })} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><label className={labelCls}>ZIP codes (comma-separated)</label><input className={inputCls} value={form.zip_codes} onChange={(e) => setForm({ ...form, zip_codes: e.target.value })} /></div>
            <div><label className={labelCls}>Sort order</label><input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> <span className="text-[13px]">Published</span></label>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={cancel} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((a) => (
          <div key={a.id} className="p-5 flex gap-6 items-center">
            <div className="flex-1"><div className="font-serif text-[18px] text-[var(--navy-deep)]">{a.name}</div><div className="text-[11px] text-[var(--warm-gray)] mt-0.5">/{a.slug} · {(a.zip_codes ?? []).length} ZIPs</div></div>
            <StatusPill on={a.published} onClick={() => togglePub(a)} />
            <button onClick={() => startEdit(a)} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Edit</button>
            <button onClick={() => remove(a.id)} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No service areas yet.</div>}
      </AdminCard>
    </div>
  );
}