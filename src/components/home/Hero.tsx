import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useHomeSection } from "@/lib/homepage-content";

const ICONS: Record<string, (p: { className?: string }) => ReactElement> = {
  shield: ShieldIcon,
  people: PeopleIcon,
  heart: HeartIcon,
  chat: ChatIcon,
  pin: PinIcon,
};

export function Hero() {
  const hero = useHomeSection("hero");
  const heroImg = hero.image_url;
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[var(--navy-deep)]">
      {/* Photo on the right; left side stays dark navy for the headline */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="A caregiver and elderly woman sitting together in a sunlit living room"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-[55%_center]"
          fetchPriority="high"
        />
        {/* Horizontal wash on every breakpoint — keeps the left column dark for the headline, lets the photo breathe on the right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--navy-deep) 0%, var(--navy-deep) 35%, rgba(14,27,46,0.9) 55%, rgba(14,27,46,0.55) 72%, rgba(14,27,46,0.15) 90%)",
          }}
        />
        {/* Subtle top fade so the fixed nav stays legible across the image */}
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(to bottom, rgba(14,27,46,0.55), transparent)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, var(--navy-deep))" }}
        />
      </div>

      <div className="relative container-editorial pt-40 pb-20 lg:pb-28">
        {/* Two-column scaffold reserves the right half for the photo at every breakpoint */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          <div className="max-w-[560px] col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="eyebrow text-[var(--gold-light)]"
          >
            {hero.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8 font-serif text-[var(--ivory)] leading-[1.08] sm:leading-[1.05] tracking-[-0.02em] font-medium [text-wrap:balance]"
            style={{ fontSize: "clamp(44px, 8.5vw, 84px)" }}
          >
            {hero.headline_line1}<br />
            {hero.headline_line2} <span className="gold-italic">{hero.headline_italic}</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8 h-px w-16 bg-[var(--gold)] origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-[17px] leading-[1.7] text-[var(--cream)] max-w-[460px] font-light"
          >
            {hero.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to={hero.primary_cta.url} className="btn-primary">
              {hero.primary_cta.label}
            </Link>
            <Link to={hero.secondary_cta.url} className="btn-outline btn-outline-light">
              {hero.secondary_cta.label}
            </Link>
          </motion.div>
          </div>
          {/* Right column intentionally left empty on desktop so the photo shows through */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative border-t border-[var(--gold)]/20"
      >
        <div className="container-editorial py-6 sm:py-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-6 lg:gap-8 rounded-xl sm:rounded-none bg-[rgba(8,16,30,0.7)] sm:bg-transparent ring-1 ring-[var(--gold)]/15 sm:ring-0 px-2 sm:px-0 py-5 sm:py-0 divide-x divide-[var(--gold)]/15 sm:divide-x-0">
            {hero.trust_items.map((it) => {
              const Icon = ICONS[it.icon] ?? ShieldIcon;
              return (
                <div
                  key={it.label}
                  className="flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-2.5 sm:gap-3 text-center sm:text-left min-w-0 px-1 sm:px-0"
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5 text-[var(--gold-light)] shrink-0" />
                  <span className="block text-[9px] sm:text-[10px] leading-[1.45] sm:leading-[1.3] tracking-[0.1em] sm:tracking-[0.18em] uppercase text-[var(--cream)] font-medium break-words hyphens-auto">
                    {it.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M12 2 L4 5 V12 C4 17 7.5 20.5 12 22 C16.5 20.5 20 17 20 12 V5 Z" />
    </svg>
  );
}
function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" />
      <path d="M3 20 C3 16 5.5 14 9 14 C12.5 14 15 16 15 20 M15 14 C17.5 14 21 15.5 21 20" />
    </svg>
  );
}
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M12 20.5 C 7 16, 3 13, 3 8.5 A 4.5 4.5 0 0 1 12 7 A 4.5 4.5 0 0 1 21 8.5 C 21 13, 17 16, 12 20.5 Z" />
    </svg>
  );
}
function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M21 12 C 21 16, 17 19, 12 19 C 10.5 19 9 18.7 7.7 18.2 L 3 19.5 L 4.3 15.8 C 3.5 14.7 3 13.4 3 12 C 3 8 7 5 12 5 C 17 5 21 8 21 12 Z" />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M12 22 C 8 16, 5 12, 5 9 A 7 7 0 0 1 19 9 C 19 12, 16 16, 12 22 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}