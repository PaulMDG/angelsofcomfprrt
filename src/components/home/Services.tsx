import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import stillLife from "@/assets/services-stilllife.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedServices } from "@/lib/cms-services";

export function Services() {
  const { data: services = [] } = useQuery({
    queryKey: ["public", "services"],
    queryFn: fetchPublishedServices,
  });
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>Our Care Services</Eyebrow>
            <h2 className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.08] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
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