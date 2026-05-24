import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard } from "@/components/admin/AdminHeader";
import { fetchAll, uploadMedia, type MediaAsset } from "@/lib/cms";

export const Route = createFileRoute("/admin/media")({ component: MediaAdmin });

function MediaAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin","media"], queryFn: () => fetchAll("media_assets") as Promise<MediaAsset[]> });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const { path, url } = await uploadMedia(file, "library");
      await supabase.from("media_assets").insert({ path, url, mime_type: file.type, size_bytes: file.size, alt: file.name });
      qc.invalidateQueries({ queryKey: ["admin","media"] });
    } catch (e) { alert((e as Error).message); }
    finally { setUploading(false); }
  };

  const remove = async (a: MediaAsset) => {
    if (!confirm("Delete this media item?")) return;
    await supabase.storage.from("cms-media").remove([a.path]);
    await supabase.from("media_assets").delete().eq("id", a.id);
    qc.invalidateQueries({ queryKey: ["admin","media"] });
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); };

  return (
    <div className="px-10 py-12 max-w-6xl">
      <AdminHeader eyebrow="Library" title="Media Gallery" subtitle="Images and files used across the site."
        action={
          <>
            <input ref={fileRef} type="file" className="hidden" accept="image/*,application/pdf"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">{uploading ? "Uploading…" : "+ Upload"}</button>
          </>
        } />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(data ?? []).map((a) => (
          <AdminCard key={a.id} className="overflow-hidden group">
            {a.mime_type?.startsWith("image/") ? (
              <img src={a.url} alt={a.alt ?? ""} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-[var(--cream)] text-[var(--gold-muted)] text-[12px]">{a.mime_type}</div>
            )}
            <div className="p-3">
              <div className="text-[11px] text-[var(--warm-gray)] truncate">{a.path.split("/").pop()}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => copyUrl(a.url)} className="text-[10px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">Copy URL</button>
                <button onClick={() => remove(a)} className="text-[10px] tracking-[0.16em] uppercase text-red-600 ml-auto">Delete</button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
      {data && data.length === 0 && <AdminCard className="p-10 text-center text-[var(--warm-gray)]">No media yet. Upload your first file.</AdminCard>}
    </div>
  );
}