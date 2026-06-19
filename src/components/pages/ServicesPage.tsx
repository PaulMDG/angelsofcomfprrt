import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { PageHeader } from "./PageHeader";
import stillLife from "@/assets/services-stilllife.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedServices } from "@/lib/cms-services";

export function ServicesPage() {
  const { data: services = [] } = useQuery({
    queryKey: ["public", "services"],
    queryFn: fetchPublishedServices,
  });
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
                  className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
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
                <Reveal key={s.id} delay={i * 0.04}>
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
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        preload="intent"
                        className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[var(--gold)] hover:text-[var(--navy-deep)] transition-colors"
                      >
                        Read more <span>→</span>
                      </Link>
                    </div>
                    <div className="md:col-span-8">
                      <p className="text-[16px] leading-[1.8] text-[var(--text-body)] font-light">
                        {s.description}
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
                      {s.body_html && (
                        <div
                          className="prose-editor mt-6 font-serif text-[17px] leading-[1.8] text-[var(--text-body)]"
                          dangerouslySetInnerHTML={{ __html: s.body_html }}
                        />
                      )}
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
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
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