import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedServices } from "@/lib/cms-services";
import { useHomeSection } from "@/lib/homepage-content";

export function Services() {
  const s = useHomeSection("services");
  const { data: services = [] } = useQuery({
    queryKey: ["public", "services"],
    queryFn: fetchPublishedServices,
  });
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>{s.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.08] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}>
              {s.heading} <span className="gold-italic">{s.italic_word}</span>
            </h2>
            <p className="editorial-body mt-6">{s.body}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-5 sm:items-center">
              <a href={s.primary_cta.url} className="btn-primary">{s.primary_cta.label}</a>
              <a href={s.secondary_cta.url} className="link-gold text-[15px]">{s.secondary_cta.label}</a>
            </div>
            <div className="mt-12 overflow-hidden rounded-[6px]">
              <img src={s.image_url} alt="Angels of Comfort care services" loading="lazy"
                className="w-full h-[340px] object-cover" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>{s.side_eyebrow}</Eyebrow>
          </Reveal>
          <div className="mt-8 divide-y divide-[var(--gold)]/25">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  preload="intent"
                  className="group block py-7 transition-colors hover:bg-[var(--champagne)]/40 -mx-4 px-4 border-l-2 border-transparent hover:border-[var(--gold)]"
                >
                  <h3 className="font-serif text-[var(--navy-deep)] group-hover:text-[var(--gold-muted)] transition-colors"
                    style={{ fontSize: "26px" }}>
                    {s.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--warm-gray)]">{s.description}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}