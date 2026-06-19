import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig } from "@/components/site/Botanical";
import journal from "@/assets/testimonials-journal.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedTestimonials } from "@/lib/cms";

export function Testimonials() {
  const { data: quotes = [] } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: fetchPublishedTestimonials,
  });
  return (
    <section className="bg-[var(--cream)]">
      <div className="container-editorial section-pad">
        <Reveal className="text-center max-w-2xl mx-auto">
          <div className="inline-flex eyebrow eyebrow-center">From the Families We Serve</div>
          <h2 className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
            style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
            Stories told with <span className="gold-italic">love.</span>
          </h2>
          <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mx-auto mt-6" />
        </Reveal>

        <div className="mt-20 grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="overflow-hidden rounded-[6px]">
              <img src={journal} alt="An open journal with a fountain pen and dried flowers"
                loading="lazy" className="w-full h-[520px] object-cover" />
            </div>
          </Reveal>
          <div className="lg:col-span-7 space-y-12">
            {quotes.map((q, i) => (
              <Reveal key={q.id} delay={i * 0.08}>
                <figure className="border-l-2 border-[var(--gold)] pl-8">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[var(--gold)] mb-4" fill="currentColor" aria-hidden>
                    <path d="M6 7c-2 1.5-3 3.5-3 6 0 2.5 1.5 4 3.5 4S10 15.5 10 13.5 8.5 10 7 10c0-2 1-3.5 3-4.5L6 7zm10 0c-2 1.5-3 3.5-3 6 0 2.5 1.5 4 3.5 4s3.5-1.5 3.5-3.5S18.5 10 17 10c0-2 1-3.5 3-4.5L16 7z" />
                  </svg>
                  <blockquote className="font-serif italic text-[var(--navy-deep)] leading-[1.4]"
                    style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}>
                    "{q.quote}"
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="block w-8 h-px bg-[var(--gold)]" />
                    <span className="text-[13px] tracking-[0.14em] uppercase text-[var(--gold-muted)] font-medium">
                      {q.author_name}
                    </span>
                    {q.location && (
                      <span className="text-[13px] text-[var(--warm-gray)] font-light">— {q.location}</span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}