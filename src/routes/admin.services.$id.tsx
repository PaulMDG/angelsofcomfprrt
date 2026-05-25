import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchServiceById, slugify, uploadCmsImage, type Service } from "@/lib/cms-services";
import { supabase } from "@/integrations/supabase/client";
import { RichEditor } from "@/components/admin/RichEditor";

export const Route = createFileRoute("/admin/services/$id")({
  component: ServiceEditor,
});

type Form = {
  name: string; slug: string; tagline: string; description: string;
  includes: string; body_html: string; cover_image_url: string;
  sort_order: number; published: boolean;
  show_in_nav: boolean; nav_label: string; nav_sort: number;
};

const empty: Form = {
  name: "", slug: "", tagline: "", description: "", includes: "",
  body_html: "", cover_image_url: "", sort_order: 100, published: true,
  show_in_nav: true, nav_label: "", nav_sort: 0,
};

function toForm(s: Service): Form {
  return {
    name: s.name, slug: s.slug, tagline: s.tagline ?? "",
    description: s.description ?? "", includes: (s.includes ?? []).join("\n"),
    body_html: s.body_html ?? "", cover_image_url: s.cover_image_url ?? "",
    sort_order: s.sort_order, published: s.published,
    show_in_nav: s.show_in_nav, nav_label: s.nav_label ?? "", nav_sort: s.nav_sort,
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">{label}</label>
      {children}
      {hint && <div className="text-[12px] text-[var(--warm-gray)] mt-1.5 italic">{hint}</div>}
    </div>
  );
}

function ServiceEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "service", id],
    queryFn: () => fetchServiceById(id),
    enabled: !isNew,
  });

  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);

  useEffect(() => {
    if (existing) { setForm(toForm(existing)); setSlugDirty(true); }
  }, [existing]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onUploadCover = async (file: File) => {
    try { set("cover_image_url", await uploadCmsImage(file)); }
    catch (e) { setErr((e as Error).message); }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      const includes = form.includes.split("\n").map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
        tagline: form.tagline.trim() || null,
        description: form.description.trim() || null,
        includes,
        body_html: form.body_html || null,
        cover_image_url: form.cover_image_url.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        published: form.published,
        show_in_nav: form.show_in_nav,
        nav_label: form.nav_label.trim() || null,
        nav_sort: Number(form.nav_sort) || 0,
      };
      if (isNew) {
        const { data, error } = await supabase.from("services").insert(payload).select("id").single();
        if (error) throw error;
        qc.invalidateQueries({ queryKey: ["admin", "services"] });
        qc.invalidateQueries({ queryKey: ["public", "services"] });
        navigate({ to: "/admin/services/$id", params: { id: data!.id } });
      } else {
        const { error } = await supabase.from("services").update(payload).eq("id", id);
        if (error) throw error;
        qc.invalidateQueries({ queryKey: ["admin", "services"] });
        qc.invalidateQueries({ queryKey: ["admin", "service", id] });
        qc.invalidateQueries({ queryKey: ["public", "services"] });
      }
    } catch (e) { setErr((e as Error).message); }
    finally { setSaving(false); }
  };

  if (!isNew && isLoading) {
    return <div className="px-10 py-12 text-[var(--warm-gray)]">Loading…</div>;
  }

  return (
    <div className="px-10 py-12 max-w-4xl">
      <Link to="/admin/services" className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">← All services</Link>
      <h1 className="font-serif text-4xl text-[var(--navy-deep)] mt-3">{isNew ? "New Service" : form.name || "Edit Service"}</h1>

      <form onSubmit={save} className="mt-10 space-y-7">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Name">
            <input required className="form-input w-full" value={form.name}
              onChange={(e) => { set("name", e.target.value); if (!slugDirty) set("slug", slugify(e.target.value)); }} />
          </Field>
          <Field label="Slug">
            <input required className="form-input w-full font-mono text-[14px]" value={form.slug}
              onChange={(e) => { setSlugDirty(true); set("slug", slugify(e.target.value)); }} />
          </Field>
        </div>

        <Field label="Tagline" hint="Short italic line under the name.">
          <input className="form-input w-full" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>

        <Field label="Short description" hint="Used on cards and listings.">
          <textarea rows={4} className="form-input w-full" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </Field>

        <Field label="What's included" hint="One item per line.">
          <textarea rows={5} className="form-input w-full font-mono text-[14px]" value={form.includes} onChange={(e) => set("includes", e.target.value)} />
        </Field>

        <Field label="Long-form body" hint="Rich content with images, headings, quotes.">
          <RichEditor value={form.body_html} onChange={(html) => set("body_html", html)} placeholder="Tell the fuller story of this service…" />
        </Field>

        <Field label="Cover image">
          <div className="space-y-3">
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="" className="w-full max-w-md h-48 object-cover rounded border border-[var(--gold)]/20" />
            )}
            <input type="file" accept="image/*" className="text-[13px]"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadCover(f); e.target.value = ""; }} />
            <input className="form-input w-full text-[13px]" placeholder="Or paste an image URL"
              value={form.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="Sort order" hint="Lower numbers appear first.">
            <input type="number" className="form-input w-full" value={form.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value))} />
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-3 mt-3">
              <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
              <span className="text-[14px] text-[var(--navy-deep)]">
                {form.published ? "Published — visible on the site" : "Draft — hidden"}
              </span>
            </label>
          </Field>
        </div>

        <div className="border-t border-[var(--gold)]/20 pt-7">
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)] mb-4">Navigation assignment</div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Show in main navigation">
              <label className="flex items-center gap-3 mt-3">
                <input type="checkbox" checked={form.show_in_nav}
                  onChange={(e) => set("show_in_nav", e.target.checked)} />
                <span className="text-[14px] text-[var(--navy-deep)]">
                  {form.show_in_nav ? "Visible in the Services dropdown" : "Hidden from navigation"}
                </span>
              </label>
            </Field>
            <Field label="Nav sort" hint="Order inside the Services menu. Lower = first.">
              <input type="number" className="form-input w-full" value={form.nav_sort}
                onChange={(e) => set("nav_sort", Number(e.target.value))} />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Nav label (optional)" hint="Override the name shown in the navigation. Leave blank to use the service name.">
              <input className="form-input w-full" value={form.nav_label}
                onChange={(e) => set("nav_label", e.target.value)} placeholder={form.name} />
            </Field>
          </div>
        </div>

        {err && <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : isNew ? "Create service" : "Save changes"}
          </button>
          <Link to="/admin/services" className="text-[13px] text-[var(--warm-gray)] hover:text-[var(--navy-deep)]">Cancel</Link>
        </div>
      </form>
    </div>
  );
}