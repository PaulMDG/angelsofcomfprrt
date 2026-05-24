import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard } from "@/components/admin/AdminHeader";
import { fetchAll, type Consultation } from "@/lib/cms";

export const Route = createFileRoute("/admin/consultations")({ component: ConsultationsAdmin });

function ConsultationsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","consultations"], queryFn: () => fetchAll("consultations") as Promise<Consultation[]> });
  const remove = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await supabase.from("consultations").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","consultations"] });
  };
  const exportCsv = () => {
    if (!data || !data.length) return;
    const cols = ["created_at","full_name","email","phone","relationship","care_for","care_types","timeline","zip","message"] as const;
    const rows = [cols.join(",")];
    data.forEach((c) => rows.push(cols.map((k) => JSON.stringify((c as any)[k] ?? "")).join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `consultations-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-10 py-12 max-w-6xl">
      <AdminHeader eyebrow="Inbox" title="Consultation Requests" subtitle="Families who reached out for a conversation."
        action={<button onClick={exportCsv} className="btn-outline">Export CSV</button>} />
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((c) => (
          <div key={c.id} className="p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-serif text-[20px] text-[var(--navy-deep)]">{c.full_name}</div>
                <div className="text-[12px] text-[var(--warm-gray)] mt-1">
                  <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a> · <a href={`tel:${c.phone}`} className="hover:underline">{c.phone}</a>
                  {c.zip && ` · ZIP ${c.zip}`}
                </div>
                <div className="text-[11px] tracking-[0.18em] uppercase text-[var(--gold-muted)] mt-2">
                  {c.relationship} · for {c.care_for} · {c.timeline}
                </div>
                {c.care_types && c.care_types.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.care_types.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--cream)] border border-[var(--gold)]/30 text-[var(--navy-deep)]">{t}</span>)}
                  </div>
                )}
                {c.message && <p className="text-[14px] text-[var(--warm-gray)] mt-3 italic max-w-2xl">"{c.message}"</p>}
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[var(--warm-gray)]">{new Date(c.created_at).toLocaleString()}</div>
                <button onClick={() => remove(c.id)} className="mt-3 text-[11px] tracking-[0.16em] uppercase text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No consultation requests yet.</div>}
      </AdminCard>
    </div>
  );
}