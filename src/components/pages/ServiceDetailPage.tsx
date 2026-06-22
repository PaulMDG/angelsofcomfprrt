import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { PageHeader } from "./PageHeader";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceBySlug } from "@/lib/cms-services";

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { data: service, isLoading } = useQuery({
    queryKey: ["public", "service", slug],
    queryFn: () => fetchServiceBySlug(slug),
  });

  if (isLoading) {
    return (
      <section className="bg-[var(--cream)] min-h-[60vh] flex items-center justify-center">
        <div className="text-[var(--warm-gray)] text-[13px] tracking-[0.2em] uppercase">Loading…</div>
      </section>
    );
  }

  if (!service) {
    return (
      <>
        <PageHeader
          eyebrow="Not found"
          title="That service is no longer"
          italic="available."
          intro="The page you're looking for may have moved. Browse all our care services below."
        />
        <section className="bg-[var(--cream)]">
          <div className="container-editorial section-pad text-center">
            <Link to="/services" className="btn-primary">Explore all services</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Care Service"
        title={service.name}
        italic={service.tagline ?? ""}
        intro={service.description ?? ""}
      />

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>What's included</Eyebrow>
                <ul className="mt-8 space-y-3">
                  {service.includes.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14px] text-[var(--warm-gray)]">
                      <span className="mt-2 w-1 h-1 rounded-full bg-[var(--gold)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {service.cover_image_url && (
                  <div className="mt-10 overflow-hidden rounded-[6px] hidden lg:block">
                    <img
                      src={service.cover_image_url}
                      alt={service.name}
                      loading="lazy"
                      className="w-full h-[420px] object-cover"
                    />
                  </div>
                )}
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                {service.body_html ? (
                  <div
                    className="prose-editor font-serif text-[17px] leading-[1.85] text-[var(--text-body)]"
                    dangerouslySetInnerHTML={{ __html: service.body_html }}
                  />
                ) : (
                  <p className="text-[17px] leading-[1.85] text-[var(--text-body)] font-light">
                    {service.description}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy-deep)] text-[var(--ivory)]">
        <div className="container-editorial section-pad text-center max-w-2xl mx-auto">
          <Reveal>
            <Eyebrow>Ready to talk?</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}
            >
              Let's design the right <span className="gold-italic">care plan.</span>
            </h2>
            <Link to="/consultation" className="btn-outline btn-outline-light mt-10 inline-flex">
              Schedule a Consultation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}