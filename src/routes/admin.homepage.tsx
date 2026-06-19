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
