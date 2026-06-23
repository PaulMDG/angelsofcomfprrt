import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { HeartOutline } from "@/components/site/Botanical";
import { PageHeader } from "./PageHeader";
import hero from "@/assets/about-hero.jpg";
import promiseImg from "@/assets/promise-values.jpg";

const values = [
  { word: "Dignity", desc: "We honor the person, not the diagnosis. Every interaction begins with respect." },
  { word: "Warmth", desc: "Care should feel human — never clinical. Kindness is non-negotiable." },
  { word: "Trust", desc: "Licensed, bonded, background-checked. Earned through consistency, not promised once." },
  { word: "Devotion", desc: "We show up. Again and again. For the families who depend on us." },
];

const stats = [
  ["RSA", "MARYLAND LICENSED AGENCY"],
  ["24/7", "CARE AVAILABILITY WHEN YOU NEED US"],
  ["24/7", "CARE AVAILABLE WHEN YOU NEED US"],
  ["RSA", "Fully licensed in the state of Maryland"],
];

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="Built on"
        italic="trust."
        intro="Angels of Comfort began with a simple promise — that the people we love deserve to grow older in the homes they helped build. A decade later, that promise still shapes everything we do."
      />

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <div className="overflow-hidden rounded-[6px] shadow-[0_30px_90px_rgba(14,27,46,0.18)]">
              <img
                src={hero}
                alt="A caregiver gently holding an elderly woman's hand"
                loading="lazy"
                className="w-full h-[640px] object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <Eyebrow>A Letter From Our Founder</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(32px, 3.5vw, 48px)" }}
            >
              We started with a single <span className="gold-italic">family.</span>
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-[1.85] text-[var(--text-body)] font-light">
              <p>
                When my grandmother began to forget her way home from the corner store, our family
                searched for help. What we found was paperwork, waiting rooms, and people who saw
                her as a list of conditions instead of a person.
              </p>
              <p>
                I built Angels of Comfort so that no Maryland family would have to feel that way
                again. Care begins with listening. With learning the songs she loves, the meals he
                remembers, the corner of the porch where the morning light is best.
              </p>
              <p className="font-serif italic text-[20px] text-[var(--gold-muted)]">
                "Care should feel like home, because it happens at home."
              </p>
              <p className="text-sm tracking-[0.18em] uppercase text-[var(--gold)]">
                — Founder, Angels of Comfort
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--navy-deep)] text-[var(--ivory)]">
        <div className="container-editorial section-pad">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow className="justify-center">Our Promise</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}
            >
              Four values, in every <span className="gold-italic">visit.</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
            {values.map((v, i) => (
              <Reveal key={v.word} delay={i * 0.08}>
                <div className="text-center">
                  <HeartOutline className="w-7 h-7 text-[var(--gold-light)] mx-auto" />
                  <h3
                    className="mt-5 font-serif text-[var(--ivory)]"
                    style={{ fontSize: "30px" }}
                  >
                    {v.word}
                  </h3>
                  <div className="w-8 h-px bg-[var(--gold-light)] mx-auto mt-4 opacity-60" />
                  <p className="mt-5 text-[14px] leading-[1.85] text-[var(--cream)]/75 font-light">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-20 pt-16 border-t border-[var(--gold-light)]/20">
            {stats.map(([num, label]) => (
              <Reveal key={label}>
                <div className="text-center">
                  <div
                    className="font-serif text-[var(--gold-light)] leading-none"
                    style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                  >
                    {num}
                  </div>
                  <p className="mt-3 text-[12px] tracking-[0.18em] uppercase text-[var(--cream)]/70">
                    {label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)]">
        <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-5 order-2 lg:order-1">
            <Eyebrow>How We Hire</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(30px, 3vw, 44px)" }}
            >
              We hire for <span className="gold-italic">heart</span> first.
            </h2>
            <p className="editorial-body mt-6 max-w-md">
              Skills can be taught. Patience, kindness, and the instinct to treat a stranger like
              family — those come from somewhere deeper. Every caregiver we hire is:
            </p>
            <ul className="mt-8 space-y-3 text-[15px] text-[var(--warm-gray)]">
              {[
                "Personally interviewed by leadership",
                "Background-checked, bonded, and insured",
                "Trained in dementia and end-of-life care",
                "Matched to your family by personality and skills",
                "Supported by an on-call clinical lead 24/7",
              ].map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[var(--gold)] shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/consultation" className="btn-primary">
                Talk With Our Care Team
              </Link>
              <Link to="/services" className="link-gold">
                Explore Services →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 order-1 lg:order-2">
            <div className="overflow-hidden rounded-[6px]">
              <img
                src={promiseImg}
                alt="A caregiver and an elder sharing a quiet moment"
                loading="lazy"
                className="w-full h-[560px] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}