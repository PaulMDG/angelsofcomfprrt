import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MonogramAC } from "./Botanical";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNavServices } from "@/lib/cms-services";
import { fetchNavItems, type NavItem as DbNavItem } from "@/lib/nav";
import { supabase } from "@/integrations/supabase/client";
import { useLogo } from "@/lib/site-settings";
import brandLogo from "@/assets/logo.jpeg";

type MegaColumn = {
  heading: string;
  blurb?: string;
  items: {
    label: string;
    desc?: string;
    to?: "/services" | "/resources" | "/services/$slug";
    params?: { slug: string };
    hash?: string;
  }[];
};

type NavItem = {
  to: string;
  label: string;
  external?: boolean;
  newTab?: boolean;
  mega?: {
    tagline: string;
    italic: string;
    columns: MegaColumn[];
    cta: { label: string; to: string };
  };
};

const servicesMegaBase = {
  tagline: "Thoughtful in-home support designed to bring comfort, dignity, and peace of mind to",
  italic: "Maryland families.",
  cta: { label: "Explore all services", to: "/services" as const },
};

const resourcesMega: NavItem["mega"] = {
  tagline: "Quiet guidance for",
  italic: "hard moments.",
  columns: [
    {
      heading: "The Journal",
      items: [
        { label: "When the caregiver needs care", desc: "A guide to burnout." },
        { label: "The first signs we missed", desc: "A daughter's letter on dementia." },
        { label: "Talking to a parent about help", desc: "A practical script." },
      ],
    },
    {
      heading: "Guides",
      items: [
        { label: "Hospital Discharge", desc: "The first 30 days at home." },
        { label: "Sundowning", desc: "Why evenings are hardest." },
        { label: "Designing a safer home", desc: "Without it feeling clinical." },
      ],
    },
    {
      heading: "Planning",
      items: [
        { label: "VA Benefits & Insurance", desc: "Questions worth asking." },
        { label: "When Siblings Disagree", desc: "Finding common ground." },
        { label: "Comfort Care at Home", desc: "What families wish they'd known." },
      ],
    },
  ],
  cta: { label: "Read the journal", to: "/resources" },
};

export function Navigation({ overHero = true }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: logo } = useLogo();
  const wordmark = logo?.wordmark || "Angels of Comfort";
  const logoSrc = logo?.url || brandLogo;

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["public", "services", "nav"],
    queryFn: fetchNavServices,
    staleTime: 60_000,
  });

  const { data: dbNav = [] } = useQuery({
    queryKey: ["public", "nav_items", "header"],
    queryFn: () => fetchNavItems("header"),
    staleTime: 60_000,
  });

  // Live-update the megamenu when services are toggled in the admin
  useEffect(() => {
    const channel = supabase
      .channel("nav-services")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "services" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["public", "services", "nav"] });
          queryClient.invalidateQueries({ queryKey: ["public", "services"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "nav_items" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["public", "nav_items"] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Build nav from DB (header menu). Fallback to hardcoded defaults if empty.
  const navLinks: NavItem[] = (() => {
    if (dbNav.length === 0) {
      // Fallback: keep current site working before admin seeds menu
      const servicesMega: NavItem["mega"] = {
        ...servicesMegaBase,
        columns: [
          {
            heading: "Services",
            items: services.map((s) => ({
              label: s.nav_label || s.name,
              desc: s.tagline ?? undefined,
              to: "/services/$slug" as const,
              params: { slug: s.slug },
            })),
          },
        ],
      };
      return [
        { to: "/services", label: "Services", mega: servicesMega },
        { to: "/family-portal", label: "Family Portal" },
        { to: "/resources", label: "Resources", mega: resourcesMega },
        { to: "/about", label: "About Us" },
      ];
    }
    const tops = dbNav.filter((n) => !n.parent_id);
    const childrenOf = (id: string) =>
      dbNav.filter((n) => n.parent_id === id).sort((a, b) => a.sort_order - b.sort_order);
    return tops.map<NavItem>((top) => {
      const kids = childrenOf(top.id);
      const isExternal = top.link_type === "external" || /^https?:\/\//i.test(top.url);
      const base: NavItem = {
        to: top.url,
        label: top.label,
        external: isExternal,
        newTab: top.open_in_new_tab,
      };
      if (kids.length === 0) return base;
      return {
        ...base,
        mega: {
          tagline:
            top.label.toLowerCase() === "services"
              ? servicesMegaBase.tagline
              : "Quiet guidance for",
          italic:
            top.label.toLowerCase() === "services"
              ? servicesMegaBase.italic
              : "every step.",
          columns: [
            {
              heading: top.label,
              items: kids.map((k) => ({
                label: k.label,
                // Force string-based URLs (typed `to` won't apply to dynamic DB URLs)
                to: k.url as any,
              })),
            },
          ],
          cta: { label: `Explore all ${top.label.toLowerCase()}`, to: top.url },
        },
      };
    });
  })();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = overHero && !scrolled;
  const activeMega = navLinks.find((l) => l.label === hovered && l.mega)?.mega;
  const isServicesMega = hovered === "Services";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background:
            scrolled || !overHero || (activeMega && !isServicesMega)
              ? "rgba(14, 27, 46, 0.96)"
              : "transparent",
          backdropFilter: scrolled || (activeMega && !isServicesMega) ? "blur(12px)" : "none",
          borderBottom:
            scrolled || (activeMega && !isServicesMega)
              ? "1px solid rgba(184, 147, 90, 0.15)"
              : "1px solid transparent",
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="container-editorial flex items-center justify-between py-5">
          <Link to="/" className="flex items-center group" aria-label={wordmark}>
            <img
              src={logoSrc}
              alt={logo?.alt || wordmark}
              className="h-14 md:h-16 w-auto object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((l) => (
              <div
                key={l.to}
                onMouseEnter={() => setHovered(l.mega ? l.label : null)}
                className="relative py-2"
              >
                <Link
                  to={l.to}
                  className="text-[12px] tracking-[0.16em] uppercase font-medium transition-colors flex items-center gap-1.5"
                  style={{ color: hovered === l.label ? "var(--gold-light)" : "#FAF8F4" }}
                  activeProps={{ style: { color: "var(--gold-light)" } }}
                >
                  {l.label}
                  {l.mega && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 10 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      style={{
                        transform: hovered === l.label ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.3s",
                      }}
                    >
                      <path d="M1 1l4 4 4-4" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:2404263304"
              className="text-[12px] tracking-[0.12em] font-medium flex items-center gap-2"
              style={{ color: "var(--gold-light)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (240) 426-3304
            </a>
            <Link to="/consultation" className="btn-outline btn-outline-light">
              Schedule Consultation
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Open menu"
          >
            <div className="space-y-[6px]">
              <div className="w-7 h-px bg-[var(--gold-light)]" />
              <div className="w-7 h-px bg-[var(--gold-light)]" />
              <div className="w-5 h-px bg-[var(--gold-light)] ml-auto" />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {activeMega && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="hidden lg:flex justify-center px-6"
            >
              <div
                className="w-full max-w-[640px] grid grid-cols-2 gap-0 rounded-sm shadow-2xl"
                style={{
                  background: "#FAF8F4",
                  boxShadow: "0 30px 60px -20px rgba(14, 27, 46, 0.35)",
                }}
              >
                <div className="p-10 flex flex-col justify-between">
                  <div>
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 48 48"
                      fill="none"
                      stroke="var(--gold)"
                      strokeWidth="1.2"
                      className="mb-6"
                    >
                      <path d="M8 22L24 8l16 14v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V22z" />
                      <path d="M24 30c-3-2.2-6-4-6-7a3 3 0 0 1 6-1.5A3 3 0 0 1 30 23c0 3-3 4.8-6 7z" />
                    </svg>
                    <p
                      className="font-serif italic text-[17px] leading-[1.6] max-w-[220px]"
                      style={{ color: "#3a3530" }}
                    >
                      {activeMega.tagline}{" "}
                      <span className="not-italic">{activeMega.italic}</span>
                    </p>
                    <div
                      className="mt-6 h-px w-12"
                      style={{ background: "var(--gold)" }}
                    />
                  </div>
                  <Link
                    to={activeMega.cta.to}
                    onClick={() => setHovered(null)}
                    className="inline-flex items-center gap-2 mt-8 text-[10px] tracking-[0.24em] uppercase font-medium hover:opacity-70 transition-opacity"
                    style={{ color: "var(--gold)" }}
                  >
                    {activeMega.cta.label}
                    <span>→</span>
                  </Link>
                </div>
                <ul className="py-4 pr-4">
                  {isServicesMega && servicesLoading && services.length === 0 ? (
                    <li className="p-4 space-y-3">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-3 border-b border-[#0e1b2e]/8 last:border-0">
                          <div className="h-3 rounded bg-[#0e1b2e]/10 animate-pulse" style={{ width: `${60 + (i * 7) % 30}%` }} />
                          <div className="h-3 w-3 rounded-full bg-[#0e1b2e]/10 animate-pulse" />
                        </div>
                      ))}
                    </li>
                  ) : isServicesMega && !servicesLoading && services.length === 0 ? (
                    <li className="p-8 text-center">
                      <p className="text-[12px] tracking-[0.18em] uppercase text-[#0e1b2e]/60 font-medium">
                        No services yet
                      </p>
                      <p className="mt-2 text-[13px] text-[#0e1b2e]/50 italic font-serif">
                        Add services from the admin to populate this menu.
                      </p>
                    </li>
                  ) : (
                    activeMega.columns.flatMap((col) => col.items).map((item, idx, arr) => (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.05 + idx * 0.04, ease: [0.4, 0, 0.2, 1] }}
                      className={
                        idx < arr.length - 1
                          ? "border-b border-[#0e1b2e]/8"
                          : ""
                      }
                    >
                      <Link
                        to={item.to ?? (hovered === "Resources" ? "/resources" : "/services")}
                        params={item.params as any}
                        hash={item.hash}
                        preload="intent"
                        onClick={() => setHovered(null)}
                        className="group relative flex items-center justify-between gap-4 px-4 py-4 text-[11px] tracking-[0.22em] uppercase font-medium transition-colors overflow-hidden"
                        style={{ color: "#0e1b2e" }}
                      >
                        <span className="absolute inset-y-0 left-0 w-[2px] bg-[var(--gold)] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
                        <span className="relative group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all duration-300">
                          {item.label}
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="relative opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                          style={{ color: "var(--gold)" }}
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </motion.li>
                  ))
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[60] bg-[var(--navy-deep)] flex flex-col"
          >
            <div className="container-editorial flex items-center justify-between py-5">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center" aria-label={wordmark}>
                <img
                  src={logoSrc}
                  alt={logo?.alt || wordmark}
                  className="h-12 w-auto object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="1.2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 container-editorial flex flex-col justify-center gap-6">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  {l.mega ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === l.label ? null : l.label)
                        }
                        className="font-serif text-4xl text-[var(--ivory)] flex items-center gap-3 w-full"
                      >
                        {l.label}
                        <motion.svg
                          width="18"
                          height="18"
                          viewBox="0 0 10 6"
                          fill="none"
                          stroke="var(--gold-light)"
                          strokeWidth="1.2"
                          animate={{ rotate: mobileExpanded === l.label ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path d="M1 1l4 4 4-4" />
                        </motion.svg>
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileExpanded === l.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-4 pl-1 border-l border-[var(--gold)]/30">
                              <li>
                                <Link
                                  to={l.to}
                                  onClick={() => setOpen(false)}
                                  className="block py-3 pl-5 text-[11px] tracking-[0.22em] uppercase text-[var(--gold-light)]"
                                >
                                  {l.mega.cta.label} →
                                </Link>
                              </li>
                              {l.label === "Services" && servicesLoading && services.length === 0 ? (
                                [0, 1, 2].map((i) => (
                                  <li key={`sk-${i}`} className="py-3 pl-5">
                                    <div className="h-4 rounded bg-white/10 animate-pulse" style={{ width: `${55 + i * 10}%` }} />
                                  </li>
                                ))
                              ) : l.label === "Services" && !servicesLoading && services.length === 0 ? (
                                <li className="py-3 pl-5 text-[13px] italic text-[var(--ivory)]/50 font-serif">
                                  No services yet.
                                </li>
                              ) : (
                                l.mega.columns.flatMap((c) => c.items).map((item) => (
                                <li key={item.label}>
                                  <Link
                                    to={
                                      item.to ??
                                      (l.label === "Resources" ? "/resources" : "/services")
                                    }
                                    params={item.params as any}
                                    hash={item.hash}
                                    preload="intent"
                                    onClick={() => setOpen(false)}
                                    className="block py-3 pl-5 text-[15px] text-[var(--ivory)]/85 hover:text-[var(--gold-light)] transition-colors"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))
                              )}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="font-serif text-4xl text-[var(--ivory)] block"
                    >
                      {l.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
            <div className="container-editorial pb-10 space-y-5">
              <a href="tel:2404263304" className="block font-serif text-2xl text-[var(--gold-light)]">
                (240) 426-3304
              </a>
              <Link to="/consultation" onClick={() => setOpen(false)} className="btn-outline btn-outline-light w-full">
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
