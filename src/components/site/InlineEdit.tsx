import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/use-is-admin";
import {
  HOME_DEFAULTS,
  type HomeContent,
} from "@/lib/homepage-content";
import {
  SECTIONS,
  SectionEditor,
  type SectionKey,
} from "@/components/admin/HomeSectionEditors";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

/* ---------------- Context ---------------- */

type InlineCtx = {
  isAdmin: boolean;
  openHome: (key: SectionKey) => void;
};

const Ctx = createContext<InlineCtx>({ isAdmin: false, openHome: () => {} });

export function useInlineEdit() {
  return useContext(Ctx);
}

/* ---------------- Provider + Drawer ---------------- */

async function fetchHomeRow() {
  const { data } = await supabase
    .from("pages")
    .select("id, sections")
    .eq("page_key", "home")
    .maybeSingle();
  return data;
}

function mergeRow(row: { sections: any } | null | undefined): HomeContent {
  const merged: any = JSON.parse(JSON.stringify(HOME_DEFAULTS));
  const stored = (row?.sections as any) ?? {};
  for (const k of Object.keys(stored)) merged[k] = { ...merged[k], ...stored[k] };
  return merged as HomeContent;
}

export function InlineEditProvider({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  const qc = useQueryClient();
  const [openKey, setOpenKey] = useState<SectionKey | null>(null);
  const [draft, setDraft] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: row } = useQuery({
    queryKey: ["admin", "pages", "home"],
    queryFn: fetchHomeRow,
    enabled: isAdmin,
  });

  // Reset draft each time the drawer opens (uses latest row data).
  useEffect(() => {
    if (openKey) setDraft(mergeRow(row ?? null));
  }, [openKey, row]);

  const openHome = useCallback(
    (key: SectionKey) => {
      if (!isAdmin) return;
      setOpenKey(key);
    },
    [isAdmin],
  );

  const close = () => {
    setOpenKey(null);
    setDraft(null);
  };

  const save = async () => {
    if (!openKey || !draft) return;
    setSaving(true);
    try {
      const existing = (row?.sections as any) ?? {};
      const next = { ...existing, [openKey]: draft[openKey] };
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
      close();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const meta = openKey ? SECTIONS.find((s) => s.key === openKey) : null;

  const value = useMemo<InlineCtx>(() => ({ isAdmin, openHome }), [isAdmin, openHome]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {isAdmin && <AutoPageAdminBar />}
      <Sheet open={!!openKey} onOpenChange={(o) => !o && close()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[640px] overflow-y-auto bg-[var(--cream)] p-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-[var(--gold)]/20 bg-white">
            <div className="text-[10px] tracking-[0.28em] uppercase text-[var(--gold-muted)]">
              Inline editor
            </div>
            <SheetTitle className="font-serif text-[26px] text-[var(--navy-deep)]">
              {meta?.label ?? "Edit"}
            </SheetTitle>
            {meta?.description && (
              <SheetDescription className="text-[13px] text-[var(--warm-gray)]">
                {meta.description}
              </SheetDescription>
            )}
          </SheetHeader>
          <div className="px-6 py-6 space-y-5">
            {openKey && draft && (
              <SectionEditor
                sectionKey={openKey}
                value={draft[openKey]}
                onChange={(v) =>
                  setDraft((d) => (d ? { ...d, [openKey]: v } : d))
                }
              />
            )}
          </div>
          <SheetFooter className="sticky bottom-0 px-6 py-4 border-t border-[var(--gold)]/20 bg-white flex flex-row justify-end gap-3">
            <button onClick={close} className="btn-outline" type="button">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="btn-primary"
              type="button"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Ctx.Provider>
  );
}

/* ---------------- Section wrapper ---------------- */

export function EditableSection({
  sectionKey,
  children,
  className = "",
  label,
}: {
  sectionKey: SectionKey;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const { isAdmin, openHome } = useInlineEdit();
  return (
    <div className={`relative group/edit ${className}`}>
      {children}
      {isAdmin && (
        <button
          type="button"
          onClick={() => openHome(sectionKey)}
          className="absolute top-4 right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[var(--gold)] text-[var(--navy-deep)] text-[11px] tracking-[0.18em] uppercase font-medium px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.25)] opacity-0 group-hover/edit:opacity-100 focus:opacity-100 transition-opacity"
          aria-label={`Edit ${label ?? sectionKey} section`}
        >
          <PencilIcon className="w-3.5 h-3.5" /> Edit {label ?? sectionKey}
        </button>
      )}
    </div>
  );
}

/* ---------------- Page-level bar (for non-home pages) ---------------- */

export function PageAdminBar({
  to,
  label,
}: {
  /** Admin route this content is managed in. */
  to: string;
  /** What's editable on this page (e.g. "services", "blog posts"). */
  label: string;
}) {
  const { isAdmin } = useInlineEdit();
  if (!isAdmin) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-full bg-[var(--navy-deep)] text-[var(--ivory)] pl-4 pr-1.5 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <span className="text-[11px] tracking-[0.18em] uppercase">
        Manage {label}
      </span>
      <Link
        to={to}
        className="rounded-full bg-[var(--gold)] text-[var(--navy-deep)] text-[11px] tracking-[0.18em] uppercase font-medium px-3.5 py-2"
      >
        Open editor
      </Link>
    </div>
  );
}

/* Maps the current public route to the admin area that controls it. */
const ROUTE_ADMIN_MAP: { match: (p: string) => boolean; to: string; label: string }[] = [
  { match: (p) => p === "/", to: "/admin/homepage", label: "homepage" },
  { match: (p) => p === "/about", to: "/admin/staff", label: "staff & about" },
  { match: (p) => p === "/services", to: "/admin/services", label: "services" },
  { match: (p) => p.startsWith("/services/"), to: "/admin/services", label: "this service" },
  { match: (p) => p === "/resources", to: "/admin/blog", label: "journal posts" },
  { match: (p) => p === "/family-portal", to: "/admin/pages", label: "this page" },
  { match: (p) => p === "/consultation", to: "/admin/consultations", label: "consultations" },
];

function AutoPageAdminBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const target = ROUTE_ADMIN_MAP.find((r) => r.match(pathname));
  // Skip on home: inline section edit buttons already cover it.
  if (!target || pathname === "/") return null;
  return (
    <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-full bg-[var(--navy-deep)] text-[var(--ivory)] pl-4 pr-1.5 py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <span className="text-[11px] tracking-[0.18em] uppercase">
        Manage {target.label}
      </span>
      <Link
        to={target.to as any}
        className="rounded-full bg-[var(--gold)] text-[var(--navy-deep)] text-[11px] tracking-[0.18em] uppercase font-medium px-3.5 py-2"
      >
        Open editor
      </Link>
    </div>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 20h4l10-10-4-4L4 16v4z" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M14 6l4 4" strokeLinecap="round" />
    </svg>
  );
}