import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllServices } from "@/lib/cms-services";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: fetchAllServices,
  });

  const togglePublish = async (id: string, next: boolean) => {
    const { error } = await supabase.from("services").update({ published: next }).eq("id", id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "services"] });
    qc.invalidateQueries({ queryKey: ["public", "services"] });
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "services"] });
    qc.invalidateQueries({ queryKey: ["public", "services"] });
  };

  return (
    <div className="px-10 py-12 max-w-6xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)]">Content</div>
          <h1 className="font-serif text-4xl text-[var(--navy-deep)] mt-2">Services</h1>
          <p className="text-[14px] text-[var(--warm-gray)] mt-2">Manage the care services shown across the site.</p>
        </div>
        <Link to="/admin/services/$id" params={{ id: "new" }} className="btn-primary">+ New Service</Link>
      </div>

      {isLoading && <div className="text-[var(--warm-gray)]">Loading…</div>}
      {error && <div className="text-red-700">{(error as Error).message}</div>}

      <div className="bg-white border border-[var(--gold)]/20 rounded-[4px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--cream)]/70 text-[10px] tracking-[0.22em] uppercase text-[var(--gold-muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Tagline</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-[var(--gold)]/15">
                <td className="px-5 py-4 text-[14px] text-[var(--warm-gray)] w-16">{s.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="font-serif text-[18px] text-[var(--navy-deep)]">{s.name}</div>
                  <div className="text-[11px] text-[var(--warm-gray)] mt-0.5">/{s.slug}</div>
                </td>
                <td className="px-5 py-4 text-[13px] text-[var(--warm-gray)] italic">{s.tagline}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => togglePublish(s.id, !s.published)}
                    className={`text-[11px] px-2.5 py-1 rounded-full tracking-[0.12em] uppercase ${
                      s.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {s.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-4 text-right space-x-4">
                  <Link
                    to="/admin/services/$id"
                    params={{ id: s.id }}
                    className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => remove(s.id, s.name)}
                    className="text-[12px] tracking-[0.16em] uppercase text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[var(--warm-gray)]">
                  No services yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}