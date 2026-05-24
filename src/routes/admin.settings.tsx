import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, type SiteSetting } from "@/lib/cms";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","settings"], queryFn: () => fetchAll("site_settings", { col: "key", asc: true }) as Promise<SiteSetting[]> });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => {
    if (data) { const d: Record<string, string> = {}; data.forEach((s) => { d[s.key] = JSON.stringify(s.value, null, 2); }); setDrafts(d); }
  }, [data]);
  const save = async (key: string) => {
    let parsed: any; try { parsed = JSON.parse(drafts[key]); } catch { return alert("Invalid JSON."); }
    const { error } = await supabase.from("site_settings").upsert({ key, value: parsed }, { onConflict: "key" });
    if (error) return alert(error.message);
    qc.invalidateQueries({ queryKey: ["admin","settings"] });
  };
  const addNew = async () => {
    const key = prompt("New setting key:"); if (!key) return;
    await supabase.from("site_settings").insert({ key, value: {} });
    qc.invalidateQueries({ queryKey: ["admin","settings"] });
  };
  return (
    <div className="px-10 py-12 max-w-4xl">
      <AdminHeader eyebrow="Configuration" title="Site Settings" subtitle="Global key/value settings (contact, social, etc)."
        action={<button onClick={addNew} className="btn-primary">+ New Key</button>} />
      <div className="space-y-4">
        {(data ?? []).map((s) => (
          <AdminCard key={s.id} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div><label className={labelCls}>Key</label><div className="font-serif text-[18px] text-[var(--navy-deep)]">{s.key}</div></div>
              <button onClick={() => save(s.key)} className="btn-primary">Save</button>
            </div>
            <textarea rows={8} className={`${inputCls} font-mono text-[12px]`} value={drafts[s.key] ?? ""} onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })} />
          </AdminCard>
        ))}
      </div>
    </div>
  );
}