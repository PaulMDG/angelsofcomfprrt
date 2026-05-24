import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { Link } from "@tanstack/react-router";
import featured from "@/assets/resources-featured.jpg";

const articles = [
  { tag: "Caregiver Wellness", t: "Knowing when it's time to ask for help.", r: "6 min read" },
  { tag: "Dementia", t: "Creating a calm home for memory care.", r: "8 min read" },
  { tag: "Family Conversations", t: "How to talk to a parent about in-home care.", r: "5 min read" },
];

export function Resources() {
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <Reveal>
            <Eyebrow>From Our Journal</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.05] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              Guidance for the <span className="gold-italic">journey.</span>
            </h2>
          </Reveal>
          <Reveal>
            <Link to="/resources" className="link-gold">Visit the Journal →</Link>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          <Reveal className="lg:col-span-7">
            <Link to="/resources" className="group block">
              <div className="overflow-hidden rounded-[6px]">
                <img src={featured} alt="Editorial still life with notebook and tea"
                  className="w-full h-[480px] object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>
              <div className="mt-6">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
                  Featured · Caregiver Wellness
                </span>
                <h3 className="mt-3 font-serif text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors"
                  style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
                  The quiet strength of asking for help.
                </h3>
                <p className="mt-3 editorial-body max-w-xl">
                  A reflection for family caregivers — and a reminder that needing support is not a
                  weakness, but an act of love.
                </p>
              </div>
            </Link>
          </Reveal>
          <div className="lg:col-span-5 space-y-8">
            {articles.map((a, i) => (
              <Reveal key={a.t} delay={i * 0.08}>
                <Link to="/resources" className="group block border-b border-[var(--gold)]/25 pb-8">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
                    {a.tag}
                  </span>
                  <h4 className="mt-3 font-serif text-2xl text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors">
                    {a.t}
                  </h4>
                  <span className="mt-3 inline-block text-[12px] text-[var(--warm-gray)] tracking-wide">{a.r}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}