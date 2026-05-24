import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, StatusPill, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, slugify, uploadMedia, type StaffMember } from "@/lib/cms";

export const Route = createFileRoute("/admin/staff")({ component: StaffAdmin });

type Form = { slug: string; full_name: string; role_title: string; photo_url: string; bio_html: string; credentials: string; sort_order: number; published: boolean };
const empty: Form = { slug: "", full_name: "", role_title: "", photo_url: "", bio_html: "", credentials: "", sort_order: 0, published: true };

function StaffAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","staff"], queryFn: () => fetchAll("staff", { col: "sort_order", asc: true }) as Promise<StaffMember[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const inv = () => { qc.invalidateQueries({ queryKey: ["admin","staff"] }); qc.invalidateQueries({ queryKey: ["public","staff"] }); };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const startEdit = (s: StaffMember) => { setEditing(s.id); setForm({ slug: s.slug, full_name: s.full_name, role_title: s.role_title ?? "", photo_url: s.photo_url ?? "", bio_html: s.bio_html ?? "", credentials: (s.credentials ?? []).join(", "), sort_order: s.sort_order, published: s.published }); };
  const cancel = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    const payload = { slug: form.slug || slugify(form.full_name), full_name: form.full_name, role_title: form.role_title || null, photo_url: form.photo_url || null, bio_html: form.bio_html || null, credentials: form.credentials.split(",").map((s) => s.trim()).filter(Boolean), sort_order: form.sort_order, published: form.published };
    if (editing === "new") { const { error } = await supabase.from("staff").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("staff").update(payload).eq("id", editing); if (error) return alert(error.message); }
    cancel(); inv();
  };
  const remove = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("staff").delete().eq("id", id); inv(); };
  const togglePub = async (s: StaffMember) => { await supabase.from("staff").update({ published: !s.published }).eq("id", s.id); inv(); };
  const uploadPhoto = async (file: File) => { try { const { url } = await uploadMedia(file, "staff"); setForm((f) => ({ ...f, photo_url: url })); } catch (e) { alert((e as Error).message); } };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Team" title="Staff & Caregivers" subtitle="The people behind the care."
        action={<button onClick={startNew} className="btn-primary">+ New Profile</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Full name</label><input className={inputCls} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><label className={labelCls}>Role title</label><input className={inputCls} value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Photo</label>
            <div className="flex gap-3 items-center">
              <input className={inputCls} value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="https://…" />
              <label className="btn-outline cursor-pointer whitespace-nowrap"><input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />Upload</label>
            </div>
            {form.photo_url && <img src={form.photo_url} alt="" className="mt-3 h-32 w-32 object-cover rounded-full" />}
          </div>
          <div><label className={labelCls}>Bio (HTML allowed)</label><textarea rows={6} className={inputCls} value={form.bio_html} onChange={(e) => setForm({ ...form, bio_html: e.target.value })} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={labelCls}>Credentials (comma-separated)</label><input className={inputCls} value={form.credentials} onChange={(e) => setForm({ ...form, credentials: e.target.value })} /></div>
            <div><label className={labelCls}>Sort order</label><input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> <span className="text-[13px]">Published</span></label>
          </div>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={cancel} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((s) => (
          <div key={s.id} className="p-5 flex gap-6 items-center">
            {s.photo_url ? <img src={s.photo_url} alt="" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-[var(--cream)]" />}
            <div className="flex-1"><div className="font-serif text-[18px] text-[var(--navy-deep)]">{s.full_name}</div><div className="text-[12px] text-[var(--warm-gray)]">{s.role_title}</div></div>
            <StatusPill on={s.published} onClick={() => togglePub(s)} />
            <button onClick={() => startEdit(s)} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Edit</button>
            <button onClick={() => remove(s.id)} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No staff profiles yet.</div>}
      </AdminCard>
    </div>
  );
}