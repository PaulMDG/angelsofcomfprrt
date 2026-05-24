import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig, HeartOutline } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import img from "@/assets/reassurance-family.jpg";

export function Reassurance() {
  return (
    <section className="bg-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-2 gap-16 items-center">
        <Reveal className="max-w-xl">
          <Eyebrow>You Don't Have To</Eyebrow>
          <h2
            className="mt-6 font-serif font-medium leading-[1.05] text-[var(--navy-deep)]"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            Carry this <span className="gold-italic">alone.</span>
          </h2>
          <p className="editorial-body mt-6">
            Caregiving is an act of love — but it can also be exhausting. We see you. We're here to
            bring relief, clarity, and compassionate support to your family.
          </p>
          <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mt-8" />
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/consultation" className="btn-primary">Schedule a Consultation</Link>
            <Link to="/services" className="btn-outline">Explore Our Services</Link>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[6px] shadow-[0_24px_80px_rgba(14,27,46,0.12)]">
            <img src={img} alt="Family caregiver comforting an elderly mother" loading="lazy"
              className="w-full h-[560px] object-cover" />
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
            You've done so much for your loved one.
          </p>
          <p className="font-serif italic text-[var(--gold)] text-2xl">Now let us help.</p>
        </div>
      </div>
    </section>
  );
}