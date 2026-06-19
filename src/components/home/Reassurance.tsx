import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig, HeartOutline } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import img from "@/assets/reassurance-family.jpg";
import { useHomeSection } from "@/lib/homepage-content";
import { EditableSection } from "@/components/site/InlineEdit";
import { ResponsiveImage } from "@/components/site/ResponsiveImage";

export function Reassurance() {
  const s = useHomeSection("reassurance");
  const image = s.image_url || img;
  return (
    <EditableSection sectionKey="reassurance" label="Reassurance">
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="max-w-xl">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <h2
            className="mt-6 font-serif font-medium leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance] text-[var(--navy-deep)]"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            {s.heading} <span className="gold-italic">{s.italic_word}</span>
          </h2>
          <p className="editorial-body mt-6">
            {s.body}
          </p>
          <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mt-8" />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={s.primary_cta.url} className="btn-primary">{s.primary_cta.label}</Link>
            <Link to={s.secondary_cta.url} className="btn-outline">{s.secondary_cta.label}</Link>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[6px] shadow-[0_24px_80px_rgba(14,27,46,0.12)]">
            <ResponsiveImage src={image} alt="Family caregiver comforting an elderly mother" loading="lazy"
              className="w-full h-[560px] object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Reveal>
      </div>

      <div style={{ background: "var(--beige)" }} className="border-y border-[var(--gold)]/15">
        <div className="container-editorial py-12 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-5 text-[var(--gold)]">
            <BotanicalSprig className="w-20 h-6" />
            <HeartOutline className="w-6 h-6" />
            <BotanicalSprig className="w-20 h-6 -scale-x-100" />
          </div>
          <p className="font-serif text-[var(--navy-deep)]" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
            {s.banner_line1}
          </p>
          <p className="font-serif italic text-[var(--gold)] text-2xl">{s.banner_line2}</p>
        </div>
      </div>
    </section>
    </EditableSection>
  );
}