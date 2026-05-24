import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, StatusPill, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, type Faq } from "@/lib/cms";

export const Route = createFileRoute("/admin/faqs")({ component: FaqsAdmin });

type Form = { question: string; answer: string; category: string; sort_order: number; published: boolean };
const empty: Form = { question: "", answer: "", category: "", sort_order: 0, published: true };

function FaqsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","faqs"], queryFn: () => fetchAll("faqs", { col: "sort_order", asc: true }) as Promise<Faq[]> });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin","faqs"] }); qc.invalidateQueries({ queryKey: ["public","faqs"] }); };
  const startNew = () => { setEditing("new"); setForm(empty); };
  const startEdit = (f: Faq) => { setEditing(f.id); setForm({ question: f.question, answer: f.answer, category: f.category ?? "", sort_order: f.sort_order, published: f.published }); };
  const cancel = () => { setEditing(null); setForm(empty); };
  const save = async () => {
    const payload = { ...form, category: form.category || null };
    if (editing === "new") { const { error } = await supabase.from("faqs").insert(payload); if (error) return alert(error.message); }
    else if (editing) { const { error } = await supabase.from("faqs").update(payload).eq("id", editing); if (error) return alert(error.message); }
    cancel(); invalidate();
  };
  const remove = async (id: string) => { if (!confirm("Delete this FAQ?")) return; await supabase.from("faqs").delete().eq("id", id); invalidate(); };
  const togglePub = async (f: Faq) => { await supabase.from("faqs").update({ published: !f.published }).eq("id", f.id); invalidate(); };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader eyebrow="Answers" title="FAQs" subtitle="Questions families ask most."
        action={<button onClick={startNew} className="btn-primary">+ New FAQ</button>} />
      {editing && (
        <AdminCard className="p-6 mb-6 space-y-4">
          <div><label className={labelCls}>Question</label><input className={inputCls} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
          <div><label className={labelCls}>Answer</label><textarea rows={5} className={inputCls} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className={labelCls}>Category</label><input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div><label className={labelCls}>Sort order</label><input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
            <label className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> <span className="text-[13px]">Published</span></label>
          </div>
          <div className="flex gap-3"><button onClick={save} className="btn-primary">Save</button><button onClick={cancel} className="btn-outline">Cancel</button></div>
        </AdminCard>
      )}
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((f) => (
          <div key={f.id} className="p-5 flex gap-6 items-start">
            <div className="flex-1">
              <div className="font-serif text-[18px] text-[var(--navy-deep)]">{f.question}</div>
              <p className="text-[13px] text-[var(--warm-gray)] mt-1 line-clamp-2">{f.answer}</p>
              {f.category && <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold-muted)] mt-2">{f.category}</div>}
            </div>
            <StatusPill on={f.published} onClick={() => togglePub(f)} />
            <button onClick={() => startEdit(f)} className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Edit</button>
            <button onClick={() => remove(f.id)} className="text-[12px] tracking-[0.16em] uppercase text-red-600">Delete</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No FAQs yet.</div>}
      </AdminCard>
    </div>
  );
}