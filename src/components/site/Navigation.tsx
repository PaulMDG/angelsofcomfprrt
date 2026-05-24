import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { MonogramAC } from "./Botanical";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/family-portal", label: "Family Portal" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About Us" },
];

export function Navigation({ overHero = true }: { overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDark = overHero && !scrolled;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled || !overHero ? "rgba(14, 27, 46, 0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(184, 147, 90, 0.15)" : "1px solid transparent",
        }}
      >
        <div className="container-editorial flex items-center justify-between py-5">
          <Link to="/" className="flex items-center gap-3 group">
            <MonogramAC className="w-10 h-10 text-[var(--gold-light)]" />
            <div className="leading-tight">
              <div
                className="font-serif text-[18px] font-semibold tracking-wide"
                style={{ color: isDark ? "#FAF8F4" : "#FAF8F4" }}
              >
                Angels of Comfort
              </div>
              <div
                className="text-[9px] tracking-[0.28em] uppercase"
                style={{ color: "var(--gold-light)" }}
              >
                In-Home Care
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[12px] tracking-[0.16em] uppercase font-medium transition-colors"
                style={{ color: "#FAF8F4" }}
                activeProps={{ style: { color: "var(--gold-light)" } }}
              >
                {l.label}
              </Link>
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
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <MonogramAC className="w-9 h-9 text-[var(--gold-light)]" />
                <span className="font-serif text-lg text-[var(--ivory)]">Angels of Comfort</span>
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
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-serif text-4xl text-[var(--ivory)] block"
                  >
                    {l.label}
                  </Link>
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