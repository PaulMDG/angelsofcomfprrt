import { useState } from "react";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { AnimatePresence, motion } from "framer-motion";
import faqImg from "@/assets/faq-books.jpg";

const faqs = [
  { q: "How quickly can care begin?", a: "In most cases, we can begin care within 48–72 hours of your initial consultation. Urgent situations are accommodated whenever possible." },
  { q: "Are your caregivers licensed and insured?", a: "Yes. Angels of Comfort is fully licensed by the Maryland RSA. Every caregiver is background-checked, trained, bonded, and insured." },
  { q: "How are caregivers matched to my loved one?", a: "We match based on personality, language, interests, and care needs — and we welcome your input. Consistency of caregiver is one of our highest priorities." },
  { q: "What if our needs change over time?", a: "Care plans are reviewed regularly. As needs evolve, we adjust hours, services, and support — seamlessly and without disruption." },
  { q: "Do you accept long-term care insurance?", a: "We work with most long-term care insurance plans and offer billing assistance. We also accept private pay and certain Medicaid waivers." },
  { q: "Where in Maryland do you serve?", a: "We serve families throughout Montgomery, Howard, Prince George's, Frederick, and surrounding counties. Reach out to confirm availability in your area." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[var(--cream)]">
      <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Frequently Asked</Eyebrow>
          <h2 className="mt-6 font-serif font-medium leading-[1.05] text-[var(--navy-deep)]"
            style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
            Answers, with <span className="gold-italic">care.</span>
          </h2>
          <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mt-6" />
          <p className="editorial-body mt-6 max-w-md">
            Choosing care is deeply personal. Here are the answers families ask most — and we're
            always available for the conversations that aren't on this page.
          </p>
          <div className="mt-10 overflow-hidden rounded-[6px] hidden lg:block">
            <img src={faqImg} alt="A stack of books with reading glasses on a linen surface"
              loading="lazy" className="w-full h-[360px] object-cover" />
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <ul className="divide-y divide-[var(--gold)]/30 border-y border-[var(--gold)]/30">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors"
                      style={{ fontSize: "24px" }}>
                      {f.q}
                    </span>
                    <span className="mt-2 shrink-0 w-8 h-8 rounded-full border border-[var(--gold)]/50 flex items-center justify-center text-[var(--gold)] transition-transform duration-500"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-12 text-[16px] leading-[1.8] text-[var(--text-body)] font-light max-w-2xl">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}