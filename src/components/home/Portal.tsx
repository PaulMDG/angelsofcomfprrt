import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { Link } from "@tanstack/react-router";
import phone from "@/assets/portal-hands-phone.jpg";

const features = [
  "Real-time visit notes from caregivers",
  "Daily wellbeing & mood check-ins",
  "Medication reminders & confirmations",
  "Secure messaging with the care team",
  "Photo updates from meaningful moments",
];

export function Portal() {
  return (
    <section className="bg-[var(--navy-mid)] text-[var(--ivory)]">
      <div className="container-editorial section-pad grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <Eyebrow>Family Portal</Eyebrow>
          <h2 className="mt-6 font-serif font-medium leading-[1.05]"
            style={{ fontSize: "clamp(36px, 4.5vw, 64px)", color: "var(--ivory)" }}>
            Stay close, <span className="gold-italic">always.</span>
          </h2>
          <p className="mt-6 text-[17px] leading-[1.8] text-[var(--cream)]/80 max-w-lg font-light">
            For families across the country, our secure family portal brings peace of mind home.
            See how your loved one is doing, in real time — from anywhere.
          </p>
          <ul className="mt-10 space-y-4">
            {features.map((f) => (
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
            <Link to="/family-portal" className="btn-outline btn-outline-light">Explore the Portal</Link>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-[6px] shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
            <img src={phone} alt="Hands holding a phone showing care updates"
              loading="lazy" className="w-full h-[600px] object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}