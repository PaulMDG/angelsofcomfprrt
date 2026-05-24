import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard } from "@/components/admin/AdminHeader";
import { fetchAll, type Subscriber } from "@/lib/cms";

export const Route = createFileRoute("/admin/subscribers")({ component: SubscribersAdmin });

function SubscribersAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","subscribers"], queryFn: () => fetchAll("subscribers") as Promise<Subscriber[]> });
  const remove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("subscribers").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin","subscribers"] });
  };
  const exportCsv = () => {
    if (!data) return;
    const rows = ["email,source,confirmed,created_at"];
    data.forEach((s) => rows.push(`${s.email},${s.source ?? ""},${s.confirmed},${s.created_at}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `subscribers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="px-10 py-12 max-w-4xl">
      <AdminHeader eyebrow="Audience" title="Newsletter Subscribers" subtitle={`${data?.length ?? 0} family members on your list.`}
        action={<button onClick={exportCsv} className="btn-outline">Export CSV</button>} />
      <AdminCard className="divide-y divide-[var(--gold)]/15">
        {(data ?? []).map((s) => (
          <div key={s.id} className="p-4 flex justify-between items-center">
            <div>
              <div className="text-[14px] text-[var(--navy-deep)]">{s.email}</div>
              <div className="text-[11px] text-[var(--warm-gray)] mt-0.5">{new Date(s.created_at).toLocaleDateString()} {s.source && `· ${s.source}`}</div>
            </div>
            <button onClick={() => remove(s.id)} className="text-[11px] tracking-[0.16em] uppercase text-red-600">Remove</button>
          </div>
        ))}
        {data && data.length === 0 && <div className="p-10 text-center text-[var(--warm-gray)]">No subscribers yet.</div>}
      </AdminCard>
    </div>
  );
}