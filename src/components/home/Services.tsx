import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import stillLife from "@/assets/services-stilllife.jpg";

const services = [
  { name: "Dementia Care", desc: "Specialized support for memory-related challenges with a focus on safety, structure, and meaningful connection." },
  { name: "Respite Care", desc: "Relief for family caregivers. Take time to rest, recharge, and care for yourself — knowing your loved one is in good hands." },
  { name: "Companion Care", desc: "Meaningful companionship that reduces loneliness and brings joy to everyday life." },
  { name: "Personal Care", desc: "Respectful help with daily activities like bathing, dressing, and mobility — always preserving dignity and independence." },
  { name: "Hospital Discharge Support", desc: "Smooth transitions from hospital to home with care coordination, medication reminders, and follow-up support." },
  { name: "Live-In Care", desc: "24/7 support for those who need extra help throughout the day and night, in the comfort of home." },
  { name: "Recovery Support", desc: "Compassionate assistance during recovery from illness, surgery, or injury — focused on healing, safety, and comfort." },
];

export function Services() {
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Our Care Services</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.08] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}>
              Personalized care for every stage of the <span className="gold-italic">journey.</span>
            </h2>
            <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mt-6" />
            <p className="editorial-body mt-6">
              Every family's situation is unique. Our services are built around your loved one's
              needs, preferences, and comfort — so they can feel safe, supported, and truly at home.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-5 sm:items-center">
              <Link to="/consultation" className="btn-primary">Schedule a Consultation</Link>
              <Link to="/services" className="link-gold">View All Services →</Link>
            </div>
            <div className="mt-12 overflow-hidden rounded-[6px]">
              <img src={stillLife} alt="Warm home interior with mugs and olive branch" loading="lazy"
                className="w-full h-[340px] object-cover" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Care That Adapts to Life</Eyebrow>
          </Reveal>
          <div className="mt-8 divide-y divide-[var(--gold)]/25">
            {services.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <Link
                  to="/services"
                  className="group block py-7 transition-colors hover:bg-[var(--champagne)]/40 -mx-4 px-4 border-l-2 border-transparent hover:border-[var(--gold)]"
                >
                  <h3 className="font-serif text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors"
                    style={{ fontSize: "26px" }}>
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--warm-gray)]">{s.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}