import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-caregiver.jpg";

const trustItems = [
  { label: "Maryland RSA Licensed", icon: ShieldIcon },
  { label: "Background-Checked Caregivers", icon: PeopleIcon },
  { label: "Personalized Care Plans", icon: HeartIcon },
  { label: "Family Communication Portal", icon: ChatIcon },
  { label: "Serving Maryland Families", icon: PinIcon },
];

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[var(--navy-deep)]">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="A caregiver and elderly woman sitting together in a sunlit living room"
          className="w-full h-full object-cover object-[70%_center]"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(14,27,46,0.96) 0%, rgba(14,27,46,0.88) 30%, rgba(14,27,46,0.55) 55%, rgba(14,27,46,0.1) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, var(--navy-deep))" }}
        />
      </div>

      <div className="relative container-editorial pt-40 pb-20 lg:pb-28">
        <div className="max-w-[640px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="eyebrow text-[var(--gold-light)]"
          >
            Maryland Licensed In-Home Care
          </motion.div>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="mt-5 h-px w-16 bg-[var(--gold)] origin-left"
          />

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8 font-serif text-[var(--ivory)] leading-[1.02] tracking-[-0.02em] font-medium"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            Care that<br />
            feels like <span className="gold-italic">home.</span>
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
            className="mt-6 text-[18px] leading-[1.7] text-[var(--cream)] max-w-[520px] font-light"
          >
            Compassionate in-home care for Maryland families. Support your loved one with dignity,
            understanding, and a familiar face — every day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/consultation" className="btn-primary">
              Schedule Consultation
            </Link>
            <Link to="/services" className="btn-outline btn-outline-light">
              Explore Care Services
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative border-t border-[var(--gold)]/20"
      >
        <div className="container-editorial py-6">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            {trustItems.map((it) => (
              <div key={it.label} className="flex items-center gap-3">
                <it.icon className="w-5 h-5 text-[var(--gold-light)] shrink-0" />
                <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--cream)] font-medium">
                  {it.label}
                </span>
              </div>
            ))}
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