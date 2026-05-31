import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllNavItems, type NavItem } from "@/lib/nav";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/admin/navigation")({
  component: NavigationManager,
});

const MENU_OPTIONS = [
  { key: "header", label: "Header (primary)" },
  { key: "header_cta", label: "Header (CTA)" },
  { key: "footer", label: "Footer" },
  { key: "footer_legal", label: "Footer (legal)" },
];

type Draft = {
  id?: string;
  menu_key: string;
  parent_id: string | null;
  label: string;
  url: string;
  link_type: string;
  open_in_new_tab: boolean;
  sort_order: number;
  published: boolean;
};

const emptyDraft = (menu_key: string): Draft => ({
  menu_key, parent_id: null, label: "", url: "/", link_type: "internal",
  open_in_new_tab: false, sort_order: 100, published: true,
});

const urlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(2048, "URL is too long")
  .refine(
    (v) =>
      v.startsWith("/") ||
      v.startsWith("#") ||
      /^https?:\/\/[^\s]+\.[^\s]+/i.test(v) ||
      /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(v) ||
      /^tel:\+?[0-9()\-.\s]+$/i.test(v),
    "Enter a valid URL (starts with /, #, https://, mailto:, or tel:)",
  );

const draftSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(80, "Keep label under 80 characters"),
  url: urlSchema,
  sort_order: z.number().int().min(0).max(9999),
});

function NavigationManager() {
  const qc = useQueryClient();
  const [menuKey, setMenuKey] = useState("header");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "nav_items", menuKey],
    queryFn: () => fetchAllNavItems(menuKey),
  });

  // Resource catalogs for the picker
  const { data: pages = [] } = useQuery({
    queryKey: ["admin", "nav_resources", "pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("page_key,title").order("title");
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: servicesList = [] } = useQuery({
    queryKey: ["admin", "nav_resources", "services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("slug,name").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "nav_resources", "blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("slug,title").order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const parentOptions = useMemo(
    () => items.filter((i) => !i.parent_id && i.id !== editing?.id),
    [items, editing?.id],
  );
  const itemById = useMemo(() => {
    const m = new Map<string, NavItem>();
    items.forEach((i) => m.set(i.id, i));
    return m;
  }, [items]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "nav_items"] });
    qc.invalidateQueries({ queryKey: ["public", "nav_items"] });
  };

  // Build URL from a picked resource based on link_type
  const setResource = (value: string) => {
    if (!editing) return;
    if (!value) return setEditing({ ...editing, url: "/" });
    if (editing.link_type === "page") {
      const p = pages.find((x: any) => x.page_key === value);
      setEditing({ ...editing, url: value === "home" ? "/" : `/${value}`, label: editing.label || p?.title || "" });
    } else if (editing.link_type === "service") {
      const s = servicesList.find((x: any) => x.slug === value);
      setEditing({ ...editing, url: `/services/${value}`, label: editing.label || s?.name || "" });
    } else if (editing.link_type === "blog") {
      const b = posts.find((x: any) => x.slug === value);
      setEditing({ ...editing, url: `/resources/${value}`, label: editing.label || b?.title || "" });
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setErr(null);
    const parsed = draftSchema.safeParse({
      label: editing.label,
      url: editing.url,
      sort_order: Number(editing.sort_order) || 0,
    });
    if (!parsed.success) {
      setErr(parsed.error.issues.map((i) => i.message).join(" · "));
      return;
    }
    try {
      const payload = {
        menu_key: editing.menu_key,
        parent_id: editing.parent_id,
        label: parsed.data.label,
        url: parsed.data.url,
        link_type: editing.link_type,
        open_in_new_tab: editing.open_in_new_tab,
        sort_order: parsed.data.sort_order,
        published: editing.published,
      };
      if (editing.id) {
        const { error } = await supabase.from("nav_items").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("nav_items").insert(payload);
        if (error) throw error;
      }
      setEditing(null);
      refresh();
    } catch (e) { setErr((e as Error).message); }
  };

  const remove = async (item: NavItem) => {
    if (!confirm(`Delete "${item.label}"?`)) return;
    const { error } = await supabase.from("nav_items").delete().eq("id", item.id);
    if (error) { alert(error.message); return; }
    refresh();
  };

  const togglePublished = async (item: NavItem) => {
    const { error } = await supabase.from("nav_items").update({ published: !item.published }).eq("id", item.id);
    if (error) { alert(error.message); return; }
    refresh();
  };

  return (
    <div className="px-10 py-12 max-w-6xl">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)]">Structure</div>
          <h1 className="font-serif text-4xl text-[var(--navy-deep)] mt-2">Navigation</h1>
          <p className="text-[14px] text-[var(--warm-gray)] mt-2">
            Build the menus that appear in the header, footer, and other navigation areas.
          </p>
        </div>
        <button onClick={() => setEditing(emptyDraft(menuKey))} className="btn-primary">
          + New item
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {MENU_OPTIONS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMenuKey(m.key)}
            className={`px-4 py-2 text-[12px] tracking-[0.16em] uppercase rounded transition-colors ${
              menuKey === m.key
                ? "bg-[var(--navy-deep)] text-[var(--ivory)]"
                : "bg-white text-[var(--warm-gray)] border border-[var(--gold)]/20 hover:text-[var(--navy-deep)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="text-[var(--warm-gray)]">Loading…</div>}

      <div className="bg-white border border-[var(--gold)]/20 rounded-[4px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--cream)]/70 text-[10px] tracking-[0.22em] uppercase text-[var(--gold-muted)]">
            <tr>
              <th className="px-5 py-3 font-medium w-20">Order</th>
              <th className="px-5 py-3 font-medium">Label</th>
              <th className="px-5 py-3 font-medium">URL</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-[var(--gold)]/15">
                <td className="px-5 py-4 text-[14px] text-[var(--warm-gray)]">{it.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="font-serif text-[17px] text-[var(--navy-deep)]">
                    {it.parent_id ? <span className="text-[var(--gold-muted)] mr-1">↳</span> : null}
                    {it.label}
                  </div>
                  <div className="text-[11px] text-[var(--warm-gray)] mt-0.5">
                    {it.link_type}
                    {it.parent_id ? ` · child of ${itemById.get(it.parent_id)?.label ?? "—"}` : ""}
                    {it.open_in_new_tab ? " · new tab" : ""}
                  </div>
                </td>
                <td className="px-5 py-4 text-[13px] text-[var(--warm-gray)] font-mono">{it.url}</td>
                <td className="px-5 py-4">
                  <button onClick={() => togglePublished(it)}
                    className={`text-[11px] px-2.5 py-1 rounded-full tracking-[0.12em] uppercase ${
                      it.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}>
                    {it.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-4 text-right space-x-4">
                  <button onClick={() => setEditing({ ...it })}
                    className="text-[12px] tracking-[0.16em] uppercase text-[var(--gold-muted)] hover:text-[var(--navy-deep)]">
                    Edit
                  </button>
                  <button onClick={() => remove(it)}
                    className="text-[12px] tracking-[0.16em] uppercase text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && items.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-[var(--warm-gray)]">
                No items in this menu yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[6px] w-full max-w-xl p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[var(--navy-deep)]">
                {editing.id ? "Edit nav item" : "New nav item"}
              </h2>
              <button type="button" onClick={() => setEditing(null)} className="text-[var(--warm-gray)] hover:text-[var(--navy-deep)]">✕</button>
            </div>

            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">Menu</label>
              <select className="form-input w-full" value={editing.menu_key}
                onChange={(e) => setEditing({ ...editing, menu_key: e.target.value, parent_id: null })}>
                {MENU_OPTIONS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">Parent (for sub-items)</label>
              <select className="form-input w-full" value={editing.parent_id ?? ""}
                onChange={(e) => setEditing({ ...editing, parent_id: e.target.value || null })}>
                <option value="">— None (top-level)</option>
                {parentOptions.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">Label</label>
              <input required className="form-input w-full" value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">Link type</label>
                <select className="form-input w-full" value={editing.link_type}
                  onChange={(e) => setEditing({ ...editing, link_type: e.target.value })}>
                  <option value="internal">Internal route (custom URL)</option>
                  <option value="page">Page (CMS)</option>
                  <option value="service">Service</option>
                  <option value="blog">Blog / Article</option>
                  <option value="external">External URL</option>
                  <option value="anchor">Anchor / section</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">Sort order</label>
                <input type="number" className="form-input w-full" value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </div>
            </div>

            {(editing.link_type === "page" || editing.link_type === "service" || editing.link_type === "blog") && (
              <div>
                <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">
                  Pick {editing.link_type}
                </label>
                <select className="form-input w-full" value="" onChange={(e) => setResource(e.target.value)}>
                  <option value="">— Select to fill URL & label —</option>
                  {editing.link_type === "page" && pages.map((p: any) => (
                    <option key={p.page_key} value={p.page_key}>{p.title} ({p.page_key})</option>
                  ))}
                  {editing.link_type === "service" && servicesList.map((s: any) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                  {editing.link_type === "blog" && posts.map((b: any) => (
                    <option key={b.slug} value={b.slug}>{b.title}</option>
                  ))}
                </select>
                <p className="text-[11px] text-[var(--warm-gray)] mt-1.5">
                  Picking a resource auto-fills the URL below. You can still tweak it manually.
                </p>
              </div>
            )}

            <div>
              <label className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold-muted)] block mb-2">URL</label>
              <input required className="form-input w-full font-mono text-[14px]" value={editing.url}
                placeholder="/services or https://..."
                onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-[14px] text-[var(--navy-deep)]">
                <input type="checkbox" checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[var(--navy-deep)]">
                <input type="checkbox" checked={editing.open_in_new_tab}
                  onChange={(e) => setEditing({ ...editing, open_in_new_tab: e.target.checked })} />
                Open in new tab
              </label>
            </div>

            {err && <div className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="text-[13px] text-[var(--warm-gray)] hover:text-[var(--navy-deep)] px-3">Cancel</button>
              <button type="submit" className="btn-primary">{editing.id ? "Save" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}