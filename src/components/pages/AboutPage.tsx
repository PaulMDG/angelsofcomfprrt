import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { HeartOutline } from "@/components/site/Botanical";
import { PageHeader } from "./PageHeader";
import founderAsset from "@/assets/founder-veronica.jpg.asset.json";
import promiseImg from "@/assets/promise-values.jpg";

const values = [
  { word: "Dignity", desc: "We honor the person, not the diagnosis. Every interaction begins with respect." },
  { word: "Warmth", desc: "Care should feel human — never clinical. Kindness is non-negotiable." },
  { word: "Trust", desc: "Licensed, bonded, background-checked. Earned through consistency, not promised once." },
  { word: "Devotion", desc: "We show up. Again and again. For the families who depend on us." },
];

type Stat = { value: string; label: string; icon: "shield" | "clock" | "heart" | "chat" };
const stats: Stat[] = [
  { value: "RSA", label: "Maryland Licensed Agency", icon: "shield" },
  { value: "24/7", label: "Care Available When You Need Us", icon: "clock" },
  { value: "1:1", label: "Personalized Care Plans", icon: "heart" },
  { value: "PORTAL", label: "Family Updates & Communication", icon: "chat" },
];

function StatIcon({ name, className }: { name: Stat["icon"]; className?: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
  if (name === "shield") return (
    <svg {...common}><path d="M12 2 L4 5 V12 C4 17 7.5 20.5 12 22 C16.5 20.5 20 17 20 12 V5 Z" /><path d="M8.5 12 L11 14.5 L15.5 10" /></svg>
  );
  if (name === "clock") return (
    <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7 V12 L15 14" /></svg>
  );
  if (name === "heart") return (
    <svg {...common}><path d="M12 20.5 C 7 16, 3 13, 3 8.5 A 4.5 4.5 0 0 1 12 7 A 4.5 4.5 0 0 1 21 8.5 C 21 13, 17 16, 12 20.5 Z" /></svg>
  );
  return (
    <svg {...common}><path d="M21 12 C 21 16, 17 19, 12 19 C 10.5 19 9 18.7 7.7 18.2 L 3 19.5 L 4.3 15.8 C 3.5 14.7 3 13.4 3 12 C 3 8 7 5 12 5 C 17 5 21 8 21 12 Z" /><circle cx="8.5" cy="12" r="0.8" fill="currentColor" /><circle cx="12" cy="12" r="0.8" fill="currentColor" /><circle cx="15.5" cy="12" r="0.8" fill="currentColor" /></svg>
  );
}

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
                src={founderAsset.url}
                alt="Veronica Karendi, Founder of Angels of Comfort"
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
                — VERONICA KARENDI, FOUNDER, ANGELS OF COMFORT
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
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--ivory)]"
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
          <div className="mt-20 rounded-[10px] border border-[var(--gold-light)]/30 p-8 sm:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 lg:divide-x lg:divide-[var(--gold-light)]/25">
              {stats.map((s, i) => (
                <Reveal key={s.value} delay={i * 0.06}>
                  <div className="text-center px-4 lg:px-8">
                    <StatIcon name={s.icon} className="w-10 h-10 text-[var(--gold-light)] mx-auto" />
                    <div
                      className="mt-6 font-serif text-[var(--gold-light)] leading-none tracking-[0.02em]"
                      style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                    >
                      {s.value}
                    </div>
                    <div className="w-10 h-px bg-[var(--gold-light)]/60 mx-auto mt-5" />
                    <p className="mt-6 text-[15px] leading-[1.6] text-[var(--ivory)] font-light max-w-[200px] mx-auto">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
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