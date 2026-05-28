import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard, inputCls, labelCls } from "@/components/admin/AdminHeader";
import { fetchAll, uploadMedia, type SiteSetting } from "@/lib/cms";

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
    qc.invalidateQueries({ queryKey: ["public", "site_settings", "logo"] });
  };
  const addNew = async () => {
    const key = prompt("New setting key:"); if (!key) return;
    await supabase.from("site_settings").insert({ key, value: {} });
    qc.invalidateQueries({ queryKey: ["admin","settings"] });
  };
  const others = (data ?? []).filter((s) => s.key !== "logo");
  return (
    <div className="px-10 py-12 max-w-4xl">
      <AdminHeader eyebrow="Configuration" title="Site Settings" subtitle="Global key/value settings (contact, social, etc)."
        action={<button onClick={addNew} className="btn-primary">+ New Key</button>} />
      <LogoEditor />
      <div className="space-y-4">
        {others.map((s) => (
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

function LogoEditor() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [wordmark, setWordmark] = useState("");
  const [tagline, setTagline] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
  const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

  const { data: current } = useQuery({
    queryKey: ["admin", "settings", "logo"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "logo").maybeSingle();
      return (data?.value as any) ?? null;
    },
  });

  useEffect(() => {
    if (!current) return;
    setUrl(current.url ?? "");
    setAlt(current.alt ?? "");
    setWordmark(current.wordmark ?? "");
    setTagline(current.tagline ?? "");
  }, [current]);

  const onUpload = async (file: File) => {
    setMsg(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMsg(`Unsupported file type "${file.type || "unknown"}". Use PNG, JPEG, SVG, or WebP.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setMsg(`File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max is 2 MB.`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setUploading(true);
    try {
      const { url: u } = await uploadMedia(file, "logo");
      setUrl(u);
      setMsg("Image uploaded. Click Save logo to apply.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const value = { url: url || null, alt: alt || null, wordmark: wordmark || null, tagline: tagline || null };
    const { error } = await supabase.from("site_settings").upsert({ key: "logo", value }, { onConflict: "key" });
    setSaving(false);
    if (error) return setMsg(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    qc.invalidateQueries({ queryKey: ["admin", "settings", "logo"] });
    qc.invalidateQueries({ queryKey: ["public", "site_settings", "logo"] });
    setMsg("Saved.");
  };

  return (
    <AdminCard className="p-6 mb-6">
      <div className="flex items-start justify-between gap-6 mb-5">
        <div>
          <div className={labelCls}>Brand</div>
          <h2 className="font-serif text-[22px] text-[var(--navy-deep)] mt-1">Logo & Wordmark</h2>
          <p className="text-[13px] text-[var(--warm-gray)] mt-1">
            Upload a logo image (PNG/SVG with transparent background works best). Used in the header and footer.
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save logo"}
        </button>
      </div>

      <div className="grid md:grid-cols-[180px_1fr] gap-6">
        <div className="bg-[var(--navy-deep)] rounded-[6px] p-4 flex items-center justify-center min-h-[140px]">
          {url ? (
            <img src={url} alt={alt || "Logo preview"} className="max-h-24 max-w-full object-contain" />
          ) : (
            <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-light)]/60">No logo</span>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded border border-[var(--gold)]/40 text-[12px] tracking-[0.16em] uppercase text-[var(--navy-deep)] hover:bg-[var(--cream)]"
            >
              {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-[12px] tracking-[0.16em] uppercase text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>
          <div>
            <label className={labelCls}>Image URL</label>
            <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Alt text</label>
              <input className={inputCls} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Angels of Comfort" />
            </div>
            <div>
              <label className={labelCls}>Wordmark</label>
              <input className={inputCls} value={wordmark} onChange={(e) => setWordmark(e.target.value)} placeholder="Angels of Comfort" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Tagline (small caps under wordmark)</label>
            <input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="In-Home Care" />
          </div>
          {msg && <div className="text-[12px] text-[var(--warm-gray)]">{msg}</div>}
        </div>
      </div>
    </AdminCard>
  );
}