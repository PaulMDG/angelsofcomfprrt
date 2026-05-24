import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, StatusPill, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, type Testimonial } from "@/lib/cms";

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

type Form = { author_name: string; location: string; quote: string; rating: number; sort_order: number; published: boolean };
const empty: Form = { author_name: "", location: "", quote: "", rating: 5, sort_order: 0, published: true };

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","testimonials"], queryFn: () => fetchAll("testimonials", { col: "sort_order", asc: true }) as Promise<Testimonial[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin","testimonials"] });
    qc.invalidateQueries({ queryKey: ["public","testimonials"] });
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t.id);
    setForm({ author_name: t.author_name, location: t.location ?? "", quote: t.quote, rating: t.rating ?? 5, sort_order: t.sort_order, published: t.published });
  };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const cancel = () => { setEditing(null); setForm(empty); };

  const save = async () => {
    if (editing === "new") {
      const { error } = await supabase.from("testimonials").insert(form);
      if (error) return alert(error.message);
    } else if (editing) {
      const { error } = await supabase.from("testimonials").update(form).eq("id", editing);
      if (error) return alert(error.message);
    }
    cancel(); invalidate();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    invalidate();
  };
  const togglePub = async (t: Testimonial) => {
    await supabase.from("testimonials").update({ published: !t.published }).eq("id", t.id);
    invalidate();
  };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Voices" title="Testimonials" subtitle="Quotes from the families you've served."
        action={<button onClick={startNew} className="btn-primary">+ New Testimonial</button>} />

      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className={labelCls}>Name</label><input className={inputCls} value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} /></div>
            <div><label className={labelCls}>Location / relationship</label><input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Quote</label><textarea rows={4} className={inputCls} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={labelCls}>Rating (1-5)</label><input type="number" min={1} max={5} className={inputCls} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
            <div><label className={labelCls}>Sort order</label><input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> <span className="text-[13px]">Published</span></label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} className="btn-primary">Save</button>
            <button onClick={cancel} className="btn-outline">Cancel</button>
          </div>
        </AdminCard>
      )}

      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((t) => (
          <div key={t.id} className="p-5 flex gap-6 items-start">
            <div className="flex-1">
              <div className="font-serif text-[18px] text-[var(--navy-deep)]">{t.author_name} <span className="text-[12px] text-[var(--warm-gray)] font-sans">— {t.location}</span></div>
              <p className="italic text-[14px] text-[var(--warm-gray)] mt-1 line-clamp-2">"{t.quote}"</p>
            </div>
            <StatusPill on={t.published} onClick={() => togglePub(t)} />
            <button onClick={() => startEdit(t)} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Edit</button>
            <button onClick={() => remove(t.id)} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No testimonials yet.</div>}
      </AdminCard>
    </div>
  );
}