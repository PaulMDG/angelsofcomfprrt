import { inputCls, labelCls } from "@/components/admin/AdminHeader";
import type { HomeContent } from "@/lib/homepage-content";
import { CroppingImagePicker } from "@/components/admin/CroppingImagePicker";

/**
 * Backwards-compatible re-export so other files that still import
 * `ImagePicker` continue to work — it just always uses the cropping flow now.
 */
export const ImagePicker = (props: { value: string; onChange: (v: string) => void }) => (
  <CroppingImagePicker {...props} />
);

export type SectionKey = keyof HomeContent;

export const SECTIONS: { key: SectionKey; label: string; description: string }[] = [
  { key: "hero", label: "Hero", description: "The first thing visitors see." },
  { key: "reassurance", label: "Reassurance", description: "Empathetic intro after the hero." },
  { key: "promise", label: "Our Promise", description: "Values shown over the dark band." },
  { key: "portal", label: "Family Portal", description: "Promo for the family portal." },
  { key: "services", label: "Services", description: "Care services section with image and CTAs." },
  { key: "resources", label: "Resources / Journal", description: "Header for the journal section." },
  { key: "cta", label: "Call to Action", description: "Closing band at the bottom of the page." },
];

export const ICON_OPTIONS = [
  { value: "shield", label: "Shield" },
  { value: "people", label: "People" },
  { value: "heart", label: "Heart" },
  { value: "chat", label: "Chat" },
  { value: "pin", label: "Pin" },
];

/* ---------- Reusable inputs ---------- */

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function Text({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function Area({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea rows={rows} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

export function CtaEditorRow({ value, onChange, label }: { value: { label: string; url: string }; onChange: (v: { label: string; url: string }) => void; label: string }) {
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


export function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
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

export function HeroEditor({ value, onChange }: { value: HomeContent["hero"]; onChange: (v: HomeContent["hero"]) => void }) {
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
      <Field label="Hero image"><CroppingImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} defaultAspect={16 / 9} /></Field>
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

export function ReassuranceEditor({ value, onChange }: { value: HomeContent["reassurance"]; onChange: (v: HomeContent["reassurance"]) => void }) {
  const set = (patch: Partial<HomeContent["reassurance"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><CroppingImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} defaultAspect={4 / 3} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary button" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Banner line 1"><Text value={value.banner_line1} onChange={(v) => set({ banner_line1: v })} /></Field>
        <Field label="Banner line 2 (italic)"><Text value={value.banner_line2} onChange={(v) => set({ banner_line2: v })} /></Field>
      </div>
    </>
  );
}

export function PromiseEditor({ value, onChange }: { value: HomeContent["promise"]; onChange: (v: HomeContent["promise"]) => void }) {
  const set = (patch: Partial<HomeContent["promise"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><CroppingImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} defaultAspect={4 / 5} /></Field>
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

export function PortalEditor({ value, onChange }: { value: HomeContent["portal"]; onChange: (v: HomeContent["portal"]) => void }) {
  const set = (patch: Partial<HomeContent["portal"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><CroppingImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} defaultAspect={3 / 4} /></Field>
      <Field label="Features"><StringList items={value.features} onChange={(v) => set({ features: v })} placeholder="Feature description" /></Field>
      <CtaEditorRow label="Button" value={value.cta} onChange={(v) => set({ cta: v })} />
    </>
  );
}

export function ResourcesEditor({ value, onChange }: { value: HomeContent["resources"]; onChange: (v: HomeContent["resources"]) => void }) {
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
      <Field label="Featured image (fallback when no blog post cover is set)">
        <CroppingImagePicker value={value.featured_image_url} onChange={(v) => set({ featured_image_url: v })} defaultAspect={4 / 3} />
      </Field>
    </>
  );
}

export function ServicesEditor({ value, onChange }: { value: HomeContent["services"]; onChange: (v: HomeContent["services"]) => void }) {
  const set = (patch: Partial<HomeContent["services"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <p className="text-[12px] text-[var(--warm-gray)]">The list of services on the right is pulled from your Services admin.</p>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Image"><CroppingImagePicker value={value.image_url} onChange={(v) => set({ image_url: v })} defaultAspect={16 / 9} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary link" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <Field label="Right-column eyebrow"><Text value={value.side_eyebrow} onChange={(v) => set({ side_eyebrow: v })} /></Field>
    </>
  );
}

export function CtaEditor({ value, onChange }: { value: HomeContent["cta"]; onChange: (v: HomeContent["cta"]) => void }) {
  const set = (patch: Partial<HomeContent["cta"]>) => onChange({ ...value, ...patch });
  return (
    <>
      <Field label="Eyebrow"><Text value={value.eyebrow} onChange={(v) => set({ eyebrow: v })} /></Field>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Heading"><Text value={value.heading} onChange={(v) => set({ heading: v })} /></Field>
        <Field label="Italic word"><Text value={value.italic_word} onChange={(v) => set({ italic_word: v })} /></Field>
      </div>
      <Field label="Body"><Area value={value.body} onChange={(v) => set({ body: v })} /></Field>
      <Field label="Background image"><CroppingImagePicker value={value.background_image_url} onChange={(v) => set({ background_image_url: v })} defaultAspect={16 / 9} /></Field>
      <CtaEditorRow label="Primary button" value={value.primary_cta} onChange={(v) => set({ primary_cta: v })} />
      <CtaEditorRow label="Secondary button" value={value.secondary_cta} onChange={(v) => set({ secondary_cta: v })} />
      <Field label="Footnote"><Text value={value.footnote} onChange={(v) => set({ footnote: v })} /></Field>
    </>
  );
}

export function SectionEditor<K extends SectionKey>({ sectionKey, value, onChange }: { sectionKey: K; value: HomeContent[K]; onChange: (v: HomeContent[K]) => void }) {
  switch (sectionKey) {
    case "hero":
      return <HeroEditor value={value as HomeContent["hero"]} onChange={onChange as any} />;
    case "reassurance":
      return <ReassuranceEditor value={value as HomeContent["reassurance"]} onChange={onChange as any} />;
    case "promise":
      return <PromiseEditor value={value as HomeContent["promise"]} onChange={onChange as any} />;
    case "portal":
      return <PortalEditor value={value as HomeContent["portal"]} onChange={onChange as any} />;
    case "resources":
      return <ResourcesEditor value={value as HomeContent["resources"]} onChange={onChange as any} />;
    case "services":
      return <ServicesEditor value={value as HomeContent["services"]} onChange={onChange as any} />;
    case "cta":
      return <CtaEditor value={value as HomeContent["cta"]} onChange={onChange as any} />;
    default:
      return null;
  }
}