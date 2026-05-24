import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { PageHeader } from "./PageHeader";
import stillLife from "@/assets/services-stilllife.jpg";

const services = [
  {
    name: "Dementia & Memory Care",
    tagline: "Familiarity is medicine.",
    desc: "For families navigating Alzheimer's and other memory-related conditions, our caregivers bring patience, structure, and deep respect. We focus on what your loved one can still do — and we protect what they cherish.",
    includes: ["Specialized memory training", "Safe-at-home assessments", "Sundowning support", "Family education"],
  },
  {
    name: "Companion Care",
    tagline: "Loneliness is its own illness.",
    desc: "Conversation. A shared meal. A drive to a favorite place. Companion care brings warmth and presence into the day — gently easing isolation and restoring small, ordinary joys.",
    includes: ["Meaningful conversation", "Hobbies & games", "Light meal preparation", "Outings & errands"],
  },
  {
    name: "Personal Care",
    tagline: "Dignity, in every small moment.",
    desc: "Help with bathing, dressing, mobility, and grooming — delivered with the kind of quiet respect that makes a difficult moment easier. Independence is preserved wherever possible.",
    includes: ["Bathing & grooming", "Dressing assistance", "Mobility support", "Medication reminders"],
  },
  {
    name: "Respite Care",
    tagline: "You deserve to rest, too.",
    desc: "Family caregivers carry a quiet weight. Respite care gives you back hours, days, or weeks — knowing your loved one is safe, supported, and genuinely cared for in your absence.",
    includes: ["Hourly or overnight relief", "Vacation coverage", "Family-event support", "Recurring respite plans"],
  },
  {
    name: "Live-In Care",
    tagline: "Around-the-clock, at home.",
    desc: "When your loved one needs continuous support, our live-in caregivers become a calm, consistent presence in the home — preserving routine, comfort, and connection.",
    includes: ["24/7 in-home presence", "Overnight monitoring", "Daily routine management", "Consistent caregiver team"],
  },
  {
    name: "Hospital Discharge Support",
    tagline: "The first 30 days matter most.",
    desc: "We bridge hospital to home with a coordinated plan — medication reminders, transportation, follow-up support, and gentle daily care during the most vulnerable stretch of recovery.",
    includes: ["Discharge coordination", "Medication management", "Follow-up transportation", "Recovery monitoring"],
  },
  {
    name: "Recovery & Post-Surgical Care",
    tagline: "Healing happens at home.",
    desc: "After surgery, illness, or injury, the body and the spirit both need rest. We provide attentive, focused care so your loved one can heal in the place that feels safest.",
    includes: ["Mobility & wound watch", "Nutrition support", "Therapy reminders", "Comfort & companionship"],
  },
];

export function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Care Services"
        title="Care for every stage of"
        italic="the journey."
        intro="Every family's situation is unique. Our services are built around your loved one — their preferences, their rhythms, and the things that make home feel like home."
      />

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>What We Provide</Eyebrow>
                <h2
                  className="mt-6 font-serif font-medium leading-[1.05] text-[var(--navy-deep)]"
                  style={{ fontSize: "clamp(30px, 3vw, 44px)" }}
                >
                  Seven services, <span className="gold-italic">one promise.</span>
                </h2>
                <BotanicalSprig className="w-24 h-7 text-[var(--gold)] mt-6" />
                <p className="editorial-body mt-6 max-w-sm">
                  Care plans are crafted with you, not handed to you. We listen first — and then we
                  build something that fits your family.
                </p>
                <div className="mt-10 overflow-hidden rounded-[6px] hidden lg:block">
                  <img
                    src={stillLife}
                    alt="Quiet morning still life in a warm home"
                    loading="lazy"
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-8 space-y-10">
              {services.map((s, i) => (
                <Reveal key={s.name} delay={i * 0.04}>
                  <article className="border-t border-[var(--gold)]/30 pt-10 grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                      <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">
                        0{i + 1}
                      </div>
                      <h3
                        className="mt-3 font-serif text-[var(--navy-deep)] leading-[1.1]"
                        style={{ fontSize: "28px" }}
                      >
                        {s.name}
                      </h3>
                      <p className="mt-3 font-serif italic text-[var(--gold-muted)]">{s.tagline}</p>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-[16px] leading-[1.8] text-[var(--text-body)] font-light">
                        {s.desc}
                      </p>
                      <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                        {s.includes.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-3 text-[14px] text-[var(--warm-gray)]"
                          >
                            <span className="mt-2 w-1 h-1 rounded-full bg-[var(--gold)] shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy-deep)] text-[var(--ivory)]">
        <div className="container-editorial section-pad text-center max-w-2xl mx-auto">
          <Reveal>
            <Eyebrow>Not sure where to begin?</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.05]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}
            >
              We'll help you find the <span className="gold-italic">right care.</span>
            </h2>
            <p className="mt-6 text-[var(--cream)]/80 font-light leading-[1.8]">
              A free consultation with one of our care advisors. No pressure, no obligation —
              just a thoughtful conversation about what your family needs.
            </p>
            <Link to="/consultation" className="btn-outline btn-outline-light mt-10 inline-flex">
              Schedule a Consultation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}