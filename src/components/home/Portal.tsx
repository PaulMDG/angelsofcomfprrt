import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { Link } from "@tanstack/react-router";
import phone from "@/assets/portal-hands-phone.jpg";
import { useHomeSection } from "@/lib/homepage-content";
import { EditableSection } from "@/components/site/InlineEdit";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export function Portal() {
  const s = useHomeSection("portal");
  const image = s.image_url || phone;
  return (
    <EditableSection sectionKey="portal" label="Portal">
    <section className="bg-[var(--navy-mid)] text-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2 className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)", color: "var(--ivory)" }}>
            {s.heading} <span className="gold-italic">{s.italic_word}</span>
          </h2>
          <p className="mt-6 text-[17px] leading-[1.8] text-[var(--cream)]/80 max-w-lg font-light">
            {s.body}
          </p>
          <ul className="mt-10 space-y-4">
            {s.features.map((f) => (
              <li key={f} className="flex items-start gap-4 text-[15px] text-[var(--cream)]/85">
                <svg viewBox="0 0 24 24" className="w-4 h-4 mt-1 shrink-0 text-[var(--gold-light)]" fill="none"
                  stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 12 l5 5 L20 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={s.cta.url} className="btn-outline btn-outline-light">{s.cta.label}</Link>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[6px] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
            <ResponsiveImage src={image} alt="Hands holding a phone showing care updates"
              loading="lazy" className="w-full h-[600px] object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Reveal>
      </div>
    </section>
    </EditableSection>
  );
}