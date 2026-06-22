import { Reveal } from "@/components/site/Reveal";
import { MonogramAC } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import bg from "@/assets/cta-living-room.jpg";
import { useHomeSection } from "@/lib/homepage-content";
import { EditableSection } from "@/components/site/InlineEdit";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export function CTA() {
  const s = useHomeSection("cta");
  const image = s.background_image_url || bg;
  const isExternalPrimary = /^(https?:|mailto:|tel:)/.test(s.primary_cta.url);
  const isExternalSecondary = /^(https?:|mailto:|tel:)/.test(s.secondary_cta.url);
  return (
    <EditableSection sectionKey="cta" label="CTA">
    <section className="relative overflow-hidden bg-[var(--navy-deep)] text-[var(--ivory)]">
      <div className="absolute inset-0">
        <ResponsiveImage src={image} alt="" loading="lazy" className="w-full h-full object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(14,27,46,0.85), rgba(14,27,46,0.95))" }} />
      </div>
      <div className="relative container-editorial section-pad text-center flex flex-col items-center">
        <Reveal>
          <div className="inline-flex eyebrow eyebrow-center text-[var(--gold-light)]">
            {s.eyebrow}
          </div>
          <h2 className="mt-8 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] max-w-3xl mx-auto"
            style={{ fontSize: "clamp(44px, 6vw, 88px)", color: "var(--ivory)" }}>
            {s.heading} <span className="gold-italic">{s.italic_word}</span>
          </h2>
          <p className="mt-8 text-[18px] leading-[1.8] text-[var(--cream)]/85 max-w-xl mx-auto font-light">
            {s.body}
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {isExternalPrimary ? (
              <a href={s.primary_cta.url} className="btn-primary"
                style={{ background: "var(--gold)", color: "var(--navy-deep)", borderColor: "var(--gold)" }}>
                {s.primary_cta.label}
              </a>
            ) : (
              <Link to={s.primary_cta.url} className="btn-primary"
                style={{ background: "var(--gold)", color: "var(--navy-deep)", borderColor: "var(--gold)" }}>
                {s.primary_cta.label}
              </Link>
            )}
            {isExternalSecondary ? (
              <a href={s.secondary_cta.url} className="btn-outline btn-outline-light">
                {s.secondary_cta.label}
              </a>
            ) : (
              <Link to={s.secondary_cta.url} className="btn-outline btn-outline-light">
                {s.secondary_cta.label}
              </Link>
            )}
          </div>
          <p className="mt-10 text-[13px] tracking-[0.18em] uppercase text-[var(--gold-light)]/80">
            {s.footnote}
          </p>
        </Reveal>
      </div>
    </section>
    </EditableSection>
  );
}