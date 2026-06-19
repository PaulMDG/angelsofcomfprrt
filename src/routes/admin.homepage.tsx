import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, AdminCard } from "@/components/admin/AdminHeader";
import { HOME_DEFAULTS, type HomeContent } from "@/lib/homepage-content";
import {
  SECTIONS,
  HeroEditor,
  ReassuranceEditor,
  PromiseEditor,
  PortalEditor,
  ResourcesEditor,
  CtaEditor,
  type SectionKey,
} from "@/components/admin/HomeSectionEditors";

export const Route = createFileRoute("/admin/homepage")({ component: HomepageAdmin });

async function fetchHomeRow() {
  const { data } = await supabase
    .from("pages")
    .select("id, sections")
    .eq("page_key", "home")
    .maybeSingle();
  return data;
}

function HomepageAdmin() {
  const qc = useQueryClient();
  const { data: row } = useQuery({ queryKey: ["admin", "pages", "home"], queryFn: fetchHomeRow });
  const [content, setContent] = useState<HomeContent>(HOME_DEFAULTS);
  const [openKey, setOpenKey] = useState<SectionKey>("hero");
  const [savingKey, setSavingKey] = useState<SectionKey | null>(null);

  useEffect(() => {
    const merged: any = JSON.parse(JSON.stringify(HOME_DEFAULTS));
    const stored = (row?.sections as any) ?? {};
    for (const k of Object.keys(stored)) {
      merged[k] = { ...merged[k], ...stored[k] };
    }
    setContent(merged as HomeContent);
  }, [row]);

  const updateSection = <K extends SectionKey>(key: K, value: HomeContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const saveSection = async (key: SectionKey) => {
    setSavingKey(key);
    try {
      const existing = (row?.sections as any) ?? {};
      const next = { ...existing, [key]: content[key] };
      if (row?.id) {
        const { error } = await supabase.from("pages").update({ sections: next }).eq("id", row.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pages").insert({
          page_key: "home",
          title: "Home",
          sections: next,
          published: true,
        });
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["admin", "pages", "home"] });
      await qc.invalidateQueries({ queryKey: ["public", "pages", "home"] });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="px-10 py-12 max-w-5xl">
      <AdminHeader
        eyebrow="Front Page"
        title="Homepage Editor"
        subtitle="Edit the copy, images, and links for every section of your home page. Changes go live the moment you save."
      />
      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const open = openKey === s.key;
          return (
            <AdminCard key={s.key} className="overflow-hidden">
              <button
                onClick={() => setOpenKey(open ? ("" as SectionKey) : s.key)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--cream)]/40"
              >
                <div>
                  <div className="font-serif text-[18px] text-[var(--navy-deep)]">{s.label}</div>
                  <div className="text-[12px] text-[var(--warm-gray)]">{s.description}</div>
                </div>
                <span className="text-[var(--gold-muted)] text-[20px]">{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="px-6 pb-6 pt-2 border-t border-[var(--gold)]/15 space-y-5">
                  {s.key === "hero" && (
                    <HeroEditor value={content.hero} onChange={(v) => updateSection("hero", v)} />
                  )}
                  {s.key === "reassurance" && (
                    <ReassuranceEditor value={content.reassurance} onChange={(v) => updateSection("reassurance", v)} />
                  )}
                  {s.key === "promise" && (
                    <PromiseEditor value={content.promise} onChange={(v) => updateSection("promise", v)} />
                  )}
                  {s.key === "portal" && (
                    <PortalEditor value={content.portal} onChange={(v) => updateSection("portal", v)} />
                  )}
                  {s.key === "resources" && (
                    <ResourcesEditor value={content.resources} onChange={(v) => updateSection("resources", v)} />
                  )}
                  {s.key === "cta" && (
                    <CtaEditor value={content.cta} onChange={(v) => updateSection("cta", v)} />
                  )}
                  <div className="flex justify-end gap-3 pt-2 border-t border-[var(--gold)]/10">
                    <button
                      onClick={() => saveSection(s.key)}
                      disabled={savingKey === s.key}
                      className="btn-primary"
                    >
                      {savingKey === s.key ? "Saving…" : `Save ${s.label}`}
                    </button>
                  </div>
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Reusable inputs ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Text({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function Area({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea rows={rows} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function CtaEditorRow({ value, onChange, label }: { value: { label: string; url: string }; onChange: (v: { label: string; url: string }) => void; label: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <Field label={`${label} — Button text`}>
        <Text value={value.label} onChange={(v) => onChange({ ...value, label: v })} />
      </Field>
      <Field label={`${label} — Link (URL or path)`}>
        <Text value={value.url} onChange={(v) => onChange({ ...value, url: v })} placeholder="/services or tel:1234567890" />
      </Field>
    </div>
  );
}

function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const onUpload = async (f: File) => {
    setUploading(true);
    try {
      const { path, url } = await uploadMedia(f, "homepage");
      await supabase.from("media_assets").insert({ path, url, mime_type: f.type, size_bytes: f.size, alt: f.name });
      onChange(url);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-3 items-start">
        {value ? (
          <img src={value} alt="" className="w-32 h-20 object-cover rounded border border-[var(--gold)]/20" />
        ) : (
          <div className="w-32 h-20 flex items-center justify-center bg-[var(--cream)] text-[var(--gold-muted)] text-[10px] tracking-[0.18em] uppercase rounded border border-dashed border-[var(--gold)]/30">
            Default
          </div>
        )}
        <div className="flex-1 space-y-2">
          <Text value={value} onChange={onChange} placeholder="Paste an image URL or upload below" />
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">
              {uploading ? "Uploading…" : "Upload new"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="text-[11px] tracking-[0.16em] uppercase text-red-600">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputCls}
            value={it}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className="text-[11px] tracking-[0.16em] uppercase text-red-600 shrink-0"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]"
      >
        + Add item
      </button>
    </div>
  );
}

/* ---------- Section editors ---------- */

const ICON_OPTIONS = [
  { value: "shield", label: "Shield" },
  { value: "people", label: "People" },
  { value: "heart", label: "Heart" },
  { value: "chat", label: "Chat" },
  { value: "pin", label: "Pin" },
];

function HeroEditor({ value, onChange }: { value: HomeContent["hero"]; onChange: (v: HomeContent["hero"]) => void }) {
  const set = (patch: Partial<HomeContent["hero"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-3 gap-3">
        <Field label="Headline — line 1"><Text value={value.headline_line1} onChange={(v) => set({ headline_line1: v })} /></Field>
        <Field label="Headline — line 2"><Text value={value.headline_line2} onChange={(v) => set({ headline_line2: v })} /></Field>
        <Field label="Italic word"><Text value={value.headline_italic} onChange={(v) => set({ headline_italic: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Hero image"><ImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary button" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <Field label="Trust strip (icon + label)">
        <div className="space-y-2">
          {value.trust_items.map((t, i) => (
            <div key={i} className="flex gap-2">
              <select
                className={`${inputCls} max-w-[140px]`}
                value={t.icon}
                onChange={(e) => {
                  const next = [...value.trust_items];
                  next[i] = { ...t, icon: e.target.value };
                  set({ trust_items: next });
                }}
              >
                {ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input
                className={inputCls}
                value={t.label}
                onChange={(e) => {
                  const next = [...value.trust_items];
                  next[i] = { ...t, label: e.target.value };
                  set({ trust_items: next });
                }}
              />
              <button type="button" onClick={() => set({ trust_items: value.trust_items.filter((_, idx) => idx !== i) })} className="text-[11px] tracking-[0.16em] uppercase text-red-600 shrink-0">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => set({ trust_items: [...value.trust_items, { icon: "shield", label: "" }] })} className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)]">+ Add item</button>
        </div>
      </Field>
    </>
  );
}

function ReassuranceEditor({ value, onChange }: { value: HomeContent["reassurance"]; onChange: (v: HomeContent["reassurance"]) => void }) {
  const set = (patch: Partial<HomeContent["reassurance"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><ImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary button" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Banner line 1"><Text value={value.banner_line1} onChange={(v) => set({ banner_line1: v })} /></Field>
        <Field label="Banner line 2 (italic)"><Text value={value.banner_line2} onChange={(v) => set({ banner_line2: v })} /></Field>
      </div>
    </>
  );
}

function PromiseEditor({ value, onChange }: { value: HomeContent["promise"]; onChange: (v: HomeContent["promise"]) => void }) {
  const set = (patch: Partial<HomeContent["promise"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><ImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} /></Field>
      <Field label="Values">
        <div className="space-y-3">
          {value.values.map((v, i) => (
            <div key={i} className="grid md:grid-cols-[80px_1fr_2fr_auto] gap-2 items-start">
              <input className={inputCls} value={v.n} placeholder="01" onChange={(e) => { const next = [...value.values]; next[i] = { ...v, n: e.target.value }; set({ values: next }); }} />
              <input className={inputCls} value={v.t} placeholder="Dignity" onChange={(e) => { const next = [...value.values]; next[i] = { ...v, t: e.target.value }; set({ values: next }); }} />
              <textarea rows={2} className={inputCls} value={v.d} placeholder="Description" onChange={(e) => { const next = [...value.values]; next[i] = { ...v, d: e.target.value }; set({ values: next }); }} />
              <button type="button" onClick={() => set({ values: value.values.filter((_, idx) => idx !== i) })} className="text-[11px] tracking-[0.16em] uppercase text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => set({ values: [...value.values, { n: "", t: "", d: "" }] })} className="text-[11px] tracking-[0.16em] uppercase text-[var(--gold-muted)]">+ Add value</button>
        </div>
      </Field>
    </>
  );
}

function PortalEditor({ value, onChange }: { value: HomeContent["portal"]; onChange: (v: HomeContent["portal"]) => void }) {
  const set = (patch: Partial<HomeContent["portal"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><ImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} /></Field>
      <Field label="Features"><StringList items={value.features} onChange={(v) => set({ features: v })} placeholder="Feature description" /></Field>
      <CtaEditorRow label="Button" value={value.cta} onChange={(v) => set({ cta: v })} />
    </>
  );
}

function ResourcesEditor({ value, onChange }: { value: HomeContent["resources"]; onChange: (v: HomeContent["resources"]) => void }) {
  const set = (patch: Partial<HomeContent["resources"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <p className="text-[12px] text-[var(--warm-gray)]">The article cards are pulled from your Blog. Manage posts in the Blog admin.</p>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Link label"><Text value={value.link_label} onChange={(v) => set({ link_label: v })} /></Field>
    </>
  );
}

function CtaEditor({ value, onChange }: { value: HomeContent["cta"]; onChange: (v: HomeContent["cta"]) => void }) {
  const set = (patch: Partial<HomeContent["cta"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Background image"><ImagePicker value={value.background_image_url} onChange={(v) => set({ background_image_url: v })} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary button" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <Field label="Footnote"><Text value={value.footnote} onChange={(v) => set({ footnote: v })} /></Field>
    </>
  );
}