import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import img from "@/assets/promise-values.jpg";

const values = [
  { n: "01", t: "Dignity", d: "We honor every person's story, choices, and pace — care is given on their terms." },
  { n: "02", t: "Warmth", d: "A familiar face, a steady presence, a home that feels lived-in and loved." },
  { n: "03", t: "Trust", d: "Licensed, background-checked caregivers and transparent communication with families." },
  { n: "04", t: "Devotion", d: "We treat your loved one as we would our own — with patience, attention, and heart." },
];

export function Promise() {
  return (
    <section className="bg-[var(--navy-deep)] text-[var(--ivory)] relative overflow-hidden">
      <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16 items-center">
        <Reveal className="lg:col-span-5">
          <div className="overflow-hidden rounded-[6px]">
            <img src={img} alt="Caregiver gently holding the hand of an elder" loading="lazy"
              className="w-full h-[620px] object-cover" />
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>Our Promise</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.05]"
              style={{ fontSize: "clamp(40px, 5vw, 72px)", color: "var(--ivory)" }}>
              Built on values that <span className="gold-italic">last.</span>
            </h2>
            <BotanicalSprig className="w-28 h-8 text-[var(--gold-light)] mt-6" />
            <p className="mt-6 text-[17px] leading-[1.8] text-[var(--cream)]/80 max-w-xl font-light">
              Angels of Comfort was founded on a simple belief: that everyone deserves to age with grace,
              surrounded by people who truly see them. These values guide every visit, every conversation,
              every act of care.
            </p>
          </Reveal>
          <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.08}>
                <div className="border-t border-[var(--gold)]/30 pt-6">
                  <div className="text-[11px] tracking-[0.2em] text-[var(--gold-light)] font-medium">{v.n}</div>
                  <h3 className="mt-3 font-serif text-3xl text-[var(--ivory)]">{v.t}</h3>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[var(--cream)]/70 font-light">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}