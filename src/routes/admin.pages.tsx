import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, type PageRow } from "@/lib/cms";

export const Route = createFileRoute("/admin/pages")({ component: PagesAdmin });

function PagesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","pages"], queryFn: () => fetchAll("pages", { col: "page_key", asc: true }) as Promise<PageRow[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState({ page_key: "", title: "", sections: "{}" });
  const inv = () => qc.invalidateQueries({ queryKey: ["admin","pages"] });
  const save = async () => {
    let parsed: any; try { parsed = JSON.parse(form.sections); } catch { return alert("Invalid JSON."); }
    const payload = { page_key: form.page_key, title: form.title, sections: parsed };
    if (editing === "new") { const { error } = await supabase.from("pages").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("pages").update(payload).eq("id", editing); if (error) return alert(error.message); }
    setEditing(null); inv();
  };
  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Structure" title="Page Manager" subtitle="Per-page section content as JSON."
        action={<button onClick={() => { setEditing("new"); setForm({ page_key: "", title: "", sections: "{}" }); }} className="btn-primary">+ New Page</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Page key</label><input className={inputCls} value={form.page_key} onChange={(e) => setForm({ ...form, page_key: e.target.value })} placeholder="home, about…" /></div>
            <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Sections (JSON)</label><textarea rows={14} className={`${inputCls} font-mono text-[12px]`} value={form.sections} onChange={(e) => setForm({ ...form, sections: e.target.value })} /></div>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={() => setEditing(null)} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((p) => (
          <div key={p.id} className="p-5 flex items-center gap-6">
            <div className="flex-1"><div className="font-serif text-[18px] text-[var(--navy-deep)]">{p.title}</div><div className="text-[11px] text-[var(--warm-gray)]">{p.page_key}</div></div>
            <button onClick={() => { setEditing(p.id); setForm({ page_key: p.page_key, title: p.title, sections: JSON.stringify(p.sections, null, 2) }); }} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)]">Edit</button>
            <button onClick={async () => { if (!confirm("Delete?")) return; await supabase.from("pages").delete().eq("id", p.id); inv(); }} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No pages yet.</div>}
      </AdminCard>
    </div>
  );
}