import { Reveal } from "@/components/site/Reveal";
import { BotanicalSprig, MonogramAC } from "@/components/site/Botanical";
import { Link } from "@tanstack/react-router";
import bg from "@/assets/cta-living-room.jpg";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--navy-deep)] text-[var(--ivory)]">
      <div className="absolute inset-0">
        <img src={bg} alt="" loading="lazy" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(14,27,46,0.85), rgba(14,27,46,0.95))" }} />
      </div>
      <div className="relative container-editorial section-pad text-center flex flex-col items-center">
        <Reveal>
          <MonogramAC className="w-14 h-14 text-[var(--gold-light)] mx-auto" />
          <div className="mt-8 inline-flex eyebrow eyebrow-center text-[var(--gold-light)]">
            Begin When You're Ready
          </div>
          <h2 className="mt-8 font-serif font-medium leading-[1.05] max-w-3xl mx-auto"
            style={{ fontSize: "clamp(44px, 6vw, 88px)", color: "var(--ivory)" }}>
            Let's bring comfort <span className="gold-italic">home.</span>
          </h2>
          <BotanicalSprig className="w-32 h-10 text-[var(--gold-light)] mx-auto mt-8" />
          <p className="mt-8 text-[18px] leading-[1.8] text-[var(--cream)]/85 max-w-xl mx-auto font-light">
            Schedule a free, no-obligation consultation. We'll listen to your family's story and
            help you understand what care could look like — at your pace, on your terms.
          </p>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Link to="/consultation" className="btn-primary"
              style={{ background: "var(--gold)", color: "var(--navy-deep)", borderColor: "var(--gold)" }}>
              Schedule a Consultation
            </Link>
            <a href="tel:2404263304" className="btn-outline btn-outline-light">
              Call (240) 426-3304
            </a>
          </div>
          <p className="mt-10 text-[13px] tracking-[0.18em] uppercase text-[var(--gold-light)]/80">
            Available 24 / 7 · Maryland RSA Licensed
          </p>
        </Reveal>
      </div>
    </section>
  );
}