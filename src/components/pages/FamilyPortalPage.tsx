import { Link } from "@tanstack/react-router";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { PageHeader } from "./PageHeader";
import phone from "@/assets/portal-hands-phone.jpg";

const features = [
  {
    title: "Real-time visit notes",
    desc: "After every visit, your caregiver writes a short note — what was eaten, what was talked about, what brought a smile.",
  },
  {
    title: "Daily wellbeing check-ins",
    desc: "A simple mood, appetite, and energy log so you can see patterns over weeks — not just isolated moments.",
  },
  {
    title: "Medication confirmations",
    desc: "Each scheduled medication is confirmed in the portal as it's given. Missed doses are flagged immediately.",
  },
  {
    title: "Secure family messaging",
    desc: "Message the care team directly — no emails lost, no phone tag. Everything is logged and end-to-end private.",
  },
  {
    title: "Photos from the day",
    desc: "A walk in the garden, a finished puzzle, a fresh-baked loaf. Small moments your loved one would have shared with you.",
  },
  {
    title: "Care plan visibility",
    desc: "Full transparency into the care schedule, the assigned caregiver, and any updates from our clinical lead.",
  },
];

export function FamilyPortalPage() {
  return (
    <>
      <PageHeader
        tone="navy"
        eyebrow="Family Portal"
        title="Modern care with"
        italic="human warmth."
        intro="For families across the room or across the country, our secure family portal brings peace of mind home. See how your loved one is doing — in real time, with the warmth of a handwritten note."
      />

      <section className="bg-[var(--navy-deep)] text-[var(--ivory)] pb-0">
        <div className="container-editorial pb-24 flex justify-center">
          <Reveal>
            <div className="overflow-hidden rounded-[8px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] max-w-3xl">
              <img
                src={phone}
                alt="Hands holding a phone displaying real-time care updates"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad">
          <Reveal className="max-w-2xl">
            <Eyebrow>What You'll See</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium text-[var(--navy-deep)] leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(34px, 4vw, 56px)" }}
            >
              Everything you'd want to know, <span className="gold-italic">in one place.</span>
            </h2>
          </Reveal>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">
                    0{i + 1}
                  </div>
                  <h3
                    className="mt-3 font-serif text-[var(--navy-deep)] leading-[1.15]"
                    style={{ fontSize: "26px" }}
                  >
                    {f.title}
                  </h3>
                  <div className="w-8 h-px bg-[var(--gold)] mt-4 opacity-70" />
                  <p className="mt-5 text-[15px] leading-[1.8] text-[var(--text-body)] font-light">
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--ivory)]">
        <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Privacy & Security</Eyebrow>
            <h2
              className="mt-6 font-serif font-medium text-[var(--navy-deep)] leading-[1.14] sm:leading-[1.06] tracking-[-0.015em] [text-wrap:balance]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
            >
              HIPAA-compliant. Encrypted end-to-end. <span className="gold-italic">Always.</span>
            </h2>
            <p className="editorial-body mt-6 max-w-xl">
              Every photo, every note, every message is protected by bank-grade encryption. Access
              is invitation-only and limited to the family members you choose. We will never share,
              sell, or analyze your data for any purpose other than caring for your loved one.
            </p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3 text-[14px] text-[var(--warm-gray)] max-w-lg">
              {[
                "HIPAA-compliant infrastructure",
                "End-to-end encrypted messaging",
                "Two-factor authentication",
                "Family-controlled access",
                "Audit logs on every record",
                "Data export on request",
              ].map((l) => (
                <li key={l} className="flex items-start gap-3">
                  <span className="mt-2 w-1 h-1 rounded-full bg-[var(--gold)] shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="bg-[var(--navy-deep)] text-[var(--ivory)] p-12 rounded-[6px] shadow-[0_30px_90px_rgba(14,27,46,0.25)]">
              <Eyebrow className="justify-center text-center">Request Portal Access</Eyebrow>
              <h3 className="mt-6 font-serif text-3xl text-center leading-[1.15] text-[var(--ivory)]">
                Already with us? <span className="gold-italic">Welcome in.</span>
              </h3>
              <p className="mt-5 text-[14px] leading-[1.8] text-[var(--cream)]/75 font-light text-center">
                Existing families receive an invitation by email within 24 hours of beginning care.
                If you haven't received yours, our care team is one call away.
              </p>
              <div className="mt-8 space-y-3">
                <Link to="/consultation" className="btn-outline btn-outline-light w-full">
                  Request Access
                </Link>
                <a
                  href="tel:2404263304"
                  className="block text-center font-serif text-[var(--gold-light)] py-2"
                >
                  Or call (240) 426-3304
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}